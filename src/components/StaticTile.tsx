"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
      className={`flex flex-col gap-3 relative transition-transform duration-500 ease-out ${origin} ${
        isLifted ? "z-50" : "z-0"
      } ${isHovered ? "scale-[1.04]" : "scale-100"}`}
    >
      <div className="rounded-none bg-fill overflow-hidden">
        {isVideo ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            aria-label={alt}
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
          className="block"
        >
          {figure}
        </a>
      ) : (
        figure
      )}

      <div
        aria-hidden
        className={`fixed inset-0 z-40 pointer-events-none backdrop-blur-sm bg-background/20 transition-opacity duration-500 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
