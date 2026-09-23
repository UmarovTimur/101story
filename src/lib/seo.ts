import type { Metadata } from "next";
import type { Story } from "./types";
import { availableLanguages, getStories, imageSrc } from "./stories";
import { defaultLanguage, getLanguage } from "./languages";
import { absoluteUrl, langTag } from "./site";
import imageLoader from "./image-loader";
import { t } from "./i18n";

// Общие куски метаданных для поисковиков и ИИ-ассистентов:
// hreflang между языковыми версиями, описания, картинки для превью.

/** Ширина картинки для Open Graph / JSON-LD (одна из заранее нарезанных, не больше исходника). */
const SHARE_IMAGE_WIDTH = 1080;

export const listPath = (lang: string) => `/${lang}/`;
export const storyPath = (lang: string, story: Pick<Story, "number">) => `/${lang}/${story.number}/`;

/** Абсолютный адрес WebP-картинки истории нужной ширины. */
export function shareImage(story: Story): string {
  return absoluteUrl(imageLoader({ src: imageSrc(story), width: SHARE_IMAGE_WIDTH }));
}

/** Текст для meta description: первые абзацы, обрезанные по слову до ~155 символов. */
export function describe(paragraphs: string[], max = 155): string {
  const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:—–-]+$/, "")}…`;
}

/** Секунды -> ISO-8601 длительность (PT5M12S) для schema.org. */
export function isoDuration(sec: number): string {
  const s = Math.round(sec);
  return `PT${Math.floor(s / 60)}M${s % 60}S`;
}

/**
 * hreflang-ссылки на все языки, где есть страница с этим путём.
 * pathFor возвращает null, если у языка такой страницы нет (например, истории
 * с этим номером в переводе не оказалось) — такие языки пропускаются.
 */
export async function languageAlternates(
  pathFor: (lang: string, stories: Story[]) => string | null
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const l of availableLanguages()) {
    const path = pathFor(l.code, await getStories(l.code));
    if (path) out[langTag(l)] = absoluteUrl(path);
  }
  const fallback = out[langTag(defaultLanguage)];
  if (fallback) out["x-default"] = fallback;
  return out;
}

/** og:locale ожидает формат ll_CC; региона у нас нет, поэтому только язык. */
export function ogLocale(lang: string): string {
  const language = getLanguage(lang);
  return (language ? langTag(language) : lang).replace("-", "_");
}

/** Общие поля Open Graph/Twitter для страницы. */
export function socialMeta({
  lang,
  url,
  title,
  description,
  siteName,
  image,
  type = "website",
}: {
  lang: string;
  url: string;
  title: string;
  description: string;
  siteName: string;
  image?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  // Размеры не указываем: исходники разной ширины и не растягиваются при нарезке.
  const images = image ? [image] : undefined;
  return {
    openGraph: { type, url, title, description, siteName, locale: ogLocale(lang), images },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images },
  };
}

/** Метаданные списка историй языка — общие для /<lang>/ и корня «/». */
export async function listMetadata(lang: string): Promise<Metadata> {
  const ui = t(lang);
  const url = absoluteUrl(listPath(lang));
  const first = (await getStories(lang)).find((s) => s.number > 0);
  return {
    title: { absolute: ui.siteTitle },
    description: ui.apps.text,
    alternates: {
      canonical: url,
      languages: await languageAlternates((code) => listPath(code)),
    },
    ...socialMeta({
      lang,
      url,
      title: ui.siteTitle,
      description: ui.apps.text,
      siteName: ui.siteTitle,
      image: first && shareImage(first),
    }),
  };
}
