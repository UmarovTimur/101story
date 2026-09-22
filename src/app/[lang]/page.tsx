import { notFound } from "next/navigation";
import { availableLanguages } from "@/lib/stories";
import { getLanguage } from "@/lib/languages";
import { StoriesList } from "@/components/stories-page";

export function generateStaticParams() {
  return availableLanguages().map((l) => ({ lang: l.code }));
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
