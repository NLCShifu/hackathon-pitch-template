"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { story } from "@/story.config";
import { ease } from "../motion";
import { PinnedSection, usePin } from "../PinnedSection";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

/**
 * Pinned "comparative drift": workaround → bottleneck → insight arrive one by
 * one along a drawing rule, the insight card lights up, then the headline
 * steps back for the bottleneck banner.
 *
 * Timeline (fractions of the pin):
 *   .02 headline   .10 because   .18–.58 rule draws   .20/.32/.44 cards
 *   .52 insight lights up   .62 focus shift   .64 banner wipes   .68 banner copy
 */
export function InsightDrift() {
  return (
    <PinnedSection id="story-insight" chapter="insight" scrollVh={story.motion.pin.insight}>
      <Stage />
    </PinnedSection>
  );
}

function Stage() {
  const p = usePin();
  const { insight } = story;
  const recede = useTransform(p, [0.6, 0.7], [1, 0.32], { ease: ease.power1InOut });
  const rule = useTransform(p, [0.18, 0.58], [0, 1], { ease: ease.power1InOut });
  const bannerWipe = useTransform(p, [0.64, 0.74], [0, 1], { ease: ease.power2InOut });

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-[clamp(28px,5vh,56px)] px-6 md:px-12">
      <motion.div style={{ opacity: recede }}>
        <ChapterMark n={3} />
        <RevealWords
          as="h2"
          text={insight.headline}
          className="story-line t-display mt-5 max-w-[18ch]"
          progress={p}
          at={0.02}
          duration={0.12}
        />
        <RevealWords
          as="p"
          text={insight.because}
          className="story-line t-section text-ink-soft mt-3"
          progress={p}
          at={0.1}
          duration={0.1}
        />
      </motion.div>

      <div className="relative">
        <motion.div
          className="bg-ink/20 absolute top-[34px] right-0 left-0 hidden h-px origin-left md:block"
          style={{ scaleX: rule }}
          aria-hidden
        />
        <ol className="grid gap-4 md:grid-cols-3 md:gap-6">
          {insight.steps.map((text, i) => (
            <Step key={i} index={i} text={text} progress={p} last={i === insight.steps.length - 1} />
          ))}
        </ol>
      </div>

      <div className="relative overflow-hidden rounded-[22px]">
        <motion.div className="bg-accent absolute inset-0 origin-left" style={{ scaleX: bannerWipe }} aria-hidden />
        <div className="relative px-6 py-6 md:px-10 md:py-8">
          <RevealWords
            as="p"
            text={insight.banner}
            className="story-line t-section text-on-accent"
            progress={p}
            at={0.68}
            duration={0.12}
          />
        </div>
      </div>
    </div>
  );
}

function Step({ index, text, progress, last }: { index: number; text: string; progress: MotionValue<number>; last: boolean }) {
  const at = 0.2 + index * 0.12;
  const opacity = useTransform(progress, [at, at + 0.06], [0, 1]);
  // Each card drifts in from the right, then keeps sliding at its own rate.
  const x = useTransform(progress, [at, at + 0.1, 1], [90, 0, -18 * (index + 1)], { ease: [ease.power3Out, (t) => t] });
  const y = useTransform(progress, [at, at + 0.1], [24, 0], { ease: ease.power3Out });
  // The insight card lights up once all three are on stage.
  const lit = useTransform(progress, [0.52, 0.58], [0, 1]);
  // Lit insight card: sky fill, black text and a black keyline.
  const bg = useTransform(lit, [0, 1], ["#f5f5f5", last ? "#5dadeb" : "#f5f5f5"]);
  const border = useTransform(lit, [0, 1], ["#e2e2e2", last ? "#131313" : "#e2e2e2"]);

  return (
    <motion.li style={{ opacity, x, y }} className="relative">
      <div className="mb-4 flex items-center gap-3">
        <span className="bg-paper border-ink/20 text-ink relative z-[1] grid h-[68px] w-[68px] place-items-center rounded-full border font-mono text-sm tracking-[0.12em]">
          {String(index + 1).padStart(2, "0")}
        </span>
        {!last && <ArrowRight className="text-ink/40 hidden h-4 w-4 md:block" strokeWidth={1.8} aria-hidden />}
      </div>
      <motion.div
        style={{ backgroundColor: bg, borderColor: border }}
        className="text-ink min-h-[clamp(96px,16vh,170px)] rounded-[22px] border p-6 shadow-[0_24px_50px_-36px_#13131366] md:p-7"
      >
        <p className="story-line text-[clamp(1.3rem,2.2vw,1.9rem)]">
          <Ph text={text} />
        </p>
      </motion.div>
    </motion.li>
  );
}
