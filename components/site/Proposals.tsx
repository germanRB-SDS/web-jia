import type { LandingModel, MarkKind } from "@/lib/content";
import { Action } from "@/components/primitives/Action";
import { Surface } from "@/components/primitives/Surface";
import { Section } from "./Section";
import styles from "./Proposals.module.css";

type Props = { propuestas: LandingModel["propuestas"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 4: present a proposal. Text on the left; a full-height visual column on the right. */
export function Proposals({ propuestas, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <Section id={propuestas.id} title={propuestas.title} subtitle={propuestas.subtitle} marks={propuestas.marks} markLabels={markLabels} showMarks={showMarks} tone="sand" layout="split">
      <div className={styles.text}>
        {propuestas.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <Action action={propuestas.action} />
      </div>
      <div className={styles.visual} data-visual="" aria-hidden="true">
        <Surface media={propuestas.media} alt="" fallback="card" ratio={1059 / 755} sizes="(min-width: 900px) 50vw, 100vw" className={styles.visualSurface} />
        <span className={styles.visualVeil} />
      </div>
    </Section>
  );
}
