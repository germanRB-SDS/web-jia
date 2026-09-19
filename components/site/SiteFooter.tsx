import type { LandingModel } from "@/lib/content";
import { FooterShots } from "./FooterShots";
import { Horseshoe } from "./horseshoe/Horseshoe";
import { StudioStrip } from "./tumbleweeds/StudioStrip";
import styles from "./SiteFooter.module.css";

type Props = Pick<LandingModel, "footer" | "brand" | "event" | "copy">;

/**
 * Inverted ground (ink) with the ivory mark, section links and the organisations printed on
 * the poster. The #JIA26 badge no longer sits in the corner (promoter, JIA-2026-09-18-09); the
 * colophon under the rule credits the production studio.
 */
export function SiteFooter({ footer, brand, event, copy }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand} data-hang-anchor="">
          <svg className={styles.wordmark} viewBox={`0 0 ${brand.wordmark.width} ${brand.wordmark.height}`} role="img" aria-label={copy.a11y.wordmark}>
            <use href={`${brand.wordmark.src}#mark`} />
          </svg>
          <p className={styles.name}>{event.fullName}</p>
          <p className={styles.credit}>{footer.credit}</p>
        </div>

        <nav className={styles.col} aria-label={copy.footer.sections}>
          <h2 className={styles.colTitle}>{copy.footer.sections}</h2>
          <ul className={styles.links}>
            {footer.sections.map((s) => (
              <li key={s.href}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{copy.footer.organiza}</h2>
          <ul className={styles.orgs}>
            {footer.organiza.map((o) => (
              <li key={o.id}>{o.url ? <a href={o.url} target="_blank" rel="noopener noreferrer">{o.name}</a> : o.name}</li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>{copy.footer.colabora}</h2>
          <ul className={styles.orgs}>
            {footer.colabora.map((o) => (
              <li key={o.id}>{o.url ? <a href={o.url} target="_blank" rel="noopener noreferrer">{o.name}</a> : o.name}</li>
            ))}
          </ul>
        </div>

        {/* The horseshoe hangs from the footer's top edge (horseshoe/), over this block and never over the strip. */}
        <Horseshoe glb={footer.horseshoe.glb} label={footer.horseshoe.label} />
      </div>

      <StudioStrip studio={footer.studio} tumbleweeds={footer.tumbleweeds} notice={footer.editionTitleNotice} />
      <FooterShots max={footer.maxShots} lifeMs={footer.shotLifeMs} fadeMs={footer.shotFadeMs} />
    </footer>
  );
}
