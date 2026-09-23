import type { ReactNode } from "react";
import { ArrowUpRight, Clapperboard, Youtube } from "lucide-react";
import { getMovieBanner, getYoutubeBanner } from "@/lib/media-banners";

/**
 * Общий вид обеих плашек: иконка + подпись в ряд, стрелка в углу, высота —
 * по содержимому (только вертикальный паддинг), без квадратного
 * соотношения сторон — на узких мобильных колонках aspect-[4/3] делал
 * плашку неоправданно высокой. Когда баннер один (fullWidth), паддинг и
 * шрифт крупнее — повторяет размер .ray-banner (SideBanner).
 */
function MediaBanner({
  href,
  className,
  icon,
  label,
  fullWidth,
}: {
  href: string;
  className: string;
  icon: ReactNode;
  label: string;
  fullWidth: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} group relative isolate flex items-center gap-2.5 rounded-xl px-3.5 shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(0_0_0/.5)] ${
        fullWidth ? "py-4" : "py-3"
      }`}
    >
      <ArrowUpRight
        className={`absolute flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100 ${
          fullWidth ? "end-3 top-3 size-4" : "end-2.5 top-2.5 size-3.5"
        }`}
        aria-hidden
      />
      {icon}
      <span className={`font-medium leading-tight ${fullWidth ? "text-[15px]" : "text-[13px]"}`}>
        {label}
      </span>
    </a>
  );
}

/**
 * Два компактных баннера в ряд рядом с SideBanner: канал на YouTube и сайт
 * с фильмами, у каждого своя иконка и подпись. Свой фирменный градиент у
 * каждого — см. .media-banner--* в globals.css — чтобы отличаться и друг
 * от друга, и от .ray-banner.
 */
export function MediaBanners({ lang, watchMoviesLabel }: { lang: string; watchMoviesLabel: string }) {
  const youtube = getYoutubeBanner(lang);
  const movies = getMovieBanner(lang);
  if (!youtube && !movies) return null;
  const fullWidth = !(youtube && movies);

  return (
    <div className={`grid gap-2.5 ${fullWidth ? "grid-cols-1" : "grid-cols-2"}`}>
      {youtube && (
        <MediaBanner
          href={youtube.href}
          className="media-banner--youtube"
          icon={<Youtube className={fullWidth ? "size-6" : "size-5"} aria-hidden />}
          label="YouTube"
          fullWidth={fullWidth}
        />
      )}
      {movies && (
        <MediaBanner
          href={movies.href}
          className="media-banner--movies"
          icon={<Clapperboard className={fullWidth ? "size-6" : "size-5"} aria-hidden />}
          label={watchMoviesLabel}
          fullWidth={fullWidth}
        />
      )}
    </div>
  );
}
