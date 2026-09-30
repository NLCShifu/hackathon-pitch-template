"use client";

import { useLenis } from "lenis/react";
import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Chapter } from "./Chrome";
import { ease, usePrefersReducedMotion } from "./motion";

/** `build` counts how many <Beat>s of a free-flowing chapter are on stage. */
type Stop = { y: number; chapter: number; build: number };

export type Presentation = {
  on: boolean;
  toggle: () => void;
  /** Current slide (0-based) and slide count, for the HUD. */
  slide: number;
  slides: number;
  /** Chapter and build step on stage, read by <Beat>. */
  chapter: number;
  build: number;
  chapterIds: string[];
  /** Glide to the first slide of a chapter (rail clicks). */
  jump: (chapterId: string) => void;
};

const NEXT = new Set(["ArrowRight", "ArrowDown", "PageDown"]);
const PREV = new Set(["ArrowLeft", "ArrowUp", "PageUp"]);
const SCROLL_KEYS = new Set([" ", "Home", "End", ...NEXT, ...PREV]);

/** Bottom edge in page coordinates; <Beat> is `display: contents`, so measure its children. */
function bottomOf(el: HTMLElement) {
  const boxes = getComputedStyle(el).display === "contents" ? [...el.children] : [el];
  return Math.max(...boxes.map((b) => b.getBoundingClientRect().bottom)) + window.scrollY;
}

/**
 * Where each "slide" rests, read fresh from the DOM so it survives resizes.
 *  • Pinned chapters stop at each of their `beats` along the pin (data-beats),
 *    or at `restProgress` alone, so every press plays the next stretch of
 *    the scroll timeline.
 *  • Free-flowing chapters with <Beat>s bring one beat on stage per press,
 *    scrolling just enough to keep the newest one in view.
 *  • Anything else is centred, or paged through when taller than the screen.
 */
function readStops(chapters: Chapter[]): Stop[] {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const all: Stop[] = [];
  chapters.forEach(({ id }, chapter) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight;
    const push = (y: number, build = 0) =>
      all.push({
        y: Math.round(Math.min(Math.max(y, 0), max)),
        chapter,
        build,
      });

    const { beats, rest } = el.dataset;
    if (beats || rest !== undefined) {
      for (const b of beats ? beats.split(",").map(Number) : [Number(rest)]) push(top + b * (h - vh));
      return;
    }

    const first = h <= vh * 1.1 ? top + (h - vh) / 2 : top;
    const last = Math.max(first, top + h - vh);
    const builds = new Map<number, number>();
    el.querySelectorAll<HTMLElement>("[data-beat]").forEach((b) => {
      const n = Number(b.dataset.beat);
      builds.set(n, Math.max(builds.get(n) ?? -Infinity, bottomOf(b)));
    });
    if (builds.size) {
      let y = first;
      for (const [n, bottom] of [...builds].sort((a, b) => a[0] - b[0])) {
        y = Math.max(y, Math.min(last, bottom + vh * 0.08 - vh));
        push(y, n);
      }
      return;
    }

    const n = Math.ceil((last - first) / (vh * 0.8));
    for (let i = 0; i <= n; i++) push(n ? first + ((last - first) * i) / n : first);
  });
  const stops: Stop[] = [];
  for (const s of all) {
    const prev = stops[stops.length - 1];
    if (!prev || Math.abs(s.y - prev.y) > 40 || s.chapter !== prev.chapter || s.build !== prev.build) stops.push(s);
  }
  return stops;
}

const nearest = (stops: Stop[], y: number) =>
  stops.reduce((best, s, i) => (Math.abs(s.y - y) < Math.abs(stops[best].y - y) ? i : best), 0);

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

/**
 * Presentation mode: wheel/touch scrolling is switched off and the arrow keys
 * (or a clicker's PageUp/PageDown, or a swipe) glide from slide to slide.
 * Toggle with P or the corner button; Esc leaves. `?present` starts in it.
 */
