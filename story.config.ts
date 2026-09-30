/**
 * ─────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE ONLY.  Replace every [BRACKETED PLACEHOLDER] with your copy.
 *
 *  • {Curly braces} are the yellow highlighter: black text on a yellow marker.
 *    It is a design choice, not a placeholder marker. Keep the braces when you
 *    swap in your copy, e.g. "[USER] SHOULD…" → "{Night nurses} SHOULD…".
 *    Use it sparingly: one key phrase per headline reads best.
 *  • Media: drop files in /public and set e.g. image: "/problem.jpg".
 *    .mp4 / .webm paths render as muted autoplay loops (except demo.video,
 *    which waits for a click and plays with sound).
 * ─────────────────────────────────────────────────────────────────────────
 */
import { Gauge, Globe, Quote, TriangleAlert } from "lucide-react";

export const story = {
  /*
   * YELLOW HIGHLIGHTS. The only place that decides what turns yellow.
   * List the exact words (case-sensitive) per chapter; every match in that
   * chapter becomes black text on a yellow marker. [] = no yellow.
   * When you rewrite a headline, update its phrase here too.
   */
  highlights: {
    hero: ["HYLITE"],
    demo: [],
    problem: ["EMPLOYEES"],
    insight: ["ANOTHER HR CHATBOT", "TRUST"],
    product: ["HYLITE"],
    tradeoffs: ["ON PURPOSE"],
    proof: ["A WORKING PROTOTYPE"],
    finale: ["ANSWERS YOU CAN CITE"],
  } satisfies Record<string, string[]>,

  meta: {
    title: "HYLITE",
    description: "Your personal HR paralegal. Exact answers, highlighted.",
  },

  /* 1 ─ Arrival */
  hero: {
    eyebrow: "NOT A PITCH. A WORKING BET.",
    team: "A ELEKTRISCH VUUR project",
    name: "HYLITE",
    tagline: "HR answers straight from the source.",
    scrollHint: "Scroll",
  },

  /* 2 ─ Proof in motion (right after the title) */
  demo: {
    action: "WATCH THE DEMO",
    frameLabel: "HYLITE IN ACTION",
    //image: "", // poster still shown before playback, e.g. "/demo.png"
    // Plays with sound when the frame is clicked; click again to pause. e.g. "/demo.mp4"
    video: "",
    //plan: "Live demo plan: [one sentence]. Backup: [recorded clip / screenshot].",
  },

  /* 3 ─ The broken reality */
  problem: {
    headline: "EMPLOYEES SHOULD NOT HAVE TO DIG FOR THEIR RIGHTS.",
    context:
      "Contracts, handbooks, emails and labour law. They disagree, and the right answer gets buried.",
    photoLabel: "CONTRACT · HR HANDBOOK · EMAILS · LABOUR LAW",
    image: "", // e.g. "/problem.jpg"
  },

  /* 4 ─ Bottleneck & non-obvious insight */
  insight: {
    headline: "WE DIDN’T BUILD ANOTHER HR CHATBOT.",
    because: "Because a paraphrase is not proof.",
    steps: [
      "SEARCH BY HAND",
      "CONFLICTING SOURCES",
      "SHOW THE SOURCE",
    ],
    banner: "THE REAL BOTTLENECK IS TRUST.",
  },

  /* 5 ─ The product bet (pinned canvas) */
  product: {
    headline: "SO WE BUILT HYLITE.",
    line: "Ask a question. Get the exact paragraph, highlighted.",
    heroLabel: "YELLOW = ANSWER · RED = CONFLICT",
    image: "", // e.g. "/hero.png"
    // Up to 4 callouts float over the canvas as you scroll. Swap icons from lucide.dev/icons.
    pills: [
      { icon: Quote, text: "NO GENERATED TEXT" },
      { icon: Gauge, text: "SMART RANKING" },
      { icon: TriangleAlert, text: "CONFLICTS IN RED" },
      { icon: Globe, text: "COUNTRY-AWARE" },
    ],
  },

  /* 6 ─ Intentional trade-offs */
  tradeoffs: {
    headline: "WE MADE THESE TRADE-OFFS ON PURPOSE.",
    cards: [
      {
        n: "01",
        title: "WE BUILT",
        body: "Search with highlighted source paragraphs.",
      },
      {
        n: "02",
        title: "WE DID NOT BUILD",
        body: "A production database. Search is mocked for now.",
      },
      {
        n: "03",
        title: "BECAUSE",
        body: "Trust was the risk to test, not scale.",
      },
    ],
    tech: "Node.js + React, one shared TypeScript API.",
  },

  /* 7 ─ Verified reality. Numeric values ("128", "3.4s", "92%") count up; bracketed ones fade in. */
  proof: {
    headline: "WHAT WE DELIVERED: A WORKING PROTOTYPE.",
    stats: [
      { value: "5", label: "topic folders" },
      { value: "4", label: "file formats" },
      { value: "0", label: "generated sentences" },
    ],
    learned:
      "Every answer is a real quote from a real source.",
  },

  /* 8 ─ Horizon & the ask */
  finale: {
    headline: "WE ARE TURNING HR GUESSWORK INTO ANSWERS YOU CAN CITE.",
    ask: "THE ASK: A PILOT TEAM.",
    milestone:
      "Next milestone: connect the real database.",
    qrUrl: "", // e.g. "https://your-demo.app" → renders a live QR code
    qrImage: "", // or a pre-made QR image, e.g. "/qr.png"
    qrLabel: "TRY HYLITE",
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
