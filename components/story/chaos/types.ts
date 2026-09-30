import type { LucideIcon } from "lucide-react";

export type ChapterKey = "hero" | "problem" | "insight" | "product" | "demo" | "tradeoffs" | "proof" | "finale";

/** Palette fills. Yellow/sky always carry black text, the rest white. */
export type Tone = "yellow" | "sky" | "blue" | "red" | "charcoal" | "white";
/** Stroke colours for doodles (shapes, never text). */
export type Ink = "yellow" | "sky" | "blue" | "red" | "black" | "white";

type Placed = {
  chapter: ChapterKey;
  /** Centre position in % of the chapter's stage (0–100). */
  x: number;
  y: number;
  /** Tilt in degrees. */
  rotate?: number;
  /** Seconds after the chapter comes into view. */
  delay?: number;
  /** Also show below 768px (off by default: phones get crowded). */
  mobile?: boolean;
};

export type ChaosItem =
  | (Placed & { kind: "sticker"; text: string; tone: Tone })
  | (Placed & { kind: "note"; text: string })
  | (Placed & {
      kind: "doodle";
      shape: "arrow" | "circle" | "underline" | "star" | "zigzag" | "forbidden";
      ink: Ink;
      /** Width in px (height follows). */
      size?: number;
      /** Only for shape "forbidden": what is not allowed. */
      icon?: LucideIcon;
    })
  | (Placed & { kind: "meme"; image: string; caption: string; width?: number });

export type ChaosBanner = { after: ChapterKey; text: string };
