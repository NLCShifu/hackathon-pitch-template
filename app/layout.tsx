import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Urbanist } from "next/font/google";
import { story } from "@/story.config";
import "./globals.css";

// The same two families askwhisper.com/story ships through next/font.
// Bricolage is loaded with its opsz + wdth axes so we can hit Whisper's exact
// "opsz" 96, "wght" 600, "wdth" 85 display cut.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

// Whisper has no monospace face; this one is only for eyebrows and counters.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const strip = (s: string) => s.replace(/[[\]{}]/g, "");

export const metadata: Metadata = {
  title: strip(story.meta.title),
  description: strip(story.meta.description),
};

export const viewport: Viewport = {
  themeColor: "#131313",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${urbanist.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
