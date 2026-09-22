"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages as LanguagesIcon, Check } from "lucide-react";
import type { Language } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="relative">
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          aria-label={label}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LanguagesIcon className="size-4" aria-hidden />
        </button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        >
          <LanguagesIcon />
          {languages.find((l) => l.code === current)?.name}
        </Button>
      )}
      {open && (
        <div className="thin-scrollbar absolute end-0 z-popover mt-2 max-h-[min(60vh,420px)] w-44 overflow-y-auto overscroll-contain rounded-md border bg-card shadow-md">
          {languages.map((l) => (
            <Link
              key={l.code}
              href={swapLang(l.code)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm hover:bg-muted",
                l.code === current && "font-medium"
              )}
            >
              <span>{l.name}</span>
              {l.code === current && <Check className="size-4" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
