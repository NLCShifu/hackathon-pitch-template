"use client";

import { createContext, Fragment, useContext, type ReactNode } from "react";

export type Kind = "plain" | "hl";
export type Part = { text: string; kind: Kind };
/** A run of parts with no whitespace between them, e.g. `THING` + `.` */
export type Word = Part[];

/** Phrases to paint yellow in the current chapter (from `story.highlights`). */
const HighlightContext = createContext<readonly string[]>([]);

export function Highlights({ phrases, children }: { phrases: readonly string[]; children: ReactNode }) {
  return <HighlightContext.Provider value={phrases}>{children}</HighlightContext.Provider>;
}

export function useHighlights() {
  return useContext(HighlightContext);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Splits text into plain and highlighted runs. Exact, case-sensitive matches; longest phrase wins. */
function segments(text: string, phrases: readonly string[]): Part[] {
  const list = phrases.filter(Boolean);
  if (!list.length) return [{ text, kind: "plain" }];
  const re = new RegExp(`(${[...list].sort((a, b) => b.length - a.length).map(escape).join("|")})`);
  return text
    .split(re)
    .filter(Boolean)
    .map((s): Part => ({ text: s, kind: list.includes(s) ? "hl" : "plain" }));
}

/** Splits copy into words while keeping highlight styling per piece. */
export function toWords(text: string, phrases: readonly string[]): Word[] {
  const words: Word[] = [];
  let current: Word = [];
  for (const seg of segments(text, phrases)) {
    for (const piece of seg.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        if (current.length) words.push(current);
        current = [];
      } else {
        current.push({ text: piece, kind: seg.kind });
      }
    }
  }
  if (current.length) words.push(current);
  return words;
}

export function PartSpan({ part }: { part: Part }) {
  if (part.kind === "plain") return <>{part.text}</>;
  return <span className={part.kind}>{part.text}</span>;
}

/** Static text with the chapter's highlights applied. */
export function Ph({ text }: { text: string }) {
  const phrases = useHighlights();
  return (
    <>
      {segments(text, phrases).map((p, i) => (
        <Fragment key={i}>
          <PartSpan part={p} />
        </Fragment>
      ))}
    </>
  );
}
