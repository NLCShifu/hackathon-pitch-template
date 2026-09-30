"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "./motion";

// Palette fills only (never text colours), as everywhere else on the page.
const COLORS = ["#ffd301", "#5dadeb", "#ffffff", "#c23b21", "#ffd301", "#131313"];

type Piece = { left: number; w: number; h: number; round: boolean; color: string; dx: number; up: number; fall: number; spin: number; dur: number; delay: number };

function makePieces(count: number): Piece[] {
  const r = (a: number, b: number) => a + Math.random() * (b - a);
  return Array.from({ length: count }, () => {
    const left = r(4, 96);
    return {
      left,
      w: r(5, 9),
      h: r(8, 14),
      round: Math.random() < 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      // Pieces fan outward from the middle of the word.
      dx: (left - 50) * r(1.4, 3) + r(-30, 30),
      up: r(110, 260),
      fall: r(-40, 30),
      spin: r(-540, 540),
      dur: r(1.5, 2.3),
      delay: r(0, 0.25),
    };
  });
}

/**
 * A small one-shot burst of paper confetti from the element it sits in (which
 * must be `position: relative`). Fires once when it comes into view; in
 * presentation mode the parent <Beat> remounts it, so it fires on every reveal.
 */
export function Confetti({ count = 44, delay = 0.35 }: { count?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = usePrefersReducedMotion();
  const pieces = useMemo(() => (inView ? makePieces(count) : []), [inView, count]);

  return (
    <span ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      {!reduced &&
        pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute top-[35%] block"
            style={{ left: `${p.left}%`, width: p.w, height: p.round ? p.w : p.h, background: p.color, borderRadius: p.round ? "50%" : 1.5 }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={{ x: p.dx, y: [0, -p.up, p.fall], rotate: p.spin, opacity: [0, 1, 1, 0] }}
            transition={{
              delay: delay + p.delay,
              duration: p.dur,
              x: { duration: p.dur, delay: delay + p.delay, ease: [0.19, 1, 0.22, 1] },
              y: { duration: p.dur, delay: delay + p.delay, times: [0, 0.38, 1], ease: ["easeOut", "easeIn"] },
              opacity: { duration: p.dur, delay: delay + p.delay, times: [0, 0.05, 0.75, 1] },
            }}
          />
        ))}
    </span>
  );
}
