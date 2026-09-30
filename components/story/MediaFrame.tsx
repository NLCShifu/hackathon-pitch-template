import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Ph } from "./text";

type Props = {
  src: string;
  label: string;
  /** Hint shown in the empty slot, e.g. `problem.image`. */
  configKey: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Image, looping video, or a labelled empty slot telling the team what goes here. */
export function MediaFrame({ src, label, configKey, className = "", sizes = "100vw", priority }: Props) {
  if (src && /\.(mp4|webm|mov)$/i.test(src)) {
    return <video className={`h-full w-full object-cover ${className}`} src={src} autoPlay muted loop playsInline />;
  }
  if (src) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`placeholder-frame flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center ${className}`}>
      <ImagePlus className="h-7 w-7 opacity-50" strokeWidth={1.5} aria-hidden />
      <span className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-80">
        <Ph text={label} />
      </span>
      <span className="font-mono text-[10px] tracking-[0.12em] opacity-45">/public → story.config.ts › {configKey}</span>
    </div>
  );
}
