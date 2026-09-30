"use client";

import { cubicBezier, useSpring, type MotionValue } from "framer-motion";
import { useSyncExternalStore } from "react";
import { story } from "@/story.config";

/** GSAP eases from the Whisper timelines, as cubic-bezier tuples + functions. */
export const BEZIER = {
  power1In: [0.55, 0.085, 0.68, 0.53],
  power1InOut: [0.445, 0.05, 0.55, 0.95],
  power2Out: [0.25, 0.46, 0.45, 0.94],
  power2InOut: [0.455, 0.03, 0.515, 0.955],
  power3Out: [0.215, 0.61, 0.355, 1],
  backOut: [0.34, 1.56, 0.64, 1],
  expoOut: [0.19, 1, 0.22, 1],
} as const;

type BezierName = keyof typeof BEZIER;
export const ease = Object.fromEntries(
  Object.entries(BEZIER).map(([k, [a, b, c, d]]) => [k, cubicBezier(a, b, c, d)]),
) as Record<BezierName, (t: number) => number>;

/** Mutable tuple copy for Framer `transition.ease`. */
export const bz = (name: BezierName) => [...BEZIER[name]] as [number, number, number, number];

/**
 * Stand-in for GSAP `scrub: 0.75` (expo.out catch-up). The spring settles in
 * ~0.8s after the wheel stops, like the measured Whisper lag.
 */
const SCRUB_SPRING = { stiffness: 110, damping: 26, mass: 0.9, restDelta: 0.0005 };

export const LENIS_ON = story.motion.smoothing === "lenis";

/**
 * Scroll progress that visuals should read. With Lenis the scroll position is
 * already smoothed, so progress is used raw; in "scrub" mode it is sprung.
 */
export function useScrub(progress: MotionValue<number>) {
  const sprung = useSpring(progress, SCRUB_SPRING);
  return LENIS_ON ? progress : sprung;
}

/** Whisper's revealWords stagger: `each = duration / (words + 2)`. */
export function staggerEach(duration: number, count: number) {
  return duration / (Math.max(count, 1) + 2);
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Hydration-safe reduced-motion flag: the server and the hydration pass both
 * render the full-motion tree, then React re-renders with the real preference.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => false);
}
