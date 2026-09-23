// Нарезает assets/images/*.jpg в WebP нужных ширин: public/img/<ширина>/<имя>.webp.
// Исходники лежат вне public, чтобы 50 МБ JPEG не попадали в out/ — сайт отдаёт только WebP.
// Ширины — те же, что у next/image (src/lib/image-widths.json). Картинки не увеличиваются:
// если оригинал уже исходной ширины, файл просто сохраняется в его размере.
// Уже готовые файлы, которые новее оригинала, пропускаются.
import { readFile, readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "assets/images");
const outDir = path.join(root, "public/img");
const { imageSizes, deviceSizes } = JSON.parse(
  await readFile(path.join(root, "src/lib/image-widths.json"), "utf8")
);
const widths = [...imageSizes, ...deviceSizes];
const QUALITY = 78;

const mtime = (p) => stat(p).then((s) => s.mtimeMs, () => 0);

const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
await Promise.all(widths.map((w) => mkdir(path.join(outDir, String(w)), { recursive: true })));

let made = 0;
let before = 0;
let after = 0;
for (const file of files) {
  const input = path.join(srcDir, file);
  const srcTime = await mtime(input);
  const name = file.replace(/\.[^.]+$/, ".webp");
  for (const w of widths) {
    const output = path.join(outDir, String(w), name);
    if ((await mtime(output)) > srcTime) continue;
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(output);
    made++;
  }
  before += (await stat(input)).size;
  after += (await stat(path.join(outDir, String(deviceSizes[2]), name))).size;
}

// Скриншоты приложения для промо-блока: показываются шириной ~100px, храним в 3x.
const promoSrc = path.join(srcDir, "promo");
const promoOut = path.join(outDir, "promo");
const PROMO_WIDTH = 300;
const promo = await readdir(promoSrc).then((l) => l.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)), () => []);
await mkdir(promoOut, { recursive: true });
for (const file of promo) {
  const input = path.join(promoSrc, file);
  const output = path.join(promoOut, file.replace(/\.[^.]+$/, ".webp"));
  if ((await mtime(output)) > (await mtime(input))) continue;
  await sharp(input).resize({ width: PROMO_WIDTH, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(output);
  made++;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `images: ${files.length} originals, ${made} webp written; ` +
    `${mb(before)} MB jpg -> ${mb(after)} MB at ${deviceSizes[2]}px`
);
