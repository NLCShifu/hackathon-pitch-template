"use client";

import { motion, useTransform, type MotionStyle, type MotionValue, type Variants } from "framer-motion";
import { bz, ease, staggerEach, usePrefersReducedMotion } from "./motion";
import { PartSpan, toWords, useHighlights, type Word } from "./text";

type Tag = "h1" | "h2" | "h3" | "p" | "div";
// All of these share the same prop surface; one type keeps the JSX checkable.
const motionTag = (tag: Tag) => motion[tag] as typeof motion.p;

type Common = {
  text: string;
  as?: Tag;
  className?: string;
  style?: MotionStyle;
};

type ScrollLinked = Common & {
  /** Pin progress to scrub against. */
  progress: MotionValue<number>;
  /** Timeline position (0–1) where the reveal starts. */
  at: number;
  /** Timeline length of the whole reveal. */
  duration: number;
  /** Optional exit window [start, end]: fades out and lifts 18px (power1.in). */
  out?: [number, number];
};

type Triggered = Common & {
  progress?: undefined;
  /** Seconds. Whisper intro uses 1s with 0.075s stagger. */
  duration?: number;
  delay?: number;
  /** Play on mount instead of on entering the viewport. */
  immediate?: boolean;
};

/**
 * Masked word-by-word slide-up (GSAP SplitText `mask: "words"` +
 * `from({ yPercent: 118, ease: "power3.out" })`), either scrubbed by scroll
 * or played once in view.
 */
export function RevealWords(props: ScrollLinked | Triggered) {
  const words = toWords(props.text, useHighlights());
  const Tag = props.as ?? "p";
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    const MotionTag = motionTag(Tag);
    return (
      <MotionTag className={props.className} style={props.style}>
        {words.map((w, i) => (
          <StaticWord key={i} word={w} first={i === 0} />
        ))}
      </MotionTag>
    );
  }

  if (props.progress) return <ScrubbedWords {...props} words={words} Tag={Tag} />;

  const duration = props.duration ?? 0.9;
  const joins = placeholderJoins(words);
  const MotionTag = motionTag(Tag);
  return (
    <MotionTag
      className={props.className}
      style={props.style}
      initial="hidden"
      {...(props.immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.5 } })}
      variants={{
        hidden: {},
        show: { transition: { delayChildren: props.delay ?? 0, staggerChildren: duration * 0.075 } },
      }}
    >
      {words.map((w, i) => (
        <Fragment2 key={i} first={i === 0}>
          {/* The wrapper is the stagger child; its part masks inherit its timing. */}
          <motion.span className="whitespace-nowrap" variants={{ hidden: {}, show: {} }}>
            <MaskedParts
              word={w}
              joinPrev={joins[i]}
              variants={{ hidden: { y: "118%" }, show: { y: "0%", transition: { duration, ease: bz("power3Out") } } }}
            />
          </motion.span>
        </Fragment2>
      ))}
    </MotionTag>
  );
}

function ScrubbedWords({ words, Tag, progress, at, duration, out, className, style }: ScrollLinked & { words: Word[]; Tag: Tag }) {
  const each = staggerEach(duration, words.length);
  const joins = placeholderJoins(words);
  // No exit window → constant output. Input ranges must stay within 0–1: framer can hand
  // scroll-linked transforms to the Web Animations API, which rejects offsets outside it.
  const exitOpacity = useTransform(progress, out ?? [0, 1], out ? [1, 0] : [1, 1], { ease: ease.power1In });
  const exitY = useTransform(progress, out ?? [0, 1], out ? [0, -18] : [0, 0], { ease: ease.power1In });
  // autoAlpha: hidden until the reveal starts, so stacked lines don't catch clicks.
  const visibility = useTransform(progress, (p) => (p < at || (out && p >= out[1]) ? "hidden" : "visible"));
  const MotionTag = motionTag(Tag);

  return (
    <MotionTag className={className} style={{ ...style, opacity: exitOpacity, y: exitY, visibility }}>
      {words.map((w, i) => (
        <Fragment2 key={i} first={i === 0}>
          <ScrubWord word={w} joinPrev={joins[i]} progress={progress} start={at + i * each} duration={duration} />
        </Fragment2>
      ))}
    </MotionTag>
  );
}

function ScrubWord({
  word,
  joinPrev,
  progress,
  start,
  duration,
}: {
  word: Word;
  joinPrev: boolean;
  progress: MotionValue<number>;
  start: number;
  duration: number;
}) {
  const y = useTransform(progress, [start, start + duration], ["118%", "0%"], { ease: ease.power3Out });
  return (
    <span className="whitespace-nowrap">
      <MaskedParts word={word} joinPrev={joinPrev} y={y} />
    </span>
  );
}

/**
 * One clip mask per part, so a highlight sits on the mask box
 * itself: every chip is exactly one line tall and neighbouring placeholder
 * words join into one continuous marker bar (see `.hl-mask` in globals.css).
 */
function MaskedParts({ word, joinPrev, y, variants }: { word: Word; joinPrev: boolean; y?: MotionValue<string>; variants?: Variants }) {
  return (
    <>
      {word.map((part, j) => (
        <span key={j} className={`word-mask ${part.kind === "hl" ? "hl-mask" : ""} ${j === 0 && joinPrev ? "hl-join" : ""}`}>
          <motion.span className="inline-block will-change-transform" style={y ? { y } : undefined} variants={variants}>
            <PartSpan part={part} />
          </motion.span>
        </span>
      ))}
    </>
  );
}

/** True for each word that continues a highlight from the previous word. */
function placeholderJoins(words: Word[]) {
  return words.map((w, i) => i > 0 && w[0].kind === "hl" && words[i - 1][words[i - 1].length - 1].kind === "hl");
}

function WordParts({ word }: { word: Word }) {
  return (
    <>
      {word.map((p, j) => (
        <PartSpan key={j} part={p} />
      ))}
    </>
  );
}

function StaticWord({ word, first }: { word: Word; first: boolean }) {
  return (
    <>
      {!first && " "}
      <WordParts word={word} />
    </>
  );
}

function Fragment2({ first, children }: { first: boolean; children: React.ReactNode }) {
  return (
    <>
      {!first && " "}
      {children}
    </>
  );
}
