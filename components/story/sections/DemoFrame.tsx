"use client";

import { motion, useTransform } from "framer-motion";
import { Play, Radio } from "lucide-react";
import { story } from "@/story.config";
import { ease } from "../motion";
import { MediaFrame } from "../MediaFrame";
import { PinnedSection, usePin } from "../PinnedSection";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

/**
 * Proof in motion. The stage holds a near full-bleed frame that starts as a
 * small card and scales up to fill the viewport, the image easing out of an
 * over-zoom inside it (Whisper's proof photos: scale 1.08 → 1).
 *
 *   .04–.44  frame scales .56 → 1, media 1.18 → 1
 *   .44      scrim fades in     .48  action label reveals     .58  status bar docks
 */
export function DemoFrame() {
  return (
    <PinnedSection id="story-demo" scrollVh={story.motion.pin.demo} restProgress={1} padded={false}>
      <Stage />
    </PinnedSection>
  );
}

function Stage() {
  const p = usePin();
  const { demo } = story;

  const grow = useTransform(p, [0.04, 0.44], [0, 1], { ease: ease.power2InOut });
  const scale = useTransform(grow, [0, 1], [0.56, 1]);
  const radius = useTransform(grow, [0, 1], [40, 24]);
  const mediaScale = useTransform(grow, [0, 1], [1.18, 1]);
  const markOpacity = useTransform(grow, [0, 0.3], [1, 0]);

  const scrim = useTransform(p, [0.42, 0.52], [0, 1]);
  const barOpacity = useTransform(p, [0.58, 0.64], [0, 1]);
  const barY = useTransform(p, [0.58, 0.66], [28, 0], { ease: ease.power3Out });

  return (
    <div className="absolute inset-0">
      <motion.div style={{ opacity: markOpacity }} className="absolute inset-x-0 top-[clamp(20px,5vh,56px)] flex justify-center">
        <ChapterMark n={5} />
      </motion.div>

      <motion.div
        style={{ scale, borderRadius: radius }}
        className="bg-night-lift text-cream absolute inset-3 overflow-hidden shadow-[0_60px_140px_-60px_#16110eaa] will-change-transform md:inset-6"
      >
        <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
          <MediaFrame src={demo.image} label={demo.frameLabel} configKey="demo.image" priority />
        </motion.div>

        <motion.div
          style={{ opacity: scrim }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#16110ee6_0%,#16110e80_32%,transparent_62%)]"
          aria-hidden
        />

        <div
          className="absolute inset-x-0 bottom-[clamp(96px,16vh,150px)] px-6 md:px-12"
          style={{ ["--ph" as string]: "var(--color-accent-lift)" }}
        >
          <div className="flex max-w-[1100px] items-end gap-5">
            <motion.span
              style={{ opacity: scrim }}
              className="bg-accent text-on-accent hidden h-14 w-14 shrink-0 place-items-center rounded-full md:grid"
              aria-hidden
            >
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />
            </motion.span>
            <RevealWords as="h2" text={demo.action} className="story-line t-display text-cream" progress={p} at={0.48} duration={0.12} />
          </div>
        </div>

        <motion.div style={{ opacity: barOpacity, y: barY }} className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-7">
          <div className="border-cream/15 bg-night/70 text-cream-dim mx-auto flex max-w-[980px] items-center gap-3 rounded-full border px-4 py-3 backdrop-blur-md md:px-6">
            <span className="relative grid h-2.5 w-2.5 shrink-0 place-items-center" aria-hidden>
              <span className="animate-live bg-accent-lift absolute inset-0 rounded-full" />
              <span className="bg-accent-lift relative h-2.5 w-2.5 rounded-full" />
            </span>
            <Radio className="text-accent-lift hidden h-4 w-4 shrink-0 sm:block" strokeWidth={1.8} aria-hidden />
            <p className="font-mono text-[11.5px] leading-snug tracking-[0.04em] md:text-[13px]" style={{ ["--ph" as string]: "#f6f1e9" }}>
              <Ph text={demo.plan} />
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
