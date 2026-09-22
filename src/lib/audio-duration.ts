import { closeSync, fstatSync, openSync, readSync } from "node:fs";
import path from "node:path";

// Длительность mp3 считаем на этапе сборки по заголовку первого фрейма:
// Xing/Info-заголовок (VBR) или битрейт × размер файла (CBR).
// Только для серверных компонентов — модуль использует fs.

const BITRATES_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const BITRATES_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const SAMPLE_RATES = [44100, 48000, 32000];

const cache = new Map<string, number | null>();

/** Длительность аудио в секундах или null, если файла нет или он не разобран. */
export function audioDuration(lang: string, file: string): number | null {
  const p = path.join(process.cwd(), "public", "audio", lang, file);
  if (!cache.has(p)) {
    let seconds: number | null = null;
    try {
      seconds = parseMp3Duration(p);
    } catch {
      seconds = null;
    }
    cache.set(p, seconds);
  }
  return cache.get(p) ?? null;
}

function parseMp3Duration(file: string): number | null {
  const fd = openSync(file, "r");
  try {
    const size = fstatSync(fd).size;
    const head = Buffer.alloc(10);
    readSync(fd, head, 0, 10, 0);

    let offset = 0;
    if (head.toString("latin1", 0, 3) === "ID3") {
      const tagSize =
        ((head[6] & 0x7f) << 21) |
        ((head[7] & 0x7f) << 14) |
        ((head[8] & 0x7f) << 7) |
        (head[9] & 0x7f);
      offset = 10 + tagSize + (head[5] & 0x10 ? 10 : 0);
    }

    const buf = Buffer.alloc(64 * 1024);
    const read = readSync(fd, buf, 0, buf.length, offset);

    for (let i = 0; i + 4 <= read; i++) {
      if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) continue;
      const version = (buf[i + 1] >> 3) & 3; // 3 = MPEG1, 2 = MPEG2, 0 = MPEG2.5
      const layer = (buf[i + 1] >> 1) & 3; // 1 = Layer III
      const bitrateIdx = buf[i + 2] >> 4;
      const rateIdx = (buf[i + 2] >> 2) & 3;
      if (version === 1 || layer !== 1) continue;
      if (bitrateIdx === 0 || bitrateIdx === 15 || rateIdx === 3) continue;

      const mpeg1 = version === 3;
      const sampleRate = SAMPLE_RATES[rateIdx] / (mpeg1 ? 1 : version === 2 ? 2 : 4);
      const samplesPerFrame = mpeg1 ? 1152 : 576;
      const mono = buf[i + 3] >> 6 === 3;
      const sideInfo = mpeg1 ? (mono ? 17 : 32) : mono ? 9 : 17;

      const x = i + 4 + sideInfo;
      if (x + 12 <= read) {
        const tag = buf.toString("latin1", x, x + 4);
        if ((tag === "Xing" || tag === "Info") && buf[x + 7] & 1) {
          return (buf.readUInt32BE(x + 8) * samplesPerFrame) / sampleRate;
        }
      }

      const kbps = (mpeg1 ? BITRATES_V1 : BITRATES_V2)[bitrateIdx];
      return ((size - offset - i) * 8) / (kbps * 1000);
    }
    return null;
  } finally {
    closeSync(fd);
  }
}
