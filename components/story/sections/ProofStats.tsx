"use client";

import { animate, motion, useInView } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import { story } from "@/story.config";
import { bz, ease, usePrefersReducedMotion } from "../motion";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

export function ProofStats() {
  const { proof } = story;
  return (
    <section id="story-proof" data-chapter className="relative z-[1] px-6 py-[16svh] md:px-12">
      <div className="mx-auto max-w-[1240px]">
        <ChapterMark n={7} />
        <RevealWords as="h2" text={proof.headline} className="story-line t-display mt-6 max-w-[18ch]" duration={0.9} />

        <dl className="mt-[clamp(48px,9vh,110px)] grid gap-10 md:grid-cols-3 md:gap-8">
          {proof.stats.map((s, i) => (
            <div key={i} className="relative pt-7">
              <motion.span
                className="bg-ink/25 absolute inset-x-0 top-0 h-px origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: 1.1, delay: i * 0.12, ease: bz("power2InOut") }}
                aria-hidden
              />
              <dd className="story-line text-[clamp(3.6rem,9vw,8rem)] leading-[0.95] tracking-[-0.035em]">
                <CountUp value={s.value} delay={0.15 + i * 0.12} />
              </dd>
              <dt className="eyebrow mt-4">
                <Ph text={s.label} />
              </dt>
            </div>
          ))}
        </dl>

        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: bz("power3Out") }}
          className="border-hairline bg-surface text-ink [--ph:#ca6833] relative mt-[clamp(48px,9vh,110px)] flex gap-5 overflow-hidden rounded-[22px] border p-7 md:ml-[25%] md:p-9"
        >
          <span className="bg-accent absolute inset-y-0 left-0 w-1" aria-hidden />
          <span className="bg-accent-tint text-accent-deep grid h-11 w-11 shrink-0 place-items-center rounded-full">
            <Lightbulb className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </span>
          <p className="t-caption !max-w-[60ch] text-[clamp(1.1rem,1.7vw,1.35rem)]">
            <Ph text={proof.learned} />
          </p>
        </motion.aside>
      </div>
    </section>
  );
}

const NUMERIC = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

/**
 * "128", "3.4s", "92%", "$1,200" count up from zero once in view (expo.out, 1.6s).
 * Anything else, including "[X]" placeholders, slides up through a mask instead.
 */
function CountUp({ value, delay }: { value: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = usePrefersReducedMotion();
  const match = value.match(NUMERIC);

  useEffect(() => {
    if (!match || !inView || reduced || !ref.current) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.split(".")[1]?.length ?? 0;
    const grouped = num.includes(",");
    const fmt = (v: number) =>
      prefix +
      v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
      suffix;
    const el = ref.current;
    el.textContent = fmt(0);
    const controls = animate(0, target, { duration: 1.6, delay, ease: ease.expoOut, onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value]);

  if (match) {
    return (
      <span ref={ref} className="tabular-nums">
        {/* React renders the start value; the effect then animates this text node directly. */}
        {reduced ? value : match[1] + "0" + match[3]}
      </span>
    );
  }

  return (
    <span ref={ref} className="word-mask">
      <motion.span
        className="inline-block"
        initial={reduced ? false : { y: "118%" }}
        animate={inView ? { y: "0%" } : undefined}
        transition={{ duration: 1, delay, ease: bz("power3Out") }}
      >
        <Ph text={value} />
      </motion.span>
    </span>
  );
}
