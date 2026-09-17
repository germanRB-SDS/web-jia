import type { LandingModel, MarkKind } from "@/lib/content";
import { CompassIcon } from "@/components/icons";
import { Action } from "@/components/primitives/Action";
import { Section } from "./Section";
import styles from "./Proposals.module.css";

type Props = { propuestas: LandingModel["propuestas"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 4: present a proposal. An invitation plus a prepared, honest action slot. */
export function Proposals({ propuestas, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <Section id={propuestas.id} title={propuestas.title} marks={propuestas.marks} markLabels={markLabels} showMarks={showMarks} tone="sand">
      <div className={styles.split}>
        <div className={styles.text}>
          {propuestas.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Action action={propuestas.action} />
        </div>
        <div className={styles.panel} aria-hidden="true">
          <CompassIcon size={160} />
        </div>
      </div>
    </Section>
  );
}
