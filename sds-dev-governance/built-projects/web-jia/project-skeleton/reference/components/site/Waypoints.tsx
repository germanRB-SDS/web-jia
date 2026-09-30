import type { LandingModel } from "@/lib/content";
import { ArrowIcon, CactusIcon, CompassIcon, HatIcon, LanternIcon } from "@/components/icons";
import styles from "./Waypoints.module.css";

const ICONS = { hat: HatIcon, cactus: CactusIcon, compass: CompassIcon, lantern: LanternIcon } as const;

type Props = { waypoints: LandingModel["waypoints"]; title: string; regionLabel: string };

/** The signpost under the hero: four routes into the page, each with its icon from the family. */
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
                <a href={w.href} className={styles.item}>
                  <span className={styles.icon}>
                    <Icon size={44} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{w.label}</span>
                    <span className={styles.line}>{w.line}</span>
                  </span>
                  <ArrowIcon className={styles.arrow} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
