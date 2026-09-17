import { languageEs } from "./language-es";
import type { Language } from "./types";

/**
 * THE LANGUAGE REGISTRY. Adding a language = write `language-<xx>.ts`, write
 * `../copy/<xx>/index.ts`, register both here and in `../copy/dictionaries.ts`.
 * No selector is rendered while only one language exists (brief §10.3).
 */
export const LANGUAGES = [languageEs] as const;
export type Locale = (typeof LANGUAGES)[number]["code"];
export const LOCALES = LANGUAGES.map((l) => l.code) as readonly Locale[];
export const LANGUAGE_BY_CODE = Object.fromEntries(LANGUAGES.map((l) => [l.code, l])) as Record<Locale, Language>;
export const DEFAULT_LOCALE: Locale = (LANGUAGES.find((l) => l.fallback) ?? LANGUAGES[0]).code;
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
export type { Language };
