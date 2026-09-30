# Web Story Template

A ready-made presentation for **hackathon teams**. You fill in one file with your own text and images, and you get a scrolling story page that also works as a slide deck on stage.

Use it:

- **At the end of a hackathon**, to pitch what you built to the jury.
- **Afterwards**, to show the project to mentors, partners or anyone who asks. It's just a link.

You don't need to know React or animation to use it. All the text lives in **`story.config.ts`**, and that's the only file most teams ever touch.

---

## 1. Run it on your computer

You need **Node.js 20 or newer** ([nodejs.org](https://nodejs.org)). Check with `node -v`.

```bash
npm install        # once, installs everything
npm run dev        # starts the page at http://localhost:3000
```

Leave `npm run dev` running. Every time you save `story.config.ts`, the page in your browser updates by itself.

---

## 2. The story you're telling

The page has 8 chapters in a fixed order. Each one answers one question the jury has. Every chapter has its own block in `story.config.ts`.

| # | Chapter | Question it answers | Config block |
|---|---|---|---|
| 1 | Arrival | Who are you, and what's this called? | `hero` |
| 2 | The broken reality | What problem does someone have today? | `problem` |
| 3 | The insight | Why don't the obvious fixes work? | `insight` |
| 4 | The product | What did you build? | `product` |
| 5 | The demo | Can I see it working? | `demo` |
| 6 | Trade-offs | What did you choose *not* to build, and why? | `tradeoffs` |
| 7 | Proof | What did you actually test or achieve? | `proof` |
| 8 | The ask | What do you need next? | `finale` |

---

## 3. Put your text in (about 10 minutes)

Open **`story.config.ts`** and work top to bottom.

### Replace the placeholders

Everything in `[SQUARE BRACKETS]` is a placeholder. Replace it, brackets included.

```ts
// before
headline: "[USER] SHOULD NOT HAVE TO [PAINFUL THING].",
// after
headline: "NIGHT NURSES SHOULD NOT HAVE TO CHART BY HAND.",
```

Tips:

- **Keep it short.** People read a slide in a few seconds. One sentence per field is plenty.
- **Headlines are in capitals** in the template; keep that style for the big lines.
- **Don't delete fields.** If you don't need one, set it to an empty string: `image: ""`. Removing it breaks the build.

### Choose what turns yellow

The yellow highlighter is set in **one place**: the `highlights` block at the top of the file. For each chapter, list the exact words to highlight.

```ts
highlights: {
  hero: ["[STARTUP NAME]"],      // → hero: ["NIGHTSHIFT"]
  problem: ["[USER]"],           // → problem: ["NIGHT NURSES"]
  ...
}
```

- The words must match the text **exactly**, including capitals.
- **When you change a headline, update its highlight too**, or the yellow disappears.
- `[]` means nothing is yellow in that chapter.
- One key phrase per headline looks best.

### Add images and a demo video

1. Put your files in the **`public/`** folder, e.g. `public/product.png`.
2. Point to them in the config with a leading slash: `image: "/product.png"`.

| Where | Field | What to put there |
|---|---|---|
| Chapter 2 | `problem.image` | A photo of the real-world problem (portrait works best) |
| Chapter 4 | `product.image` | A screenshot of your product (wide, 16:10) |
| Chapter 5 | `demo.video` | Your demo clip, e.g. `"/demo.mp4"`. It plays **with sound** when clicked. |
| Chapter 5 | `demo.image` | A still shown before the video plays (or on its own if you have no video) |

- `.mp4` and `.webm` files in other slots play as silent loops.
- Leave a field as `""` and the page shows a labelled empty frame instead, so you can see what's still missing.
- **No video? Record your screen.** A 30–60 second clip of the product working is the most convincing thing in the whole pitch.

### Chapter-by-chapter notes

- **`hero`**: your product name, team name and one-line promise. `team` is shown as-is, e.g. `"A NIGHTSHIFT project"`.
- **`insight.steps`**: three short cards read left to right: *what people do today → where it breaks → your idea*.
- **`product.pills`**: up to 4 feature callouts that float over the screenshot. Keep each to 2–5 words. You can swap the icons for any from [lucide.dev/icons](https://lucide.dev/icons). Import the icon name at the top of the file.
- **`demo.plan`**: an optional caption bar under the demo (e.g. your live-demo backup plan). Leave `""` to hide it.
- **`tradeoffs.cards`**: *what you built / what you skipped / why*. This is where you show the jury you made smart choices under time pressure.
- **`proof.stats`**: three numbers. Plain numbers like `"128"`, `"3.4s"` or `"92%"` **count up** on screen. Only use real results; the jury will ask.
- **`finale`**: your ask (`"THE ASK: …"`), your next milestone, and `qrUrl`. Put your demo link in `qrUrl` and a QR code is generated for you.

---

## 4. Present it

Press **P** (or click **Present**, bottom right) to switch into slide mode.

| Key | Does |
|---|---|
| **→ ↓ PageDown** | next step (works with a presentation clicker) |
| **← ↑ PageUp** | previous step |
| **Home / End** | first / last slide |
| **Esc** | leave slide mode |

- On a touchscreen, swipe.
- Open `your-link/?present` to start directly in slide mode.
- Chapters build up **one press at a time** (headline, then each card, then each callout), so you can talk through each point.

### Before you go on stage

- [ ] No `[BRACKETS]` left anywhere on the page.
- [ ] Every highlighted phrase is actually yellow. If not, check the `highlights` block.
- [ ] The demo video plays with sound on the presentation laptop.
- [ ] You clicked through the whole deck once in slide mode.
- [ ] The QR code opens the right link on a phone.

---

## 5. Put it online (free)

The easiest way is **[Vercel](https://vercel.com)**:

1. Push this folder to a GitHub repository.
2. On Vercel, click **Add New → Project**, pick the repository and click **Deploy**. Vercel detects everything automatically.
3. You get a public link. Every push to that branch updates it.

Check that it builds before you push:

```bash
npm run build
```

If that passes on your computer, it will pass on Vercel.

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| `Property '…' does not exist` when building | You deleted a field from `story.config.ts`. Put it back with an empty value (`""`). |
| Highlight isn't yellow | The phrase in `highlights` doesn't match the text exactly (check capitals and punctuation). |
| Image doesn't show | The file must be in `public/` and the path must start with `/`, e.g. `"/demo.png"`. |
| Page doesn't update | Check the terminal running `npm run dev` for an error, fix it and save again. |
| Animations feel too fast or slow | Change the `motion.pin` numbers at the bottom of the config (bigger = more scrolling per chapter). |

---

## For developers

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion 13, Lenis, Lucide, qrcode.react. Typography and motion follow askwhisper.com/story.

```
story.config.ts                 ← all copy, media, highlights, pin lengths, smoothing mode
app/globals.css                 design tokens, type scale, background layers
components/story/
  StoryPage.tsx                 chapter order + background (black → white → blue) timeline
  PinnedSection.tsx             sticky pin with 0→1 progress (usePin)
  RevealWords.tsx               word-by-word reveal (scroll-scrubbed or on view)
  Presentation.tsx              slide mode: stops, <Beat> build steps, keys, scroll lock
  Chrome.tsx                    progress bar, chapter dots, scroll cue, Present button
  MediaFrame.tsx                image · video · labelled empty slot
  sections/
    HeroIntro.tsx               1 · arrival
    BrokenReality.tsx           2 · problem + photo
    InsightDrift.tsx            3 · three cards → bottleneck banner
    PinnedCanvas.tsx            4 · product canvas + floating feature callouts
    DemoFrame.tsx               5 · frame grows to full screen, click-to-play video
    TradeoffGrid.tsx            6 · three trade-off cards
    ProofStats.tsx              7 · count-up stats
    Finale.tsx                  8 · ask, milestone, QR, thank-you
```

- **Reorder chapters:** change the order in `CHAPTERS` and in the JSX of `StoryPage.tsx`, then update each section's `<ChapterMark n={…} />`.
- **Add a slide-mode step:** wrap an element in `<Beat n={…}>` (free-flowing chapters) or add a value to `beats` on `<PinnedSection>` (pinned chapters).
- **Smoothing:** `motion.smoothing: "lenis"` gives smooth wheel scrolling everywhere; `"scrub"` keeps native scrolling and eases each pinned visual instead.
- **Colours:** blue `#264ed0` · sky `#5dadeb` · yellow `#ffd301` · red `#c23b21` · charcoal `#333333` · black `#131313`. Yellow and sky are only used as fills, never as text colours.
- **Reduced motion:** visitors who ask for less motion get a static page with everything in its final state.
