"use client";

import { useEffect, useRef } from "react";
import type { LandingModel } from "@/lib/content";
import type { TumbleweedField } from "./tumbleweed-field";
import styles from "../SiteFooter.module.css";

type Props = { studio: LandingModel["footer"]["studio"]; notice: string | null };

/**
 * The strip under the footer's rule: the studio credit and, while the pointer (or the keyboard
 * focus) rests on it, tumbleweeds rolling across behind it. The field is decoration: it loads on
 * the first hover, never with reduced motion, and the link works the same with or without it.
 */
export function StudioStrip({ studio, notice }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const markRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const link = linkRef.current;
    const mark = markRef.current;
    if (!stage || !link || !mark) return;
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
    // A finger has no hover: the tap goes straight to the studio's site.
    const onPointerEnter = (e: PointerEvent) => { if (e.pointerType !== "touch") void enter(); };
    link.addEventListener("pointerenter", onPointerEnter);
    link.addEventListener("pointerleave", leave);
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
    return () => {
      disposed = true;
      link.removeEventListener("pointerenter", onPointerEnter);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("focus", enter);
      link.removeEventListener("blur", leave);
      field?.dispose();
    };
  }, []);

  return (
    <div className={styles.bottom}>
      <div ref={stageRef} className={styles.weeds} aria-hidden="true" />
      <div className={styles.bottomInner}>
        {notice ? <p className={styles.notice}>{notice}</p> : null}
        <a ref={linkRef} href={studio.url} className={styles.studioCredit} target="_blank" rel="noopener noreferrer">
          {/* The mark carries no alt: the sentence beside it already names the studio. */}
          <img ref={markRef} src={studio.mark.src} alt="" width={studio.mark.width} height={studio.mark.height} loading="lazy" decoding="async" className={styles.studioMark} />
          <span className={styles.studioCopy}>
            <span>{studio.prefix}</span>
            <span className={styles.studioName}>{studio.name}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
