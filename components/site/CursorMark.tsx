"use client";

import { useEffect, useRef } from "react";
import styles from "./CursorMark.module.css";

/**
 * Cursor: a registration mark that trails the pointer, opens into a crosshair
 * over anything actionable and tightens on press. Ported from
 * south-desert-main-web (assets/js/cursor.js) with JIA colours. It only
 * replaces the native cursor on a fine pointer with motion allowed; touch,
 * coarse pointers and reduced-motion users keep their own.
 */
export function CursorMark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = ref.current;
    if (!mark) return;
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    if (!fine.matches || calm.matches) return;

    root.classList.add("has-mark");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let live = false;
    let raf: number | null = null;
    const FOLLOW = 0.22;

    const frame = () => {
      x += (tx - x) * FOLLOW;
      y += (ty - y) * FOLLOW;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx;
        y = ty;
        raf = null;
        mark.style.transform = `translate3d(${x}px,${y}px,0)`;
        return;
      }
      mark.style.transform = `translate3d(${x}px,${y}px,0)`;
      raf = window.requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf === null) raf = window.requestAnimationFrame(frame);
    };

    const TARGETS = 'a, button, input, select, textarea, summary, [role="menuitem"], [tabindex]:not([tabindex="-1"])';
    const closest = (t: EventTarget | null) => (t instanceof Element ? t.closest(TARGETS) : null);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!live) {
        live = true;
        x = tx;
        y = ty;
        mark.classList.add(styles.live);
      }
      start();
    };
    const onDown = () => mark.classList.add(styles.down);
    const onUp = () => mark.classList.remove(styles.down);
    const onOver = (e: PointerEvent) => {
      if (closest(e.target)) mark.classList.add(styles.open);
    };
    const onOut = (e: PointerEvent) => {
      if (closest(e.target) && !closest(e.relatedTarget)) mark.classList.remove(styles.open);
    };
    const hide = () => {
      live = false;
      mark.classList.remove(styles.live, styles.open, styles.down);
    };
    const reassess = () => {
      if (!fine.matches || calm.matches) {
        hide();
        root.classList.remove("has-mark");
      } else {
        root.classList.add("has-mark");
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    fine.addEventListener("change", reassess);
    calm.addEventListener("change", reassess);

    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      fine.removeEventListener("change", reassess);
      calm.removeEventListener("change", reassess);
      root.classList.remove("has-mark");
    };
  }, []);

  return (
    <div ref={ref} className={styles.mark} aria-hidden="true">
      <div className={styles.ring} />
      <div className={styles.cross} />
      <div className={styles.dot} />
    </div>
  );
}
