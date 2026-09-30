import type { CSSProperties } from "react";
import type { Media } from "@/lib/content";

type Props = {
  media: Media;
  alt: string;
  /** `sizes` attribute for responsive selection; defaults to full width. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  /** Load now even when not priority: for pictures that slide into view sideways (a moving strip), where the
      browser's lazy loading, which watches the page's scroll, would let them arrive blank. */
  eager?: boolean;
};

/** Responsive <img> built from a media registry entry. No optimizer, no layout shift. */
export function Picture({ media, alt, sizes = "100vw", className, style, priority = false, eager = false }: Props) {
  const largest = media.variants[media.variants.length - 1];
  const srcSet = media.variants.map((v) => `${v.src} ${v.width}w`).join(", ");
  const height = Math.round(largest.width / media.ratio);
  const objectPosition = media.focal ? `${media.focal.x}% ${media.focal.y}%` : undefined;
  return (
    <img
      src={largest.src}
      srcSet={srcSet}
      sizes={sizes}
      width={largest.width}
      height={height}
      alt={alt}
      className={className}
      style={{ objectPosition, ...style }}
      loading={priority || eager ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
