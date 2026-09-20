"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { LandingModel, MarkKind } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { Marks } from "@/components/primitives/Mark";
import styles from "./ProgramaDias.module.css";

type Props = {
  days: LandingModel["jornadas"]["program"]["days"];
  copy: LandingModel["copy"];
  markLabels: Record<MarkKind, string>;
  showMarks: boolean;
};

/**
 * The programme. From 760 px up it is the notebook spread of always: the two days side by side,
 * parted by a rule, and each one carrying its own heading.
 *
 * On a phone (below 760 px) the two days are a horizontal track that snaps, one day per view, and
 * the two labels sit above it: the one being read carries a thick terracotta line
 * (JIA-2026-09-20-49). The swipe is the platform's own scroll — no gesture handler of our own —
 * so the finger, the scrollbar, the arrow keys and a screen reader all move the same thing; the
 * component only reads back where the track is and lights the right label up.
 *
 * On the labels: they are buttons with `aria-controls` and `aria-current`, not a `tablist`. A tab
 * set hides the panels it is not showing, and here BOTH days stay reachable — a reader scrolls
 * through them, a finger drags to them — so saying "tab" would describe something the markup does
 * not do.
 */
export function ProgramaDias({ days, copy, markLabels, showMarks }: Props) {
  const trackRef = useRef<HTMLOListElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const baseId = useId();
  const panelId = (i: number) => `${baseId}-dia-${i}`;

  // Where the track is, is what the line follows. One day per view, so the page is the track's width.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const page = track.clientWidth;
    if (!page) return;
    const i = Math.round(track.scrollLeft / page);
    setActive((current) => (i !== current && i >= 0 && i < days.length ? i : current));
  }, [days.length]);

  // The track only scrolls on a phone; on a wide window scrollLeft stays 0 and this settles on the first day.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const handler = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        onScroll();
      });
    };
    track.addEventListener("scroll", handler, { passive: true });
    return () => {
      track.removeEventListener("scroll", handler);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [onScroll]);

  const goTo = useCallback((i: number, moveFocus = false) => {
    const track = trackRef.current;
    setActive(i);
    if (track && track.clientWidth) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: i * track.clientWidth, behavior: calm ? "auto" : "smooth" });
    }
    if (moveFocus) tabsRef.current[i]?.focus();
  }, []);

  return (
    <>
      {/* Only on a phone (the CSS hides it from 760 px up, where each day shows its own heading). */}
      <div className={styles.strip} role="group" aria-label={copy.jornadas.program.daysRegion}>
        {days.map((day, i) => (
          <button
            key={day.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            className={styles.tab}
            data-active={i === active ? "" : undefined}
            aria-controls={panelId(i)}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" && i < days.length - 1) {
                e.preventDefault();
                goTo(i + 1, true);
              } else if (e.key === "ArrowLeft" && i > 0) {
                e.preventDefault();
                goTo(i - 1, true);
              }
            }}
          >
            {day.label}
          </button>
        ))}
      </div>

      <ol ref={trackRef} className={styles.days}>
        {days.map((day, i) => (
          <li key={day.id} id={panelId(i)} className={styles.day}>
            <div className={styles.dayHead}>
              {/* The visible label on a phone is the one on the strip; this one is hidden there, visually only. */}
              <h4 className={`${styles.dayLabel} ${styles.panelLabel}`}>{day.label}</h4>
              <Marks marks={day.marks} labels={markLabels} show={showMarks} />
            </div>
            {day.dateText ? (
              <p className={styles.dayDate}>
                <time dateTime={day.dateIso ?? undefined}>{day.dateText}</time>
              </p>
            ) : (
              <p className={styles.dayDate}>{copy.states.dateTbc}</p>
            )}
            <dl className={styles.dayMeta}>
              <div>
                <dt>{copy.jornadas.program.venueLabel}</dt>
                <dd>{day.venue ?? copy.states.venueTbc}</dd>
              </div>
              <div>
                <dt>{copy.jornadas.program.hoursLabel}</dt>
                <dd>{day.hours.length ? day.hours.join(" · ") : copy.states.hoursTbc}</dd>
              </div>
              {day.map ? (
                <div>
                  <dt>{copy.jornadas.program.locationLabel}</dt>
                  <dd>
                    {/* A maps.app.goo.gl link: a new tab on a computer, the maps app on a phone. */}
                    <a href={day.map.href} className={styles.mapLink} target="_blank" rel="noopener noreferrer" aria-label={day.map.label} title={day.map.label}>
                      <ArrowIcon size={18} className={styles.mapArrow} />
                      <span>{copy.jornadas.program.directions}</span>
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            <ol className={styles.sessions}>
              {day.sessions.map((s) => (
                <li key={s.id} className={styles.session} data-unnumbered={s.numbered ? undefined : ""}>
                  {s.time ? <span className={styles.sessionTime}>{s.time}</span> : null}
                  <span className={styles.sessionText}>{s.text}</span>
                  {s.link ? (
                    <a href={s.link.href} className={styles.sessionLink}>
                      {s.link.label}
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
            {day.provenanceNote && showMarks ? <p className={styles.provenance}>{day.provenanceNote}</p> : null}
          </li>
        ))}
      </ol>
    </>
  );
}
