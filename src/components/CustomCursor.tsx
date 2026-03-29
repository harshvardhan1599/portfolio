"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setVisible(true);

    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button"));
    }

    function onLeave() {
      setPos({ x: -100, y: -100 });
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-full transition-[width,height,opacity] duration-200"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        width: hovering ? 25 : 15,
        height: hovering ? 25 : 15,
        opacity: hovering ? 0.2 : 1,
        backgroundColor: "var(--foreground)",
      }}
    />
  );
}
