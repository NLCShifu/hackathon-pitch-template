# Web Story Template

A continuous-scroll product manifesto for hackathon teams. Its typography and motion follow askwhisper.com/story. It is one vertical flow, not a slide deck: chapters pin, type morphs, and one shared background turns from night to paper to warm as you scroll.

**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion 13, Lenis, Lucide, qrcode.react

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Fill it in (≈10 minutes)

1. Open **`story.config.ts`**. It is the only file you need to edit.
2. Replace every `[BRACKETED PLACEHOLDER]`. Unfilled brackets show in the accent colour with a dashed underline, so you can see what's left at a glance.
3. Put images in `/public` and set `image: "/your-file.jpg"`. `.mp4` and `.webm` files play as muted loops.
4. Set `finale.qrUrl` to your demo link and the QR code is generated for you.
5. Optional: wrap words in `{curly braces}` to colour them with the accent on purpose.

## File map

```
story.config.ts                 ← all copy, media, pin lengths, smoothing mode
app/layout.tsx                  fonts (next/font): Bricolage Grotesque, Urbanist, JetBrains Mono
app/globals.css                 design tokens, type scale, background layers
components/story/
  StoryPage.tsx                 composition + night→paper→warm ground/ink timeline
  PinnedSection.tsx             sticky pin + normalised 0→1 progress (usePin)
  RevealWords.tsx               masked word slide-up (scroll-scrubbed or in-view)
  SmoothScroll.tsx              Lenis root config
  Ground.tsx / Chrome.tsx       fixed background stack / progress bar, chapter rail, scroll cue
  MediaFrame.tsx                image · video · labelled empty slot
  motion.ts                     GSAP-equivalent eases, scrub spring, reduced-motion hook
  sections/
    HeroIntro.tsx               1 · arrival (pinned 110vh, variable-font morph)
    BrokenReality.tsx           2 · split narrative, clip-path wipe + parallax
    InsightDrift.tsx            3 · pinned card drift → bottleneck banner
    PinnedCanvas.tsx            4 · 300vh living canvas + floating feature pills
    DemoFrame.tsx               5 · frame scales to full-bleed, docked status bar
    TradeoffGrid.tsx            6 · asymmetric cards with mono counters
    ProofStats.tsx              7 · count-up stats + honest callout
    Finale.tsx                  8 · ask, milestone, QR, thank-you
```

## Motion spec (from the Whisper audit)

| Rule | Value | Where |
|---|---|---|
| Pin length | `100svh + scroll vh`; Whisper uses 100–300 per chapter | `motion.pin` in config |
| Timeline | progress 0→1 over the pinned distance only; tween positions are fractions of it | `PinnedSection` |
| Scrub lag | GSAP `scrub: 0.75` (≈0.75s expo catch-up). Here: Lenis `lerp 0.1`, or a spring in `"scrub"` mode | `motion.smoothing` |
| Word reveal | `yPercent 118 → 0`, `power3.out`, stagger `duration / (words + 2)`, clipped per word | `RevealWords` |
| Exits | `opacity 1 → 0`, `y 0 → −18px`, `power1.in` | `RevealWords out=[a,b]` |
| Pops | `back.out(1.4–2)` ≈ `cubic-bezier(0.34, 1.56, 0.64, 1)` | pills, finale |
| Chapter jumps | 0.9s `power2.inOut` | rail |

**Typography:**
- Display: Bricolage Grotesque with `font-variation-settings: "opsz" 96, "wght" 600, "wdth" 85`, letter-spacing `-0.015em`, line-height `1.1`, `text-wrap: balance`.
- Sizes: `clamp(2.85rem, 9.4vw, 7.5rem)` (hero), `clamp(1.78rem, 4.6vw, 3.6rem)` (lead), `clamp(1.62rem, 3.7vw, 3rem)` (section).
- Body: Urbanist 500, 1.55 line-height.
- Eyebrows: 12px, `0.19em` tracking, uppercase. They use JetBrains Mono because Whisper's page has no monospaced face.

## Tuning

- **Smoothing:** `motion.smoothing: "lenis"` gives smooth wheel scrolling across the whole page. `"scrub"` keeps native scrolling and eases each pinned visual toward the scroll position, which is the Whisper behaviour exactly.
- **Pacing:** raise or lower the `motion.pin` values to give a chapter more or less scroll.
- **Choreography:** each pinned section lists its timeline positions in a comment at the top of the file.
- **Reduced motion:** pins collapse to normal flow, Lenis switches off, and every element renders in its final state.
