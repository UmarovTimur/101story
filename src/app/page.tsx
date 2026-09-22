import type { Metadata } from "next";
import { defaultLanguage } from "@/lib/languages";
import { t } from "@/lib/i18n";
import { StoriesList } from "@/components/stories-page";

// Корень отдаёт язык по умолчанию сразу, без редиректа: то же содержимое,
// что и /<lang>/. Канонический адрес — языковой, чтобы поисковик не считал
// две страницы разными.
const lang = defaultLanguage.code;

export const metadata: Metadata = {
  title: t(lang).siteTitle,
  alternates: { canonical: `/${lang}/` },
};

export default function Home() {
  return (
    <div lang={lang} dir={defaultLanguage.dir} className="min-h-screen">
      <StoriesList lang={lang} />
    </div>
  );
}
