import type { ReactNode } from "react";
import { ArrowUpRight, BookOpen, Clapperboard, Youtube } from "lucide-react";
import { getBooksBanner, getMovieBanner, getYoutubeBanner } from "@/lib/media-banners";

/**
 * Общий вид плашек: иконка + подпись в ряд, стрелка в углу, высота — по
 * содержимому (только вертикальный паддинг). Каждая плашка на всю ширину
 * колонки, размер повторяет .ray-banner (SideBanner).
 */
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
      className={`${className} group relative isolate flex items-center gap-2.5 rounded-card px-4 md:rounded-xl md:px-3.5 shadow-[0_1px_2px_rgb(0_0_0/.12)] transition-shadow hover:shadow-[0_6px_18px_-6px_rgb(0_0_0/.5)] py-4`}
    >
      <ArrowUpRight
        className="absolute flex-none opacity-70 transition-transform group-hover:translate-x-px group-hover:-translate-y-px rtl:-scale-x-100 end-3.5 top-3.5 size-4 md:end-3 md:top-3"
        aria-hidden
      />
      {icon}
      <span className="text-[15px] font-medium leading-tight">{label}</span>
    </a>
  );
}

/**
 * Плашки в колонке под SideBanner, каждая на всю ширину: канал на YouTube,
 * сайт с фильмами, раздел «Книги». У каждой своя иконка, подпись и
 * градиент — см. .media-banner--* в globals.css — чтобы отличаться друг от
 * друга и от .ray-banner.
 */
export function MediaBanners({ lang, watchMoviesLabel }: { lang: string; watchMoviesLabel: string }) {
  const youtube = getYoutubeBanner(lang);
  const movies = getMovieBanner(lang);
  const books = getBooksBanner(lang);
  if (!youtube && !movies && !books) return null;

  return (
    <div className="grid grid-cols-1 gap-2.5">
      {youtube && (
        <MediaBanner
          href={youtube.href}
          className="media-banner--youtube"
          icon={<Youtube className="size-6" aria-hidden />}
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
      {books && (
        <MediaBanner
          href={books.href}
          className="media-banner--books"
          icon={<BookOpen className="size-6" aria-hidden />}
          label={books.label}
        />
      )}
    </div>
  );
}
