import type { CSSProperties, ReactNode } from "react";
import { surfaceVar, type Media, type SurfaceToken } from "@/lib/content";
import { Picture } from "./Picture";
import styles from "./Surface.module.css";

type Props = {
  media: Media | null;
  alt: string;
  fallback: SurfaceToken;
  /** width / height. Defaults to the media ratio or 4/3 for a colour surface. */
  ratio?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  children?: ReactNode;
};

/**
 * An image with a guaranteed footprint: when `media` is null it paints a solid
 * palette surface of the same proportion, so removing an image never breaks
 * the composition and never shows a broken-file icon (brief §12).
 */
export function Surface({ media, alt, fallback, ratio, sizes, className, priority, children }: Props) {
  const aspect = ratio ?? media?.ratio ?? 4 / 3;
  const style = { aspectRatio: String(aspect), background: surfaceVar(fallback) } as CSSProperties;
  return (
    <div className={[styles.surface, className].filter(Boolean).join(" ")} style={style} data-empty={media ? undefined : ""}>
      {media ? <Picture media={media} alt={alt} sizes={sizes} className={styles.img} priority={priority} /> : null}
      {children}
    </div>
  );
}
