"use client";

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { LandingModel, MarkKind } from "@/lib/content";
import { ArrowIcon, CloseIcon, PlayIcon } from "@/components/icons";
import { Surface } from "@/components/primitives/Surface";
import actionStyles from "@/components/primitives/Action.module.css";
import { useYouTubeCheck } from "@/lib/media/use-youtube-check";
import { Section } from "./Section";
import styles from "./Closing.module.css";

type Props = { cierre: LandingModel["cierre"]; copy: LandingModel["copy"]; showMarks: boolean };

/**
 * «El cierre de Tizaseca» ([71-0]): the farewell of the edition, built like «Tu propuesta JIA» — the words on the left,
 * on the section's own ground, the photograph bleeding on the right — and the same leather button, «Ver el aftermovie».
 *
 * The button is a link to YouTube in a new tab. A dead link is never offered: the first sign of intent checks the
 * video (lib/media/use-youtube-check.ts) and, if YouTube no longer has it or no URL is configured, the press opens a
 * note under the button instead of leaving the page.
 */
export function Closing({ cierre, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  const { aftermovie } = cierre;
  const { check, unavailable, isGone } = useYouTubeCheck(aftermovie.youtubeId, aftermovie.href);
  const [noteOpen, setNoteOpen] = useState(false);
  const noteId = useId();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!isGone()) return;
      e.preventDefault();
      setNoteOpen(true);
    },
    [isGone],
  );

  useEffect(() => {
    if (!noteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setNoteOpen(false);
      linkRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [noteOpen]);

  return (
    <Section id={cierre.id} title={cierre.title} subtitle={cierre.subtitle} marks={cierre.marks} markLabels={markLabels} showMarks={showMarks} tone="paper" layout="split" className={`${styles.section} ${styles.ground}`}>
      <div className={styles.text}>
        {cierre.paragraphs.map((p, i) => (
          <p key={p}>
            {p}
            {/* As in «Tu propuesta JIA»: the closing line points down at the button right under it. */}
            {i === cierre.paragraphs.length - 1 ? <ArrowIcon size={24} className={styles.pointer} /> : null}
          </p>
        ))}
        <div className={styles.actions}>
          <a
            ref={linkRef}
            className={`${actionStyles.btn} ${actionStyles.primary} ${styles.play}`}
            href={aftermovie.href ?? `#${cierre.id}`}
            {...(!unavailable ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={unavailable ? aftermovie.label : aftermovie.accessibleName}
            aria-expanded={unavailable ? noteOpen : undefined}
            aria-describedby={noteOpen ? noteId : undefined}
            onPointerEnter={check}
            onPointerDown={check}
            onFocus={check}
            onClick={onClick}
          >
            <span>{aftermovie.label}</span>
            <PlayIcon size={20} />
          </a>
          <div className={styles.noteFold} data-open={noteOpen ? "" : undefined} inert={!noteOpen}>
            <div className={styles.noteInner}>
              <p id={noteId} className={styles.note} role="status">
                <span>{noteOpen ? aftermovie.unavailable : null}</span>
                <button
                  type="button"
                  className={styles.dismiss}
                  onClick={() => {
                    setNoteOpen(false);
                    linkRef.current?.focus();
                  }}
                  aria-label={aftermovie.dismiss}
                  title={aftermovie.dismiss}
                >
                  <CloseIcon size={16} />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.visual} data-visual="">
        <Surface media={cierre.media} alt={cierre.alt} fallback="card" sizes="(min-width: 900px) 53vw, 100vw" className={styles.visualSurface} />
      </div>
    </Section>
  );
}
