"use client";

import { MotionConfig, motion, transform, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { story } from "@/story.config";
import { Chrome, type Chapter } from "./Chrome";
import { Ground } from "./Ground";
import { ease, useScrub } from "./motion";
import { DeckProvider, usePresentation } from "./Presentation";
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
  const present = usePresentation(CHAPTERS);

  // Ground crossfades are keyed to where chapters sit, not to fixed pixel values.
  // Black → white is a long, eased dissolve: it starts as the title begins to fade
  // and completes just before the next headline (~18svh below its section top)
  // scrolls into view, so no headline is ever mid-colour on a mid-grey ground.
  const { scrollYProgress: toPaperLinear } = useScroll({ target: problemRef, offset: ["start 175%", "start 74%"] });
  const toPaper = useTransform(toPaperLinear, (v) => ease.power1InOut(v));
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
      <Chrome chapters={CHAPTERS} ink={ink} signal={signal} scrollHint={story.hero.scrollHint} present={present} />
      {/* overflow-x: clip (not hidden) so position: sticky keeps working */}
      <DeckProvider value={present}>
        <motion.main
          className="relative overflow-x-clip"
          style={{ color: ink }}
        >
          {/* Each chapter gets its own yellow phrases from story.config.ts › highlights */}
          <Highlights phrases={hl.hero}>
            <HeroIntro />
          </Highlights>
          <Highlights phrases={hl.problem}>
            <BrokenReality ref={problemRef} />
          </Highlights>
          <Highlights phrases={hl.insight}>
            <InsightDrift />
          </Highlights>
          <Highlights phrases={hl.product}>
            <PinnedCanvas />
          </Highlights>
          <Highlights phrases={hl.demo}>
            <DemoFrame />
          </Highlights>
          <Highlights phrases={hl.tradeoffs}>
            <TradeoffGrid />
          </Highlights>
          <Highlights phrases={hl.proof}>
            <ProofStats />
          </Highlights>
          <Highlights phrases={hl.finale}>
            <Finale ref={finaleRef} />
          </Highlights>
        </motion.main>
      </DeckProvider>
    </MotionConfig>
  );
}
