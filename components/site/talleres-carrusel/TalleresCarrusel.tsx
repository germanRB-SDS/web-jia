"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronIcon } from "@/components/icons";
import styles from "./TalleresCarrusel.module.css";

type Props = {
  labels: { region: string; prev: string; next: string };
  children: ReactNode;
};

/**
 * The workshops. From 760 px up this is the same grid of cards as always and the buttons are not
 * drawn: everything below is CSS that only exists on a phone (JIA-2026-09-20-49).
 *
 * On a phone the cards become a track that snaps, one card per view with the next one peeking, and
 * two round buttons move it one card at a time. The scroll is the platform's own, so a finger
 * drags the track without any gesture code of ours — and because the browser does not fire a click
 * after a drag, sliding the track never opens a sheet. The cards come in as `children`: this
 * component knows nothing about workshops, only how to move what it is given.
 */
export function TalleresCarrusel({ labels, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  const read = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEnds({ start: track.scrollLeft <= 1, end: track.scrollLeft >= max - 1 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const handler = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };
    read();
    track.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      track.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [read]);

  // One card at a time: the step is the card's own width plus the gap between two of them.
  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const second = track.children[1] as HTMLElement | null;
    const step = first && second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? track.clientWidth);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <>
      {/* A scrollable box needs to be reachable from the keyboard — but only while it scrolls: on a
          wide window this is a plain grid and would be one more empty stop on the way to the cards. */}
      <div ref={trackRef} className={styles.grid} role="group" aria-label={labels.region} tabIndex={ends.start && ends.end ? undefined : 0}>
        {children}
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => move(-1)} disabled={ends.start} aria-label={labels.prev}>
          <ChevronIcon size={18} className={styles.prevIcon} />
        </button>
        <button type="button" className={styles.arrow} onClick={() => move(1)} disabled={ends.end} aria-label={labels.next}>
          <ChevronIcon size={18} className={styles.nextIcon} />
        </button>
      </div>
    </>
  );
}
