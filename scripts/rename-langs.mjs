// Одноразовая миграция: исходная база использовала чужие ISO-коды для девяти языков
// (hz = гереро вместо таджикского и т.п.). Переименовывает data/<old>.json,
// public/audio/<old>/ и audio-original/<old>/, а в JSON — id и имена аудио (hz12 -> tg12).
// Коды в languages.json, stories.ts, i18n.ts и side-banner.ts правятся вручную.
import { readFile, rename, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const MAP = {
  hz: "tg",
  ms: "kmr",
  eu: "sah",
  ty: "tyv",
  ba: "ug",
  kr: "xal",
  tl: "kaa",
  gv: "sgh",
  gl: "pdt",
};

const exists = (p) => stat(p).then(() => true, () => false);
const swap = (s, from, to) => (s.startsWith(from) ? to + s.slice(from.length) : s);

for (const [from, to] of Object.entries(MAP)) {
  const src = path.join(root, "data", `${from}.json`);
  const dst = path.join(root, "data", `${to}.json`);
  if (await exists(src)) {
    const stories = JSON.parse(await readFile(src, "utf8"));
    for (const s of stories) {
      s.id = swap(s.id, from, to);
      s.audio = swap(s.audio, from, to);
    }
    await writeFile(dst, JSON.stringify(stories, null, 2) + "\n");
    await rm(src); // старая версия остаётся в истории git
  }

  for (const base of ["public/audio", "audio-original"]) {
    const dir = path.join(root, base, from);
    if (!(await exists(dir))) continue;
    for (const f of await readdir(dir)) {
      if (f.startsWith(from)) await rename(path.join(dir, f), path.join(dir, swap(f, from, to)));
    }
    await rename(dir, path.join(root, base, to));
  }
  console.log(`lang: ${from} -> ${to}`);
}
