"use client";

import * as React from "react";
import { useScrollHide } from "@/hooks/use-scroll-hide";
import { cn } from "@/lib/utils";

/**
 * Шапка «прилипает» к верху и прячется в такт скроллу — так же, как
 * мини-плеер внизу (см. AudioDock в story-audio.tsx).
 *
 * На мобайле это плавающая «пилюля» с отступами от краёв (.floating-bar),
 * на md+ — обычная полоса на всю ширину. Поля вокруг пилюли пропускают
 * тапы к странице (pointer-events-none), иначе они «съедали» бы клики.
 */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const hidden = useScrollHide();

  return (
    <header
      className={cn(
        "pointer-events-none sticky top-0 z-header px-[--bar-gap-x] pt-[max(var(--bar-gap),env(safe-area-inset-top))] transition-transform duration-200 md:p-0",
        // С запасом на тень — иначе при скрытии её край остаётся у верха экрана.
        hidden ? "-translate-y-[calc(100%+2rem)]" : "translate-y-0"
      )}
    >
      <div className="floating-bar pointer-events-auto md:border-b md:bg-card">{children}</div>
    </header>
  );
}
