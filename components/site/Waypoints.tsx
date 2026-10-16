import type { LandingModel } from "@/lib/content";
import { ArrowIcon, ArrowsIcon, BoardIcon, CactusIcon, CompassIcon, ExternalIcon, HatIcon, HoofprintsIcon, LampIcon, LanternIcon } from "@/components/icons";
import styles from "./Waypoints.module.css";

const ICONS = { hat: HatIcon, cactus: CactusIcon, compass: CompassIcon, lantern: LanternIcon, board: BoardIcon, hoofprints: HoofprintsIcon, lamp: LampIcon, arrows: ArrowsIcon } as const;

type Props = { waypoints: LandingModel["waypoints"]; title: string; regionLabel: string };

/** The signpost under the hero: the routes into the page, each with its icon from the family. One that leaves the
    site (the «Bandos») opens in a new tab and says so: an outward arrow, and the warning for a screen reader. */
export function Waypoints({ waypoints, title, regionLabel }: Props) {
  return (
    <nav className={styles.strip} aria-label={regionLabel}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <ul className={styles.list}>
          {waypoints.map((w) => {
            const Icon = ICONS[w.icon];
            return (
              <li key={w.id}>
                <a href={w.href} className={styles.item} {...(w.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className={styles.icon}>
                    <Icon size={44} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{w.label}</span>
                    <span className={styles.line}>{w.line}</span>
                    {w.external ? <span className={styles.srOnly}> ({w.newTab})</span> : null}
                  </span>
                  {w.external ? <ExternalIcon className={`${styles.arrow} ${styles.external}`} /> : <ArrowIcon className={styles.arrow} />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
