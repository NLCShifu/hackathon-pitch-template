"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Cpu } from "lucide-react";
import { useRef } from "react";
import { story } from "@/story.config";
import { bz, useScrub, usePrefersReducedMotion } from "../motion";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

// Counter colours (all readable on the light card surface).
const COUNTER_TONES = ["text-blue", "text-red", "text-charcoal"];

// Asymmetric 12-col layout: descending widths, each card stepping further down.
const LAYOUT = ["md:col-span-5", "md:col-span-4 md:mt-28", "md:col-span-3 md:mt-56"];

/** Three progressive editorial cards that drift at different rates as you pass them. */
export function TradeoffGrid() {
  const { tradeoffs } = story;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pass = useScrub(scrollYProgress);

  return (
    <section id="story-tradeoffs" ref={ref} data-chapter className="relative z-[1] px-6 py-[16svh] md:px-12">
      <div className="mx-auto max-w-[1240px]">
        <ChapterMark n={6} />
        <RevealWords as="h2" text={tradeoffs.headline} className="story-line t-display mt-6 max-w-[16ch]" duration={0.9} />

        <div className="mt-[clamp(48px,9vh,110px)] grid items-start gap-5 md:grid-cols-12 md:gap-6">
          {tradeoffs.cards.map((card, i) => (
            <Card key={card.n} card={card} index={i} pass={pass} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, ease: bz("power3Out") }}
          className="border-ink/15 mt-[clamp(48px,9vh,110px)] flex items-start gap-4 border-y py-6 md:items-center"
        >
          <span className="bg-blue grid h-10 w-10 text-white shrink-0 place-items-center rounded-full">
            <Cpu className="h-4.5 w-4.5" strokeWidth={1.7} aria-hidden />
          </span>
          <p className="font-mono text-[14px] leading-relaxed tracking-[0.02em] md:text-[15px]">
            <Ph text={tradeoffs.tech} />
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Card({ card, index, pass }: { card: (typeof story.tradeoffs.cards)[number]; index: number; pass: MotionValue<number> }) {
  const reduced = usePrefersReducedMotion();
  const drift = useTransform(pass, [0, 1], [36 * (index + 1), -36 * (index + 1)]);

  return (
    <motion.div className={LAYOUT[index] ?? "md:col-span-4"} style={reduced ? undefined : { y: drift }}>
      <motion.article
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: bz("power3Out") }}
        className="border-hairline bg-surface text-ink [--accent-fg:#c23b21] [--accent-bg:transparent] flex min-h-[260px] flex-col rounded-[22px] border p-7 shadow-[0_30px_60px_-44px_#13131366] md:p-8"
      >
        <div className="flex items-baseline justify-between gap-4 font-mono">
          <span
            className={`${COUNTER_TONES[index % COUNTER_TONES.length]} text-[clamp(2.4rem,4vw,3.4rem)] leading-none font-medium tracking-[-0.04em]`}
          >
            {card.n}
          </span>
          <span className="text-ink-soft text-right text-[11px] tracking-[0.19em] uppercase">
            <Ph text={card.title} />
          </span>
        </div>
        <div className="bg-hairline my-6 h-px" aria-hidden />
        <p className="story-line mt-auto text-[clamp(1.35rem,2.1vw,1.85rem)]">
          <Ph text={card.body} />
        </p>
      </motion.article>
    </motion.div>
  );
}
