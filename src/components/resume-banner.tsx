"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { formatTime } from "@/lib/format";
import { Button } from "@/components/ui/button";

export interface ResumeStory {
  id: string;
  number: number;
  title: string;
  image: string;
  duration: number | null;
}

/** «Закладка вместо аккаунта»: последняя открытая история и позиция аудио. */
export function ResumeBanner({
  lang,
  stories,
  labels,
}: {
  lang: string;
  stories: ResumeStory[];
  labels: { resume: string; action: string };
}) {
  const { last } = useProgress(lang);
  const story = last && stories.find((s) => s.id === last.id);
  if (!last || !story) return null;

  const href = `/${lang}/${story.number}/`;
  const title = story.number > 0 ? `${story.number}. ${story.title}` : story.title;

  return (
    <>
      <div className="hidden items-center gap-5 rounded-lg border border-l-[3px] border-l-accent bg-card py-3.5 pe-[18px] ps-4 md:flex rtl:border-l rtl:border-r-[3px] rtl:border-r-accent">
        <div className="relative aspect-video w-[84px] flex-none overflow-hidden rounded bg-plate">
          <Image src={story.image} alt={title} title={title} fill sizes="84px" className="plate-img object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="text-[11px] uppercase tracking-[.14em] text-muted-foreground">
            {labels.resume}
          </span>
          <span className="truncate font-display text-[19px]">{title}</span>
        </div>
        <span className="flex-none tabular-nums text-xs text-muted-foreground">
          {formatTime(last.t)} / {formatTime(last.d ?? story.duration)}
        </span>
        {/* В тёмной теме primary — светло-серый, поэтому берём красный accent. */}
        <Button asChild size="sm" className="dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90">
          <Link href={href}>
            <span className="text-optical">{labels.action}</span>
          </Link>
        </Button>
      </div>

      <Link
        href={href}
        className="flex items-center gap-3 rounded-card border bg-card py-2.5 pe-3 ps-4 md:hidden"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">
            {labels.action}
          </span>
          <span className="truncate font-display text-base">{title}</span>
        </span>
        <span className="grid size-11 flex-none place-items-center rounded-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground">
          <Play className="size-4 fill-current" aria-hidden />
        </span>
      </Link>
    </>
  );
}
