"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LazyVideo } from "@/components/LazyVideo";
import { tint } from "@/components/tint";

const TRANSITION_MS = 500;

type StaticTileProps = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  side?: "left" | "right";
  href?: string;
};

export function StaticTile({
  src,
  alt,
  caption,
  width,
  height,
  side = "left",
  href,
}: StaticTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const liftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (liftTimer.current) clearTimeout(liftTimer.current);
    setIsLifted(true);
    setIsHovered(true);
  }

  function handleLeave() {
    setIsHovered(false);
    if (liftTimer.current) clearTimeout(liftTimer.current);
    liftTimer.current = setTimeout(() => setIsLifted(false), TRANSITION_MS);
  }

  const origin = side === "right" ? "origin-top-right" : "origin-top-left";
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  const figure = (
    <figure
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`flex flex-col gap-3 relative transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${origin} ${
        isLifted ? "z-50" : "z-0"
      } ${isHovered ? "scale-[1.04] motion-reduce:scale-100" : "scale-100"}`}
    >
      <div
        className="rounded-none overflow-hidden"
        style={{ backgroundColor: tint(src) }}
      >
        {isVideo ? (
          <LazyVideo
            src={src}
            poster={src.replace(/\.(mp4|webm|mov)$/i, "-poster.jpg")}
            width={width}
            height={height}
            ariaLabel={alt}
            className="w-full h-auto block"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto block"
          />
        )}
      </div>
      <figcaption className="text-alt-sm text-muted">{caption}</figcaption>
    </figure>
  );

  return (
    <>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="case-study"
          data-cursor-label="View Project"
          className="block transition-transform duration-[120ms] ease-out active:scale-[0.98] motion-reduce:active:scale-100"
        >
          {figure}
        </a>
      ) : (
        figure
      )}

      <div
        aria-hidden
        className={`fixed inset-0 z-40 pointer-events-none backdrop-blur-sm bg-background/20 transition-opacity duration-300 ease-out motion-reduce:hidden ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
