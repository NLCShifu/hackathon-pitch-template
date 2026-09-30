"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { story } from "@/story.config";
import { usePrefersReducedMotion } from "../motion";

const COLORS = ["#264ed0", "#5dadeb", "#ffd301", "#c23b21", "#131313", "#ffffff"];

type Piece = {
  id: number;
  dx: number;
  dy: number;
  fall: number;
  spin: number;
  size: number;
  color: string;
  round: boolean;
  duration: number;
};

/**
 * Palette confetti. `useConfetti()` returns a burst() you can call from any
 * event, plus the layer to render inside a `relative` parent.
 */
export function useConfetti(count = 70) {
  const reduced = usePrefersReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const next = useRef(0);

  const burst = useCallback(() => {
    if (reduced || !story.chaos.enabled || !story.chaos.confetti) return;
    const fresh = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const power = 160 + Math.random() * 320;
      return {
        id: next.current++,
        dx: Math.cos(angle) * power,
        dy: Math.sin(angle) * power * 0.8 - 140,
        fall: 260 + Math.random() * 260,
        spin: (Math.random() - 0.5) * 900,
        size: 7 + Math.random() * 9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() > 0.6,
        duration: 1.4 + Math.random() * 0.9,
      };
    });
    setPieces(fresh);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPieces([]), 2600);
  }, [count, reduced]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const layer = (
    <span className="pointer-events-none absolute top-1/2 left-1/2 z-[7] h-0 w-0" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block border border-black/40"
          style={{ width: p.size, height: p.size * (p.round ? 1 : 0.55), background: p.color, borderRadius: p.round ? "50%" : 2 }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: [0, p.dx, p.dx * 1.15], y: [0, p.dy, p.dy + p.fall], rotate: p.spin, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, times: [0, 0.35, 1], ease: "easeOut" }}
        />
      ))}
    </span>
  );

  return { burst, layer };
}
