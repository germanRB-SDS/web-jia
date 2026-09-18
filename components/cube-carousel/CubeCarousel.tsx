"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { BulletHole, type Shot } from "@/components/primitives/BulletHole";
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

type Hole = Shot;

type Props = { items: CubeItem[]; labels: CubeLabels; className?: string };

const FACES = Array.from({ length: CUBE_CONFIG.faces }, (_, i) => i);
const mod = (a: number, n: number) => ((a % n) + n) % n;

/**
 * A cube that shows a whole sequence: drag it, click it or use the arrows / arrow keys and every
 * quarter turn brings the next item (every fourth one rolls vertically), n items on six sides,
 * round and round. A click on the side facing you shoots it: the hole stays on that item. Knows nothing about what it
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
  const [cap, setCap] = useState({ top: 0, bottom: 0 });
  const [front, setFront] = useState(0);
  const [announce, setAnnounce] = useState(false);
  const [holes, setHoles] = useState<Record<number, Hole[]>>({});
  const shots = useRef(0);

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
      const pick = (name: string) => [...cube.querySelectorAll<HTMLElement>(`[data-cube-side="${name}"]`)];
      const engine = new CubeEngine({
        stage,
        cube,
        sides: pick("turn"),
        top: pick("top")[0],
        bottom: pick("bottom")[0],
        count,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onAssign: setAssigned,
        onCap: setCap,
        onFront: setFront,
        onInteract: () => setAnnounce(true),
        onShot: ({ item, x, y }) => {
          const hole: Hole = { key: ++shots.current, x: x * 100, y: y * 100, turn: Math.round(Math.random() * 360) };
          setHoles((all) => ({ ...all, [item]: [...(all[item] ?? []), hole].slice(-CUBE_CONFIG.shot.maxPerItem) }));
        },
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
          {/* The page-load pose is in the markup too, so the cube does not jump when the engine arrives (it writes --cube-rot from then on). */}
          <div ref={cubeRef} className={styles.cube} style={count > 1 ? ({ "--cube-rot": `${-CUBE_CONFIG.initialTurn}deg` } as CSSProperties) : undefined}>
            {FACES.map((f) => (
              <Side key={f} kind="turn" item={items[assigned[f] ?? 0]} holes={holes[assigned[f] ?? 0]} sizes={sizes} style={{ "--cube-i": f } as CSSProperties} />
            ))}
            <Side kind="top" item={items[cap.top] ?? items[0]} holes={holes[items[cap.top] ? cap.top : 0]} sizes={sizes} />
            <Side kind="bottom" item={items[cap.bottom] ?? items[0]} holes={holes[items[cap.bottom] ? cap.bottom : 0]} sizes={sizes} />
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

/** One side of the cube: its varnished ground, the item as a sticker, the holes shot into it, the veil and the light over all. */
function Side({ kind, item, holes, sizes, style }: { kind: "turn" | "top" | "bottom"; item: CubeItem; holes?: Hole[]; sizes: string; style?: CSSProperties }) {
  return (
    <div className={`${styles.face} ${kind === "turn" ? "" : styles[kind]}`} data-cube-side={kind} style={style}>
      <div className={styles.faceBody}>
        {item.image ? (
          <img className={styles.sticker} src={item.image.src} srcSet={item.image.srcSet} sizes={sizes} width={item.image.width} height={item.image.height} alt="" draggable={false} decoding="async" />
        ) : (
          <span className={styles.stickerBlank}>{item.title}</span>
        )}
        {holes?.map((h) => (
          <BulletHole key={h.key} shot={h} />
        ))}
        <span className={styles.veil} />
      </div>
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
