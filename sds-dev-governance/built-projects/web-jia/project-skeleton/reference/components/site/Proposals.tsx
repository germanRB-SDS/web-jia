import type { LandingModel, MarkKind } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { Action } from "@/components/primitives/Action";
import { Surface } from "@/components/primitives/Surface";
import { Section } from "./Section";
import styles from "./Proposals.module.css";

type Props = { propuestas: LandingModel["propuestas"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 4: present a proposal. Text on the left; a full-height visual column on the right. */
export function Proposals({ propuestas, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <Section id={propuestas.id} title={propuestas.title} subtitle={propuestas.subtitle} marks={propuestas.marks} markLabels={markLabels} showMarks={showMarks} tone="sand" layout="split" className={styles.section}>
      <div className={styles.text}>
        {propuestas.paragraphs.map((p, i) => (
          <p key={p}>
            {p}
            {/* The closing line points down at the action right under it. */}
            {i === propuestas.paragraphs.length - 1 ? <ArrowIcon size={24} className={styles.pointer} /> : null}
          </p>
        ))}
        <Action action={propuestas.action} />
      </div>
      <div className={styles.visual} data-visual="" aria-hidden="true">
        {/* No ratio written by hand: it comes from the media entry. Nothing is painted or masked over the
            photograph either; the left half of the band is the section's own ground (see the CSS). */}
        <Surface media={propuestas.media} alt="" fallback="card" sizes="(min-width: 900px) 53vw, 100vw" className={styles.visualSurface} />
      </div>
    </Section>
  );
}
