"use client";

import * as React from "react";
import { Bookmark, Check } from "lucide-react";
import { markDone, toggleBookmark, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** Метки «прочитано» и «закладка» на карточке истории. */
export function StoryStatus({
  lang,
  id,
  labels,
}: {
  lang: string;
  id: string;
  labels: { done: string; bookmarked: string };
}) {
  const { done, bookmarks } = useProgress(lang);
  const isDone = done.includes(id);
  const isBookmarked = bookmarks.includes(id);
  if (!isDone && !isBookmarked) return null;

  return (
    <span className="ms-auto flex items-center gap-2 text-accent">
      {isBookmarked && (
        <Bookmark className="size-3.5 fill-current" aria-label={labels.bookmarked} />
      )}
      {isDone && (
        <span className="inline-flex items-center gap-1">
          {labels.done}
          <Check className="size-3" aria-hidden />
        </span>
      )}
    </span>
  );
}

export function BookmarkButton({
  lang,
  id,
  labels,
}: {
  lang: string;
  id: string;
  labels: { add: string; remove: string };
}) {
  const { bookmarks } = useProgress(lang);
  const on = bookmarks.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(lang, id)}
      aria-pressed={on}
      className="inline-flex items-center gap-1.5 self-start rounded text-start text-primary underline decoration-accent/0 underline-offset-[3px] transition-colors hover:decoration-accent"
    >
      <Bookmark className={cn("size-3.5", on && "fill-accent text-accent")} aria-hidden />
      {on ? labels.remove : labels.add}
    </button>
  );
}

/** Невидимая отметка в конце текста: дочитали до неё — история «прочитана». */
export function ReadMarker({ lang, id }: { lang: string; id: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && window.scrollY > 0) {
        markDone(lang, id);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [lang, id]);

  return <div ref={ref} aria-hidden className="h-px" />;
}
