import type { LandingModel } from "@/lib/content";
import type { CSSProperties } from "react";
import { Picture } from "@/components/primitives/Picture";
import { FooterShots } from "./FooterShots";
import { Horseshoe } from "./horseshoe/Horseshoe";
import { StudioStrip } from "./tumbleweeds/StudioStrip";
import styles from "./SiteFooter.module.css";

type Props = Pick<LandingModel, "footer" | "brand" | "event" | "copy">;

/**
 * Inverted ground (ink, with the stable in half light above the rule) with the ivory mark, section links and the
 * organisations printed on the poster. The #JIA26 badge no longer sits in the corner (promoter, JIA-2026-09-18-09); the
 * colophon under the rule credits the production studio.
 */
export function SiteFooter({ footer, brand, event, copy }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* The ground of the block above the rule: the stable, placed by its post. The invisible marker on the post's
            lit face is what the horseshoe hangs on (horseshoe-scene.ts reads its box), so they always coincide. */}
        {footer.stable ? (
          <div className={styles.stableGround} aria-hidden="true">
            <div className={styles.stable} style={{ "--stable-ratio": String(footer.stable.media.ratio), "--post-centre": String((footer.stable.post.leftPct + footer.stable.post.widthPct / 2) / 100) } as CSSProperties}>
              <Picture media={footer.stable.media} alt="" sizes="(min-width: 760px) 1600px, 300vw" className={styles.stableImg} />
              <span
                data-horseshoe-post=""
                className={styles.post}
                style={{ left: `${footer.stable.post.leftPct}%`, width: `${footer.stable.post.widthPct}%`, top: `${footer.stable.post.nailTopPct}%` }}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.brand}>
          <svg className={styles.wordmark} viewBox={`0 0 ${brand.wordmark.width} ${brand.wordmark.height}`} role="img" aria-label={copy.a11y.wordmark}>
            <use href={`${brand.wordmark.src}#mark`} />
          </svg>
          <p className={styles.name}>{event.fullName}</p>
          <p className={styles.credit}>{footer.credit}</p>
        </div>

        {/* The three lists travel together: one group, centred on the window, evenly spaced (JIA-2026-09-19-40). */}
        <div className={styles.cols}>
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
        </div>

        {/* The horseshoe hangs on the stable's post (or, with no stable, by the window's right edge); not on small windows. */}
        <Horseshoe glb={footer.horseshoe.glb} label={footer.horseshoe.label} />
      </div>

      <StudioStrip studio={footer.studio} tumbleweeds={footer.tumbleweeds} notice={footer.editionTitleNotice} />
      <FooterShots max={footer.maxShots} lifeMs={footer.shotLifeMs} fadeMs={footer.shotFadeMs} />
    </footer>
  );
}
