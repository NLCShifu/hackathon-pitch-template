"use client";

import { ReactLenis } from "lenis/react";
import { story } from "@/story.config";
import { LENIS_ON, usePrefersReducedMotion } from "./motion";

/**
 * Global smooth-scroll. Lenis drives the real window scroll position, so
 * `position: sticky` and Framer's `useScroll` keep working untouched.
 * Touch devices keep native momentum scrolling (syncTouch off).
 *
 * Rendered as a childless sibling: toggling it must never remount the story,
 * or every scroll-linked ref would be left pointing at detached nodes.
 * `useLenis()` still reaches the root instance from anywhere.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  if (!LENIS_ON || reduced) return null;
  return (
    <ReactLenis root options={{ lerp: story.motion.lenis.lerp, wheelMultiplier: story.motion.lenis.wheelMultiplier, anchors: true }} />
  );
}
