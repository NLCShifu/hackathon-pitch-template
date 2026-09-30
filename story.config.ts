/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE ONLY.  Replace every [BRACKETED PLACEHOLDER] with your copy.
 *
 *  • What turns yellow is set in one place: `highlights` right below.
 *  • The funny stuff (stickers, scribbles, memes, banners, confetti) lives in
 *    `chaos` near the bottom. Delete an entry to remove it.
 *  • Media: drop files in /public and set e.g. image: "/problem.jpg".
 *    .mp4 / .webm paths render as muted autoplay loops.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { Bird, Gauge, Layers, ShieldCheck, Sparkles } from "lucide-react";
import type { ChaosBanner, ChaosItem } from "@/components/story/chaos/types";

export const story = {
  /*
   * YELLOW HIGHLIGHTS. The only place that decides what turns yellow.
   * List the exact words (case-sensitive) per chapter; every match in that
   * chapter becomes black text on a yellow marker. [] = no yellow.
   * When you rewrite a headline, update its phrase here too.
   */
  highlights: {
    hero: ["[STARTUP NAME]"],
    problem: ["[USER]"],
    insight: ["[THE OBVIOUS SOLUTION]", "[YOUR NON-OBVIOUS INSIGHT]"],
    product: ["[STARTUP NAME]"],
    demo: [],
    tradeoffs: ["ON PURPOSE"],
    proof: ["[X HOURS]"],
    finale: ["[A BETTER FUTURE]"],
  } satisfies Record<string, string[]>,

  meta: {
    title: "[STARTUP NAME]",
    description: "[The clear human outcome you create.]",
  },

  /* 1 ─ Arrival */
  hero: {
    eyebrow: "NOT A PITCH. A WORKING BET.",
    team: "A [TEAM NAME] project",
    name: "[STARTUP NAME]",
    tagline: "[The clear human outcome you create.]",
    scrollHint: "Scroll",
  },

  /* 2 ─ The broken reality */
  problem: {
    headline: "[USER] SHOULD NOT HAVE TO [PAINFUL THING].",
    context: "[Describe the exact moment: what happens, what they do today, and what it costs.]",
    photoLabel: "[REAL-WORLD PROBLEM PHOTO]",
    image: "", // e.g. "/problem.jpg"
  },

  /* 3 ─ Bottleneck & non-obvious insight */
  insight: {
    headline: "WE DIDN’T BUILD [THE OBVIOUS SOLUTION].",
    because: "Because [why it still fails the user].",
    steps: ["[CURRENT WORKAROUND]", "[THE ACTUAL BOTTLENECK]", "[YOUR INSIGHT]"],
    banner: "THE REAL BOTTLENECK IS [YOUR NON-OBVIOUS INSIGHT].",
  },

  /* 4 ─ The product bet (pinned canvas) */
  product: {
    headline: "SO WE BUILT [STARTUP NAME].",
    line: "We help [specific user] achieve [concrete outcome] by [how it works—in plain English].",
    heroLabel: "[YOUR PRODUCT / PROTOTYPE HERO IMAGE]",
    image: "", // e.g. "/hero.png"
    // Up to 4 callouts float over the canvas as you scroll. Swap icons from lucide.dev/icons.
    pills: [
      { icon: Sparkles, text: "[FEATURE CALLOUT 1]" },
      { icon: Gauge, text: "[FEATURE CALLOUT 2]" },
      { icon: ShieldCheck, text: "[FEATURE CALLOUT 3]" },
      { icon: Layers, text: "[FEATURE CALLOUT 4]" },
    ],
  },

  /* 5 ─ Proof in motion */
  demo: {
    action: "[State the demo action—not its feature name.]",
    frameLabel: "[LARGE DEMO SCREENSHOT / VIDEO STILL]",
    image: "", // e.g. "/demo.png" or "/demo.mp4"
    plan: "Live demo plan: [one sentence]. Backup: [recorded clip / screenshot].",
  },

  /* 6 ─ Intentional trade-offs */
  tradeoffs: {
    headline: "WE MADE THESE TRADE-OFFS ON PURPOSE.",
    cards: [
      {
        n: "01",
        title: "WE BUILT",
        body: "[smallest thing proving key assumption]",
      },
      {
        n: "02",
        title: "WE DID NOT BUILD",
        body: "[tempting non-essential feature]",
      },
      {
        n: "03",
        title: "BECAUSE",
        body: "[why this was the correct technical choice]",
      },
    ],
    tech: "[Architecture / model / sensor / workflow in one defensible line]",
  },

  /* 7 ─ Verified reality. Numeric values ("128", "3.4s", "92%") count up; bracketed ones fade in. */
  proof: {
    headline: "WHAT WE PROVED IN [X HOURS].",
    stats: [
      { value: "[X]", label: "tests/users" },
      { value: "[Y]", label: "key output" },
      { value: "[Z]", label: "seconds / % / result" },
    ],
    learned: "What we learned: [One honest result. What worked + next constraint].",
  },

  /* 8 ─ Horizon & the ask */
  finale: {
    headline: "WE ARE TURNING [OLD PAINFUL REALITY] INTO [A BETTER FUTURE].",
    ask: "THE ASK: [pilot / intro / access / mentorship / prize]",
    milestone: "Next milestone: [specific experiment or build by concrete time]",
    qrUrl: "", // e.g. "https://your-demo.app" → renders a live QR code
    qrImage: "", // or a pre-made QR image, e.g. "/qr.png"
    qrLabel: "[QR CODE]",
    thanks: "THANK YOU.",
  },

  /*
   * Motion. Defaults are lifted from askwhisper.com/story (GSAP ScrollTrigger):
   * chapters pin for N% of the viewport height ("scroll" values 100–300) and
   * visuals trail the scrollbar by ~0.75s (scrub: 0.75, expo.out).
   */
  /*
   * CHAOS. The fun layer on top of the design. Every item is optional.
   *   chapter  which chapter it sits in (same keys as `highlights`)
   *   x, y     centre position in % of that chapter (0–100), rotate in degrees
   *   kinds    sticker { text, tone } · note { text } (handwritten)
   *            doodle { shape, ink, size } · meme { image, caption, width }
   *   tones    yellow · sky · blue · red · charcoal · white
   * Memes: drop an image in /public and set image: "/meme.jpg". Items hide
   * on phones (small screens get crowded) unless you set mobile: true.
   */
  chaos: {
    enabled: true,
    confetti: true, // bursts on "THANK YOU." (and when you click the startup name)
    items: [
      // 1 ─ Arrival
      { chapter: "hero", kind: "sticker", text: "100% not a pitch deck", tone: "yellow", x: 76, y: 29, rotate: 8, mobile: true },
      { chapter: "hero", kind: "doodle", shape: "arrow", ink: "yellow", x: 26, y: 72, rotate: -4, size: 90 },
      { chapter: "hero", kind: "note", text: "yes, that's us", x: 24, y: 82, rotate: -9, delay: 0.3 },
      // 2 ─ Reality
      { chapter: "problem", kind: "sticker", text: "source: your grandma", tone: "red", x: 63, y: 20, rotate: -8 },
      { chapter: "problem", kind: "doodle", shape: "zigzag", ink: "blue", x: 91, y: 86, rotate: -6, size: 110 },
      // 3 ─ Insight
      { chapter: "insight", kind: "meme", image: "", caption: "me, explaining the bottleneck", x: 84, y: 22, rotate: 6, width: 210 },
      { chapter: "insight", kind: "doodle", shape: "star", ink: "yellow", x: 70, y: 9, rotate: 12, size: 64 },
      // 4 ─ The bet
      { chapter: "product", kind: "sticker", text: "built at 3 a.m.", tone: "blue", x: 10, y: 22, rotate: -10 },
      { chapter: "product", kind: "note", text: "it works. mostly.", x: 86, y: 48, rotate: -7 },
      { chapter: "product", kind: "doodle", shape: "arrow", ink: "red", x: 86, y: 60, rotate: 150, size: 90, delay: 0.2 },
      // 5 ─ Demo
      { chapter: "demo", kind: "sticker", text: "do not lick the demo", tone: "yellow", x: 83, y: 13, rotate: 7, mobile: true },
      { chapter: "demo", kind: "doodle", shape: "star", ink: "sky", x: 9, y: 12, rotate: -14, size: 56 },
      // 6 ─ Trade-offs
      { chapter: "tradeoffs", kind: "doodle", shape: "forbidden", icon: Bird, ink: "red", x: 84, y: 13, rotate: -6, size: 140 },
      { chapter: "tradeoffs", kind: "note", text: "no penguins allowed", x: 84, y: 22, rotate: -4, delay: 0.4 },
      // 7 ─ Proof
      { chapter: "proof", kind: "sticker", text: "peer-reviewed by our moms", tone: "red", x: 80, y: 13, rotate: -6 },
      { chapter: "proof", kind: "doodle", shape: "circle", ink: "yellow", x: 9.5, y: 54, rotate: 0, size: 190 },
      // 8 ─ Finale
      {
        chapter: "finale",
        kind: "meme",
        image: "",
        caption: "thank you for listening to my presentation",
        x: 76,
        y: 84,
        rotate: -5,
        width: 230,
      },
      { chapter: "finale", kind: "sticker", text: "let's have some fun!!!", tone: "yellow", x: 88, y: 12, rotate: 9 },
    ] satisfies ChaosItem[] as ChaosItem[],
    // Crossed, scrolling tape between chapters. Speeds up when you scroll fast.
    banners: [
      { after: "insight", text: "LET'S DO FUN STUPID STUFF" },
      { after: "tradeoffs", text: "IT WORKS ON MY MACHINE" },
    ] satisfies ChaosBanner[] as ChaosBanner[],
  },

  motion: {
    // "lenis": smooth wheel scrolling for the whole page, visuals follow it 1:1.
    // "scrub": native scrolling, and every pinned visual eases toward the scroll
    //          position with a spring, the way the Whisper page does it.
    smoothing: "lenis" as "lenis" | "scrub",
    lenis: { lerp: 0.1, wheelMultiplier: 1 },
    // Extra scroll distance each pinned chapter holds the screen, in vh.
    pin: { hero: 110, insight: 190, canvas: 300, demo: 220 },
  },
};

export type Story = typeof story;
