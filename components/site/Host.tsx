import type { LandingModel } from "@/lib/content";
import { Action } from "@/components/primitives/Action";
import { Surface } from "@/components/primitives/Surface";
import styles from "./Host.module.css";

type Props = { acoge: LandingModel["acoge"]; copy: LandingModel["copy"] };

/**
 * Area 5: host a future edition. A full-bleed photographic band: the archer
 * holds the left, the clear ground on the right carries the call. The band
 * fades in from paper at the top and into ink at the bottom so it hands over
 * to the footer without a seam.
 */
export function Host({ acoge, copy }: Props) {
  return (
    <section id={acoge.id} className={styles.band} aria-labelledby={`${acoge.id}-title`}>
      <div className={styles.photo}>
        <Surface media={acoge.media} alt={acoge.alt} fallback={acoge.fallback} ratio={1922 / 818} sizes="100vw" className={styles.surface} />
      </div>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 id={`${acoge.id}-title`} className={styles.title}>
            {acoge.title}
          </h2>
          <p className={styles.subtitle}>{acoge.subtitle}</p>
          {acoge.paragraphs.map((p) => (
            <p key={p} className={styles.p}>
              {p}
            </p>
          ))}
          <Action action={acoge.action} />
        </div>
      </div>
      <span className={styles.hint} aria-hidden="true">
        {copy.nav.areas.acoge}
      </span>
    </section>
  );
}
