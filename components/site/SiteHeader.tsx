import type { LandingModel } from "@/lib/content";
import { Picture } from "@/components/primitives/Picture";
import { SiteNav } from "./SiteNav";
import styles from "./SiteHeader.module.css";

type Props = Pick<LandingModel, "nav" | "brand" | "event" | "copy">;

export function SiteHeader({ nav, brand, event, copy }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href={nav.homeHref} className={styles.lockup} aria-label={`${event.shortName} · ${event.fullName} · ${copy.nav.home}`}>
          <svg className={styles.wordmark} viewBox={`0 0 ${brand.wordmark.width} ${brand.wordmark.height}`} aria-hidden="true" focusable="false">
            <use href={`${brand.wordmark.src}#mark`} />
          </svg>
          <span className={styles.name} aria-hidden="true">
            {event.nameLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        </a>
        <SiteNav items={nav.items} studio={nav.studio} labels={{ menu: copy.buttons.nav.menu, close: copy.buttons.nav.close, submenu: copy.buttons.nav.submenu, region: copy.a11y.mainNav, newTab: copy.footer.newTab }} />
        {brand.badge ? (
          <span className={styles.badge}>
            <Picture media={brand.badge} alt={copy.a11y.badge} sizes="56px" />
          </span>
        ) : null}
      </div>
    </header>
  );
}
