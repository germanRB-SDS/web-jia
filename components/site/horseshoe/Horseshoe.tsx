"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { HORSESHOE as CFG } from "./config";
import styles from "../SiteFooter.module.css";

type Props = { glb: string; label: string };

const subscribeLarge = (cb: () => void) => {
  const mq = window.matchMedia(CFG.largeMedia);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const isLarge = () => window.matchMedia(CFG.largeMedia).matches;

/**
 * A worn horseshoe hanging from a nail on the post of the footer's stable (config.post), drawn with
 * Three.js on a transparent canvas over the block above the rule (horseshoe-scene.ts). Not on small
 * windows: there nothing is mounted. Decoration with a real button over it: the button carries
 * the accessible name and the double click (Enter or Space with the keyboard), which makes the shoe fall (and climb back). Without WebGL or the
 * model nothing is drawn.
 */
export function Horseshoe({ glb, label }: Props) {
  const large = useSyncExternalStore(subscribeLarge, isLarge, () => false);
  return large ? <Stage glb={glb} label={label} /> : null;
}

function Stage({ glb, label }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<import("./horseshoe-scene").HorseshoeScene | null>(null);
  const drop = useCallback(() => sceneRef.current?.drop(), []);
  // The keyboard has no double click: Enter or Space on the button lets the shoe go.
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!e.repeat) sceneRef.current?.drop();
  }, []);
  const byDoubleClick = CFG.fall.trigger === "dblclick";

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const hit = hitRef.current;
    if (!stage || !canvas || !hit) return;
    let disposed = false;
    let ro: ResizeObserver | null = null;

    (async () => {
      const mod = await import("./horseshoe-scene");
      if (disposed || !mod.webglAvailable()) return;
      let scene: import("./horseshoe-scene").HorseshoeScene;
      try {
        const post = stage.closest("footer")?.querySelector<HTMLElement>(CFG.post.selector) ?? null;
        scene = new mod.HorseshoeScene(stage, canvas, hit, window.matchMedia("(prefers-reduced-motion: reduce)").matches, post);
      } catch (err) {
        console.warn("[Horseshoe] WebGL renderer unavailable:", err);
        return;
      }
      sceneRef.current = scene;
      ro = new ResizeObserver(() => scene.resize());
      ro.observe(stage);
      try {
        await scene.init(glb);
      } catch (err) {
        console.warn("[Horseshoe] model unavailable:", err);
      }
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [glb]);

  return (
    <div ref={stageRef} className={styles.shoeStage}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {/* A pointer click must not leave the focus ring on the shoe (nor a double click select text); the keyboard keeps it. */}
      <button
        ref={hitRef}
        type="button"
        className={styles.shoeHit}
        aria-label={label}
        title={label}
        onClick={byDoubleClick ? undefined : drop}
        onDoubleClick={byDoubleClick ? drop : undefined}
        onKeyDown={byDoubleClick ? onKeyDown : undefined}
        onMouseDown={(e) => e.preventDefault()}
      />
    </div>
  );
}
