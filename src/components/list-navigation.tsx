"use client";

import * as React from "react";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollHide } from "@/hooks/use-scroll-hide";
import { eraSectionId } from "@/lib/eras";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { JumpToNumber } from "@/components/jump-to-number";
import { SideBanner } from "@/components/side-banner";

export interface EraNavItem {
  key: string;
  title: string;
  short: string;
  from: number;
  to: number;
}

const eyebrow = "text-[11px] uppercase tracking-[.16em] text-muted-foreground";

/** Боковая колонка списка (десктоп): эпохи, переход по номеру, прогресс. */
export function ListSidebar({
  lang,
  eras,
  jumpIds,
  min,
  max,
  readIds,
  labels,
}: {
  lang: string;
  eras: EraNavItem[];
  jumpIds: Record<number, string>;
  min: number;
  max: number;
  readIds: string[];
  labels: {
    eras: string;
    jump: string;
    jumpHint: string;
    jumpError: string;
    jumpGo: string;
    read: string;
  };
}) {
  const active = useActiveSection(eras.map((e) => eraSectionId(e.key)));

  return (
    /* Отступ сверху учитывает прилипшую шапку (57px) — иначе она наезжает. */
    <aside className="sticky top-[73px] hidden flex-col gap-7 self-start md:flex">
      <nav aria-labelledby="eras-label" className="flex flex-col gap-2.5">
        <div id="eras-label" className={eyebrow}>
          {labels.eras}
        </div>
        <ul className="flex flex-col gap-0.5 text-[14.5px]">
          {eras.map((e) => {
            const on = active === eraSectionId(e.key);
            return (
              <li key={e.key}>
                <a
                  href={`#${eraSectionId(e.key)}`}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "flex items-baseline justify-between gap-2.5 rounded-lg px-3 py-2 transition-colors",
                    on
                      ? "bg-muted font-medium text-foreground"
                      : "text-foreground/75 hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="text-optical">{e.title}</span>
                  <span className="text-optical flex-none whitespace-nowrap tabular-nums text-xs font-normal text-muted-foreground">
                    {e.from}–{e.to}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <JumpToNumber
        id="jump-sidebar"
        lang={lang}
        ids={jumpIds}
        min={min}
        max={max}
        labelClassName={eyebrow}
        labels={{
          input: labels.jump,
          go: labels.jumpGo,
          error: labels.jumpError,
          hint: labels.jumpHint,
        }}
      />

      <ReadProgress lang={lang} ids={readIds} label={labels.read} />

      <SideBanner lang={lang} />
    </aside>
  );
}

function ReadProgress({ lang, ids, label }: { lang: string; ids: string[]; label: string }) {
  const { done } = useProgress(lang);
  const count = React.useMemo(() => ids.filter((id) => done.includes(id)).length, [ids, done]);
  const pct = ids.length ? (count / ids.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 border-t pt-[18px]">
      <div id="read-progress-label" className={eyebrow}>
        {label}
      </div>
      <div
        role="progressbar"
        aria-labelledby="read-progress-label"
        aria-valuemin={0}
        aria-valuemax={ids.length}
        aria-valuenow={count}
        className="h-1.5 overflow-hidden rounded-full bg-track"
      >
        <span className="block h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <div className="tabular-nums text-xs text-muted-foreground">
        {count} / {ids.length}
      </div>
    </div>
  );
}

/** Полоса эпох-«чипов» под шапкой (мобайл), прилипает при прокрутке. */
export function EraChips({ eras, label }: { eras: EraNavItem[]; label: string }) {
  const active = useActiveSection(eras.map((e) => eraSectionId(e.key)));
  const rowRef = React.useRef<HTMLUListElement>(null);
  // Тот же хук, что и у шапки: пока она видна, стоим под ней (52px), когда
  // она уезжает вверх — занимаем её место, чтобы не висела пустая щель.
  const headerHidden = useScrollHide();

  React.useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - 18, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky z-sticky border-b bg-background/95 backdrop-blur transition-[top] duration-200 md:hidden",
        headerHidden ? "top-0" : "top-[52px]"
      )}
    >
      <ul ref={rowRef} className="no-scrollbar relative flex gap-2 overflow-x-auto px-[18px] py-3 text-[13px]">
        {eras.map((e) => {
          const id = eraSectionId(e.key);
          const on = active === id;
          return (
            <li key={e.key} className="flex-none">
              <a
                href={`#${id}`}
                data-section={id}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-3 py-[7px] transition-colors",
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-input text-foreground/75"
                )}
              >
                <span className="text-optical">{e.short}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
