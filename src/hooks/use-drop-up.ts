"use client";

import * as React from "react";

const EDGE_GAP = 8;

/**
 * Куда раскрывать выпадающее меню: если под кнопкой не хватает места до
 * низа экрана, а сверху его больше — вверх. Меряем уже отрисованное меню
 * в layout-эффекте, до отрисовки кадра, поэтому оно не «прыгает».
 * По горизонтали меню сдвигается (style.translate) так, чтобы его края не
 * выходили за экран; пересчитывается и при изменении размера окна.
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

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom;
      setUp(below < menu.offsetHeight + 8 && rect.top > below);

      // Меряем без прежнего сдвига, затем возвращаем в границы экрана.
      menu.style.translate = "0px";
      const box = menu.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      let shift = 0;
      if (box.right > viewport - EDGE_GAP) shift = viewport - EDGE_GAP - box.right;
      if (box.left + shift < EDGE_GAP) shift = EDGE_GAP - box.left;
      menu.style.translate = shift ? `${shift}px` : "";
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, anchorRef, menuRef]);

  return up;
}
