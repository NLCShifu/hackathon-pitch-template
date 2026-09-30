"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { story } from "@/story.config";
import { ease } from "../motion";
import { MediaFrame } from "../MediaFrame";
import { PinnedSection, usePin } from "../PinnedSection";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

/**
 * The product bet, a 300vh "living canvas" (Whisper's journey chapter length).
 *
 *   .02–.14  headline rises centred and large
 *   .10–.34  headline docks to the top; canvas tilts up out of perspective
 *   .22      sub-copy reveals under the headline
 *   .38–.74  feature pills float onto the canvas, one every .12
 *   .86–.96  pills and copy clear the stage for the demo chapter
 */
export function PinnedCanvas() {
  return (
    <PinnedSection id="story-product" scrollVh={story.motion.pin.canvas} restProgress={0.8} padded={false}>
      <Stage />
    </PinnedSection>
  );
}

// Icon bubbles cycle through the palette (black icons on yellow/sky, white on blue/red).
const PILL_TONES = ["bg-yellow text-black", "bg-blue text-white", "bg-sky text-black", "bg-red text-white"];

// Pill anchor points, in % of the canvas box (they overhang its edges on purpose).
const PILL_SLOTS = [
  { left: "-6%", top: "14%" },
  { right: "-4%", top: "-6%" },
  { right: "-5%", top: "62%" },
  { left: "-3%", top: "80%" },
];

function Stage() {
  const p = usePin();
  const { product } = story;

  const dock = useTransform(p, [0.1, 0.34], [0, 1], { ease: ease.power2InOut });
  const headY = useTransform(dock, [0, 1], ["26svh", "0svh"]);
  const headScale = useTransform(dock, [0, 1], [1.18, 1]);
  const copyOut = useTransform(p, [0.86, 0.96], [1, 0], { ease: ease.power1In });

  const canvasIn = useTransform(p, [0.12, 0.36], [0, 1], { ease: ease.power3Out });
  const canvasY = useTransform(canvasIn, [0, 1], ["60svh", "0svh"]);
  const rotateX = useTransform(canvasIn, [0, 1], [24, 0]);
  const canvasScale = useTransform(p, [0.12, 0.36, 1], [0.78, 1, 1.04]);
  const canvasOpacity = useTransform(p, [0.12, 0.2], [0, 1]);

  return (
    <div className="relative flex flex-1 flex-col items-center px-6 pt-[clamp(56px,9vh,110px)] md:px-12">
      <motion.header
        style={{ y: headY, scale: headScale, opacity: copyOut }}
        className="relative z-[2] w-full max-w-[980px] origin-top text-center"
      >
        <ChapterMark n={4} className="justify-center" />
        <RevealWords as="h2" text={product.headline} className="story-line t-display mt-4" progress={p} at={0.02} duration={0.12} />
        <RevealWords
          as="p"
          text={product.line}
          className="t-caption text-ink-soft mx-auto mt-4 !max-w-[58ch]"
          progress={p}
          at={0.22}
          duration={0.12}
        />
      </motion.header>

      <div className="relative mt-[clamp(20px,4vh,44px)] w-full flex-1 [perspective:1600px]">
        <motion.div
          style={{ y: canvasY, rotateX, scale: canvasScale, opacity: canvasOpacity }}
          className="relative mx-auto aspect-[4/5] w-[min(100%,420px)] sm:aspect-[16/10] sm:w-[min(100%,1000px,calc((100svh_-_340px)*1.6))] origin-[50%_0%]"
        >
          <div className="border-ink/10 bg-surface absolute inset-0 overflow-hidden rounded-[22px] border shadow-[0_60px_120px_-50px_#13131366]">
            <div className="border-ink/10 flex h-9 items-center gap-1.5 border-b px-4" aria-hidden>
              <i className="bg-red h-2.5 w-2.5 rounded-full" />
              <i className="bg-yellow h-2.5 w-2.5 rounded-full" />
              <i className="bg-blue h-2.5 w-2.5 rounded-full" />
            </div>
            <div className="text-ink absolute inset-x-0 top-9 bottom-0">
              <MediaFrame
                src={product.image}
                label={product.heroLabel}
                configKey="product.image"
                sizes="(min-width: 1024px) 1000px, 90vw"
              />
            </div>
          </div>

          {product.pills.slice(0, PILL_SLOTS.length).map((pill, i) => (
            <Pill key={i} index={i} progress={p} {...pill} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Pill({
  index,
  progress,
  icon: Icon,
  text,
}: (typeof story.product.pills)[number] & { index: number; progress: MotionValue<number> }) {
  const at = 0.38 + index * 0.12;
  const t = useTransform(progress, [at, at + 0.08], [0, 1], { clamp: true });
  const out = useTransform(progress, [0.84 + index * 0.02, 0.9 + index * 0.02], [1, 0]);
  const opacity = useTransform([t, out], ([a, b]: number[]) => a * b);
  const scale = useTransform(t, [0, 1], [0.86, 1], { ease: ease.backOut });
  // Every pill floats at its own rate, so the canvas feels alive under the scroll.
  const y = useTransform(progress, [at, 1], [28, -26 - index * 10]);

  return (
    <motion.div
      style={{ ...PILL_SLOTS[index], opacity, scale, y }}
      className="border-ink/10 bg-surface/90 text-ink absolute z-[3] flex max-w-[min(320px,46vw)] items-center gap-2.5 rounded-full border py-2 pr-4 pl-2 shadow-[0_18px_40px_-20px_#13131366] backdrop-blur-md"
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${PILL_TONES[index % PILL_TONES.length]}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      </span>
      <span className="text-[13px] leading-tight font-semibold">
        <Ph text={text} />
      </span>
    </motion.div>
  );
}
