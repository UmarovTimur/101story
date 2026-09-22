import type { MetadataRoute } from "next";
import { availableLanguages, getStories } from "@/lib/stories";

// Домен сайта. Пока не привязан домен — плейсхолдер; при выпуске задайте
// SITE_URL в окружении сборки (например SITE_URL=https://example.com npm run build).
const siteUrl = (process.env.SITE_URL ?? "https://example.com").replace(/\/+$/, "");

// Нужно явно для output: "export" — иначе сборка считает маршрут динамическим.
export const dynamic = "force-static";

/**
 * Статический sitemap.xml: при экспорте (output: "export") next пересчитывает
 * его на сборке и кладёт в out/sitemap.xml — без сервера на рантайме.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of availableLanguages()) {
    entries.push({
      url: `${siteUrl}/${lang.code}/`,
      changeFrequency: "weekly",
      priority: 1,
    });

    const stories = await getStories(lang.code);
    for (const story of stories) {
      entries.push({
        url: `${siteUrl}/${lang.code}/${story.number}/`,
        changeFrequency: "monthly",
        // Вступление для родителей (uz0) чуть менее приоритетно, чем сами истории.
        priority: story.number > 0 ? 0.8 : 0.5,
      });
    }
  }

  return entries;
}
