"use client";

import { motion, type MotionValue } from "framer-motion";

/**
 * One fixed background shared by every chapter (Whisper `.story-ground`).
 * Chapters never own a background; the page crossfades night → paper → warm
 * by tweening two layers' opacity.
 */
export function Ground({ paper, warm }: { paper: MotionValue<number>; warm: MotionValue<number> }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="ground-mesh absolute" />
      <div className="ground-streaks absolute inset-0" />
      <motion.div className="ground-paper absolute inset-0" style={{ opacity: paper }} />
      <motion.div className="ground-warm absolute inset-0" style={{ opacity: warm }} />
      <div className="ground-grain absolute inset-0" />
      <div className="ground-vignette absolute inset-0" />
    </div>
  );
}
