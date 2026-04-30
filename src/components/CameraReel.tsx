"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CameraReelImage = { src: string; alt: string };

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export function CameraReel({
  images,
  bg,
  className = "",
  transitionDelay,
  on = false,
  darkGradient,
}: {
  images: CameraReelImage[];
  bg?: string;
  className?: string;
  transitionDelay?: string;
  on?: boolean;
  darkGradient?: string;
}) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);

  const N = images.length;
  const loop = N > 1;
  const slides = loop ? [images[N - 1], ...images, images[0]] : images;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !loop) return;
    el.scrollLeft = el.clientWidth;
  }, [loop]);

  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slot = loop ? i + 1 : i;
    el.scrollTo({ left: slot * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w === 0) return;

    const slot = Math.round(el.scrollLeft / w);
    const real = loop ? (slot - 1 + N) % N : slot;
    if (real !== index) setIndex(real);

    if (!loop) return;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const cur = Math.round(el.scrollLeft / el.clientWidth);
      if (cur === 0) el.scrollLeft = N * el.clientWidth;
      else if (cur === N + 1) el.scrollLeft = el.clientWidth;
    }, 120);
  };

  return (
    <div
      className={`relative border-overlay rounded-2xl p-1 flex flex-col transition-colors duration-500 ease-out ${
        bg ? "" : "bg-fill-secondary"
      } ${className}`}
      style={{
        ...(bg ? { backgroundColor: bg } : {}),
        ...(transitionDelay ? { transitionDelay } : {}),
      }}
    >
      {darkGradient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl hidden dark:block transition-opacity duration-500 ease-out ring-1 ring-inset ring-white/15"
          style={{
            backgroundImage: darkGradient,
            opacity: on ? 1 : 0,
            ...(transitionDelay ? { transitionDelay } : {}),
          }}
        />
      ) : null}
      <div className="relative flex items-center justify-between pt-[20px] px-[20px]">
        <p className="text-alt text-foreground">CAMERA REEL</p>
        <div className="flex items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === index}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index
                  ? "bg-foreground"
                  : "bg-foreground/30 hover:bg-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-72 md:min-h-0 relative rounded-xl overflow-hidden bg-fill">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((media, i) => (
            <div
              key={i}
              className="relative shrink-0 w-full h-full snap-start"
            >
              {isVideo(media.src) ? (
                <video
                  src={media.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={media.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 100vw"
                />
              )}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/10 dark:border-white/10" />
      </div>
    </div>
  );
}
