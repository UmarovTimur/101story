import type { Story } from "./types";
import { languages } from "./languages";

// Статически подгружаем JSON каждого языка на этапе сборки.
// При добавлении языка достаточно положить data/<code>.json и запись в
// data/languages.json — маршруты и списки соберутся автоматически.
const loaders: Record<string, () => Promise<{ default: Story[] }>> = {
  uz: () => import("@data/uz.json") as Promise<{ default: Story[] }>,
  ru: () => import("@data/ru.json") as Promise<{ default: Story[] }>,
  az: () => import("@data/az.json") as Promise<{ default: Story[] }>,
  kk: () => import("@data/kk.json") as Promise<{ default: Story[] }>,
  ky: () => import("@data/ky.json") as Promise<{ default: Story[] }>,
  tg: () => import("@data/tg.json") as Promise<{ default: Story[] }>,
  uk: () => import("@data/uk.json") as Promise<{ default: Story[] }>,
  hy: () => import("@data/hy.json") as Promise<{ default: Story[] }>,
  ka: () => import("@data/ka.json") as Promise<{ default: Story[] }>,
  tr: () => import("@data/tr.json") as Promise<{ default: Story[] }>,
  de: () => import("@data/de.json") as Promise<{ default: Story[] }>,
  es: () => import("@data/es.json") as Promise<{ default: Story[] }>,
  fa: () => import("@data/fa.json") as Promise<{ default: Story[] }>,
  ro: () => import("@data/ro.json") as Promise<{ default: Story[] }>,
  kmr: () => import("@data/kmr.json") as Promise<{ default: Story[] }>,
  mn: () => import("@data/mn.json") as Promise<{ default: Story[] }>,
  sah: () => import("@data/sah.json") as Promise<{ default: Story[] }>,
  tyv: () => import("@data/tyv.json") as Promise<{ default: Story[] }>,
  ug: () => import("@data/ug.json") as Promise<{ default: Story[] }>,
  xal: () => import("@data/xal.json") as Promise<{ default: Story[] }>,
  kaa: () => import("@data/kaa.json") as Promise<{ default: Story[] }>,
  sgh: () => import("@data/sgh.json") as Promise<{ default: Story[] }>,
  pdt: () => import("@data/pdt.json") as Promise<{ default: Story[] }>,
};

export async function getStories(lang: string): Promise<Story[]> {
  const load = loaders[lang];
  if (!load) return [];
  const mod = await load();
  return [...mod.default]
    .sort((a, b) => a.number - b.number)
    .map((s) => ({
      ...s,
      // В исходной базе в reference местами попал URL аудио вместо ссылки на Библию.
      reference: /^https?:\/\//.test(s.reference) ? "" : s.reference,
    }));
}

export async function getStory(
  lang: string,
  id: string
): Promise<Story | undefined> {
  const stories = await getStories(lang);
  return stories.find((s) => s.id === id);
}

export function audioSrc(lang: string, story: Story): string {
  return `/audio/${lang}/${story.audio}`;
}

export function imageSrc(story: Story): string {
  return `/images/${story.image}`;
}

/** Языки, для которых реально есть загрузчик данных. */
export function availableLanguages() {
  return languages.filter((l) => l.code in loaders);
}
