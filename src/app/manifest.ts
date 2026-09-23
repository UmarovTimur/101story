import type { MetadataRoute } from "next";
import { defaultLanguage } from "@/lib/languages";
import { t } from "@/lib/i18n";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const ui = t(defaultLanguage.code);
  return {
    name: ui.siteTitle,
    short_name: ui.siteTitle,
    description: ui.apps.text,
    start_url: `/${defaultLanguage.code}/`,
    display: "standalone",
    background_color: "#f9f5eb",
    theme_color: "#f9f5eb",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
