import Link from "next/link";
import { Play } from "lucide-react";
import type { Story } from "@/lib/types";
import { imageSrc } from "@/lib/stories";
import { formatTime, pad3 } from "@/lib/format";
import { StoryPlate } from "@/components/story-plate";
import { StoryStatus } from "@/components/progress-marks";

/**
 * Одна карточка для всех 102 историй.
 * Мобайл: строка, картинка слева во всю высоту карточки.
 * От sm: колонка, картинка в паспарту над текстом.
 */
export function StoryCard({
  lang,
  story,
  duration,
  labels,
}: {
  lang: string;
  story: Story;
  duration: number | null;
  labels: { done: string; bookmarked: string };
}) {
  return (
    <Link
      href={`/${lang}/${story.number}/`}
      className="group flex h-full min-h-[92px] items-stretch overflow-hidden rounded-card border bg-card shadow-paper transition-shadow hover:shadow-plate sm:min-h-0 sm:flex-col sm:gap-3 md:rounded-lg"
    >
      <StoryPlate
        src={imageSrc(story)}
        alt={story.title}
        title={story.title}
        sizes="(max-width: 640px) 132px, (max-width: 1024px) 50vw, 320px"
        badge={pad3(story.number)}
        className="w-[132px] flex-none sm:w-auto"
        frameClassName="aspect-auto h-full rounded-none border-0 sm:aspect-video sm:h-auto"
        // На мобайле угол карточки скруглён сильно (rounded-card) — номер
        // отодвинут от края и сам стал пилюлей, концентрично углу.
        badgeClassName="translate-x-2.5 translate-y-2.5 rounded-full px-2 py-0.5 text-[11px] rtl:-translate-x-2.5 sm:px-2.5 sm:py-[3px] sm:text-xs md:translate-x-2 md:translate-y-2 md:rounded md:px-[7px] md:rtl:-translate-x-2"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px] px-3 py-2.5 sm:justify-start sm:gap-[5px] sm:px-4 sm:pb-4 sm:pt-0">
        <h3 className="font-display text-[17px] font-medium leading-tight [text-wrap:pretty] sm:text-xl">
          {story.title}
        </h3>
        {story.reference && (
          <span className="line-clamp-2 text-xs text-muted-foreground sm:text-[12.5px]">
            {story.reference}
          </span>
        )}
        <div className="flex items-center gap-2 tabular-nums text-[11px] text-muted-foreground sm:mt-auto sm:pt-1 sm:text-[11.5px]">
          {duration != null && (
            <>
              <span className="grid size-[18px] flex-none place-items-center rounded-full border border-input text-primary">
                <Play className="size-2 fill-current" aria-hidden />
              </span>
              <span className="text-optical">{formatTime(duration)}</span>
            </>
          )}
          <StoryStatus lang={lang} id={story.id} labels={labels} />
        </div>
      </div>
    </Link>
  );
}
