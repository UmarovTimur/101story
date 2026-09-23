import type { MetadataRoute } from "next";
import { availableLanguages, getStories } from "@/lib/stories";
import { absoluteUrl, langTag } from "@/lib/site";
import { listPath, storyPath } from "@/lib/seo";

// Нужно явно для output: "export" — иначе сборка считает маршрут динамическим.
export const dynamic = "force-static";

/**
 * Статический sitemap.xml: при экспорте (output: "export") next пересчитывает
 * его на сборке и кладёт в out/sitemap.xml — без сервера на рантайме.
 * У каждой записи — hreflang-ссылки на ту же страницу в других языках.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = availableLanguages();
  const byLang = new Map(await Promise.all(languages.map(async (l) => [l.code, await getStories(l.code)] as const)));

  const listAlternates = Object.fromEntries(languages.map((l) => [langTag(l), absoluteUrl(listPath(l.code))]));
  const storyAlternates = (number: number) =>
    Object.fromEntries(
      languages
        .filter((l) => byLang.get(l.code)!.some((s) => s.number === number))
        .map((l) => [langTag(l), absoluteUrl(storyPath(l.code, { number }))])
    );

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of languages) {
    entries.push({
      url: absoluteUrl(listPath(lang.code)),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: listAlternates },
    });

    for (const story of byLang.get(lang.code)!) {
      entries.push({
        url: absoluteUrl(storyPath(lang.code, story)),
        changeFrequency: "monthly",
        // Вступление для родителей (номер 0) чуть менее приоритетно, чем сами истории.
        priority: story.number > 0 ? 0.8 : 0.5,
        alternates: { languages: storyAlternates(story.number) },
      });
    }
  }

  return entries;
}
