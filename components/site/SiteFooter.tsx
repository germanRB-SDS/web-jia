import type { LandingModel, MarkKind } from "@/lib/content";
import { Marks } from "@/components/primitives/Mark";
import { Picture } from "@/components/primitives/Picture";
import styles from "./SiteFooter.module.css";

type Props = Pick<LandingModel, "footer" | "brand" | "event" | "copy" | "nav"> & { showMarks: boolean };

/** Inverted ground (ink) with the ivory mark, section links and the organisations printed on the poster. */
export function SiteFooter({ footer, brand, event, copy, nav, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <svg className={styles.wordmark} viewBox={`0 0 ${brand.wordmark.width} ${brand.wordmark.height}`} role="img" aria-label={copy.a11y.wordmark}>
            <use href={`${brand.wordmark.src}#mark`} />
          </svg>
          <p className={styles.name}>{event.fullName}</p>
          <p className={styles.credit}>{footer.credit}</p>
          {brand.badge ? (
            <span className={styles.badge}>
              <Picture media={brand.badge} alt={copy.a11y.badge} sizes="96px" />
            </span>
          ) : null}
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
          <h2 className={styles.colTitle}>
            {copy.footer.organiza} <Marks marks={footer.marks} labels={markLabels} show={showMarks} />
          </h2>
          <ul className={styles.orgs}>
            {footer.organiza.map((o) => (
              <li key={o.id}>{o.url ? <a href={o.url}>{o.name}</a> : o.name}</li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>
            {copy.footer.colabora} <Marks marks={footer.marks} labels={markLabels} show={showMarks} />
          </h2>
          <ul className={styles.orgs}>
            {footer.colabora.map((o) => (
              <li key={o.id}>{o.url ? <a href={o.url}>{o.name}</a> : o.name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          {footer.previewNotice ? <p className={styles.notice}>{footer.previewNotice}</p> : null}
          {footer.editionTitleNotice ? <p className={styles.notice}>{footer.editionTitleNotice}</p> : null}
          <a href={nav.homeHref} className={styles.top}>
            {copy.buttons.common.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
