"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { TREE_DEFAULTS, TREE_DEFAULT_PALETTE, mergeOptions, type DeepPartial, type TreeOptions, type TreePalette } from "./config";
import styles from "./Tree3D.module.css";

export type Tree3DProps = {
  /** The tree's colours: CSS values or custom properties ("var(--brand-leaf)"). Missing keys keep the defaults. */
  palette?: Partial<TreePalette>;
  /** Anything from TREE_DEFAULTS, as deep as needed; the rest keeps its default. */
  options?: DeepPartial<TreeOptions>;
  /** Same seed, same tree. */
  seed?: number;
  /** The box the tree fills is the caller's: give it a size and a place here. */
  className?: string;
  style?: CSSProperties;
};

/**
 * A procedural 3D tree on a mound, swaying in the wind, drawn with Three.js on a transparent canvas that fills this
 * element's box. Decoration: hidden from assistive technology and from the pointer. The engine (tree-scene.ts) is
 * loaded on demand, draws only while on screen, and stands still under reduced motion. Without WebGL 2 it draws
 * nothing. Depends on react and three, and on nothing outside this folder.
 */
export function Tree3D({ palette, options, seed = 7, className, style }: Tree3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Props are plain data: their content, not their identity, decides when the tree is rebuilt.
  const key = JSON.stringify([palette ?? null, options ?? null, seed]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const [p, o, s] = JSON.parse(key) as [Partial<TreePalette> | null, DeepPartial<TreeOptions> | null, number];
    let disposed = false;
    let scene: import("./tree-scene").TreeScene | null = null;
    let ro: ResizeObserver | null = null;

    (async () => {
      const mod = await import("./tree-scene");
      if (disposed || !mod.webglAvailable()) return;
      try {
        scene = new mod.TreeScene(host, mergeOptions(TREE_DEFAULTS, o ?? undefined), { ...TREE_DEFAULT_PALETTE, ...(p ?? {}) }, s, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      } catch (err) {
        console.warn("[Tree3D] WebGL renderer unavailable:", err);
        return;
      }
      const built = scene;
      ro = new ResizeObserver(() => built.resize());
      ro.observe(host);
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      scene?.dispose();
    };
  }, [key]);

  return <div ref={hostRef} className={`${styles.tree} ${className ?? ""}`} style={style} aria-hidden="true" />;
}
