"use client";

import { useEffect, useRef } from "react";
import type { LandingModel } from "@/lib/content";
import type { TumbleweedField } from "./tumbleweed-field";
import styles from "../SiteFooter.module.css";

type Props = { studio: LandingModel["footer"]["studio"]; tumbleweeds: LandingModel["footer"]["tumbleweeds"]; notice: string | null };

/**
 * The strip under the footer's rule: the studio credit, a small link that says what is rolling by,
 * and, while the pointer (or the keyboard focus) is anywhere on the footer, tumbleweeds crossing
 * behind them. The field is decoration: it loads on the first hover, never with reduced motion,
 * and the links work the same with or without it.
 */
export function StudioStrip({ studio, tumbleweeds, notice }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const mark = markRef.current;
    const footer = stage?.closest("footer");
    if (!stage || !footer || !mark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let field: TumbleweedField | null = null;
    let over = false;
    let disposed = false;
    const enter = async () => {
      over = true;
      if (!field) {
        const { TumbleweedField } = await import("./tumbleweed-field");
        if (disposed) return;
        field ??= new TumbleweedField(stage, mark);
      }
      if (over) field.start();
    };
    const leave = () => {
      over = false;
      field?.stop();
    };
    // A finger has no hover: nothing rolls on a touch screen.
    const onPointerEnter = (e: PointerEvent) => { if (e.pointerType !== "touch") void enter(); };
    const onFocusOut = (e: FocusEvent) => { if (!footer.contains(e.relatedTarget as Node | null)) leave(); };
    footer.addEventListener("pointerenter", onPointerEnter);
    footer.addEventListener("pointerleave", leave);
    footer.addEventListener("focusin", enter);
    footer.addEventListener("focusout", onFocusOut);
    return () => {
      disposed = true;
      footer.removeEventListener("pointerenter", onPointerEnter);
      footer.removeEventListener("pointerleave", leave);
      footer.removeEventListener("focusin", enter);
      footer.removeEventListener("focusout", onFocusOut);
      field?.dispose();
    };
  }, []);

  return (
    <div className={styles.bottom}>
      <div ref={stageRef} className={styles.weeds} aria-hidden="true" />
      <div className={styles.bottomInner}>
        {notice ? <p className={styles.notice}>{notice}</p> : null}
        <a href={studio.url} className={styles.studioCredit} target="_blank" rel="noopener noreferrer">
          {/* The mark carries no alt: the sentence beside it already names the studio. */}
          <img ref={markRef} src={studio.mark.src} alt="" width={studio.mark.width} height={studio.mark.height} loading="lazy" decoding="async" className={styles.studioMark} />
          <span className={styles.studioCopy}>
            <span>{studio.prefix}</span>
            <span className={styles.studioName}>{studio.name}</span>
          </span>
        </a>
      </div>
      {/* Positioned against the strip itself (its bottom right corner), not the centred container. */}
      <a href={tumbleweeds.href} className={styles.weedsNote} target="_blank" rel="noopener noreferrer" aria-label={`${tumbleweeds.label} (${tumbleweeds.newTab})`}>
        {tumbleweeds.label}
      </a>
    </div>
  );
}
