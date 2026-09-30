"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { story } from "@/story.config";
import { MediaFrame } from "../MediaFrame";
import { bz, usePrefersReducedMotion } from "../motion";
import { Doodle } from "./Doodle";
import type { ChaosItem, ChapterKey, Tone } from "./types";

// Fills with a readable text colour: black on yellow / sky / white, white on the rest.
export const TONE: Record<Tone, string> = {
  yellow: "bg-yellow text-black",
  sky: "bg-sky text-black",
  white: "bg-white text-black",
  blue: "bg-blue text-white",
  red: "bg-red text-white",
  charcoal: "bg-charcoal text-white",
};

/**
 * Decorative overlay for one chapter: stickers, handwritten notes, scribbles
 * and meme polaroids from `story.chaos.items`. It never catches clicks except
 * on the stickers themselves (hover wiggle), and all of it is aria-hidden.
 */
export function ChaosLayer({ chapter }: { chapter: ChapterKey }) {
  const reduced = usePrefersReducedMotion();
  const items = story.chaos.enabled ? story.chaos.items.filter((i) => i.chapter === chapter) : [];

  // Everything jiggles a little when you scroll fast.
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 });
  const jiggle = useTransform(velocity, [-2500, 0, 2500], [-1, 0, 1], { clamp: true });

  if (!items.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[6]" aria-hidden>
      {items.map((item, i) => (
        <Placed key={i} item={item} index={i} jiggle={jiggle} reduced={reduced} />
      ))}
    </div>
  );
}

function Placed({ item, index, jiggle, reduced }: { item: ChaosItem; index: number; jiggle: MotionValue<number>; reduced: boolean }) {
  const base = item.rotate ?? 0;
  const amp = item.kind === "doodle" ? 3 : 7;
  const rotate = useTransform(jiggle, (j) => base + (reduced ? 0 : j * amp * (index % 2 ? 1 : -1)));
  const hideOnPhone = !item.mobile;

  return (
    <motion.div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${hideOnPhone ? "max-md:hidden" : "max-md:scale-75"}`}
      style={{ left: `${item.x}%`, top: `${item.y}%` }}
      initial={reduced ? false : { opacity: 0, scale: 0.4, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: item.delay ?? 0.1 + (index % 3) * 0.12, ease: bz("backOut") }}
    >
      <motion.div style={{ rotate }}>
        <Item item={item} reduced={reduced} />
      </motion.div>
    </motion.div>
  );
}

function Item({ item, reduced }: { item: ChaosItem; reduced: boolean }) {
  switch (item.kind) {
    case "sticker":
      return (
        <motion.span
          className={`font-display pointer-events-auto block cursor-default rounded-[10px] border-2 border-black px-3.5 py-2 text-[clamp(12px,1.05vw,15px)] font-bold tracking-[0.04em] whitespace-nowrap uppercase shadow-[4px_4px_0_#131313] ${TONE[item.tone]}`}
          whileHover={reduced ? undefined : { rotate: [0, -6, 5, -3, 0], scale: 1.08, transition: { duration: 0.5 } }}
        >
          {item.text}
        </motion.span>
      );
    case "note":
      return <span className="font-hand block text-[clamp(1.3rem,2vw,1.9rem)] leading-none font-bold whitespace-nowrap">{item.text}</span>;
    case "doodle":
      return (
        <Doodle shape={item.shape} ink={item.ink} size={item.size} icon={item.icon} delay={(item.delay ?? 0) + 0.25} reduced={reduced} />
      );
    case "meme":
      return (
        <figure
          className="relative bg-white p-2.5 pb-3 text-black shadow-[0_24px_40px_-18px_#13131399]"
          style={{ width: item.width ?? 220 }}
        >
          {/* tape */}
          <span className="bg-yellow/80 absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg]" />
          <div className="aspect-[4/3] w-full overflow-hidden">
            <MediaFrame src={item.image} label="[DROP A MEME]" configKey="chaos.items › image" sizes="240px" />
          </div>
          <figcaption className="font-hand mt-2 text-center text-[1.35rem] leading-[1.05] font-bold">{item.caption}</figcaption>
        </figure>
      );
  }
}
