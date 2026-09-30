"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import type { Ref } from "react";
import { story } from "@/story.config";
import { bz, ease, useScrub, usePrefersReducedMotion } from "../motion";
import { MediaFrame } from "../MediaFrame";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";
import { useMergedRef } from "../useMergedRef";
import { ChaosLayer } from "../chaos/ChaosLayer";

/** Free-flowing (unpinned) split: headline + context left, editorial photo right. */
export function BrokenReality({ ref }: { ref?: Ref<HTMLElement> }) {
  const { problem } = story;
  const [local, setRef] = useMergedRef(ref);
  const reduced = usePrefersReducedMotion();

  // Frame wipes open from the bottom while the section rises into view…
  const { scrollYProgress: enter } = useScroll({ target: local, offset: ["start 85%", "start 20%"] });
  const e = useScrub(enter);
  const clip = useTransform(e, [0, 1], [100, 0], { ease: ease.power2InOut });
  const clipPath = useMotionTemplate`inset(${clip}% 0% 0% 0% round 28px)`;
  const frameY = useTransform(e, [0, 1], [80, 0], { ease: ease.power3Out });

  // …and the photo drifts inside it for the whole time it is on screen.
  const { scrollYProgress: pass } = useScroll({ target: local, offset: ["start end", "end start"] });
  const passing = useScrub(pass);
  const photoY = useTransform(passing, [0, 1], ["-9%", "9%"]);

  return (
    <section id="story-problem" ref={setRef} data-chapter className="relative z-[1] px-6 py-[18svh] md:px-12">
      <ChaosLayer chapter="problem" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7 md:pr-6">
          <ChapterMark n={2} />
          <RevealWords as="h2" text={problem.headline} className="story-line t-display mt-6" duration={0.9} />
          <motion.p
            className="t-caption text-ink-soft mt-10 md:ml-[12%]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.35, ease: bz("power3Out") }}
          >
            <Ph text={problem.context} />
          </motion.p>
        </div>

        <motion.figure
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_#13131366] md:col-span-5 md:-mt-24"
          style={reduced ? undefined : { clipPath, y: frameY }}
        >
          <motion.div className="absolute inset-[-10%_0]" style={reduced ? undefined : { y: photoY }}>
            <MediaFrame src={problem.image} label={problem.photoLabel} configKey="problem.image" sizes="(min-width: 768px) 40vw, 100vw" />
          </motion.div>
        </motion.figure>
      </div>
    </section>
  );
}
