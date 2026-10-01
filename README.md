# Hackathon Web Presentation Template

**A scrolling pitch page for hackathon teams.** Fill in one file and you get a story site you can share as a link, which also works as a slide deck on stage.

**Preview available [here](https://ppt-template-theta.vercel.app/).**

> **Best viewed in Firefox.** Animations are smoothest there, so present from Firefox when you can.

---

## Quick start

Requires **Node.js 20+** (`node -v` to check).

```bash
npm install
npm run dev          # → http://localhost:3000
```

The page reloads every time you save.

---

## Fill it in: one file, ~10 minutes

Everything lives in **`story.config.ts`**.

1. **Replace every `[PLACEHOLDER]`**, brackets included.
2. **Update `highlights`** at the top so the yellow words match your new text exactly.
3. **Drop images and videos in `public/`** and reference them as `"/file.png"`.

> ⚠️ **Never delete a field.** If you don't need one, set it to `""`, otherwise the build breaks.

---

## The 8 chapters

| # | Chapter | Answers | Config |
|:-:|---|---|---|
| 1 | Arrival | Who are you? | `hero` |
| 2 | Problem | Who's struggling, and how? | `problem` |
| 3 | Insight | Why do obvious fixes fail? | `insight` |
| 4 | Product | What did you build? | `product` |
| 5 | Demo | Show it working | `demo` |
| 6 | Trade-offs | What did you skip, and why? | `tradeoffs` |
| 7 | Proof | What did you achieve? | `proof` |
| 8 | Ask | What do you need next? | `finale` |

---

## Writing tips

- **One idea per line.** People read a slide in about 3 seconds.
- **Highlight one phrase per headline**, the one you want remembered.
- **Proof numbers count up** (`"128"`, `"3.4s"`, `"92%"`). Use real results only.
- **Feature callouts** (`product.pills`): 2–5 words each, max 4.
- **No demo video?** Record 30–60 s of your screen. It's the most convincing part of the pitch.

---

## Media

| Field | What to add |
|---|---|
| `problem.image` | Real-world photo of the problem (portrait) |
| `product.image` | Product screenshot (wide, 16:10) |
| `demo.video` | Demo clip; plays **with sound** on click |
| `demo.image` | Poster shown before the video plays |
| `finale.qrUrl` | Your demo link; the QR code is generated for you |

Empty fields show a labelled placeholder, so you can see what's missing.

---

## Present

Press **P** (or click **Present**, bottom right).

| Key | Action |
|---|---|
| **→ / ↓ / PageDown** | Next step (clicker-friendly) |
| **← / ↑ / PageUp** | Previous step |
| **Home / End** | First / last |
| **Esc** | Exit |

Start directly in slide mode with `your-link/?present`.

### Before going on stage

- [ ] No `[BRACKETS]` left
- [ ] All highlights are yellow
- [ ] Demo plays with sound on the presenting laptop
- [ ] Clicked through once in slide mode, **in Firefox**
- [ ] QR code opens the right link

---

## Publish (free)

1. Push to GitHub.
2. On [Vercel](https://vercel.com): **Add New → Project →** pick the repo **→ Deploy**.
3. Each push updates the live link.

Run `npm run build` first. If it passes locally, it passes on Vercel.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Property '…' does not exist` | A config field was deleted. Restore it as `""`. |
| Highlight not yellow | Text in `highlights` must match exactly, including capitals. |
| Image missing | File must be in `public/`, path starts with `/`. |
| Animation too fast or slow | Adjust `motion.pin` (higher = longer chapter). |
| Choppy scrolling | Use Firefox and close other heavy tabs. |

---

<details>
<summary><strong>For developers</strong></summary>

**Stack:** Next.js 16 · React 19 · Tailwind 4 · Framer Motion 13 · Lenis · Lucide

```
story.config.ts            all copy, media, highlights, timing
app/globals.css            colours, type scale, background layers
components/story/
  StoryPage.tsx            chapter order + background colour timeline
  PinnedSection.tsx        sticky chapters with 0→1 scroll progress
  RevealWords.tsx          word-by-word reveals
  Presentation.tsx         slide mode, <Beat> build steps
  sections/                one file per chapter
```

- **Reorder chapters:** edit `CHAPTERS` and the JSX in `StoryPage.tsx`, then each `<ChapterMark n={…} />`.
- **Add a slide step:** wrap an element in `<Beat n={…}>`, or add to `beats` on `<PinnedSection>`.
- **Colours:** blue `#264ed0` · sky `#5dadeb` · yellow `#ffd301` · red `#c23b21` · black `#131313`.
- **Performance:** avoid `filter: blur()` on large layers. It costs Chrome up to ~100 ms per frame.

</details>
