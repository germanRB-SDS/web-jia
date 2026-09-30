"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { ReelModel } from "@/lib/content";
import { subscribeMotion, isMotionReduced } from "@/lib/motion/policy";
import { ArrowIcon, PauseIcon, PlayIcon } from "@/components/icons";
import { Picture } from "@/components/primitives/Picture";
import { reelGeometry } from "./config";
import { createReelEngine, type ReelEngine } from "./reel-engine";
import { ReelViewer } from "./ReelViewer";
import styles from "./FilmReel.module.css";

type Props = { reel: ReelModel; className?: string };

/** The set that is real for assistive technology and the keyboard; the others are copies for the eye and the mouse. */
const REAL = 1;
const GEOMETRY = reelGeometry() as CSSProperties;

/**
 * A film strip running slowly from right to left with one poster in each frame ([61-0]). The film is the promoter's
 * drawing cut into a repeatable frame (see scripts/build-assets.sh); every poster sits in its frame's window in
 * percentages of that frame, so film and posters are one picture at every size. The stains are a still layer the
 * film runs over. A click, a tap, Enter or Space on a poster opens it large in the viewer.
 */
export function FilmReel({ reel, className }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fadeProbe = useRef<HTMLSpanElement>(null);
  const engine = useRef<ReelEngine | null>(null);
  const realButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const opened = useRef<number | null>(null);
  const [copies, setCopies] = useState(3);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const count = reel.posters.length;

  useEffect(() => {
    const update = () => setReduced(isMotionReduced());
    update();
    return subscribeMotion(update);
  }, []);

  useEffect(() => {
    if (!viewport.current || !track.current || !fadeProbe.current) return;
    const e = createReelEngine({ viewport: viewport.current, track: track.current, fadeProbe: fadeProbe.current, count, onCopies: setCopies });
    engine.current = e;
    return () => {
      e.destroy();
      engine.current = null;
    };
  }, [count]);

  useEffect(() => { engine.current?.refresh(); }, [copies]);
  useEffect(() => { engine.current?.setManualPause(paused); }, [paused]);

  const open = (index: number) => {
    engine.current?.setViewerOpen(true);
    opened.current = index;
    setOpenIndex(index);
  };
  /* Focus goes back to the poster's real button — the one the keyboard opened, or the same poster's when a copy was
     clicked. It never scrolls the page; if the keyboard is in use, the engine brings that poster into view. */
  const closed = useCallback(() => {
    const index = opened.current;
    opened.current = null;
    setOpenIndex(null);
    if (index !== null) realButtons.current[index]?.focus({ preventScroll: true });
    engine.current?.setViewerOpen(false);
  }, []);

  const showArrows = reduced || paused;
  const current = openIndex === null ? null : reel.posters[openIndex];

  return (
    <div className={`${styles.reel}${className ? ` ${className}` : ""}`} style={GEOMETRY}>
      <div className={styles.stage}>
        <div ref={viewport} className={styles.viewport} role="region" aria-label={reel.labels.region}>
          <span ref={fadeProbe} className={styles.fadeProbe} aria-hidden="true" />
          {/* Over the faintest half of the fade: a poster seen through it is barely there, so it takes no tap. */}
          <span className={styles.shield} aria-hidden="true" />
          <div className={styles.stains} aria-hidden="true" />
          <div ref={track} className={styles.track} data-track="">
            {Array.from({ length: copies }, (_, copy) => {
              const real = copy === REAL;
              return (
                <ul key={copy} className={styles.set} aria-hidden={real ? undefined : true}>
                  {reel.posters.map((p, index) => (
                    <li key={p.id} className={styles.frame} data-frame="" data-copy={copy} data-index={index}>
                      {real ? (
                        <button
                          ref={(el) => { realButtons.current[index] = el; }}
                          type="button"
                          className={styles.poster}
                          data-poster=""
                          aria-label={p.label}
                          aria-haspopup="dialog"
                          onClick={() => open(index)}
                        >
                          <Picture media={p.media} alt="" sizes="(min-width: 1280px) 170px, 150px" className={styles.picture} eager />
                        </button>
                      ) : (
                        <span className={styles.poster} data-poster="" onClick={() => open(index)}>
                          <Picture media={p.media} alt="" sizes="(min-width: 1280px) 170px, 150px" className={styles.picture} eager />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        {showArrows ? (
          <>
            <button type="button" className={styles.control} aria-label={reel.labels.previous} onClick={() => engine.current?.step(-1)}>
              <ArrowIcon className={styles.back} />
            </button>
            <button type="button" className={styles.control} aria-label={reel.labels.next} onClick={() => engine.current?.step(1)}>
              <ArrowIcon />
            </button>
          </>
        ) : null}
        {reduced ? null : (
          <button type="button" className={styles.control} aria-label={paused ? reel.labels.play : reel.labels.pause} onClick={() => setPaused((p) => !p)}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
      <ReelViewer poster={current} closeLabel={reel.labels.close} onClose={closed} />
    </div>
  );
}
