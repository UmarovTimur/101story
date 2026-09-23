import { ArrowUpRight } from "lucide-react";
import { getSideBanner } from "@/lib/side-banner";

/**
 * Баннер-ссылка на сторонний сайт в сайдбаре списка историй: где ещё можно
 * почитать Библию на языке текущей страницы. Фон и лучи — в globals.css
 * (.ray-banner), здесь только содержимое.
 */
export function SideBanner({ lang }: { lang: string }) {
  const banner = getSideBanner(lang);
  if (!banner) return null;

  return (
    <a
      href={banner.href}
      target="_blank"
      rel="noopener noreferrer"
      className="ray-banner group relative isolate flex flex-col gap-1.5 overflow-hidden rounded-card p-4 md:rounded-xl shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(20_10_40/.5)]"
    >
      <span aria-hidden className="ray-banner__rays" />

      {/* Стрелка в углу вместо соседа по флексу — тогда текст можно свободно
          центрировать на мобильных, не подвинув её. На md+ всё как было: текст слева. */}
      <ArrowUpRight
        className="absolute end-3 top-3 size-4 flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100"
        aria-hidden
      />

      <span className="relative flex flex-col items-center gap-1.5 text-center md:items-start md:text-start">
        <span className="font-display text-[17px] font-bold leading-[1.15]">{banner.title}</span>
        <span className="text-[12px] leading-snug opacity-85">{banner.subtitle}</span>
      </span>
    </a>
  );
}
