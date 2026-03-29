"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "hover" | "case-study";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setVisible(true);

    function onMove(e: MouseEvent) {
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top = `${e.clientY}px`;
      }
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='case-study']")) {
        setMode("case-study");
      } else if (target.closest("a, button")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    }

    function onLeave() {
      if (ref.current) {
        ref.current.style.left = "-100px";
        ref.current.style.top = "-100px";
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!visible) return null;

  const isPill = mode === "case-study";
  const isHover = mode === "hover";

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 rounded-full flex items-center justify-center"
      style={{
        left: -100,
        top: -100,
        transform: "translate(-50%, -50%)",
        width: isPill ? "auto" : isHover ? 25 : 15,
        height: isPill ? "auto" : isHover ? 25 : 15,
        padding: isPill ? "8px 16px" : 0,
        opacity: isHover ? 0.2 : 1,
        backgroundColor: isPill ? "var(--cursor-pill)" : "var(--foreground)",
        transition: "width 200ms ease-out, height 200ms ease-out, opacity 200ms ease-out, padding 200ms ease-out, background-color 200ms ease-out",
      }}
    >
      <span
        className="text-body-sm text-foreground whitespace-nowrap"
        style={{
          opacity: isPill ? 1 : 0,
          transform: isPill ? "scale(1)" : "scale(0)",
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
        }}
      >
        Case Study
      </span>
    </div>
  );
}
