import type { Locale } from "../languages";
import type { Copy } from "./types";
import { dictionaryEs } from "./es";

/** Register one dictionary per language declared in ../languages. */
const DICTIONARIES: Record<Locale, Copy> = { es: dictionaryEs };

export function getDictionary(locale: Locale): Copy {
  return DICTIONARIES[locale];
}
