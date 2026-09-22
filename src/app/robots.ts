import type { MetadataRoute } from "next";

const siteUrl = (process.env.SITE_URL ?? "https://example.com").replace(/\/+$/, "");

// Нужно явно для output: "export" — иначе сборка считает маршрут динамическим.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
