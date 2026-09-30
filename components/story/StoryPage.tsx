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

// Colours per ground: night (black) → paper (white) → warm (brand blue).
const INK = { night: "#ffffff", paper: "#131313", warm: "#ffffff" };
// {accent} words: red text on white; white text on a red chip on black / blue.
const ACCENT_FG = { night: "#ffffff", paper: "#c23b21", warm: "#ffffff" };
const ACCENT_BG = { night: "rgba(194, 59, 33, 1)", paper: "rgba(194, 59, 33, 0)", warm: "rgba(194, 59, 33, 1)" };
// Progress bar + active rail dot (shapes, never text): whichever palette colour pops on the ground.
const SIGNAL = { night: "#ffd301", paper: "#264ed0", warm: "#ffd301" };

type Stops = { night: string; paper: string; warm: string };

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
  const accentFg = useTransform([paper, warm], byGround(ACCENT_FG));
  const accentBg = useTransform([paper, warm], byGround(ACCENT_BG));
  const signal = useTransform([paper, warm], byGround(SIGNAL));

  return (
    // reducedMotion="user": Framer drops transform/layout animations for visitors who ask.
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Ground paper={paper} warm={warm} />
      <Chrome chapters={CHAPTERS} ink={ink} signal={signal} scrollHint={story.hero.scrollHint} />
      {/* overflow-x: clip (not hidden) so position: sticky keeps working */}
      <motion.main
        className="relative overflow-x-clip"
        style={{ color: ink, "--accent-fg": accentFg, "--accent-bg": accentBg } as MotionStyle}
      >
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
