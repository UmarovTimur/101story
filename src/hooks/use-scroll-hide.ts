"use client";

import * as React from "react";

/**
 * Скрыть/показать панель (шапку, плеер) в такт скроллу: вниз — прячем,
 * вверх — возвращаем. У самого верха страницы всегда видна. Пока панель
 * скрыта, любой клик по странице тоже возвращает её — чтобы не потерять
 * доступ к управлению.
 */
export function useScrollHide({ threshold = 8, topOffset = 64 } = {}) {
  const [hidden, setHidden] = React.useState(false);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y <= topOffset) {
        setHidden(false);
      } else if (delta > threshold) {
        setHidden(true);
      } else if (delta < -threshold) {
        setHidden(false);
      }
      lastY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, topOffset]);

  // Пока скрыта — любой клик по странице возвращает панель обратно.
  React.useEffect(() => {
    if (!hidden) return;
    const onPointerDown = () => setHidden(false);
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [hidden]);

  return hidden;
}
