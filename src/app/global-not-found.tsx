import type { Metadata } from "next";
import Link from "next/link";
import { defaultLanguage } from "@/lib/languages";
import { getStories, imageSrc } from "@/lib/stories";
import { t, tr } from "@/lib/i18n";
import { JumpToNumber } from "@/components/jump-to-number";
import { StoryPlate } from "@/components/story-plate";
import { ThemeToggle } from "@/components/theme-toggle";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata: Metadata = {
  ...rootMetadata,
  title: t(defaultLanguage.code).notFoundKicker,
  robots: { index: false },
};
export const viewport = rootViewport;

// Единая 404 для любых неизвестных адресов: корневых layout-ов несколько,
// поэтому страница сама рисует документ целиком.
export default async function GlobalNotFound() {
  const lang = defaultLanguage.code;
  const ui = t(lang);
  const numbered = (await getStories(lang)).filter((s) => s.number > 0);
  const min = numbered[0]?.number ?? 1;
  const max = numbered[numbered.length - 1]?.number ?? 1;

  // Три случайные истории выбираются один раз при сборке — страница статическая.
  const picks = [...numbered].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <RootDocument language={defaultLanguage}>
      <header className="border-b bg-card">
        <div className="mx-auto flex h-[52px] max-w-[1280px] items-center justify-between gap-4 px-[18px] md:h-14 md:px-12">
          <Link href={`/${lang}/`} className="relative top-0.5 truncate rounded-md font-display text-[17px] font-medium md:text-[21px]">
            {ui.siteTitle}
          </Link>
          <ThemeToggle labels={ui.theme} variant="icon" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-[18px] py-12 md:py-20">
        <div className="flex flex-col items-start gap-[18px] rounded-card border bg-card md:rounded-lg px-6 py-8 md:px-9 md:py-10">
          <span className="tabular-nums text-[13px] tracking-[.12em] text-muted-foreground">
            {ui.notFoundKicker}
          </span>
          <h1 className="font-display text-[26px] leading-[1.15] md:text-[32px]">{ui.notFoundTitle}</h1>
          <p className="max-w-[46ch] font-serif text-base leading-[1.65] text-muted-foreground">
            {tr(ui.notFoundText, { max })}
          </p>
          <JumpToNumber
            id="jump-404"
            lang={lang}
            ids={Object.fromEntries(numbered.map((s) => [s.number, String(s.number)]))}
            min={min}
            max={max}
            variant="wide"
            labelClassName="sr-only"
            labels={{ input: ui.jumpLabel, go: ui.jumpGo, error: ui.jumpError }}
          />
          <ul className="mt-1 flex flex-wrap gap-2">
            {picks.map((s) => (
              <li key={s.id}>
                <Link href={`/${lang}/${s.number}/`} title={s.title} className="block w-24 rounded-[5px]">
                  <StoryPlate
                    src={imageSrc(s)}
                    alt={`${s.number}. ${s.title}`}
                    title={`${s.number}. ${s.title}`}
                    sizes="96px"
                    className="rounded-[5px] p-1 transition-shadow hover:shadow-plate"
                    frameClassName="rounded-[2px]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </RootDocument>
  );
}
