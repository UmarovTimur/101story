import type { NextConfig } from "next";
import widths from "./src/lib/image-widths.json";

const nextConfig: NextConfig = {
  // Полностью статическая сборка (SSG / static export) -> папка ./out
  output: "export",
  trailingSlash: true,
  // Корневых layout-ов несколько (у каждого языка свой <html lang>), поэтому
  // общая 404 — app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  images: {
    // В статическом экспорте на лету оптимизировать нельзя: WebP нарезаются
    // заранее (npm run images), а загрузчик подставляет нужную ширину в srcset.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    imageSizes: widths.imageSizes,
    deviceSizes: widths.deviceSizes,
  },
};

export default nextConfig;
