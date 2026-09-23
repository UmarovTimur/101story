import { rootLlms } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return rootLlms();
}
