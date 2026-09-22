import languagesData from "@data/languages.json";
import type { Language } from "./types";

export const languages: Language[] = languagesData as Language[];

export const defaultLanguage: Language =
  languages.find((l) => l.default) ?? languages[0];

export function getLanguage(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}

export function isLanguage(code: string): boolean {
  return languages.some((l) => l.code === code);
}
