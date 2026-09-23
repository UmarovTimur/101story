// Пережимает аудио для веба: public/audio/<lang>/*.mp3 -> MP3 64 kbps моно (CBR).
// Для речи на слух разницы нет, а файлы в ~3 раза меньше, чем исходные 192 kbps стерео.
// Оригиналы переносятся в audio-original/<lang>/ (вне public, не в git) и не трогаются
// повторно: уже пережатые файлы (битрейт ≤ TARGET) пропускаются, так что скрипт можно
// запускать сколько угодно раз, например после добавления нового языка.
//
//   node scripts/transcode-audio.mjs          # все языки
//   node scripts/transcode-audio.mjs ru uz    # только перечисленные
import { execFile } from "node:child_process";
import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { availableParallelism } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const audioDir = path.join(root, "public/audio");
const backupDir = path.join(root, "audio-original");
const TARGET_KBPS = 64;
const JOBS = Math.max(1, availableParallelism());

const exists = (p) => stat(p).then(() => true, () => false);

async function bitrateKbps(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error", "-select_streams", "a:0",
    "-show_entries", "stream=bit_rate,channels", "-of", "json", file,
  ]);
  const stream = JSON.parse(stdout).streams?.[0] ?? {};
  return { kbps: Number(stream.bit_rate) / 1000, channels: Number(stream.channels) };
}

async function transcode(lang, file) {
  const src = path.join(audioDir, lang, file);
  const { kbps, channels } = await bitrateKbps(src);
  if (kbps <= TARGET_KBPS + 1 && channels === 1) return "skip";

  const backup = path.join(backupDir, lang, file);
  if (!(await exists(backup))) await rename(src, backup);

  const tmp = `${src}.tmp.mp3`;
  await run("ffmpeg", [
    "-v", "error", "-y", "-i", backup,
    "-map", "0:a:0", "-map_metadata", "-1",
    "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", `${TARGET_KBPS}k`,
    "-write_xing", "1", tmp,
  ]);
  await rename(tmp, src);
  return "done";
}

const langs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (await readdir(audioDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);

const queue = [];
for (const lang of langs) {
  await mkdir(path.join(backupDir, lang), { recursive: true });
  for (const file of await readdir(path.join(audioDir, lang))) {
    if (file.endsWith(".tmp.mp3")) await rm(path.join(audioDir, lang, file));
    else if (file.endsWith(".mp3")) queue.push([lang, file]);
  }
}

let done = 0;
let skipped = 0;
let failed = 0;
async function worker() {
  while (queue.length) {
    const [lang, file] = queue.shift();
    try {
      (await transcode(lang, file)) === "done" ? done++ : skipped++;
    } catch (e) {
      failed++;
      console.error(`audio: ${lang}/${file} failed: ${e.message}`);
    }
    if ((done + skipped + failed) % 100 === 0) console.log(`audio: ${done + skipped + failed} processed…`);
  }
}
await Promise.all(Array.from({ length: JOBS }, worker));
console.log(`audio: ${done} transcoded, ${skipped} already ok, ${failed} failed`);
if (failed) process.exitCode = 1;
