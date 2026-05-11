"use client";

import { useRef, useState } from "react";

const TRANSITION_MS = 500;

export function DitherTile() {
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

  return (
    <>
      <a
        href="https://dither.harshvardhan.work"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        data-cursor="case-study"
        data-cursor-label="View Project"
        className={`block relative transition-transform duration-500 ease-out origin-top-left ${
          isLifted ? "z-50" : "z-0"
        } ${isHovered ? "scale-[1.04]" : "scale-100"}`}
      >
        <figure className="flex flex-col gap-3">
          <div className="rounded-none bg-fill overflow-hidden">
            <video
              src="/playground/dither.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
          </div>
          <figcaption className="text-alt-sm text-muted">
            Dither pattern
          </figcaption>
        </figure>
      </a>

      <div
        aria-hidden
        className={`fixed inset-0 z-40 pointer-events-none backdrop-blur-sm bg-background/20 transition-opacity duration-500 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
