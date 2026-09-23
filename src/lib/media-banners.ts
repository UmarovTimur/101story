/**
 * Ссылки для баннеров YouTube и «фильмы» в сайдбаре — по языку, как и
 * sideBanners в side-banner.ts. Для языка без записи в карте баннер просто
 * не показывается (см. MediaBanners в components/media-banners.tsx).
 *
 * TODO(you): заполните реальными каналами YouTube по мере появления —
 * сейчас карта пустая, поэтому баннер YouTube скрыт для всех языков.
 */

const YOUTUBE_LANG_PATHS: Record<string, string> = {
  uz: "https://www.youtube.com/@muqaddaskitob1",
};

export const youtubeBanners: Record<string, { href: string }> = Object.fromEntries(
  Object.entries(YOUTUBE_LANG_PATHS).map(([code, href]) => [code, { href }])
);

// vidkino.com поддерживает не все LANGS — для языков без реальной ссылки
// баннер «фильмы» просто не показывается (см. getMovieBanner).
const VIDKINO_LANG_PATHS: Record<string, string> = {
  ru: "ru",
  uz: "uz",
  az: "az",
  kk: "kz", // на vidkino казахский контент отдаётся по пути /kz
  ky: "kg", // на vidkino киргизский контент отдаётся по пути /kg
};

export const movieBanners: Record<string, { href: string }> = Object.fromEntries(
  Object.entries(VIDKINO_LANG_PATHS).map(([code, path]) => [
    code,
    { href: `https://vidkino.com/${path}` },
  ])
);

export function getYoutubeBanner(lang: string) {
  return youtubeBanners[lang];
}

export function getMovieBanner(lang: string) {
  return movieBanners[lang];
}
