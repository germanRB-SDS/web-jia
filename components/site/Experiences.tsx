import type { LandingModel, MarkKind } from "@/lib/content";
import { Surface } from "@/components/primitives/Surface";
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
    theme: copy.experiencias.relatedWorkshops,
    marks: markLabels,
  };
  return (
    <Section
      id={experiencias.id}
      title={experiencias.title}
      lede={experiencias.lede}
      markLabels={markLabels}
      showMarks={showMarks}
      className={styles.section}
      backdrop={
        experiencias.media ? (
          <div className={styles.photo} aria-hidden="true">
            <Surface media={experiencias.media} alt="" fallback={experiencias.fallback} sizes="100vw" className={styles.surface} />
          </div>
        ) : null
      }
    >
      {experiencias.items.length ? (
        <>
          <div className={styles.grid}>
            {experiencias.items.map((sheet) => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                anchorId={`${experiencias.id}-${sheet.id}`}
                labels={{ ...cardLabels, sheetOf: copy.a11y.sheetOf.replace("{title}", sheet.title) }}
                showMarks={showMarks}
                variant="wide"
                mediaRatio={16 / 9}
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
