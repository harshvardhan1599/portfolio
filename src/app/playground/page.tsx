import type { Metadata } from "next";
import { DitherTile } from "@/components/DitherTile";
import { StaticTile } from "@/components/StaticTile";
import { PlaygroundDither } from "@/components/PlaygroundDither";

export const metadata: Metadata = {
  title: "Playground",
  description: "Archive of visual explorations.",
};

export default function PlaygroundPage() {
  return (
    <div className="flex-1">
      {/* Blue hero — work-page orientation: colored hero → dither → light body */}
      <section className="w-full" style={{ backgroundColor: "#044AB3" }}>
        <div className="px-6 pb-10 pt-12 md:px-14 md:pt-14">
          <p className="text-alt text-left text-white/75">
            Archive of
            <br />
            visual explorations
          </p>
        </div>
      </section>

      {/* Dither: blue hero → light body (cool embers) */}
      <PlaygroundDither />

      {/* Light body — full width */}
      <section className="surface-light w-full">
        <div className="px-6 pb-16 pt-12 md:px-14 md:pt-14">
          {/* Clean grid — one tile per cell, no overlaps. items-start keeps
              varying tile heights from stretching. */}
          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <DitherTile />
            </div>
            <div>
              <StaticTile
                src="/playground/pixel-grid.mp4"
                alt="Delhi, Daily — a daily generative study of flowers shaped by Delhi's weather"
                caption="Generative • Delhi, Daily"
                width={2000}
                height={1339}
                side="right"
                href="https://pixel-grid-drab.vercel.app/"
              />
            </div>
            <div>
              <StaticTile
                src="/playground/guild-landing.mp4"
                alt="Guild Robotics — Building Robotics for Logistics landing page"
                caption="Landing page • Guild Robotics"
                width={1600}
                height={922}
                side="right"
              />
            </div>
            <div>
              <StaticTile
                src="/playground/saturn-studios.png"
                alt="Saturn Studios branding"
                caption="Branding • Saturn Studios"
                width={1755}
                height={988}
                side="left"
              />
            </div>
            <div>
              <StaticTile
                src="/playground/gyft.png"
                alt="Gyft branding concept"
                caption="Branding concept • Gyft"
                width={1170}
                height={659}
                side="right"
              />
            </div>
            <div>
              <StaticTile
                src="/playground/presfit.png"
                alt="Presfit branding"
                caption="Branding • Presfit"
                width={1370}
                height={659}
                side="left"
              />
            </div>
            <div>
              <StaticTile
                src="/playground/nu-ventures.png"
                alt="Nu Ventures branding concept"
                caption="Branding concept • Nu Ventures"
                width={1170}
                height={659}
                side="right"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
