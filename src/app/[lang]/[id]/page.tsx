import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Story } from "@/lib/types";
import { availableLanguages, getStories, audioSrc, imageSrc } from "@/lib/stories";
import { audioDuration } from "@/lib/audio-duration";
import { getLanguage } from "@/lib/languages";
import { eraOf } from "@/lib/eras";
import { t, tr } from "@/lib/i18n";
import { formatTime, pad3 } from "@/lib/format";
import imageLoader from "@/lib/image-loader";
import { absoluteUrl, langTag } from "@/lib/site";
import { describe, isoDuration, languageAlternates, listPath, shareImage, socialMeta, storyPath } from "@/lib/seo";
import { StoryPlate } from "@/components/story-plate";
import { AudioDock, AudioPanel, StoryAudioProvider, StoryText } from "@/components/story-audio";
import { BookmarkButton, ReadMarker } from "@/components/progress-marks";
import { TextSizeToggle } from "@/components/text-size-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StickyHeader } from "@/components/sticky-header";
import { AppPromoCompact } from "@/components/app-promo";
import { MediaBanners } from "@/components/media-banners";
import { StoryNumberJump } from "@/components/story-number-jump";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

const WORDS_PER_MINUTE = 160;

export async function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  for (const l of availableLanguages()) {
    const stories = await getStories(l.code);
    for (const s of stories) params.push({ lang: l.code, id: String(s.number) });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const story = (await getStories(lang)).find((s) => String(s.number) === id);
  if (!story) return {};
  const ui = t(lang);
  const title = `${story.number > 0 ? `${story.number}. ` : ""}${story.title} — ${ui.siteTitle}`;
  const description = describe(story.paragraphs);
  const url = absoluteUrl(storyPath(lang, story));
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: await languageAlternates((code, stories) =>
        stories.some((s) => s.number === story.number) ? storyPath(code, story) : null
      ),
    },
    ...socialMeta({ lang, url, title, description, siteName: ui.siteTitle, image: shareImage(story), type: "article" }),
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!getLanguage(lang)) notFound();
  const languages = availableLanguages();
  const stories = await getStories(lang);
  const idx = stories.findIndex((s) => String(s.number) === id);
  const story = stories[idx];
  if (!story) notFound();

  const ui = t(lang);
  const prev: Story | undefined = stories[idx - 1];
  const next: Story | undefined = stories[idx + 1];
  const lastNumber = stories[stories.length - 1].number;
  const numberLabel = (s: Story) => (s.number > 0 ? pad3(s.number) : ui.preface);
  const era = eraOf(story.number);
  const eraStories = era ? stories.filter((s) => s.number >= era.from && s.number <= era.to) : [];
  const start = Math.max(0, eraStories.findIndex((s) => s.id === story.id) - 1);
  const nearby = eraStories.slice(start, start + 4);

  const duration = audioDuration(lang, story.audio);
  const words = story.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  const fullTitle = story.number > 0 ? `${story.number}. ${story.title}` : story.title;

  // Структурированные данные: поисковикам и ИИ-ассистентам проще понять, что
  // это пересказ библейского отрывка с аудиоверсией и где он в сборнике.
  const url = absoluteUrl(storyPath(lang, story));
  const inLanguage = langTag(getLanguage(lang)!);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#story`,
        headline: story.title,
        name: fullTitle,
        description: describe(story.paragraphs, 300),
        inLanguage,
        url,
        mainEntityOfPage: url,
        image: shareImage(story),
        wordCount: words,
        timeRequired: isoDuration(readingMinutes * 60),
        ...(story.reference && { citation: story.reference }),
        ...(era && { articleSection: ui.eras[era.key].title }),
        ...(story.number > 0 && { position: story.number }),
        isPartOf: { "@type": "CreativeWorkSeries", name: ui.siteTitle, url: absoluteUrl(listPath(lang)) },
        audio: {
          "@type": "AudioObject",
          name: fullTitle,
          contentUrl: absoluteUrl(audioSrc(lang, story)),
          encodingFormat: "audio/mpeg",
          inLanguage,
          ...(duration != null && { duration: isoDuration(duration) }),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.siteTitle, item: absoluteUrl(listPath(lang)) },
          { "@type": "ListItem", position: 2, name: fullTitle, item: url },
        ],
      },
    ],
  };

  return (
    <StoryAudioProvider
      src={audioSrc(lang, story)}
      lang={lang}
      storyId={story.id}
      title={fullTitle}
      artist={ui.siteTitle}
      artwork={imageLoader({ src: imageSrc(story), width: 640 })}
      initialDuration={duration}
      labels={ui.player}
    >
      <JsonLd data={jsonLd} />
      <StickyHeader>
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-3 px-2.5 text-[13px] text-muted-foreground md:h-14 md:px-12 md:text-sm">
          <Link
            href={`/${lang}/`}
            aria-label={ui.allStories}
            title={ui.allStories}
            className="grid size-10 flex-none place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-end">
            <StoryNumberJump
              lang={lang}
              label={story.title}
              shortLabel={`${numberLabel(story)} / ${pad3(lastNumber)}`}
              current={story.number}
              items={stories.map((s) => ({ number: s.number, title: s.title }))}
              className="text-[13px] md:text-sm"
            />
          </div>
          <div className="flex flex-none items-center gap-2">
            <LanguageSwitcher languages={languages} current={lang} variant="header" label={ui.language} />
            <TextSizeToggle label={ui.textSize} className="size-10 rounded-full border border-input px-0" />
            <ThemeToggle labels={ui.theme} variant="icon" className="size-10" />
          </div>
        </div>
      </StickyHeader>

      <div className="mx-auto grid max-w-[1120px] gap-14 px-[18px] pb-10 pt-[var(--bar-gap)] md:px-12 md:pt-[52px] lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="mx-auto flex w-full min-w-0 max-w-[680px] flex-col gap-4 md:gap-8 lg:mx-0">
          <StoryPlate
            src={imageSrc(story)}
            alt={story.title}
            title={story.title}
            sizes="(max-width: 768px) 100vw, 680px"
            priority
            className="-mx-[18px] rounded-none p-0 shadow-none md:mx-0 md:rounded-lg md:p-3.5 md:shadow-plate"
            frameClassName="rounded-none border-0 md:rounded-[3px] md:border md:border-plate-edge"
          />

          <div className="flex flex-col gap-1.5 md:gap-2.5">
            <h1 className="font-display text-[29px] font-medium leading-[1.15] [text-wrap:balance] md:text-[46px] md:leading-[1.08] md:tracking-[-.01em]">
              {story.title}
            </h1>
            {story.reference && (
              <p className="text-[13px] text-muted-foreground md:text-[14.5px] md:text-primary">
                {story.reference}
              </p>
            )}
          </div>

          <AudioPanel />

          <StoryText paragraphs={story.paragraphs} />
          <ReadMarker lang={lang} id={story.id} />

          {story.questions.length > 0 && (
            <section
              aria-labelledby="questions-title"
              className="flex flex-col gap-4 rounded-card border bg-card px-[18px] py-5 md:rounded-lg md:px-7 md:py-[26px]"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 id="questions-title" className="font-display text-xl md:text-2xl">
                  {ui.questionsTitle}
                </h2>
                <span className="tabular-nums text-[11.5px] text-muted-foreground">
                  {tr(ui.questionCount, { n: story.questions.length })}
                </span>
              </div>
              <ol className="story-text flex flex-col gap-3">
                {story.questions.map((q, i) => (
                  <li key={i} className="flex items-baseline gap-3.5 border-t border-border/70 pt-3">
                    <span aria-hidden className="flex-none tabular-nums text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p>{q}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* На узком экране карточки в одну колонку: в двух на 390px заголовку
              остаётся ~75px и он ломается в столбик вплотную к картинке. */}
          <nav data-nosnippet aria-label={`${ui.previous} / ${ui.next}`} className="grid gap-3 sm:grid-cols-2 md:gap-4">
            {prev ? (
              <Link
                href={`/${lang}/${prev.number}/`}
                className="flex flex-row-reverse items-start justify-between gap-4 rounded-card border bg-card p-3 transition-shadow hover:shadow-plate md:gap-3.5 md:rounded-lg md:p-3"
              >
                <StoryPlate
                  src={imageSrc(prev)}
                  alt={prev.title}
                  title={prev.title}
                  sizes="84px"
                  className="w-[56px] flex-none rounded-[8px] md:w-[72px] md:rounded-md"
                  frameClassName="rounded-[7px] md:rounded-sm"
                />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="inline-flex items-center gap-1 tabular-nums text-[11.5px] text-muted-foreground">
                    <ArrowLeft className="size-3 rtl:rotate-180" aria-hidden />
                    <span className="sr-only">{ui.previous}: </span>
                    <span className="text-optical">{numberLabel(prev)}</span>
                  </span>
                  <span className="line-clamp-3 font-display text-[15px] leading-tight md:line-clamp-2 md:text-xl">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={`/${lang}/${next.number}/`}
                className="flex items-start justify-between gap-4 rounded-card border bg-card p-3 text-end transition-shadow hover:shadow-plate md:gap-3.5 md:rounded-lg md:p-3"
              >
                <StoryPlate
                  src={imageSrc(next)}
                  alt={next.title}
                  title={next.title}
                  sizes="84px"
                  className="w-[56px] flex-none rounded-[8px] md:w-[72px] md:rounded-md"
                  frameClassName="rounded-[7px] md:rounded-sm"
                />
                <span className="flex min-w-0 flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 tabular-nums text-[11.5px] text-muted-foreground">
                    <span className="sr-only">{ui.next}: </span>
                    <span className="text-optical">{numberLabel(next)}</span>
                    <ArrowRight className="size-3 rtl:rotate-180" aria-hidden />
                  </span>
                  <span className="line-clamp-3 font-display text-[15px] leading-tight md:line-clamp-2 md:text-xl">
                    {next.title}
                  </span>
                </span>
              </Link>
            )}
          </nav>

          {/* На lg+ баннер уже есть в aside — здесь показываем только на мобильных/планшетах, в самом конце. */}
          <div data-nosnippet className="lg:hidden">
            <MediaBanners lang={lang} watchMoviesLabel={ui.watchMovies} />
          </div>
        </article>

        {/* Отступ сверху учитывает прилипшую шапку (57px) — иначе она наезжает. */}
        <aside data-nosnippet className="sticky top-[73px] hidden flex-col gap-[22px] self-start text-[13.5px] text-muted-foreground lg:flex">
          {nearby.length > 0 && (
            <nav aria-labelledby="nearby-title" className="flex flex-col gap-2 border-s-2 ps-3.5">
              <span id="nearby-title" className="text-[11px] uppercase tracking-[.16em]">
                {ui.inThisSection}
              </span>
              {nearby.map((s) =>
                s.id === story.id ? (
                  <span key={s.id} aria-current="page" className="font-medium text-foreground">
                    {s.number}. {s.title}
                  </span>
                ) : (
                  <Link key={s.id} href={`/${lang}/${s.number}/`} className="rounded transition-colors hover:text-foreground">
                    {s.number}. {s.title}
                  </Link>
                )
              )}
            </nav>
          )}
          <div className="flex flex-col gap-2 border-s-2 ps-3.5">
            <span className="text-[11px] uppercase tracking-[.16em]">{ui.pageInfo}</span>
            <span>
              {duration != null && `${ui.audio} ${formatTime(duration)} · `}
              {tr(ui.paragraphCount, { n: story.paragraphs.length })}
            </span>
            <span>{tr(ui.readingTime, { n: readingMinutes })}</span>
            <BookmarkButton
              lang={lang}
              id={story.id}
              labels={{ add: ui.addBookmark, remove: ui.removeBookmark }}
            />
          </div>
          <AppPromoCompact labels={{ title: ui.apps.title, text: ui.apps.text, download: ui.apps.download }} />
          <MediaBanners lang={lang} watchMoviesLabel={ui.watchMovies} />
        </aside>
      </div>

      <Footer languages={languages} current={lang} className="pb-32" />

      <AudioDock title={fullTitle} image={imageSrc(story)} />
    </StoryAudioProvider>
  );
}
