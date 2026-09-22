import type { ReactNode } from "react";
import { ArrowUpRight, Clapperboard, Youtube } from "lucide-react";
import { getMovieBanner, getYoutubeBanner } from "@/lib/media-banners";

/** Общий вид обеих плашек: иконка + подпись, стрелка в углу, равный отступ со всех сторон. */
function MediaBanner({
  href,
  className,
  icon,
  label,
}: {
  href: string;
  className: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} group relative isolate flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-center shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(0_0_0/.5)]`}
    >
      <ArrowUpRight
        className="absolute end-2.5 top-2.5 size-3.5 flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100"
        aria-hidden
      />
      {icon}
      <span className="text-[12px] font-medium leading-tight">{label}</span>
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

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {youtube && (
        <MediaBanner
          href={youtube.href}
          className="media-banner--youtube"
          icon={<Youtube className="size-7" aria-hidden />}
          label="YouTube"
        />
      )}
      {movies && (
        <MediaBanner
          href={movies.href}
          className="media-banner--movies"
          icon={<Clapperboard className="size-6" aria-hidden />}
          label={watchMoviesLabel}
        />
      )}
    </div>
  );
}
