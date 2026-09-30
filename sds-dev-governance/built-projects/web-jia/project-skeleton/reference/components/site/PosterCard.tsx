"use client";

import { useCallback, useState } from "react";
import type { Media } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { Picture } from "@/components/primitives/Picture";
import { SheetDialog } from "@/components/primitives/SheetDialog";
import { Surface } from "@/components/primitives/Surface";
import styles from "./PosterCard.module.css";

type Props = {
  media: Media;
  alt: string;
  caption: string;
  labels: { open: string; close: string };
  /** "small" sits under a text block (10rem wide); default is the full card. */
  size?: "default" | "small";
};

/**
 * The event poster, pinned to the band like a lobby card: slightly turned at
 * rest, it straightens and lifts under the pointer, and a real button opens it
 * at full size in the same dialog the sheets use (mouse, keyboard and touch).
 */
export function PosterCard({ media, alt, caption, labels, size = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <figure className={`${styles.card} ${size === "small" ? styles.small : ""}`}>
      <button type="button" className={styles.trigger} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <Surface media={media} alt={alt} fallback="card" sizes="(min-width: 900px) 22rem, 70vw" className={styles.surface} />
        <span className={styles.label}>
          <span>{labels.open}</span>
          <ArrowIcon />
        </span>
      </button>
      <figcaption className={styles.caption}>{caption}</figcaption>

      <SheetDialog open={open} onClose={close} label={alt} closeLabel={labels.close}>
        <div className={styles.full}>
          <Picture media={media} alt={alt} sizes="(min-width: 900px) 640px, 92vw" className={styles.fullImg} priority={open} />
        </div>
      </SheetDialog>
    </figure>
  );
}
