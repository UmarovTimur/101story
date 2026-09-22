/**
 * Серый каркас страницы на время загрузки шрифтов.
 *
 * Показывается, пока на <html> висит data-loading (его ставит и снимает
 * скрипт в layout.tsx). Без JS атрибут не появится вовсе — тогда сразу
 * виден настоящий контент, а каркас остаётся скрытым.
 */
function Block({ className }: { className: string }) {
  return <div className={`skeleton-block ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-hidden>
      {/* шапка */}
      <div className="border-b bg-card">
        <div className="mx-auto flex h-[52px] max-w-[1280px] items-center justify-between gap-4 px-[18px] md:h-14 md:px-12">
          <Block className="h-5 w-40 rounded-md md:h-6 md:w-56" />
          <div className="flex flex-none items-center gap-2.5">
            <Block className="h-8 w-24 rounded-lg" />
            <Block className="size-9 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-11 px-[18px] pt-3.5 md:grid-cols-[224px_minmax(0,1fr)] md:px-12 md:pt-11">
        {/* боковая колонка */}
        <div className="hidden flex-col gap-7 md:flex">
          <div className="flex flex-col gap-2.5">
            <Block className="h-3 w-24 rounded" />
            {["w-full", "w-[84%]", "w-[92%]", "w-[76%]", "w-[88%]"].map((w, i) => (
              <Block key={i} className={`h-9 rounded-lg ${w}`} />
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <Block className="h-3 w-20 rounded" />
            <Block className="h-10 w-full rounded-lg" />
          </div>
          <Block className="h-[110px] w-full rounded-xl" />
        </div>

        {/* основная колонка */}
        <div className="flex min-w-0 flex-col gap-3 md:gap-[26px]">
          <Block className="h-[172px] w-full rounded-2xl lg:h-[216px]" />
          <Block className="h-[52px] w-full rounded-lg" />
          <div className="flex flex-col gap-3 pt-4 md:gap-[26px] md:pt-0">
            <Block className="h-7 w-56 rounded" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Block key={i} className="h-[92px] rounded-lg sm:h-[230px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
