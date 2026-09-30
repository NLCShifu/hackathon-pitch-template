"use client";

import { motion, useScroll, useSpring, useTransform, type MotionStyle, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { ease } from "./motion";

export type Chapter = { id: string; label: string };

/**
 * Fixed UI over the story: 2px progress bar, chapter rail, scroll cue.
 * `ink` is the page's live text colour so the rail reads on every ground;
 * `signal` is the palette colour used for the bar and the active dot.
 */
export function Chrome({
  chapters,
  ink,
  signal,
  scrollHint,
}: {
  chapters: Chapter[];
  ink: MotionValue<string>;
  signal: MotionValue<string>;
  scrollHint: string;
}) {
  const { scrollYProgress, scrollY } = useScroll();
  // Whisper: `scaleX` scrubbed over the whole document with scrub 0.4.
  const bar = useSpring(scrollYProgress, { stiffness: 220, damping: 34, restDelta: 0.0005 });
  // Whisper: the cue fades between scrollY 60 and 200.
  const cueOpacity = useTransform(scrollY, [60, 200], [1, 0]);
  const cueEvents = useTransform(cueOpacity, (o) => (o < 0.05 ? "none" : "auto"));

  const active = useActiveChapter(chapters);
  const lenis = useLenis();

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 0.9, easing: ease.power2InOut });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div style={{ color: ink, "--signal": signal } as MotionStyle}>
      <div className="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden>
        <div className="absolute inset-0 bg-current opacity-[0.12]" />
        <motion.i className="absolute inset-0 block origin-left bg-(--signal)" style={{ scaleX: bar }} />
      </div>

      <nav aria-label="Chapters" className="fixed top-1/2 right-[18px] z-40 hidden -translate-y-1/2 flex-col gap-[11px] md:flex">
        {chapters.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => go(c.id)}
              aria-label={`Chapter ${i + 1}: ${c.label}`}
              aria-current={on ? "true" : undefined}
              className="group relative h-2.5 w-2.5 cursor-pointer rounded-full transition-[opacity,transform,background-color,box-shadow] duration-[350ms]"
              style={{
                background: on ? "var(--signal)" : "currentColor",
                opacity: on ? 1 : 0.26,
                transform: on ? "scale(1.9)" : "scale(1)",
                boxShadow: on ? "0 0 0 3px color-mix(in srgb, var(--signal) 30%, transparent)" : "none",
              }}
            >
              <span className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 scale-[0.53] font-mono text-[10px] tracking-[0.16em] whitespace-nowrap uppercase opacity-0 transition-opacity group-hover:opacity-100">
                {c.label}
              </span>
            </button>
          );
        })}
      </nav>

      <motion.button
        type="button"
        onClick={() => go(chapters[1]?.id ?? "")}
        style={{ opacity: cueOpacity, pointerEvents: cueEvents }}
        className="bg-yellow text-black fixed bottom-[26px] left-1/2 z-40 flex -translate-x-1/2 cursor-pointer items-center gap-3 rounded-full py-[11px] pr-5 pl-4 shadow-[0_18px_40px_-22px_#0000008c]"
      >
        <span className="relative block h-[34px] w-[22px] rounded-full border-[1.5px] opacity-85" aria-hidden>
          <span className="animate-cue absolute top-[7px] left-1/2 block h-[7px] w-[3px] rounded-full bg-current" />
        </span>
        <span className="font-display text-[14px] font-semibold whitespace-nowrap">{scrollHint}</span>
      </motion.button>
    </motion.div>
  );
}

/** Whisper: a chapter is active while it spans the viewport's 60%–40% band. */
function useActiveChapter(chapters: Chapter[]) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);
  return active;
}
