import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { availableLanguages, getStories, imageSrc } from "@/lib/stories";
import { audioDuration } from "@/lib/audio-duration";
import { eraSectionId, eras } from "@/lib/eras";
import { t, tr } from "@/lib/i18n";
import { EraChips, ListSidebar } from "@/components/list-navigation";
import { StickyHeader } from "@/components/sticky-header";
import { AppPromo } from "@/components/app-promo";
import { SideBanner } from "@/components/side-banner";
import { MediaBanners } from "@/components/media-banners";
import { ResumeBanner } from "@/components/resume-banner";
import { StoryCard } from "@/components/story-card";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { JsonLd } from "@/components/json-ld";
import { getLanguage } from "@/lib/languages";
import { absoluteUrl, langTag } from "@/lib/site";
import { listPath, storyPath } from "@/lib/seo";

/**
 * Список историй одного языка. Общий для маршрута /<lang>/ и для корня «/»,
 * который отдаёт язык по умолчанию сразу, без редиректа.
 */
export async function StoriesList({ lang }: { lang: string }) {
  const ui = t(lang);
  const languages = availableLanguages();

  const stories = await getStories(lang);
  const preface = stories.find((s) => s.number === 0);
  const numbered = stories.filter((s) => s.number > 0);
  const min = numbered[0]?.number ?? 1;
  const max = numbered[numbered.length - 1]?.number ?? 1;
  const durations = new Map(stories.map((s) => [s.id, audioDuration(lang, s.audio)]));

  const groups = eras
    .map((era) => ({
      ...era,
      ...ui.eras[era.key],
      stories: numbered.filter((s) => s.number >= era.from && s.number <= era.to),
    }))
    .filter((g) => g.stories.length > 0);
  const navItems = groups.map(({ key, title, short, from, to }) => ({ key, title, short, from, to }));
  const cardLabels = { done: ui.done, bookmarked: ui.bookmarked };

  const url = absoluteUrl(listPath(lang));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    url,
    name: ui.siteTitle,
    description: ui.apps.text,
    inLanguage: langTag(getLanguage(lang)!),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stories.length,
      itemListElement: stories.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.number > 0 ? `${s.number}. ${s.title}` : s.title,
        url: absoluteUrl(storyPath(lang, s)),
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <StickyHeader>
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 ps-5 pe-2.5 md:h-14 md:px-12">
          <Link href={`/${lang}/`} className="relative top-0.5 flex min-w-0 items-baseline gap-3.5 rounded-md">
            <h1 className="truncate font-display text-[17px] font-medium md:text-[21px]">
              {ui.siteTitle}
            </h1>
            <span className="hidden flex-none tabular-nums text-xs text-muted-foreground sm:inline">
              {tr(ui.storyCount, { n: numbered.length })}
            </span>
          </Link>
          <ThemeToggle labels={ui.theme} variant="icon" className="size-10 flex-none" />
        </div>
      </StickyHeader>

      <EraChips eras={navItems} label={ui.erasLabel} />

      <div className="mx-auto grid max-w-[1280px] gap-11 px-[18px] pb-10 pt-3.5 md:grid-cols-[224px_minmax(0,1fr)] md:px-12 md:pb-[52px] md:pt-11">
        <ListSidebar
          lang={lang}
          eras={navItems}
          jumpIds={Object.fromEntries(numbered.map((s) => [s.number, String(s.number)]))}
          min={min}
          max={max}
          readIds={numbered.map((s) => s.id)}
          labels={{
            eras: ui.erasLabel,
            jump: ui.jumpLabel,
            jumpHint: ui.jumpHint,
            jumpError: ui.jumpError,
            jumpGo: ui.jumpGo,
            read: ui.readLabel,
            watchMovies: ui.watchMovies,
          }}
        />

        <main className="flex min-w-0 flex-col gap-3 md:gap-[26px]">
          <AppPromo labels={ui.apps} />

          {/* На md+ баннеры уже есть в сайдбаре — здесь показываем только на мобильных. */}
          <div className="flex flex-col gap-2.5 md:hidden">
            <SideBanner lang={lang} />
            <MediaBanners lang={lang} watchMoviesLabel={ui.watchMovies} />
          </div>

          <ResumeBanner
            lang={lang}
            stories={stories.map((s) => ({
              id: s.id,
              number: s.number,
              title: s.title,
              image: imageSrc(s),
              duration: durations.get(s.id) ?? null,
            }))}
            labels={{ resume: ui.resumeLabel, action: ui.resumeAction }}
          />

          {preface && (
            <Link
              href={`/${lang}/${preface.number}/`}
              className="flex items-baseline gap-3 rounded-card border border-dashed md:rounded-lg border-input bg-card/60 px-4 py-3 transition-colors hover:bg-card"
            >
              <span className="text-optical relative top-[0.25em] flex-none text-[11px] uppercase tracking-[.14em] text-muted-foreground">
                {ui.preface}
              </span>
              <span className="text-optical min-w-0 truncate font-display text-base">{preface.title}</span>
              <ArrowRight className="ms-auto size-4 flex-none self-center text-muted-foreground rtl:rotate-180" aria-hidden />
            </Link>
          )}

          {groups.map((g) => (
            <section
              key={g.key}
              id={eraSectionId(g.key)}
              aria-labelledby={`${eraSectionId(g.key)}-title`}
              className="flex scroll-mt-[72px] flex-col gap-3 pt-4 md:scroll-mt-6 md:gap-[26px] md:pt-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b pb-2.5">
                <h2 id={`${eraSectionId(g.key)}-title`} className="font-display text-xl md:text-[26px]">
                  {g.title}
                </h2>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {tr(ui.storyCount, { n: g.stories.length })} · {g.books}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {g.stories.map((s) => (
                  <li key={s.id}>
                    <StoryCard
                      lang={lang}
                      story={s}
                      duration={durations.get(s.id) ?? null}
                      labels={cardLabels}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>

      <Footer languages={languages} current={lang} />
    </>
  );
}
