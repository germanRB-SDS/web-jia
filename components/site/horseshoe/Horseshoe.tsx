"use client";

import { useEffect, useRef } from "react";
import { HORSESHOE as CFG } from "./config";
import type { Layout } from "./horseshoe-scene";
import styles from "../SiteFooter.module.css";

type Props = { glb: string; label: string };

/**
 * A worn horseshoe hanging from a nail on the footer's top edge, drawn with Three.js on a transparent
 * canvas over the block above the rule (horseshoe-scene.ts). Decoration with a real button over it:
 * the button carries the accessible name and, later, the click. Without WebGL or the model nothing
 * is drawn and the footer reads exactly as before.
 */
export function Horseshoe({ glb, label }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<import("./horseshoe-scene").HorseshoeScene | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const hit = hitRef.current;
    if (!stage || !canvas || !hit) return;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    const narrow = window.matchMedia(CFG.narrowMedia);

    (async () => {
      const mod = await import("./horseshoe-scene");
      if (disposed || !mod.webglAvailable()) return;
      const anchor = stage.closest("footer")?.querySelector<HTMLElement>("[data-hang-anchor]") ?? null;
      let scene: import("./horseshoe-scene").HorseshoeScene;
      try {
        scene = new mod.HorseshoeScene(stage, canvas, hit, anchor);
      } catch (err) {
        console.warn("[Horseshoe] WebGL renderer unavailable:", err);
        return;
      }
      sceneRef.current = scene;
      const layout = (): Layout => (narrow.matches ? "narrow" : "wide");
      ro = new ResizeObserver(() => {
        scene.setLayout(layout());
      });
      ro.observe(stage);
      if (anchor) ro.observe(anchor);
      try {
        await scene.init(glb);
      } catch (err) {
        console.warn("[Horseshoe] model unavailable:", err);
        return;
      }
      if (!disposed) scene.setLayout(layout());
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
      <button ref={hitRef} type="button" className={styles.shoeHit} aria-label={label} title={label} />
    </div>
  );
}
