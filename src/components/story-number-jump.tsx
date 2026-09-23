"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { useDropUp } from "@/hooks/use-drop-up";
import { cn } from "@/lib/utils";

export interface StoryNumberJumpItem {
  number: number;
  title: string;
}

/**
 * Кнопка текущей истории в шапке — раскрывает список всех историй.
 * Это настоящие <Link>, а не JS-навигация: так страницы историй
 * перелинкованы между собой и для краулеров.
 */
export function StoryNumberJump({
  lang,
  label,
  shortLabel,
  current,
  items,
  className,
}: {
  lang: string;
  /** Название истории — показывается от md. */
  label: string;
  /** Номер вида «002 / 101» — показывается на мобильных. */
  shortLabel: string;
  current: number;
  items: StoryNumberJumpItem[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLUListElement>(null);
  const dropUp = useDropUp(open, containerRef, menuRef);

  // Пока список открыт — блокируем скролл страницы под ним (он длинный
  // и скроллится сам).
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Открыли — сразу показываем текущую историю, а не начало списка.
  React.useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`${className} inline-flex h-10 max-w-full items-center gap-1.5 rounded-full border border-input pe-3.5 ps-4 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`}
      >
        {/* Мобайл — номер, от md — название истории. */}
        <span className="tabular-nums md:hidden">{shortLabel}</span>
        <span className="hidden truncate md:inline">{label}</span>
        <ChevronDown
          className={`size-4 flex-none opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul
          ref={menuRef}
          className={cn(
            "thin-scrollbar absolute end-0 z-popover max-h-[min(60vh,420px)] w-60 overflow-y-auto overscroll-contain rounded-2xl border bg-card shadow-md md:rounded-md",
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {items.map((it) => {
            const active = it.number === current;
            return (
              <li key={it.number}>
                <Link
                  href={`/${lang}/${it.number}/`}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted",
                    active && "font-medium"
                  )}
                >
                  <span className="flex-none tabular-nums text-muted-foreground">{it.number}.</span>
                  <span className="min-w-0 flex-1 truncate">{it.title}</span>
                  {active && <Check className="size-4 flex-none" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
