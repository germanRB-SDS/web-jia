"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { CUBE_CONFIG } from "./config";
import type { CubeEngine } from "./cube-engine";
import styles from "./CubeCarousel.module.css";

export type CubeItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  alt: string;
  /** Portrait or landscape, any ratio: it is fitted to the side's height and centred. */
  image: { src: string; srcSet?: string; width: number; height: number } | null;
};

export type CubeLabels = {
  /** Accessible name of the whole carousel. */
  region: string;
  prev: string;
  next: string;
  /** `{current}` and `{total}`. */
  position: string;
  /** Visible hint under the cube. */
  hint: string;
  /** Accessible name of the full list that assistive technology reads instead of the cube. */
  list: string;
};

type Props = { items: CubeItem[]; labels: CubeLabels; className?: string };

const FACES = Array.from({ length: CUBE_CONFIG.faces }, (_, i) => i);
const STRIPS = Array.from({ length: CUBE_CONFIG.edgeStrips }, (_, i) => i);
const STRIP_STEP = 90 / CUBE_CONFIG.edgeStrips;
const mod = (a: number, n: number) => ((a % n) + n) % n;

/**
 * A cube that shows a whole sequence: drag it (or use the arrows / arrow keys) and every quarter
 * turn brings the next item, n items on four sides, round and round. Knows nothing about what it
 * shows: items and every label come from the caller. The cube itself is decoration for assistive
 * technology, which gets the complete list and the prev/next buttons with a live caption.
 */
export function CubeCarousel({ items, labels, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CubeEngine | null>(null);
  const count = items.length;
  const [assigned, setAssigned] = useState<number[]>(() => FACES.map((f) => (count ? mod(f <= 2 ? f : -1, count) : 0)));
  const [front, setFront] = useState(0);
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const cube = cubeRef.current;
    if (!root || !stage || !cube || !count) return;
    let disposed = false;
    let io: IntersectionObserver | null = null;
    (async () => {
      const { CubeEngine } = await import("./cube-engine");
      if (disposed) return;
      const surfaces = [...cube.querySelectorAll<HTMLElement>("[data-cube-angle]")].map((el) => ({ el, angle: Number(el.dataset.cubeAngle) }));
      const engine = new CubeEngine({
        stage,
        cube,
        surfaces,
        count,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onAssign: setAssigned,
        onFront: setFront,
        onInteract: () => setAnnounce(true),
      });
      engineRef.current = engine;
      io = new IntersectionObserver((entries) => engine.setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.5 });
      io.observe(stage);
    })();
    return () => {
      disposed = true;
      io?.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [count]);

  // Fetch the neighbours before a turn can bring them into view (same candidate the <img> will pick).
  const sizes = "(max-width: 620px) 42vw, 260px";
  useEffect(() => {
    if (!count) return;
    for (let d = -CUBE_CONFIG.preloadRadius; d <= CUBE_CONFIG.preloadRadius; d++) {
      const image = items[mod(front + d, count)].image;
      if (!image) continue;
      const img = new Image();
      img.sizes = sizes;
      if (image.srcSet) img.srcset = image.srcSet;
      img.src = image.src;
    }
  }, [front, count, items]);

  const position = useMemo(() => labels.position.replace("{current}", String(front + 1)).replace("{total}", String(count)), [labels.position, front, count]);

  if (!count) return null;
  const current = items[front];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") engineRef.current?.step(1);
    else if (e.key === "ArrowLeft") engineRef.current?.step(-1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onKeyDown={onKeyDown}
      onPointerEnter={() => engineRef.current?.setHeld(true)}
      onPointerLeave={() => engineRef.current?.setHeld(false)}
      onFocus={() => engineRef.current?.setHeld(true)}
      onBlur={() => engineRef.current?.setHeld(false)}
    >
      <div ref={stageRef} className={styles.stage} aria-hidden="true" data-cursor="open">
        <div className={styles.scene}>
          <div ref={cubeRef} className={styles.cube}>
            {FACES.map((f) => {
              const item = items[assigned[f] ?? 0];
              return (
                <div key={f} className={styles.face} data-cube-angle={f * 90} style={{ "--cube-i": f } as CSSProperties}>
                  <div className={styles.faceBody}>
                    {item.image ? (
                      <img className={styles.sticker} src={item.image.src} srcSet={item.image.srcSet} sizes={sizes} width={item.image.width} height={item.image.height} alt="" draggable={false} decoding="async" />
                    ) : (
                      <span className={styles.stickerBlank}>{item.title}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {FACES.map((f) => (
              <span key={`core-${f}`} className={styles.core} style={{ "--cube-i": f } as CSSProperties} />
            ))}
            {FACES.map((f) =>
              STRIPS.map((m) => (
                <span key={`${f}-${m}`} className={styles.edge} data-cube-angle={f * 90 + (m + 0.5) * STRIP_STEP} data-strip={m} style={{ "--cube-i": f, "--cube-theta": `${(m + 0.5) * STRIP_STEP}deg` } as CSSProperties} />
              )),
            )}
          </div>
        </div>
        <span className={styles.shadow} />
      </div>

      <div className={styles.bar}>
        <button type="button" className={styles.arrow} onClick={() => engineRef.current?.step(-1)} aria-label={labels.prev} title={labels.prev}>
          <Chevron direction="left" />
        </button>
        <p className={styles.caption} aria-live={announce ? "polite" : "off"} aria-atomic="true">
          <span className={styles.captionTitle}>{current.title}</span>
          {current.subtitle ? <span className={styles.captionSub}>{current.subtitle}</span> : null}
          <span className={styles.captionPos}>{position}</span>
        </p>
        <button type="button" className={styles.arrow} onClick={() => engineRef.current?.step(1)} aria-label={labels.next} title={labels.next}>
          <Chevron direction="right" />
        </button>
      </div>
      <p className={styles.hint}>{labels.hint}</p>

      <ul className={styles.list} aria-label={labels.list}>
        {items.map((item) => (
          <li key={item.id}>
            {item.title}
            {item.subtitle ? `, ${item.subtitle}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}
