import type { LandingModel, MarkKind } from "@/lib/content";
import { LanternIcon } from "@/components/icons";
import { Action } from "@/components/primitives/Action";
import { Marks } from "@/components/primitives/Mark";
import { Section } from "./Section";
import styles from "./Dossiers.module.css";

type Props = { dosieres: LandingModel["dosieres"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 2: teaching dossiers. A flexible shelf; empty until documents exist. */
export function Dossiers({ dosieres, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <Section id={dosieres.id} title={dosieres.title} lede={dosieres.lede} markLabels={markLabels} showMarks={showMarks} tone="sand">
      {dosieres.items.length ? (
        <ul className={styles.list}>
          {dosieres.items.map((r) => (
            <li key={r.id} id={`${dosieres.id}-${r.id}`} className={styles.item}>
              <div className={styles.itemText}>
                <p className={styles.format}>{r.formatLabel}</p>
                <h3 className={styles.itemTitle}>{r.title}</h3>
                {r.summary ? <p className={styles.summary}>{r.summary}</p> : null}
                <Marks marks={r.marks} labels={markLabels} show={showMarks} />
              </div>
              <Action action={r.action} variant="secondary" />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <LanternIcon size={56} />
          </span>
          <p className={styles.emptyText}>{dosieres.empty}</p>
        </div>
      )}
    </Section>
  );
}
