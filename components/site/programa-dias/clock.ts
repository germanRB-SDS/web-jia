import type { DayModel } from "@/lib/content";

export type NowAt = { dayId: string; sessionId: string };

/**
 * The date ("2026-10-16") and the minutes from midnight at `date` in `timeZone`, whatever the visitor's own
 * zone is. Summer or winter time is the platform's business: Intl knows when Europe/Madrid changes.
 */
export function wallClock(date: Date, timeZone: string): { iso: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { iso: `${get("year")}-${get("month")}-${get("day")}`, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/** The session being held at `date` in `timeZone`: its day is today there and start ≤ now < end. Otherwise null. */
export function sessionAt(days: readonly DayModel[], date: Date, timeZone: string): NowAt | null {
  const { iso, minutes } = wallClock(date, timeZone);
  for (const day of days) {
    if (day.dateIso !== iso) continue;
    const session = day.sessions.find((s) => s.slot && s.slot.start <= minutes && minutes < s.slot.end);
    if (session) return { dayId: day.id, sessionId: session.id };
  }
  return null;
}
