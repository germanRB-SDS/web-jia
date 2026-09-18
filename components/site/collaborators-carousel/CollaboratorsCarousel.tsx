"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { LandingModel } from "@/lib/content";
import { createCarouselEngine } from "./carousel-engine";
import { CollaboratorCard } from "./CollaboratorCard";
import { COLLABORATORS_CAROUSEL } from "./config";
import styles from "./CollaboratorsCarousel.module.css";

type Props = { carousel: LandingModel["partners"]["carousel"] };

/**
 * The collaborators, as a strip of cards dragged left or right (mouse, finger, a sideways wheel, ← / →).
 * It has no end: the set is repeated as many times as the width asks for, and only the second set is real
 * (focusable, announced). The rule above it is the page's left edge, where the first card rests.
 */
export function CollaboratorsCarousel({ carousel }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState<number>(COLLABORATORS_CAROUSEL.minCopies);
  const count = carousel.items.length;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const anchor = anchorRef.current;
    if (!viewport || !track || !anchor || !count) return;
    return createCarouselEngine({ viewport, track, anchor, count, onCopies: setCopies });
  }, [count]);

  if (!count) return null;

  return (
    <div className={styles.carousel}>
      <div ref={anchorRef} className={styles.rule} />
      <div ref={viewportRef} className={styles.viewport} role="group" aria-label={carousel.label} tabIndex={0}>
        <ul ref={trackRef} className={styles.track}>
          {Array.from({ length: copies }, (_, set) =>
            carousel.items.map((item, index) => <CollaboratorCard key={`${set}-${item.id}`} item={item} index={index} copy={set !== 1} />),
          )}
        </ul>
      </div>
      <p className={styles.hint}>{carousel.hint}</p>
    </div>
  );
}
