import { ArrowUpRight, Clapperboard, Youtube } from "lucide-react";
import { getMovieBanner, getYoutubeBanner } from "@/lib/media-banners";

/**
 * Два компактных баннера в ряд рядом с SideBanner: канал на YouTube (только
 * лого — подпись только для скринридеров) и сайт с фильмами (иконка +
 * подпись). Свой фирменный градиент у каждого — см. .media-banner--* в
 * globals.css — чтобы отличаться и друг от друга, и от .ray-banner.
 */
export function MediaBanners({ lang, watchMoviesLabel }: { lang: string; watchMoviesLabel: string }) {
  const youtube = getYoutubeBanner(lang);
  const movies = getMovieBanner(lang);
  if (!youtube && !movies) return null;

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {youtube && (
        <a
          href={youtube.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="media-banner--youtube group relative isolate flex aspect-[4/3] flex-col items-center justify-center rounded-xl shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(20_10_10/.5)]"
        >
          <ArrowUpRight
            className="absolute end-2.5 top-2.5 size-3.5 flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100"
            aria-hidden
          />
          <Youtube className="size-9" aria-hidden />
        </a>
      )}

      {movies && (
        <a
          href={movies.href}
          target="_blank"
          rel="noopener noreferrer"
          className="media-banner--movies group relative isolate flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl px-2 text-center shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(10_16_30/.5)]"
        >
          <ArrowUpRight
            className="absolute end-2.5 top-2.5 size-3.5 flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100"
            aria-hidden
          />
          <Clapperboard className="size-6" aria-hidden />
          <span className="text-[12px] font-medium leading-tight">{watchMoviesLabel}</span>
        </a>
      )}
    </div>
  );
}
