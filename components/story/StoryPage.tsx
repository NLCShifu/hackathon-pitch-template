"use client";

import { MotionConfig, motion, transform, useScroll, useTransform } from "framer-motion";
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
import { Highlights } from "./text";
import { Marquee } from "./chaos/Marquee";
import type { ChapterKey } from "./chaos/types";

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

// Colours per ground: night (black) → paper (white) → warm (brand blue).
const INK = { night: "#ffffff", paper: "#131313", warm: "#ffffff" };
// Progress bar + active rail dot (shapes, never text): whichever palette colour pops on the ground.
const SIGNAL = { night: "#ffd301", paper: "#264ed0", warm: "#ffd301" };

type Stops = { night: string; paper: string; warm: string };

const hl = story.highlights;

export function StoryPage() {
  const problemRef = useRef<HTMLElement>(null);
  const finaleRef = useRef<HTMLElement>(null);

  // Ground crossfades are keyed to where chapters sit, not to fixed pixel values.
  const { scrollYProgress: toPaper } = useScroll({ target: problemRef, offset: ["start 85%", "start 30%"] });
  const { scrollYProgress: toWarm } = useScroll({ target: finaleRef, offset: ["start 55%", "start 5%"] });
  const paper = useScrub(toPaper);
  const warm = useScrub(toWarm);

  const byGround =
    (c: Stops) =>
    ([a, b]: number[]) =>
      b > 0 ? transform(b, [0, 1], [c.paper, c.warm]) : transform(a, [0, 1], [c.night, c.paper]);
  const ink = useTransform([paper, warm], byGround(INK));
  const signal = useTransform([paper, warm], byGround(SIGNAL));

  return (
    // reducedMotion="user": Framer drops transform/layout animations for visitors who ask.
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Ground paper={paper} warm={warm} />
      <Chrome chapters={CHAPTERS} ink={ink} signal={signal} scrollHint={story.hero.scrollHint} />
      {/* overflow-x: clip (not hidden) so position: sticky keeps working */}
      <motion.main className="relative overflow-x-clip" style={{ color: ink }}>
        {/* Each chapter gets its own yellow phrases from story.config.ts › highlights */}
        <Highlights phrases={hl.hero}>
          <HeroIntro />
        </Highlights>
        <Banners after="hero" />
        <Highlights phrases={hl.problem}>
          <BrokenReality ref={problemRef} />
        </Highlights>
        <Banners after="problem" />
        <Highlights phrases={hl.insight}>
          <InsightDrift />
        </Highlights>
        <Banners after="insight" />
        <Highlights phrases={hl.product}>
          <PinnedCanvas />
        </Highlights>
        <Banners after="product" />
        <Highlights phrases={hl.demo}>
          <DemoFrame />
        </Highlights>
        <Banners after="demo" />
        <Highlights phrases={hl.tradeoffs}>
          <TradeoffGrid />
        </Highlights>
        <Banners after="tradeoffs" />
        <Highlights phrases={hl.proof}>
          <ProofStats />
        </Highlights>
        <Banners after="proof" />
        <Highlights phrases={hl.finale}>
          <Finale ref={finaleRef} />
        </Highlights>
      </motion.main>
    </MotionConfig>
  );
}

/** Crossed scrolling tape from `story.chaos.banners`, dropped in between chapters. */
function Banners({ after }: { after: ChapterKey }) {
  if (!story.chaos.enabled) return null;
  return (
    <>
      {story.chaos.banners
        .filter((b) => b.after === after)
        .map((b, i) => (
          <Marquee key={i} text={b.text} />
        ))}
    </>
  );
}
