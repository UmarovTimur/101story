import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { availableLanguages } from "@/lib/stories";
import { getLanguage } from "@/lib/languages";
import { t } from "@/lib/i18n";

export function generateStaticParams() {
  return availableLanguages().map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return { title: t(lang).siteTitle };
}

// Шапки у списка и у страницы истории разные, поэтому их рисуют сами страницы.
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = getLanguage(lang);
  if (!language) notFound();

  return (
    <div lang={language.code} dir={language.dir} className="min-h-screen">
      {children}
    </div>
  );
}
