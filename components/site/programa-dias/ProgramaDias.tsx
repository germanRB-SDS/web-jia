"use client";

import { isMotionReduced } from "@/lib/motion/policy";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { LandingModel, MarkKind, ProgramClock } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { Marks } from "@/components/primitives/Mark";
import { sessionAt, type NowAt } from "./clock";
import styles from "./ProgramaDias.module.css";

type Props = {
  days: LandingModel["jornadas"]["program"]["days"];
  clock: ProgramClock;
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
 *
 * The revolver ([56-0]) points at the session being held right now, by the venue's clock (config/revolver.ts).
 * The site is static, so "now" is only known in the browser: the HTML carries no revolver, and it turns up
 * after mounting, on the event's two days and inside a session's hours. The preview pins it on the session
 * config/revolver.ts names, in the HTML too, so its size and colour can be judged on any date.
 */
export function ProgramaDias({ days, clock, copy, markLabels, showMarks }: Props) {
  const trackRef = useRef<HTMLOListElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const baseId = useId();
  const panelId = (i: number) => `${baseId}-dia-${i}`;

  const pinned: NowAt | null = clock.enabled ? clock.preview : null;
  const [now, setNow] = useState<NowAt | null>(pinned);
  useEffect(() => {
    if (!clock.enabled || clock.preview) return;
    const tick = () => {
      const next = sessionAt(days, new Date(), clock.timeZone);
      setNow((current) => (current?.dayId === next?.dayId && current?.sessionId === next?.sessionId ? current : next));
    };
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [clock.enabled, clock.preview, clock.timeZone, days]);
  const revolver = clock.icon ? clock.icon.variants[clock.icon.variants.length - 1] : null;

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

  // The track shows one day at a time, so it takes that day's height and not the longer one's.
  // Measured, not guessed: the text reflows with the width and with the reader's own font size.
  const [alto, setAlto] = useState<number | null>(null);
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panel = track.children[active] as HTMLElement | undefined;
    if (!panel) return;
    const measure = () => setAlto(panel.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [active]);

  const goTo = useCallback((i: number, moveFocus = false) => {
    const track = trackRef.current;
    setActive(i);
    if (track && track.clientWidth) {
      const calm = isMotionReduced();
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

      <ol ref={trackRef} className={styles.days} style={alto ? ({ "--programa-alto": `${alto}px` } as CSSProperties) : undefined}>
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
            <ol className={styles.sessions} data-clock={now?.dayId === day.id && clock.icon ? "" : undefined}>
              {day.sessions.map((s) => {
                const isNow = now?.dayId === day.id && now.sessionId === s.id;
                return (
                <li key={s.id} className={styles.session} data-unnumbered={s.numbered ? undefined : ""} data-now={isNow ? "" : undefined} aria-current={isNow ? "time" : undefined}>
                  {isNow && revolver && clock.icon ? (
                    clock.style === "tinta" ? (
                      <span className={`${styles.revolver} ${styles.revolverInk}`} style={{ "--revolver-src": `url(${revolver.src})`, aspectRatio: clock.icon.ratio } as CSSProperties} aria-hidden="true" />
                    ) : (
                      <img className={styles.revolver} src={revolver.src} srcSet={clock.icon.variants.map((v) => `${v.src} ${v.width}w`).join(", ")} sizes="2.5rem" width={revolver.width} height={Math.round(revolver.width / clock.icon.ratio)} alt="" decoding="async" />
                    )
                  ) : null}
                  {isNow ? <span className={styles.srOnly}>{clock.nowLabel}: </span> : null}
                  {s.time ? <span className={styles.sessionTime}>{s.time}</span> : null}
                  <span className={styles.sessionText}>{s.text}</span>
                  {s.link ? (
                    <a href={s.link.href} className={styles.sessionLink}>
                      {s.link.label}
                    </a>
                  ) : null}
                </li>
                );
              })}
            </ol>
            {day.provenanceNote && showMarks ? <p className={styles.provenance}>{day.provenanceNote}</p> : null}
          </li>
        ))}
      </ol>
    </>
  );
}
