/** Monospaced chapter index, e.g. "02 / 07", with a hairline rule. */
export function ChapterMark({ n, of = 7, className = "" }: { n: number; of?: number; className?: string }) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span>{pad(n)}</span>
      <span className="h-px w-10 bg-current opacity-50" aria-hidden />
      <span>{pad(of)}</span>
    </p>
  );
}
