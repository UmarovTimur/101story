"use client";

import * as React from "react";
import { useScrollHide } from "@/hooks/use-scroll-hide";
import { cn } from "@/lib/utils";

/**
 * Шапка «прилипает» к верху и прячется в такт скроллу — так же, как
 * мини-плеер внизу (см. AudioDock в story-audio.tsx).
 */
export function StickyHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hidden = useScrollHide();

  return (
    <header
      className={cn(
        "sticky top-0 z-header transition-transform duration-200",
        hidden ? "-translate-y-full" : "translate-y-0",
        className
      )}
    >
      {children}
    </header>
  );
}
