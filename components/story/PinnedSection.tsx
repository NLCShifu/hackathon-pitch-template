"use client";

import { createContext, useContext, useLayoutEffect, useRef, type ReactNode, type Ref } from "react";
import { useMotionValue, useScroll, type MotionValue } from "framer-motion";
import { useScrub, usePrefersReducedMotion } from "./motion";
import { useMergedRef } from "./useMergedRef";

const PinContext = createContext<MotionValue<number> | null>(null);

/** 0 → 1 progress of the nearest pinned chapter (already scrubbed). */
export function usePin() {
  const p = useContext(PinContext);
  if (!p) throw new Error("usePin() must be used inside <PinnedSection>");
  return p;
}

type Props = {
  id: string;
  /** Extra scroll distance the stage is held for, in % of viewport height (Whisper: 100–300). */
  scrollVh: number;
  /** Progress to freeze at when the visitor prefers reduced motion (the "resting" composition). */
  restProgress?: number;
  /** Presentation mode: progress points each arrow press stops at (defaults to `restProgress` alone). */
  beats?: number[];
  className?: string;
  /** Whisper stage padding: clamp(52px, 6.5vh, 92px) top and bottom. */
  padded?: boolean;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
};

/**
 * Whisper-style pin without a pin-spacer: a section that is
 * `100svh + scrollVh` tall, holding a `position: sticky` stage. Progress is
 * mapped over exactly the pinned distance ("start start" → "end end"),
 * so timeline positions read as fractions of the pin, like GSAP's
 * normalised `chapterTimeline`.
 */
export function PinnedSection({ id, scrollVh, restProgress = 1, beats, className = "", padded = true, ref, children }: Props) {
  const reduced = usePrefersReducedMotion();
  const [local, setRef] = useMergedRef(ref);

  const { scrollYProgress } = useScroll({ target: local, offset: ["start start", "end end"] });
  const scrubbed = useScrub(scrollYProgress);
  const resting = useMotionValue(restProgress);
  const progress = reduced ? resting : scrubbed;

  return (
    <section
      id={id}
      ref={setRef}
      data-chapter
      data-rest={reduced ? undefined : restProgress}
      data-beats={reduced || !beats ? undefined : beats.join(",")}
      className={`relative z-[1] ${className}`}
      style={{ height: reduced ? "auto" : `calc(100svh + ${scrollVh}svh)` }}
    >
      <div
        className={`${reduced ? "relative min-h-svh py-24" : "sticky top-0 h-svh overflow-hidden"} flex flex-col ${
          padded && !reduced ? "py-[clamp(52px,6.5vh,92px)]" : ""
        }`}
      >
        <PinContext.Provider value={progress}>{reduced ? children : <Fit>{children}</Fit>}</PinContext.Provider>
      </div>
    </section>
  );
}

/**
 * Whisper `.story-fit`: if a stage's content is taller than the viewport
 * (short laptops, phones), scale it down to fit, but never below 62%.
 */
function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      const s = i.offsetHeight > o.clientHeight ? Math.max(o.clientHeight / i.offsetHeight, 0.62) : 1;
      i.style.transform = s < 1 ? `scale(${s.toFixed(4)})` : "";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="relative min-h-0 flex-1">
      <div ref={inner} className="flex min-h-full origin-center flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
