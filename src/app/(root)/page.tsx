import type { Metadata } from "next";
import { defaultLanguage } from "@/lib/languages";
import { listMetadata } from "@/lib/seo";
import { StoriesList } from "@/components/stories-page";

// Корень отдаёт язык по умолчанию сразу, без редиректа: то же содержимое,
// что и /<lang>/. Канонический адрес — языковой, чтобы поисковик не считал
// две страницы разными.
const lang = defaultLanguage.code;

export function generateMetadata(): Promise<Metadata> {
  return listMetadata(lang);
}

export default function Home() {
  return <StoriesList lang={lang} />;
}
