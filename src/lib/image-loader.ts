/**
 * Загрузчик для next/image в статическом экспорте: вместо оптимизации на лету
 * отдаёт заранее нарезанные WebP из /public/img/<ширина>/ (см. scripts/optimize-images.mjs).
 */
export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const m = src.match(/^\/images\/([^/]+)\.(?:jpe?g|png)$/i);
  return m ? `/img/${width}/${m[1]}.webp` : src;
}
