"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function SelectionFrame({ children }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="relative inline-block border-2 border-[#0D99FF] px-1.5 py-0.5"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#0D99FF]"
      />
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#0D99FF]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-[#0D99FF]"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white border border-[#0D99FF]"
      />
      {size ? (
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-full mb-2 text-body-sm bg-[#0D99FF] text-white px-1.5 py-0.5 rounded select-none leading-none"
        >
          {size.w} x {size.h}
        </span>
      ) : null}
    </span>
  );
}
