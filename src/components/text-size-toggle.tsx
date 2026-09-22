"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SIZES = ["sm", "md", "lg"] as const;
type Size = (typeof SIZES)[number];

/** «Aa»: по кругу меняет размер текста истории (см. .story-text в globals.css). */
export function TextSizeToggle({ label, className }: { label: string; className?: string }) {
  const [size, setSize] = React.useState<Size>("md");

  React.useEffect(() => {
    const current = document.documentElement.dataset.textSize as Size | undefined;
    if (current && SIZES.includes(current)) setSize(current);
  }, []);

  const cycle = () => {
    const next = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length];
    document.documentElement.dataset.textSize = next;
    try {
      localStorage.setItem("bs:text", next);
    } catch {
      // размер просто не запомнится
    }
    setSize(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${label}: ${size.toUpperCase()}`}
      className={cn(
        "grid h-9 min-w-9 place-items-center rounded-lg px-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <span aria-hidden className="font-serif leading-none">
        <span className={cn(size === "sm" ? "text-[13px]" : size === "lg" ? "text-[17px]" : "text-[15px]")}>
          A
        </span>
        <span className="text-[12px]">a</span>
      </span>
    </button>
  );
}
