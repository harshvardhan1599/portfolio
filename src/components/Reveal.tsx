"use client";

// Scroll-triggered entrance: fades + rises the element into place the first time
// it enters the viewport (once — it never re-animates on scroll-back). Elements
// already in view at mount fire immediately, so a hero with staggered `delay`s
// cascades in on load. Matches the About page's curve/timing for cohesion, and
// respects prefers-reduced-motion (renders visible, no movement).
//
// Once the rise finishes it DROPS the inline transform: a lingering transform
// creates a containing block that would trap descendant `position: fixed`
// overlays (e.g. the tiles' full-screen hover blur). After settling there's no
// inline style at all, so those overlays behave normally.

import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode, TransitionEvent } from "react";

type RevealProps = {
  as?: ElementType;
  delay?: number; // ms — stagger offset
  y?: number; // rise distance, px
  className?: string;
  children: ReactNode;
};

export function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 18,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // once only
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const settled = reduced || done;
  const style = settled
    ? undefined
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  const onTransitionEnd = settled
    ? undefined
    : (e: TransitionEvent) => {
        if (e.propertyName === "transform") setDone(true);
      };

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      onTransitionEnd={onTransitionEnd}
    >
      {children}
    </Tag>
  );
}
