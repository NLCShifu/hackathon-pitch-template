"use client";

import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import { Compass, Layers, MessageCircle, Sparkles, Timer, Zap, type LucideIcon } from "lucide-react";
import { story } from "@/story.config";
import { bz, ease } from "../motion";
import { PinnedSection, usePin } from "../PinnedSection";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { useConfetti } from "../chaos/Confetti";

// Decorative glyphs orbiting the title (Whisper `.story-open-glyph`). Positions in % of the stage.
// Tiles use the palette as fills; icons are black on yellow/sky, white on blue/red/charcoal.
const TONES = {
  blue: "bg-blue text-white",
  sky: "bg-sky text-black",
  yellow: "bg-yellow text-black",
  red: "bg-red text-white",
  charcoal: "bg-charcoal text-white border border-white/15",
} as const;
const GLYPHS: { Icon: LucideIcon; x: number; y: number; size: number; delay: number; tone: keyof typeof TONES }[] = [
  { Icon: MessageCircle, x: 12, y: 20, size: 44, delay: 0, tone: "blue" },
  { Icon: Sparkles, x: 84, y: 16, size: 48, delay: 1.4, tone: "yellow" },
  { Icon: Layers, x: 78, y: 74, size: 42, delay: 0.7, tone: "red" },
  { Icon: Zap, x: 17, y: 78, size: 46, delay: 2.4, tone: "sky" },
  { Icon: Timer, x: 46, y: 8, size: 38, delay: 3.1, tone: "charcoal" },
  { Icon: Compass, x: 62, y: 90, size: 40, delay: 2, tone: "blue" },
];

export function HeroIntro() {
  return (
    <PinnedSection id="story-arrival" chapter="hero" scrollVh={story.motion.pin.hero} restProgress={0}>
      <Stage />
    </PinnedSection>
  );
}

function Stage() {
  const p = usePin();
  const { hero } = story;
  const confetti = useConfetti();

  // Scroll-linked morph of the display type: Bricolage's width axis condenses
  // and the weight climbs while the block lifts away.
  const wght = useTransform(p, [0.08, 0.6], [600, 700], { ease: ease.power1InOut });
  const wdth = useTransform(p, [0.08, 0.6], [85, 79], { ease: ease.power1InOut });
  const tracking = useTransform(p, [0.08, 0.6], [-0.03, -0.022]);
  const fvs = useMotionTemplate`"opsz" 96, "wght" ${wght}, "wdth" ${wdth}`;
  const letterSpacing = useMotionTemplate`${tracking}em`;

  const lift = useTransform(p, [0.3, 0.9], [0, -90], { ease: ease.power2InOut });
  const scale = useTransform(p, [0.3, 0.9], [1, 0.9], { ease: ease.power2InOut });
  const fade = useTransform(p, [0.58, 0.88], [1, 0], { ease: ease.power1In });
  const blur = useTransform(p, [0.6, 0.9], [0, 10]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {GLYPHS.map((g, i) => (
          <Glyph key={i} {...g} index={i} progress={p} />
        ))}
      </div>

      <motion.div style={{ y: lift, scale, opacity: fade, filter }} className="relative mx-auto w-full max-w-[1100px] text-center">
        <motion.p
          className="eyebrow mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: bz("power2Out") }}
        >
          <span>
            <Ph text={hero.eyebrow} />
          </span>
          <span aria-hidden className="text-cream-faint">
            //
          </span>
          <span>
            <Ph text={hero.team} />
          </span>
        </motion.p>

        {/* Easter egg: click the name for confetti. */}
        <div className="relative cursor-pointer" onClick={confetti.burst}>
          <RevealWords
            as="h1"
            text={hero.name}
            className="story-line t-mega"
            style={{ fontVariationSettings: fvs, letterSpacing }}
            immediate
            delay={0.15}
            duration={1}
          />
          {confetti.layer}
        </div>

        <RevealWords
          as="p"
          text={hero.tagline}
          className="story-line t-lead text-cream-dim mx-auto mt-7 max-w-[22ch]"
          immediate
          delay={0.55}
          duration={0.9}
        />
      </motion.div>
    </div>
  );
}

function Glyph({
  Icon,
  x,
  y,
  size,
  delay,
  tone,
  index,
  progress,
}: (typeof GLYPHS)[number] & { index: number; progress: MotionValue<number> }) {
  // Whisper: glyphs fade out at 0.82 of the opening pin, staggered by 0.02.
  const opacity = useTransform(progress, [0.62 + index * 0.02, 0.74 + index * 0.02], [1, 0]);
  const drift = useTransform(progress, [0, 1], [0, (index % 2 ? -1 : 1) * 60]);
  return (
    <motion.span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%`, opacity, y: drift }}>
      <motion.span
        className="block"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2 + index * 0.09, ease: bz("power2Out") }}
      >
        <span
          className={`animate-drift flex items-center justify-center rounded-[14px] shadow-[0_14px_30px_-14px_#000000cc] ${TONES[tone]}`}
          style={{ width: size, height: size, animationDelay: `${-delay}s` }}
        >
          <Icon className="h-[42%] w-[42%]" strokeWidth={1.6} />
        </span>
      </motion.span>
    </motion.span>
  );
}
