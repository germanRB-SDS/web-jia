"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RouteModel } from "@/lib/content";
import { NARROW_MEDIA, ROUTE_CONFIG, ROUTE_LAYOUTS, type LayoutName } from "./config";
import type { LabelLayout, PlayState } from "./route-scene";
import styles from "./JornadasRoute.module.css";

type Props = { route: RouteModel };

type ViewState = PlayState | "fallback";

/**
 * The wagon on a six-stop road under the Jornadas intro. Three.js draws the road, the discs,
 * the wagon and its shadow on a transparent canvas; the six labels are real HTML anchored to
 * the projected discs, so they are readable (and reachable by assistive tech) without waiting
 * for the animation. Without WebGL or the model, the same list renders as a static row.
 */
export function JornadasRoute({ route }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<import("./route-scene").RouteScene | null>(null);
  const [state, setState] = useState<ViewState>("loading");
  const [visited, setVisited] = useState<boolean[]>(() => route.stops.map(() => false));
  const [labels, setLabels] = useState<LabelLayout | null>(null);
  const [layout, setLayout] = useState<LayoutName>("wide");

  const showAll = state === "static" || state === "fallback";

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    const narrow = window.matchMedia(NARROW_MEDIA);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onVisibility = () => sceneRef.current?.setVisible(document.visibilityState === "visible" && inView);
    let inView = false;

    (async () => {
      const mod = await import("./route-scene");
      if (disposed) return;
      if (!mod.webglAvailable()) {
        setState("fallback");
        return;
      }
      const css = getComputedStyle(document.documentElement);
      const token = (name: string) => css.getPropertyValue(name).trim();
      const initial: LayoutName = narrow.matches ? "narrow" : "wide";
      setLayout(initial);
      let scene: import("./route-scene").RouteScene;
      try {
        scene = new mod.RouteScene(
          container,
          canvas,
          initial,
          calm.matches,
          { road: token(ROUTE_CONFIG.road.colors.road), disc: token(ROUTE_CONFIG.road.colors.disc), discActive: token(ROUTE_CONFIG.road.colors.discActive) },
          {
            onState: (s) => setState(s),
            onStop: (i) => setVisited((v) => v.map((x, k) => (k === i ? true : x))),
            onReset: () => setVisited(route.stops.map(() => false)),
            onLabels: (l) => setLabels(l),
            onFail: (reason) => {
              if (reason === "webgl") setState("fallback");
            },
          },
        );
      } catch (err) {
        console.warn("[JornadasRoute] WebGL renderer unavailable:", err);
        setState("fallback");
        return;
      }
      sceneRef.current = scene;

      ro = new ResizeObserver(() => {
        const next: LayoutName = narrow.matches ? "narrow" : "wide";
        setLayout(next);
        scene.setLayout(next);
        scene.resize();
      });
      ro.observe(container);
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? false;
          scene.setVisible(inView && document.visibilityState === "visible");
        },
        { threshold: ROUTE_CONFIG.render.visibleThreshold },
      );
      io.observe(container);
      document.addEventListener("visibilitychange", onVisibility);
      document.fonts?.ready.then(() => scene.resize()).catch(() => {});

      await scene.init(route.glb);
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [route.glb, route.stops]);

  const onPause = useCallback(() => sceneRef.current?.pause(), []);
  const onResume = useCallback(() => sceneRef.current?.resume(), []);
  const onReplay = useCallback(() => sceneRef.current?.replay(), []);

  const box = ROUTE_LAYOUTS[layout].box;
  const offsetPx = labels ? ROUTE_LAYOUTS[layout].labelOffsetUnits * labels.unitPx : 0;

  return (
    <div ref={containerRef} className={styles.route} data-state={state} data-layout={layout} style={{ aspectRatio: `${box.w} / ${box.h}` }}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <ol className={styles.stops} aria-label={route.regionLabel}>
        {route.stops.map((stop, i) => {
          const pos = labels?.positions[i];
          return (
            <li
              key={stop.id}
              className={styles.stop}
              data-visible={showAll || visited[i] ? "true" : "false"}
              style={pos && state !== "fallback" ? { left: `${pos.x + offsetPx}px`, top: `${pos.y}px` } : undefined}
            >
              {stop.label}
            </li>
          );
        })}
      </ol>
      <div className={styles.controls}>
        {state === "playing" ? (
          <button type="button" className={styles.control} onClick={onPause}>
            {route.controls.pause}
          </button>
        ) : null}
        {state === "paused" ? (
          <button type="button" className={styles.control} onClick={onResume}>
            {route.controls.resume}
          </button>
        ) : null}
        {state === "paused" || state === "done" ? (
          <button type="button" className={styles.control} onClick={onReplay}>
            {route.controls.replay}
          </button>
        ) : null}
      </div>
    </div>
  );
}
