import { availableLanguages } from "@/lib/stories";
import { langLlms } from "@/lib/llms";

export const dynamic = "force-static";

export function generateStaticParams() {
  return availableLanguages().map((l) => ({ lang: l.code }));
}

export async function GET(_: Request, { params }: { params: Promise<{ lang: string }> }) {
  return langLlms((await params).lang);
}
