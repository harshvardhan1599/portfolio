import type { Metadata } from "next";
import { DitherTile } from "@/components/DitherTile";

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DitherTile />
          </div>
        </div>
      </section>
    </div>
  );
}
