"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "framer-motion";
import { usePrefersReducedMotion } from "../motion";

/**
 * Two crossed strips of "tape" with endlessly scrolling text. The yellow one
 * runs left, the blue one right, and both speed up with scroll velocity.
 */
export function Marquee({ text }: { text: string }) {
  return (
    <div className="relative z-[2] h-[clamp(150px,24vh,240px)] overflow-x-clip" aria-hidden>
      <Strip text={text} className="bg-blue text-white" rotate={3} direction={1} />
      <Strip text={text} className="bg-yellow text-black" rotate={-4} direction={-1} />
    </div>
  );
}

function Strip({ text, className, rotate, direction }: { text: string; className: string; rotate: number; direction: 1 | -1 }) {
  const reduced = usePrefersReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1500], [0, 6], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const speed = 2.2 * (1 + Math.abs(boost.get())); // % of track per second
    base.set(base.get() + direction * speed * (delta / 1000));
  });

  // Two identical halves, so wrapping at -50% is seamless.
  const run = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="flex items-center gap-[0.6em] pr-[0.6em]">
      {text}
      <span className="text-[0.7em]">★</span>
    </span>
  ));

  return (
    <div
      className={`story-line absolute top-1/2 left-[-10%] w-[120%] -translate-y-1/2 border-y-2 border-black py-3 text-[clamp(1.4rem,3.2vw,2.6rem)] uppercase shadow-[0_10px_0_#131313] ${className}`}
      style={{ rotate: `${rotate}deg` }}
    >
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        <div className="flex">{run}</div>
        <div className="flex">{run}</div>
      </motion.div>
    </div>
  );
}
