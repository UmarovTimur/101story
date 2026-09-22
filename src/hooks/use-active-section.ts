import * as React from "react";

/**
 * id секции, чей верх последним пересёк линию на 30% высоты окна
 * (в самом низу страницы — последняя секция).
 */
export function useActiveSection(ids: string[]): string | undefined {
  const key = ids.join(" ");
  const [active, setActive] = React.useState<string | undefined>(ids[0]);

  React.useEffect(() => {
    const els = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const line = window.innerHeight * 0.3;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(atBottom ? els[els.length - 1].id : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
