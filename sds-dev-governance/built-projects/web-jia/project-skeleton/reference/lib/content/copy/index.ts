import type { Copy } from "./types";

/** Fills `{name}` placeholders. The only formatting the copy layer needs. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}

export type { Copy };
export type { Buttons, WorkshopCopy, ExperienceCopy, ResourceCopy } from "./types";
