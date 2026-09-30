"use client";

import { motion, useTransform } from "framer-motion";
import { Pause, Play, Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { story } from "@/story.config";
import { ease } from "../motion";
import { MediaFrame } from "../MediaFrame";
import { PinnedSection, usePin } from "../PinnedSection";
import { RevealWords } from "../RevealWords";
import { Ph } from "../text";
import { ChapterMark } from "./ChapterMark";

/**
 * Proof in motion. The stage holds a near full-bleed frame that starts as a
 * small card and scales up to fill the viewport, the image easing out of an
 * over-zoom inside it (Whisper's proof photos: scale 1.08 → 1).
 *
 *   .04–.44  frame scales .56 → 1, media 1.18 → 1
 *   .44      scrim fades in     .48  action label reveals     .58  status bar docks
 *
 * Presentation stops at .68, right after the bar docks: past that the pin only holds.
 *
 * Clicking the frame plays `demo.video` with sound; the overlays step aside
 * while it runs. Click again (or scroll away) to pause.
 */
export function DemoFrame() {
  return (
    <PinnedSection id="story-demo" scrollVh={story.motion.pin.demo} restProgress={1} beats={[0.68]} padded={false}>
      <Stage />
    </PinnedSection>
  );
}

function Stage() {
  const p = usePin();
  const { demo } = story;

  const grow = useTransform(p, [0.04, 0.44], [0, 1], { ease: ease.power2InOut });
  const scale = useTransform(grow, [0, 1], [0.56, 1]);
  const radius = useTransform(grow, [0, 1], [40, 24]);
  const mediaScale = useTransform(grow, [0, 1], [1.18, 1]);
  const markOpacity = useTransform(grow, [0, 0.3], [1, 0]);

  const scrim = useTransform(p, [0.42, 0.52], [0, 1]);
  const barOpacity = useTransform(p, [0.58, 0.64], [0, 1]);
  const barY = useTransform(p, [0.58, 0.66], [28, 0], { ease: ease.power3Out });

  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = !!demo.video;

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  // Leaving the chapter (scroll or presentation step) pauses playback.
  useEffect(() => {
    const el = frame.current;
    if (!el || !hasVideo) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) video.current?.pause();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  // Overlays fade out while the clip runs, back in when it pauses or ends.
  const overlay = `transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100"}`;

  return (
    <div className="absolute inset-0">
      <motion.div style={{ opacity: markOpacity }} className="absolute inset-x-0 top-[clamp(20px,5vh,56px)] flex justify-center">
        <ChapterMark n={2} />
      </motion.div>

      <motion.div
        ref={frame}
        style={{ scale, borderRadius: radius }}
        className="bg-night-lift text-cream absolute inset-3 overflow-hidden shadow-[0_60px_140px_-60px_#131313aa] will-change-transform md:inset-6"
      >
        <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
          {hasVideo ? (
            <video
              ref={video}
              className="h-full w-full bg-black object-cover"
              src={demo.video}
              poster={demo.image || undefined}
              preload="metadata"
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <MediaFrame src={demo.image} label={demo.frameLabel} configKey="demo.image" priority />
          )}
        </motion.div>

        {hasVideo && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause demo video" : "Play demo video"}
            className="absolute inset-0 z-[1] cursor-pointer"
          />
        )}

        <motion.div
          style={{ opacity: scrim }}
          className="pointer-events-none absolute inset-0 z-[2]"
          aria-hidden
        >
          <div className={`absolute inset-0 bg-[linear-gradient(to_top,#131313e6_0%,#13131380_32%,transparent_62%)] ${overlay}`} />
        </motion.div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-[clamp(96px,16vh,150px)] z-[2] px-6 md:px-12 ${overlay}`}
        >
          <div className="flex max-w-[1100px] items-end gap-5">
            <motion.span
              style={{ opacity: scrim }}
              className="bg-yellow text-black hidden h-14 w-14 shrink-0 place-items-center rounded-full md:grid"
              aria-hidden
            >
              {playing ? (
                <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              ) : (
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />
              )}
            </motion.span>
            <RevealWords as="h2" text={demo.action} className="story-line t-display text-cream" progress={p} at={0.48} duration={0.12} />
          </div>
        </div>

        {demo.plan && (
          <motion.div
            style={{ opacity: barOpacity, y: barY }}
            className="pointer-events-none absolute inset-x-4 bottom-4 z-[2] md:inset-x-8 md:bottom-7"
          >
            <div className={`${overlay} border-cream/15 bg-night/70 text-cream-dim mx-auto flex max-w-[980px] items-center gap-3 rounded-full border px-4 py-3 backdrop-blur-md md:px-6`}>
              <span className="relative grid h-2.5 w-2.5 shrink-0 place-items-center" aria-hidden>
                <span className="animate-live bg-yellow absolute inset-0 rounded-full" />
                <span className="bg-yellow relative h-2.5 w-2.5 rounded-full" />
              </span>
              <Radio className="text-yellow hidden h-4 w-4 shrink-0 sm:block" strokeWidth={1.8} aria-hidden />
              <p className="font-mono text-[11.5px] leading-snug tracking-[0.04em] md:text-[13px]">
                <Ph text={demo.plan} />
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
