import type { LandingModel, MarkKind } from "@/lib/content";
import { Marks } from "@/components/primitives/Mark";
import { SheetCard } from "@/components/primitives/SheetCard";
import { Section } from "./Section";
import styles from "./Experiences.module.css";

type Props = { experiencias: LandingModel["experiencias"]; copy: LandingModel["copy"]; showMarks: boolean };

/** Area 3: experiences already taken to the classroom. Not a second list of workshops. */
export function Experiences({ experiencias, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  const cardLabels = {
    open: copy.buttons.sheet.open,
    close: copy.buttons.sheet.close,
    pending: copy.states.sheetPending,
    people: copy.experiencias.fields.presents,
    marks: markLabels,
  };
  return (
    <Section id={experiencias.id} title={experiencias.title} lede={experiencias.lede} marks={experiencias.marks} markLabels={markLabels} showMarks={showMarks}>
      {experiencias.items.length ? (
        <>
          <p className={styles.hint}>
            {experiencias.demoNotice ? (
              <>
                <Marks marks={["demo"]} labels={markLabels} show={showMarks} /> <span>{experiencias.demoNotice}</span>{" "}
              </>
            ) : null}
            <span>{experiencias.hint}</span>
          </p>
          <div className={styles.grid}>
            {experiencias.items.map((sheet) => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                anchorId={`${experiencias.id}-${sheet.id}`}
                labels={{ ...cardLabels, sheetOf: copy.a11y.sheetOf.replace("{title}", sheet.title) }}
                showMarks={showMarks}
                variant="wide"
                heading="h3"
                sizes="(min-width: 900px) 420px, 90vw"
              />
            ))}
          </div>
        </>
      ) : (
        <p className={styles.empty}>{experiencias.empty}</p>
      )}
    </Section>
  );
}
