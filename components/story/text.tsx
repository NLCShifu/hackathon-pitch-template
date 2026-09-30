import { Fragment } from "react";

export type Kind = "plain" | "ph" | "accent";
export type Part = { text: string; kind: Kind };
/** A run of parts with no whitespace between them, e.g. `[THING]` + `.` */
export type Word = Part[];

const TOKEN = /(\[[^\]]*\]|\{[^}]*\})/;

function segments(text: string): Part[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((s) =>
      s.startsWith("[")
        ? { text: s, kind: "ph" }
        : s.startsWith("{")
          ? { text: s.slice(1, -1), kind: "accent" }
          : { text: s, kind: "plain" },
    );
}

/** Splits copy into words while keeping [placeholder] / {accent} styling per piece. */
export function toWords(text: string): Word[] {
  const words: Word[] = [];
  let current: Word = [];
  for (const seg of segments(text)) {
    const pieces = seg.text.split(/(\s+)/);
    for (const piece of pieces) {
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

/** Static render with placeholder / accent highlighting. */
export function Ph({ text }: { text: string }) {
  return (
    <>
      {segments(text).map((p, i) => (
        <Fragment key={i}>
          <PartSpan part={p} />
        </Fragment>
      ))}
    </>
  );
}

export const isPlaceholder = (s: string) => /^\s*\[[^\]]*\]\s*$/.test(s);
