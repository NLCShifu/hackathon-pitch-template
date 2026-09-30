"use client";

import { motion } from "framer-motion";
import type { Ref } from "react";
import { story } from "@/story.config";
import { bz } from "../motion";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

/** Free-flowing (unpinned) text chapter: headline + context. */
export function BrokenReality({ ref }: { ref?: Ref<HTMLElement> }) {
  const { problem } = story;

  return (
    <section id="story-problem" ref={ref} data-chapter className="relative z-[1] px-6 py-[18svh] md:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="max-w-[900px]">
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
      </div>
    </section>
  );
}
