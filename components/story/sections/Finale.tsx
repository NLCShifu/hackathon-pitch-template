"use client";

import { motion } from "framer-motion";
import { Flag, Handshake, QrCode } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import type { Ref } from "react";
import { story } from "@/story.config";
import { Confetti } from "../Confetti";
import { bz } from "../motion";
import { Beat } from "../Presentation";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.9, delay, ease: bz("power3Out") },
});

/**
 * Horizon and ask. The page ground crossfades to warm as this section rises (see StoryPage).
 * Presentation beats: headline · ask · QR · thank-you (with a small confetti burst).
 */
export function Finale({ ref }: { ref?: Ref<HTMLElement> }) {
  const { finale, hero } = story;
  const [askLabel, ...askRest] = finale.ask.split(":");
  const askBody = askRest.join(":").trim();

  return (
    <section id="story-ask" ref={ref} data-chapter className="relative z-[1] px-6 pt-[20svh] pb-12 md:px-12">
      <div className="mx-auto max-w-[1240px]">
        <ChapterMark n={8} />
        <Beat n={0}>
          <RevealWords as="h2" text={finale.headline} className="story-line t-hero mt-6 max-w-[16ch]" duration={1} />
        </Beat>

        <div className="mt-[clamp(56px,10vh,120px)] grid gap-5 md:grid-cols-12 md:gap-6">
          <Beat n={1}>
            <motion.div
              {...rise()}
              className="border-on-accent/25 bg-on-accent/[0.08] rounded-[26px] border p-7 backdrop-blur-sm md:col-span-8 md:p-10"
            >
              <p className="eyebrow flex items-center gap-2.5">
                <Handshake className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                {askRest.length ? askLabel : "THE ASK"}
              </p>
              <p className="story-line t-lead mt-5">
                <Ph text={askRest.length ? askBody : finale.ask} />
              </p>
              <div className="bg-on-accent/20 my-7 h-px" aria-hidden />
              <p className="flex items-start gap-3 text-[clamp(1rem,1.4vw,1.15rem)] font-medium">
                <Flag className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
                <span>
                  <Ph text={finale.milestone} />
                </span>
              </p>
            </motion.div>
          </Beat>

          <Beat n={2}>
            <motion.figure {...rise(0.12)} className="flex flex-col items-center justify-center gap-4 md:col-span-4">
              <div className="text-ink relative rounded-[26px] bg-white p-5 shadow-[0_40px_80px_-40px_#0b1a5299]">
                <Corners />
                <div className="relative grid h-[clamp(150px,18vw,210px)] w-[clamp(150px,18vw,210px)] place-items-center">
                  <QrSlot />
                </div>
              </div>
              <figcaption className="eyebrow">
                <Ph text={finale.qrLabel} />
              </figcaption>
            </motion.figure>
          </Beat>
        </div>

        <div className="mt-[clamp(80px,16vh,200px)] flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Beat n={3}>
            <motion.p
              initial={{ opacity: 0, scale: 0.86, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.1, ease: bz("backOut") }}
              className="story-line t-mega relative origin-bottom-left"
            >
              <Ph text={finale.thanks} />
              <Confetti />
            </motion.p>
          </Beat>
          <p className="eyebrow pb-3 md:text-right">
            <Ph text={hero.name} /> <span aria-hidden>{"//"}</span> <Ph text={hero.team} />
          </p>
        </div>
      </div>
    </section>
  );
}

function QrSlot() {
  const { qrUrl, qrImage } = story.finale;
  if (qrUrl) return <QRCodeSVG value={qrUrl} className="h-full w-full" bgColor="transparent" fgColor="#131313" level="M" />;
  if (qrImage) return <Image src={qrImage} alt="QR code" fill sizes="210px" className="object-contain" />;
  return (
    <div className="placeholder-frame text-ink flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl">
      <QrCode className="h-9 w-9 opacity-45" strokeWidth={1.4} aria-hidden />
      <span className="font-mono text-[10px] tracking-[0.12em] opacity-55">finale.qrUrl</span>
    </div>
  );
}

/** Viewfinder corner ticks around the code. */
function Corners() {
  const c = "absolute h-5 w-5 border-accent";
  return (
    <span aria-hidden>
      <span className={`${c} top-2 left-2 rounded-tl-lg border-t-2 border-l-2`} />
      <span className={`${c} top-2 right-2 rounded-tr-lg border-t-2 border-r-2`} />
      <span className={`${c} bottom-2 left-2 rounded-bl-lg border-b-2 border-l-2`} />
      <span className={`${c} right-2 bottom-2 rounded-br-lg border-r-2 border-b-2`} />
    </span>
  );
}
