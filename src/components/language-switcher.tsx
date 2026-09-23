"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages as LanguagesIcon, Check, Globe } from "lucide-react";
import type { Language } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { customFlags } from "@/lib/custom-flags";
import { useDropUp } from "@/hooks/use-drop-up";

/**
 * Флаг языка: юникод-эмодзи страны, если она есть; иначе — свой SVG для
 * языков без государства (см. custom-flags.tsx); иначе — нейтральный глобус.
 */
function LanguageFlag({ code, flag }: { code: string; flag?: string }) {
  if (flag) {
    return (
      <span aria-hidden className="text-[15px] leading-none">
        {flag}
      </span>
    );
  }
  const custom = customFlags[code];
  if (custom) {
    return (
      <span aria-hidden className="inline-block size-4 flex-none overflow-hidden rounded-[3px]">
        {custom}
      </span>
    );
  }
  return <Globe aria-hidden className="size-3.5 text-muted-foreground" />;
}

export function LanguageSwitcher({
  languages,
  current,
  variant = "full",
  label,
}: {
  languages: Language[];
  current: string;
  /** "full" — кнопка с названием языка (список историй), "icon" — компактная круглая кнопка (страница истории). */
  variant?: "full" | "icon";
  /** aria-label для компактного варианта. */
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const dropUp = useDropUp(open, containerRef, menuRef);
  const pathname = usePathname();

  // Пока меню открыто — блокируем скролл страницы под ним (языков много,
  // список сам скроллится внутри себя).
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Закрываем по клику/тапу вне меню и по Escape — вместо onBlur с таймером.
  // onBlur+setTimeout ненадёжен: на медленных ПК (RDP/VPN, трекпад-эмуляция
  // мыши) браузер иногда обрабатывает blur раньше клика по ссылке в списке,
  // меню схлопывается быстрее перехода, и клик по языку не срабатывает.
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

  // Меняем только сегмент языка в начале пути — номер истории (или другой
  // путь) остаётся тем же, поэтому смена языка не уводит со страницы.
  const swapLang = (code: string) => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return `/${code}`;
    parts[0] = code;
    return "/" + parts.join("/") + "/";
  };

  if (languages.length < 2) {
    if (variant === "icon") return null;
    return (
      <span className="text-sm text-muted-foreground">
        {languages.find((l) => l.code === current)?.name}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={label}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LanguagesIcon className="size-4" aria-hidden />
        </button>
      ) : (
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => setOpen((v) => !v)}>
          <LanguageFlag code={current} flag={languages.find((l) => l.code === current)?.flag} />
          {languages.find((l) => l.code === current)?.name}
        </Button>
      )}
      {open && (
        <div
          ref={menuRef}
          className={cn(
            "thin-scrollbar absolute end-0 z-popover max-h-[min(60vh,420px)] w-44 overflow-y-auto overscroll-contain rounded-2xl border bg-card shadow-md md:rounded-md",
            dropUp ? "bottom-full mb-2" : "mt-2"
          )}
        >
          {languages.map((l) => (
            <Link
              key={l.code}
              href={swapLang(l.code)}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted",
                l.code === current && "font-medium"
              )}
            >
              <LanguageFlag code={l.code} flag={l.flag} />
              <span className="flex-1 truncate">{l.name}</span>
              {l.code === current && <Check className="size-4 flex-none" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
