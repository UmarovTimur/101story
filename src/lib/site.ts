import type { Language } from "./types";

// Боевой домен сайта.
export const PRODUCTION_URL = "https://101story.org";

// Канонический домен сайта (без завершающего /): canonical, hreflang, sitemap,
// robots, Open Graph и JSON-LD строятся от него. По умолчанию в сборке —
// PRODUCTION_URL, в dev — localhost; SITE_URL переопределяет оба варианта.
function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
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
