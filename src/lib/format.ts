/** Номер истории в книжном виде: 7 → "007". */
export function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

/** Секунды → "MM:SS"; неизвестное значение → "--:--". */
export function formatTime(sec: number | null | undefined): string {
  if (sec == null || !isFinite(sec) || sec < 0) return "--:--";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
