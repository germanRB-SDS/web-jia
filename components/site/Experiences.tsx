import type { CSSProperties } from "react";
import type { LandingModel, MarkKind } from "@/lib/content";
import { Surface } from "@/components/primitives/Surface";
import { SheetCard } from "@/components/primitives/SheetCard";
import { SunRays } from "./sun-rays/SunRays";
import { glyphTiming } from "./sun-rays/config";
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
  /* Nothing sits between the title of an experience and its «Ver ficha»: no subtitle, no people, no theme. Those
     three rows of the card would still be paid for, one section row gap each — 96 px of empty paper under the
     title, the same reserve that the cards already drop on a phone. The section decides it for all its cards at
     once, so they keep sharing a row structure; the day one experience carries any of the three, the seven-row
     card comes back for every one of them and the actions go on lining up. */
  const compact = experiencias.items.every((x) => !x.subtitle && !x.people.length && !x.meta);
  /* The blackboard is written letter by letter ([51-0]). Each letter is given its place in the queue here, so
     the whole name takes the same two and a half seconds however long it is and into however many lines it
     breaks: nothing downstream knows what the board says. The spaces keep their turn — a hand crossing a gap
     takes as long as a hand drawing a letter — and become hard spaces so an inline box can hold them. */
  let queued = 0;
  const chalkLines = copy.experiencias.board.map((line) => ({
    line,
    glyphs: [...line].map((ch) => ({ ch: ch === " " ? " " : ch, at: queued++ })),
  }));
  const chalk = glyphTiming(queued);
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
          /* The ground of the section is a stack of layers, not a photograph ([51-0]). From the back:
               1. the classroom, with the chalk on its blackboard;
               2. the sun coming in through its window;
               3. the same teacher, cut out of that same frame and laid exactly back on herself;
               4. the heading and the sheets, which the section already puts above all of this.
             The light is between 1 and 3, so it passes BEHIND her and she stops it. That, and nothing else,
             is what turns a flat photograph into a room with air in it.
             `data-classroom` is the handle the client piece uses to find this stack. */
          <div className={styles.photo} data-classroom="" aria-hidden="true">
            <Surface media={experiencias.media} alt="" fallback={experiencias.fallback} sizes="100vw" className={styles.surface} />
            {/* The name of the jornadas written in chalk on the blackboard at the back of the classroom. The
                frame below is the photograph's own rectangle (see the CSS), so the lettering is placed in
                percentages OF THE IMAGE and lands on the slate at every width. Decorative: the backdrop is
                already aria-hidden and the name is in the title, the h1 and the badge.
                Since [51-0] it writes itself when the section arrives; with no JavaScript it is simply there. */}
            <div className={styles.boardFrame}>
              <p
                className={styles.board}
                style={{ "--chalk-duration": `${chalk.duration}s`, "--chalk-step": `${chalk.step}s` } as CSSProperties}
              >
                {chalkLines.map(({ line, glyphs }) => (
                  <span key={line} className={styles.chalkLine}>
                    {glyphs.map(({ ch, at }) => (
                      <span key={at} className={styles.glyph} style={{ "--chalk-at": at } as CSSProperties}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            </div>
            <SunRays />
            {/* Layer 3. It is NOT a second photograph: it is the same pixels, with everything but her taken
                away, so it can only ever land back exactly where she already is. What guarantees that is that
                it shares this box, this ratio and this focal point with layer 1 — see lib/content/media.ts. */}
            {experiencias.cutout ? (
              <Surface
                media={experiencias.cutout}
                alt=""
                fallback={experiencias.fallback}
                sizes="100vw"
                className={`${styles.surface} ${styles.cutout}`}
                priority
              />
            ) : null}
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
                compact={compact}
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
