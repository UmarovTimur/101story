// Эпохи — «оглавление книги» вместо фильтров. Диапазоны задаются номерами
// историй: порядок историй общий для всех языков (как и картинки).
// Названия эпох переводятся в i18n.ts.
export type EraKey = "beginnings" | "exodus" | "kings" | "gospel" | "church";

export interface Era {
  key: EraKey;
  from: number;
  to: number;
}

export const eras: Era[] = [
  { key: "beginnings", from: 1, to: 17 },
  { key: "exodus", from: 18, to: 30 },
  { key: "kings", from: 31, to: 49 },
  { key: "gospel", from: 50, to: 92 },
  { key: "church", from: 93, to: 101 },
];

/** id секции эпохи на странице списка (якорь для навигации). */
export function eraSectionId(key: string): string {
  return `era-${key}`;
}

/** Эпоха истории; у вступления (номер 0) эпохи нет. */
export function eraOf(number: number): Era | undefined {
  return eras.find((e) => number >= e.from && number <= e.to);
}
