import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Нужно явно для output: "export" — иначе сборка считает маршрут динамическим.
export const dynamic = "force-static";

// ИИ-поисковикам и ассистентам тоже открываем всё: сайт ради того, чтобы истории нашли.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
