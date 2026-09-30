/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE ONLY.  Replace every [BRACKETED PLACEHOLDER] with your copy.
 *
 *  • {Curly braces} are the yellow highlighter: black text on a yellow marker.
 *    It is a design choice, not a placeholder marker. Keep the braces when you
 *    swap in your copy, e.g. "[USER] SHOULD…" → "{Night nurses} SHOULD…".
 *    Use it sparingly: one key phrase per headline reads best.
 *  • Media: drop files in /public and set e.g. image: "/problem.jpg".
 *    .mp4 / .webm paths render as muted autoplay loops.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { Gauge, Layers, ShieldCheck, Sparkles } from "lucide-react";

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
    context:
      "[Describe the exact moment: what happens, what they do today, and what it costs.]",
    photoLabel: "[REAL-WORLD PROBLEM PHOTO]",
    image: "", // e.g. "/problem.jpg"
  },

  /* 3 ─ Bottleneck & non-obvious insight */
  insight: {
    headline: "WE DIDN’T BUILD [THE OBVIOUS SOLUTION].",
    because: "Because [why it still fails the user].",
    steps: [
      "[CURRENT WORKAROUND]",
      "[THE ACTUAL BOTTLENECK]",
      "[YOUR INSIGHT]",
    ],
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
    learned:
      "What we learned: [One honest result. What worked + next constraint].",
  },

  /* 8 ─ Horizon & the ask */
  finale: {
    headline: "WE ARE TURNING [OLD PAINFUL REALITY] INTO [A BETTER FUTURE].",
    ask: "THE ASK: [pilot / intro / access / mentorship / prize]",
    milestone:
      "Next milestone: [specific experiment or build by concrete time]",
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
