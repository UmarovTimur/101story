import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { availableLanguages } from "@/lib/stories";
import { getLanguage } from "@/lib/languages";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata: Metadata = rootMetadata;
export const viewport = rootViewport;

// Других языков, кроме собранных, нет: неизвестный /xx/ сразу уходит в 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return availableLanguages().map((l) => ({ lang: l.code }));
}

// Корневой layout языка: у каждой языковой версии свой <html lang dir>.
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

  return <RootDocument language={language}>{children}</RootDocument>;
}
