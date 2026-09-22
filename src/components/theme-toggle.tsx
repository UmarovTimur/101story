"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import type { ThemeLabels } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const variants = {
  icon: "grid size-9 place-items-center rounded-full border border-input text-muted-foreground hover:bg-muted hover:text-foreground",
  pill: "inline-flex items-center gap-1.5 rounded-full border border-input px-2.5 py-1 text-[12.5px] text-foreground/75 hover:bg-muted",
  plain: "grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function ThemeToggle({
  labels,
  variant = "icon",
  className,
}: {
  labels: ThemeLabels;
  variant?: keyof typeof variants;
  className?: string;
}) {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("bs:theme", next ? "dark" : "light");
    } catch {
      // тема просто не запомнится
    }
    setDark(next);
  };

  const Icon = dark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={labels.toggle}
      aria-pressed={dark}
      className={cn("transition-colors", variants[variant], className)}
    >
      <Icon className="size-4" aria-hidden />
      {variant === "pill" && <span className="text-optical">{dark ? labels.light : labels.dark}</span>}
    </button>
  );
}
