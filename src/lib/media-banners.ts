/**
 * Ссылки для баннеров YouTube и «фильмы» в сайдбаре — по языку, как и
 * sideBanners в side-banner.ts.
 *
 * TODO(you): значения ниже — заглушки. Замените href на реальные каналы
 * YouTube и сайты с фильмами для каждого языка (или на один и тот же
 * адрес для всех, если отдельные версии по языкам не нужны).
 */

const TODO_YOUTUBE = "https://www.youtube.com/@REPLACE_ME";
const TODO_MOVIES = "https://example.com/movies";

const LANGS = [
  "uz", "ru", "az", "kk", "ky", "hz", "uk", "hy", "ka", "tr", "de", "es",
  "fa", "ro", "ms", "mn", "eu", "ty", "ba", "kr", "tl", "gv", "gl",
];

export const youtubeBanners: Record<string, { href: string }> = Object.fromEntries(
  LANGS.map((code) => [code, { href: `${TODO_YOUTUBE}?lang=${code}` }])
);

export const movieBanners: Record<string, { href: string }> = Object.fromEntries(
  LANGS.map((code) => [code, { href: `${TODO_MOVIES}/${code}` }])
);

export function getYoutubeBanner(lang: string) {
  return youtubeBanners[lang];
}

export function getMovieBanner(lang: string) {
  return movieBanners[lang];
}
