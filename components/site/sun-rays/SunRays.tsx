"use client";

import { useReducedMotion } from "@/lib/motion/use-motion";

import { useEffect, useRef } from "react";
import { SUN_RAYS as CFG } from "./config";
import styles from "../Experiences.module.css";

/**
 * The moment the classroom wakes up ([51-0]): the sun comes in through the window and the name of the jornadas
 * is written on the blackboard. Both are fired by the same thing — the band reaching the screen. The light
 * comes in again on every return (promoter, 25-09-2026); the chalk is written once and stays written, because
 * chalk on a board does not unwrite itself.
 *
 * The two are deliberately independent underneath. The light is Three.js on a transparent canvas and needs
 * WebGL; the chalk is CSS and needs nothing. So the chalk is armed and released by this component directly,
 * before and regardless of whether the scene ever loads. With no JavaScript at all the lettering is simply
 * there, written, the way it has always been: the default state of the CSS is the finished one.
 *
 * The canvas is given the rectangle the photograph is actually drawn in (`.lightFrame`, the same rule as the
 * blackboard's frame), so the window stays under the window at every width.
 */
export function SunRays() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const root = stage.closest<HTMLElement>("[data-classroom]");
    if (!root) return;

    const calm = reduced;
    // Hide the lettering only once we know we are here to write it. Everything else leaves it written.
    if (!calm) root.dataset.chalk = "armed";

    let disposed = false;
    let wanted = false;
    /** Whether the band was on screen last time we were told, so only a real arrival lights it again. */
    let onScreen = false;
    /** The name is written once and stays written. It is chalk on a board, not a sign that blinks. */
    let written = false;
    let scene: import("./sun-rays-scene").SunRaysScene | null = null;
    let ro: ResizeObserver | null = null;
    // The observer is never disconnected: the promoter asked for the light to come in EVERY time the band
    // comes back on screen. What stops it firing twice on the way past is `onScreen` — the light only starts
    // when the band goes from away to here, never while it is simply being scrolled through.
    const io = new IntersectionObserver(
      (entries) => {
        const here = entries[entries.length - 1]?.isIntersecting ?? false;
        if (!here) {
          onScreen = false;
          return;
        }
        if (onScreen) return;
        onScreen = true;
        if (!written) {
          written = true;
          root.dataset.chalk = "writing";
        }
        wanted = true;
        scene?.start();
      },
      { threshold: CFG.triggerRatio },
    );
    io.observe(root);

    const onVisibility = () => scene?.setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);

    (async () => {
      const mod = await import("./sun-rays-scene");
      if (disposed || !mod.webglAvailable()) return;
      const token = getComputedStyle(document.documentElement).getPropertyValue(CFG.colorToken).trim();
      if (!token) return;
      try {
        scene = new mod.SunRaysScene(stage, canvas, calm, token);
      } catch (err) {
        console.warn("[SunRays] WebGL renderer unavailable:", err);
        return;
      }
      ro = new ResizeObserver(() => scene?.resize());
      ro.observe(stage);
      if (wanted) scene.start();
    })().catch(() => { /* Static content remains available if the engine cannot load. */ });

    return () => {
      disposed = true;
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
      scene = null;
      delete root.dataset.chalk;
    };
  }, [reduced]);

  return (
    <div ref={stageRef} className={styles.lightFrame} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.lightCanvas} />
    </div>
  );
}
