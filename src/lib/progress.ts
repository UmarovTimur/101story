import * as React from "react";

// Прогресс чтения живёт только в localStorage (сайт статический, без аккаунтов):
// прочитанные истории, закладки, позиция аудио и «где мы остановились».

export interface ProgressState {
  done: string[];
  bookmarks: string[];
  last: { id: string; t: number; d: number | null } | null;
  positions: Record<string, number>;
}

const EMPTY: ProgressState = { done: [], bookmarks: [], last: null, positions: {} };
const CHANGE_EVENT = "bs:progress";

const storageKey = (lang: string) => `bs:progress:${lang}`;
const cache = new Map<string, { raw: string | null; value: ProgressState }>();

export function getProgress(lang: string): ProgressState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey(lang));
  } catch {
    // localStorage недоступен (приватный режим и т.п.)
  }
  const hit = cache.get(lang);
  if (hit && hit.raw === raw) return hit.value;
  let value = EMPTY;
  if (raw) {
    try {
      value = { ...EMPTY, ...JSON.parse(raw) };
    } catch {
      value = EMPTY;
    }
  }
  cache.set(lang, { raw, value });
  return value;
}

function update(lang: string, fn: (s: ProgressState) => ProgressState) {
  const next = fn(getProgress(lang));
  try {
    localStorage.setItem(storageKey(lang), JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useProgress(lang: string): ProgressState {
  return React.useSyncExternalStore(
    subscribe,
    () => getProgress(lang),
    () => EMPTY
  );
}

export function markDone(lang: string, id: string) {
  update(lang, (s) => (s.done.includes(id) ? s : { ...s, done: [...s.done, id] }));
}

export function toggleBookmark(lang: string, id: string) {
  update(lang, (s) => ({
    ...s,
    bookmarks: s.bookmarks.includes(id)
      ? s.bookmarks.filter((b) => b !== id)
      : [...s.bookmarks, id],
  }));
}

export function savePosition(lang: string, id: string, t: number, d: number | null) {
  update(lang, (s) => ({
    ...s,
    last: { id, t, d },
    positions: { ...s.positions, [id]: t },
  }));
}
