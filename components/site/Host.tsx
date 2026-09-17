import type { LandingModel, MarkKind } from "@/lib/content";
import { Action } from "@/components/primitives/Action";
import { Surface } from "@/components/primitives/Surface";
import { Section } from "./Section";
import styles from "./Host.module.css";

type Props = { acoge: LandingModel["acoge"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 5: host a future edition. Solid palette surfaces stand in for the photographs to come. */
export function Host({ acoge, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  return (
    <Section id={acoge.id} title={acoge.title} marks={acoge.marks} markLabels={markLabels} showMarks={showMarks}>
      <div className={styles.split}>
        <div className={styles.panels} aria-hidden="true">
          {acoge.panels.map((panel, i) => (
            <Surface key={i} media={panel.media} alt="" fallback={panel.fallback} ratio={i === 0 ? 4 / 5 : 1} className={styles.panel} />
          ))}
        </div>
        <div className={styles.text}>
          {acoge.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Action action={acoge.action} />
        </div>
      </div>
    </Section>
  );
}
