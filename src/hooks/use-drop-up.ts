"use client";

import * as React from "react";

/**
 * Куда раскрывать выпадающее меню: если под кнопкой не хватает места до
 * низа экрана, а сверху его больше — вверх. Меряем уже отрисованное меню
 * в layout-эффекте, до отрисовки кадра, поэтому оно не «прыгает».
 */
export function useDropUp(
  open: boolean,
  anchorRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>
) {
  const [up, setUp] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;
    const rect = anchor.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setUp(below < menu.offsetHeight + 8 && rect.top > below);
  }, [open, anchorRef, menuRef]);

  return up;
}
