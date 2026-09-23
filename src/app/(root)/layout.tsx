import type { Metadata } from "next";
import { defaultLanguage } from "@/lib/languages";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata: Metadata = rootMetadata;
export const viewport = rootViewport;

// Корень «/» показывает язык по умолчанию — у него свой корневой layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument language={defaultLanguage}>{children}</RootDocument>;
}
