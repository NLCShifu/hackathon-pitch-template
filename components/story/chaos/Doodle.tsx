"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { bz } from "../motion";
import type { ChaosItem, Ink } from "./types";

export const INK: Record<Ink, string> = {
  yellow: "#ffd301",
  sky: "#5dadeb",
  blue: "#264ed0",
  red: "#c23b21",
  black: "#131313",
  white: "#ffffff",
};

type Shape = Extract<ChaosItem, { kind: "doodle" }>["shape"];

// Hand-drawn paths in a 100×100 box: deliberately wobbly, never geometric.
const PATHS: Record<Exclude<Shape, "forbidden">, string[]> = {
  arrow: ["M10 86 C 22 70, 30 48, 52 38 C 66 31, 76 26, 88 14", "M70 12 C 76 13, 82 13, 89 13 C 88 20, 86 26, 85 33"],
  circle: ["M52 8 C 80 6, 96 30, 92 56 C 88 84, 56 96, 30 88 C 8 80, 2 50, 12 30 C 22 12, 44 6, 66 12"],
  underline: ["M4 58 C 28 48, 62 66, 96 50", "M10 72 C 38 64, 66 78, 92 66"],
  star: ["M50 6 L60 38 L94 39 L66 58 L77 92 L50 71 L23 92 L34 58 L6 39 L40 38 Z"],
  zigzag: ["M6 56 L20 30 L32 62 L46 28 L58 64 L72 30 L86 60 L96 40"],
};
const FORBIDDEN = ["M50 7 C 78 6, 95 26, 93 52 C 91 80, 66 95, 40 92 C 14 88, 3 62, 8 36 C 13 16, 32 6, 56 9", "M20 82 L82 18"];

/** Scribbles that draw themselves in (stroke-dash via pathLength). */
export function Doodle({
  shape,
  ink,
  size = 100,
  icon: Icon,
  delay = 0,
  reduced,
}: {
  shape: Shape;
  ink: Ink;
  size?: number;
  icon?: LucideIcon;
  delay?: number;
  reduced: boolean;
}) {
  const color = INK[ink];
  const paths = shape === "forbidden" ? FORBIDDEN : PATHS[shape];
  return (
    <span className="relative block" style={{ width: size, height: size }}>
      {shape === "forbidden" && Icon && (
        <Icon className="absolute inset-[22%] h-[56%] w-[56%] text-current" strokeWidth={1.6} aria-hidden />
      )}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={shape === "circle" || shape === "forbidden" ? 5 : 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: delay + i * 0.45, ease: bz("power2InOut") }}
          />
        ))}
      </svg>
    </span>
  );
}