export function usePresentation(chapters: Chapter[]): Presentation {
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [slides, setSlides] = useState(0);
  const [at, setAt] = useState({ chapter: 0, build: 0 });
  // Slide on stage (or being travelled to): builds share a scroll position, so scrollY can't tell them apart.
  const here = useRef(0);
  // Where the last glide was headed, so a build never nudges the page against the direction of travel.
  const target = useRef({ y: 0, chapter: -1 });

  const go = useCallback(
    (i: number, immediate = false) => {
      const stops = readStops(chapters);
      if (!stops.length) return;
      const to = Math.min(Math.max(i, 0), stops.length - 1);
      const { chapter, build } = stops[to];
      let { y } = stops[to];
      // Builds are measured mid-animation, so their positions wobble a few pixels.
      if (chapter === target.current.chapter && Math.sign(y - target.current.y) !== Math.sign(to - here.current)) {
        y = target.current.y;
      }
      target.current = { y, chapter };
      here.current = to;
      setSlide(to);
      setSlides(stops.length);
      setAt({ chapter, build });

      // Unhurried, so scrubbed choreography reads as it plays; long pins get more time.
      const travel = Math.abs(y - window.scrollY) / window.innerHeight;
      const duration = Math.min(1.1 + travel * 0.5, 3.4);
      // Long glides cross several timelines (title out, next chapter in); a gentle
      // sine-like curve keeps their speed even instead of rushing the middle.
      const easing = travel > 1 ? ease.power1InOut : ease.power2InOut;
      if (lenis && !reduced) {
        lenis.scrollTo(y, { duration, easing, immediate, force: true, lock: true });
      } else {
        window.scrollTo({ top: y, behavior: immediate || reduced ? "auto" : "smooth" });
      }
    },
    [chapters, lenis, reduced],
  );

  const step = useCallback((dir: number) => go(here.current + dir), [go]);

  const jump = useCallback(
    (id: string) => {
      const chapter = chapters.findIndex((c) => c.id === id);
      const i = readStops(chapters).findIndex((s) => s.chapter === chapter);
      if (i >= 0) go(i);
    },
    [chapters, go],
  );

  const toggle = useCallback(() => setOn((v) => !v), []);

  // Deep link: /?present opens straight into presentation mode.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("present")) setOn(true);
  }, []);

  // P toggles from anywhere; Esc leaves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (e.key === "p" || e.key === "P") setOn((v) => !v);
      else if (e.key === "Escape") setOn(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Listeners read the latest callbacks through a ref: `go` changes identity when
  // Lenis mounts, and re-running the effect would re-snap mid-glide.
  const latest = useRef({ go, step, chapters });
  latest.current = { go, step, chapters };

  useEffect(() => {
    if (!on) return;
    const { go, step, chapters } = latest.current;
    // Not lenis.stop(): its stopped state clips <html>, which would block our own glides too.
    go(nearest(readStops(chapters), window.scrollY));

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      if (!SCROLL_KEYS.has(e.key)) return;
      // Space still presses a focused button (e.g. the demo video) but never scrolls.
      if (e.key === " " && e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      if (e.repeat) return;
      const { go, step } = latest.current;
      if (NEXT.has(e.key)) step(1);
      else if (PREV.has(e.key)) step(-1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(Infinity);
    };
    // Capture phase on window runs before Lenis's own wheel listener, so it never sees the event.
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0]?.clientY ?? null);
    const onTouchEnd = (e: TouchEvent) => {
      const end = e.changedTouches[0]?.clientY;
      if (touchY !== null && end !== undefined && Math.abs(touchY - end) > 50) latest.current.step(touchY > end ? 1 : -1);
      touchY = null;
    };
    let resize: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resize);
      resize = setTimeout(() => latest.current.go(here.current, true), 150);
    };

    const capture = { capture: true, passive: false } as const;
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", block, capture);
    window.addEventListener("touchmove", block, capture);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", block, capture);
      window.removeEventListener("touchmove", block, capture);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [on]);

  const chapterIds = useMemo(() => chapters.map((c) => c.id), [chapters]);
  return {
    on,
    toggle,
    slide,
    slides,
    chapter: at.chapter,
    build: at.build,
    chapterIds,
    jump,
  };
}

const Deck = createContext<Presentation | null>(null);
export const DeckProvider = Deck.Provider;

/**
 * A build step inside a free-flowing chapter. Outside presentation mode it
 * renders its children untouched (`display: contents`). In presentation mode
 * it stays hidden, holding its space, until its turn; then its children
 * remount so their own entrance animation plays right then.
 */
export function Beat({ n, children }: { n: number; children: ReactNode }) {
  const deck = useContext(Deck);
  const ref = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(-1);

  useEffect(() => {
    const id = ref.current?.closest<HTMLElement>("[data-chapter]")?.id ?? "";
    setChapter(deck?.chapterIds.indexOf(id) ?? -1);
  }, [deck?.chapterIds]);

  const shown = !deck?.on || chapter < deck.chapter || (chapter === deck.chapter && n <= deck.build);
  return (
    <div ref={ref} data-beat={n} className="contents" style={shown ? undefined : { visibility: "hidden" }}>
      <Fragment key={shown ? "on" : "off"}>{children}</Fragment>
    </div>
  );
}
