import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { availableLanguages } from "@/lib/stories";
import { getLanguage } from "@/lib/languages";
import { listMetadata } from "@/lib/seo";
import { StoriesList } from "@/components/stories-page";

export function generateStaticParams() {
  return availableLanguages().map((l) => ({ lang: l.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return listMetadata(lang);
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!getLanguage(lang)) notFound();
  return <StoriesList lang={lang} />;
}
