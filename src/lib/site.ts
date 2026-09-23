import type { Language } from "./types";

// Канонический домен сайта (без завершающего /): canonical, hreflang, sitemap,
// robots, Open Graph и JSON-LD строятся от него. Боевую сборку без SITE_URL
// не выпускаем: иначе все ссылки для поисковиков тихо укажут на чужой домен.
function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SITE_URL не задан. Укажите домен сайта, например:\n" +
        "  SITE_URL=https://example.org npm run build\n" +
        "Для локальной проверки подойдёт SITE_URL=http://localhost:3000."
    );
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

/** Абсолютный адрес для пути на сайте ("/ru/5/" -> "https://…/ru/5/"). */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** BCP-47 тег языка для lang/hreflang: URL-код не всегда совпадает с ним (ug -> ug-Cyrl). */
export function langTag(language: Language): string {
  return language.hreflang ?? language.code;
}
