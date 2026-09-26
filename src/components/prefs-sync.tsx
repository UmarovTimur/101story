"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Возвращает на <html> тему и размер текста из localStorage после клиентских
 * переходов. Язык — корневой сегмент ([lang]/layout), и при его смене Next
 * перерисовывает <html> заново: класс dark и data-text-size, выставленные
 * boot-скриптом, пропадают, а сам скрипт повторно не выполняется.
 * useLayoutEffect — чтобы успеть до отрисовки и не мигнуть светлой темой.
 */
export function PrefsSync() {
  const pathname = usePathname();

  React.useLayoutEffect(() => {
    const d = document.documentElement;
    try {
      const t = localStorage.getItem("bs:theme");
      d.classList.toggle("dark", t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
      const s = localStorage.getItem("bs:text");
      if (s) d.dataset.textSize = s;
    } catch {
      // хранилище недоступно — остаётся то, что выставил boot-скрипт
    }
  }, [pathname]);

  return null;
}
