"use client";

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { InaugurationModel } from "@/lib/content";
import { CloseIcon, ExternalIcon, PlayIcon } from "@/components/icons";
import styles from "./InaugurationBand.module.css";

type Props = { band: InaugurationModel };

/** What YouTube says about the video: not asked yet, asking, still there, gone, or no answer (network, blocker). */
type Status = "idle" | "checking" | "ok" | "gone" | "unknown";

/**
 * «Inauguración de las JIA 2026» ([70-0]): a second cinema bar under the Intro, in saddle leather, that never unfolds.
 * The whole band is ONE link to the opening ceremony on YouTube (a new tab); the round play disc on the right is its
 * sign, not a separate control, so there is one stop for the keyboard and one name for screen readers.
 *
 * A dead link is never offered. Nothing is asked of YouTube when the page loads; the first sign of intent (pointer
 * over it, focus, a press) checks the video's public thumbnail, which YouTube answers with a 120×90 placeholder once the
 * video no longer exists. If it is gone, or no URL is configured, the press opens a note under the band instead. If
 * the check has not answered yet, or the network is blocked, the link behaves as a link.
 */
export function InaugurationBand({ band }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<Status>("idle");
  const [noteOpen, setNoteOpen] = useState(false);
  const [pressed, setPressed] = useState(0);
  const noteId = useId();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const settle = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const probe = useCallback(() => {
    if (statusRef.current !== "idle" || !band.href || !band.youtubeId) return;
    settle("checking");
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    const timer = window.setTimeout(() => settle("unknown"), 4000);
    img.onload = () => {
      window.clearTimeout(timer);
      settle(img.naturalWidth === 120 ? "gone" : "ok");
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      settle("unknown");
    };
    img.src = `https://i.ytimg.com/vi/${encodeURIComponent(band.youtubeId)}/mqdefault.jpg`;
  }, [band.href, band.youtubeId, settle]);

  const unavailable = !band.href || status === "gone";

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      setPressed((n) => n + 1);
      if (!band.href || statusRef.current === "gone") {
        e.preventDefault();
        setNoteOpen(true);
      }
    },
    [band.href],
  );

  // The note closes with Escape and gives the focus back to the band.
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
    <div id={band.anchor} className={styles.root}>
      <a
        ref={linkRef}
        className={styles.band}
        href={band.href ?? `#${band.anchor}`}
        {...(band.href && !unavailable ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={unavailable ? band.title : band.linkLabel}
        aria-describedby={noteOpen ? noteId : undefined}
        aria-expanded={unavailable ? noteOpen : undefined}
        title={unavailable ? undefined : band.linkLabel}
        onPointerEnter={probe}
        onPointerDown={probe}
        onFocus={probe}
        onClick={onClick}
        data-unavailable={unavailable ? "" : undefined}
      >
        <span className={styles.label} aria-hidden="true">
          {band.label}
        </span>
        <span className={styles.title}>{band.title}</span>
        <span className={styles.cue} aria-hidden="true">
          {unavailable ? null : (
            <span className={styles.hint}>
              {band.hint}
              <ExternalIcon size={12} />
            </span>
          )}
          {/* Keyed on each press so the ripple plays again every time. */}
          <span key={pressed} className={styles.disc} data-pressed={pressed ? "" : undefined}>
            <PlayIcon size={22} />
          </span>
        </span>
      </a>
      <div className={styles.noteFold} data-open={noteOpen ? "" : undefined} inert={!noteOpen}>
        <div className={styles.noteInner}>
          <p id={noteId} className={styles.note} role="status">
            <span>{noteOpen ? band.unavailable : null}</span>
            <button
              type="button"
              className={styles.dismiss}
              onClick={() => {
                setNoteOpen(false);
                linkRef.current?.focus();
              }}
              aria-label={band.dismiss}
              title={band.dismiss}
            >
              <CloseIcon size={18} />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
