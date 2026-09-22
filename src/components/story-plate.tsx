import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Иллюстрация как печатная вставка: паспарту, тонкая рамка и зерно.
 * Картинки низкого разрешения, поэтому ширина плашки всегда ограничена
 * контейнером — на весь экран они не растягиваются.
 */
export function StoryPlate({
  src,
  alt,
  title,
  sizes,
  priority,
  badge,
  className,
  frameClassName,
  badgeClassName,
}: {
  src: string;
  alt: string;
  title?: string;
  sizes: string;
  priority?: boolean;
  badge?: string;
  className?: string;
  frameClassName?: string;
  badgeClassName?: string;
}) {
  return (
    <div className={cn("relative bg-plate", className)}>
      <div
        className={cn(
          "plate-frame relative aspect-video overflow-hidden rounded-[3px] border border-plate-edge",
          frameClassName
        )}
      >
        <Image src={src} alt={alt} title={title} fill sizes={sizes} priority={priority} className="plate-img object-cover" />
      </div>
      {badge && (
        <span
          className={cn(
            "absolute start-0 top-0 -translate-x-1.5 -translate-y-1.5 rounded bg-foreground px-[7px] py-[3px] tabular-nums text-xs text-background rtl:translate-x-1.5",
            badgeClassName
          )}
        >
          <span className="text-optical">{badge}</span>
        </span>
      )}
    </div>
  );
}
