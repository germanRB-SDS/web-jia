"use client";

import { isMotionReduced } from "@/lib/motion/policy";

import { Children, useId, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronIcon } from "@/components/icons";
import { WORKSHOP_DECK as CFG } from "./config";
import styles from "./TalleresCarrusel.module.css";

type Props = {
  labels: { region: string; prev: string; next: string; expand: string };
  children: ReactNode;
};

/** The same cards form a mobile fan, then unfold into a native scroll-snap track.
 * Desktop retains the grid. A separate button owns the first tap, so it cannot open a sheet. */
export function TalleresCarrusel({ labels, children }: Props) {
  const trackId = useId();
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const focusOnExpand = useRef(false);
  const collapsed = mobile && !expanded;
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

  useEffect(() => {
    const query = window.matchMedia(CFG.mobileMedia);
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    read();
    if (expanded && focusOnExpand.current) {
      trackRef.current?.focus({ preventScroll: true });
      focusOnExpand.current = false;
    }
  }, [expanded, mobile, read]);

  useEffect(() => {
    const track = trackRef.current;
    if (!mobile || !expanded || !track) return;
    const section = track.closest('[role="region"]') ?? track;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !track.querySelector("dialog[open]")) {
        track.scrollTo({ left: 0, behavior: "instant" });
        setExpanded(false);
      }
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [mobile, expanded]);

  // Programme/related links must still reach an individual workshop in a closed deck.
  useEffect(() => {
    const revealAnchor = () => {
      const card = Array.from(trackRef.current?.children ?? []).find((child) => `#${child.id}` === window.location.hash);
      if (card) {
        setExpanded(true);
        requestAnimationFrame(() => card.scrollIntoView({ block: "nearest", inline: "start", behavior: "instant" }));
      }
    };
    revealAnchor();
    window.addEventListener("hashchange", revealAnchor);
    return () => window.removeEventListener("hashchange", revealAnchor);
  }, []);

  // One card at a time: the step is the card's own width plus the gap between two of them.
  const move = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const second = track.children[1] as HTMLElement | null;
    const step = first && second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? track.clientWidth);
    const calm = isMotionReduced();
    track.scrollBy({ left: direction * step, behavior: calm ? "auto" : "smooth" });
  };

  return (
    <div className={styles.deck} data-expanded={expanded ? "" : undefined} style={{ "--workshop-count": Children.count(children), "--poster-inset": CFG.posterInset } as CSSProperties}>
      {/* A scrollable box needs to be reachable from the keyboard — but only while it scrolls: on a
          wide window this is a plain grid and would be one more empty stop on the way to the cards. */}
      <div id={trackId} ref={trackRef} className={styles.grid} inert={collapsed} role="group" aria-label={labels.region} tabIndex={collapsed ? undefined : ends.start && ends.end ? -1 : 0}>
        {children}
      </div>
      {!expanded ? (
        <button
          type="button"
          className={styles.expand}
          aria-expanded={false}
          aria-controls={trackId}
          onClick={(event) => {
            focusOnExpand.current = event.detail === 0;
            setExpanded(true);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches) setExpanded(true);
          }}
        >
          <span>{labels.expand}</span>
        </button>
      ) : null}
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => move(-1)} disabled={ends.start} aria-label={labels.prev}>
          <ChevronIcon size={18} className={styles.prevIcon} />
        </button>
        <button type="button" className={styles.arrow} onClick={() => move(1)} disabled={ends.end} aria-label={labels.next}>
          <ChevronIcon size={18} className={styles.nextIcon} />
        </button>
      </div>
    </div>
  );
}
