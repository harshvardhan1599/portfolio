import type { Metadata } from "next";
import { DitherTile } from "@/components/DitherTile";
import { StaticTile } from "@/components/StaticTile";

export const metadata: Metadata = {
  title: "Playground",
  description: "Archive of visual explorations.",
};

export default function PlaygroundPage() {
  return (
    <div className="flex-1">
      <section className="max-w-4xl">
        <div className="px-6 pt-10 md:px-10 md:pt-12">
          <p className="text-alt text-muted text-left">
            Archive of
            <br />
            visual explorations
          </p>
        </div>

        <div className="mt-10 px-6 pb-16 md:px-10 md:mt-12">
          <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-y-0">
            <div className="md:col-start-1 md:col-span-7">
              <DitherTile />
            </div>
            <div className="md:col-start-6 md:col-span-7 md:-mt-12">
              <StaticTile
                src="/playground/delhi-daily.png"
                alt="Delhi, Daily — a daily generative study of flowers shaped by Delhi's weather"
                caption="Generative • Delhi, Daily"
                width={2000}
                height={1339}
                side="right"
                href="https://pixel-grid-drab.vercel.app/"
              />
            </div>
            <div className="md:col-start-1 md:col-span-7 md:-mt-12">
              <StaticTile
                src="/playground/saturn-studios.png"
                alt="Saturn Studios branding"
                caption="Branding • Saturn Studios"
                width={1755}
                height={988}
                side="left"
              />
            </div>
            <div className="md:col-start-6 md:col-span-7 md:-mt-12">
              <StaticTile
                src="/playground/gyft.png"
                alt="Gyft branding concept"
                caption="Branding concept • Gyft"
                width={1170}
                height={659}
                side="right"
              />
            </div>
            <div className="md:col-start-1 md:col-span-7 md:-mt-12">
              <StaticTile
                src="/playground/presfit.png"
                alt="Presfit branding"
                caption="Branding • Presfit"
                width={1370}
                height={659}
                side="left"
              />
            </div>
            <div className="md:col-start-6 md:col-span-7 md:-mt-12">
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
