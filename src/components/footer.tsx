import type { Language } from "@/lib/types";
import { LanguageSwitcher } from "@/components/language-switcher";

/** Общий подвал: название сайта и выбор языка. */
export function Footer({
  languages,
  current,
  className,
}: {
  languages: Language[];
  current: string;
  className?: string;
}) {
  return (
    <footer data-nosnippet className={`border-t bg-card ${className ?? ""}`}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-[18px] py-6 md:px-12">
        <span className="font-display text-[13px] tracking-wide text-muted-foreground">101story.org</span>
        {languages.length > 1 && <LanguageSwitcher languages={languages} current={current} />}
      </div>
    </footer>
  );
}
