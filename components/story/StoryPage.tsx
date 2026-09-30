"use client";

import { MotionConfig, motion, transform, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { useRef } from "react";
import { story } from "@/story.config";
import { Chrome, type Chapter } from "./Chrome";
import { Ground } from "./Ground";
import { useScrub } from "./motion";
import { SmoothScroll } from "./SmoothScroll";
import { BrokenReality } from "./sections/BrokenReality";
import { DemoFrame } from "./sections/DemoFrame";
import { Finale } from "./sections/Finale";
import { HeroIntro } from "./sections/HeroIntro";
import { InsightDrift } from "./sections/InsightDrift";
import { PinnedCanvas } from "./sections/PinnedCanvas";
import { ProofStats } from "./sections/ProofStats";
import { TradeoffGrid } from "./sections/TradeoffGrid";

const CHAPTERS: Chapter[] = [
  { id: "story-arrival", label: "Arrival" },
  { id: "story-problem", label: "Reality" },
  { id: "story-insight", label: "Insight" },
  { id: "story-product", label: "The bet" },
  { id: "story-demo", label: "Demo" },
  { id: "story-tradeoffs", label: "Trade-offs" },
  { id: "story-proof", label: "Proof" },
  { id: "story-ask", label: "The ask" },
];

// Text + placeholder colours per ground: night → paper → warm.
const INK = { night: "#f6f1e9", paper: "#2a2420", warm: "#fdf6ef" };
const PH = { night: "#e2864a", paper: "#ca6833", warm: "#ffdcc0" };

export function StoryPage() {
  const problemRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);

  // Ground crossfades are keyed to where chapters sit, not to fixed pixel values.
  const { scrollYProgress: toPaper } = useScroll({ target: problemRef, offset: ["start 85%", "start 30%"] });
  const { scrollYProgress: toWarm } = useScroll({ target: finaleRef, offset: ["start 55%", "start 5%"] });
  const paper = useScrub(toPaper);
  const warm = useScrub(toWarm);

  const ink = useTransform([paper, warm], ([a, b]: number[]) =>
    b > 0 ? transform(b, [0, 1], [INK.paper, INK.warm]) : transform(a, [0, 1], [INK.night, INK.paper]),
  );
  const ph = useTransform([paper, warm], ([a, b]: number[]) =>
    b > 0 ? transform(b, [0, 1], [PH.paper, PH.warm]) : transform(a, [0, 1], [PH.night, PH.paper]),
  );

  return (
    // reducedMotion="user": Framer drops transform/layout animations for visitors who ask.
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Ground paper={paper} warm={warm} />
      <Chrome chapters={CHAPTERS} ink={ink} scrollHint={story.hero.scrollHint} />
      {/* overflow-x: clip (not hidden) so position: sticky keeps working */}
      <motion.main className="relative overflow-x-clip" style={{ color: ink, "--ph": ph } as MotionStyle}>
        <HeroIntro />
        <BrokenReality ref={problemRef} />
        <InsightDrift />
        <PinnedCanvas />
        <DemoFrame />
        <TradeoffGrid />
        <ProofStats />
        <Finale ref={finaleRef} />
      </motion.main>
    </MotionConfig>
  );
}
