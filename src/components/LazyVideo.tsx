"use client";

// A muted looping tile video that only downloads + plays once it's near the
// viewport, shows a lightweight poster until then, and pauses when scrolled
// away. The aspect ratio is reserved up front so there's no layout shift.

import { useEffect, useRef } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  width: number;
  height: number;
  className?: string;
  ariaLabel?: string;
};

export function LazyVideo({
  src,
  poster,
  width,
  height,
  className,
  ariaLabel,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.src) v.src = src; // defer the download until near-viewport
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={ariaLabel}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
}
