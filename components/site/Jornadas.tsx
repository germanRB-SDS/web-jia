import type { LandingModel, MarkKind } from "@/lib/content";
import { Marks } from "@/components/primitives/Mark";
import { SheetCard } from "@/components/primitives/SheetCard";
import { Surface } from "@/components/primitives/Surface";
import { Section, SubSection } from "./Section";
import styles from "./Jornadas.module.css";

type Props = {
  jornadas: LandingModel["jornadas"];
  copy: LandingModel["copy"];
  showMarks: boolean;
};

/**
 * Area 1: the jornadas. One section, three notebook spreads (programme, how
 * it works, workshops) plus the team strip. Workshops stay a distinct entity
 * from experiences even though both use SheetCard.
 */
export function Jornadas({ jornadas, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  const cardLabels = {
    open: copy.buttons.sheet.open,
    close: copy.buttons.sheet.close,
    pending: copy.states.sheetPending,
    people: copy.jornadas.workshops.peopleLabel,
    marks: markLabels,
  };

  return (
    <Section id={jornadas.id} title={jornadas.title} markLabels={markLabels} showMarks={showMarks}>
      <div className={styles.intro}>
        <p className={styles.introText}>{jornadas.intro}</p>
        {jornadas.poster ? (
          <figure className={styles.poster}>
            <Surface media={jornadas.poster} alt={copy.a11y.cartel} fallback="sand" sizes="(min-width: 900px) 320px, 70vw" />
            <figcaption className={styles.posterCaption}>{jornadas.hashtag}</figcaption>
          </figure>
        ) : null}
      </div>

      {/* ---- Programa ---- */}
      <SubSection id={jornadas.anchors.programa} label={jornadas.program.title} markLabels={markLabels} showMarks={showMarks}>
        <ol className={styles.days}>
          {jornadas.program.days.map((day) => (
            <li key={day.id} className={styles.day}>
              <div className={styles.dayHead}>
                <h4 className={styles.dayLabel}>{day.label}</h4>
                <Marks marks={day.marks} labels={markLabels} show={showMarks} />
              </div>
              {day.dateText ? (
                <p className={styles.dayDate}>
                  <time dateTime={day.dateIso ?? undefined}>{day.dateText}</time>
                </p>
              ) : (
                <p className={styles.dayDate}>{copy.states.dateTbc}</p>
              )}
              <dl className={styles.dayMeta}>
                <div>
                  <dt>{copy.jornadas.program.venueLabel}</dt>
                  <dd>{day.venue ?? copy.states.venueTbc}</dd>
                </div>
                <div>
                  <dt>{copy.jornadas.program.hoursLabel}</dt>
                  <dd>{day.hours.length ? day.hours.join(" · ") : copy.states.hoursTbc}</dd>
                </div>
              </dl>
              <ol className={styles.sessions}>
                {day.sessions.map((s) => (
                  <li key={s.id} className={styles.session}>
                    {s.time ? <span className={styles.sessionTime}>{s.time}</span> : null}
                    <span className={styles.sessionText}>{s.text}</span>
                    {s.link ? (
                      <a href={s.link.href} className={styles.sessionLink}>
                        {s.link.label}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
              {day.provenanceNote && showMarks ? <p className={styles.provenance}>{day.provenanceNote}</p> : null}
            </li>
          ))}
        </ol>
        <p className={styles.note}>{jornadas.program.note}</p>
      </SubSection>

      {/* ---- Cómo funcionan ---- */}
      <SubSection id={jornadas.anchors.comoFuncionan} label={jornadas.how.title} marks={jornadas.how.marks} markLabels={markLabels} showMarks={showMarks}>
        <div className={styles.prose}>
          {jornadas.how.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {jornadas.team ? (
          <div className={styles.team}>
            <h4 className={styles.teamTitle}>{jornadas.team.title}</h4>
            <p className={styles.teamLede}>{jornadas.team.lede}</p>
            <div className={styles.strip} role="region" aria-label={copy.a11y.teamRegion} tabIndex={0}>
              <ul className={styles.stripList}>
                {jornadas.team.cards.map((card) => (
                  <li key={card.id} className={styles.stripItem}>
                    <figure className={styles.member}>
                      <Surface media={card.media} alt={card.alt} fallback={card.fallback} ratio={1414 / 2000} sizes="180px" className={styles.memberImg} />
                      <figcaption className={styles.memberCaption}>
                        <span className={styles.memberName}>{card.name}</span>
                        <span className={styles.memberRole}>{card.roleLabel}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </SubSection>

      {/* ---- Talleres ---- */}
      <SubSection id={jornadas.anchors.talleres} label={jornadas.workshops.title} markLabels={markLabels} showMarks={showMarks}>
        <p className={styles.lede}>{jornadas.workshops.lede}</p>
        <p className={styles.hint}>{jornadas.workshops.hint}</p>
        {jornadas.workshops.items.length ? (
          <div className={styles.grid}>
            {jornadas.workshops.items.map((sheet) => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                anchorId={`${jornadas.anchors.talleres}-${sheet.id}`}
                labels={{ ...cardLabels, sheetOf: copy.a11y.sheetOf.replace("{title}", sheet.title) }}
                showMarks={showMarks}
                sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 90vw"
              />
            ))}
          </div>
        ) : (
          <p className={styles.note}>{copy.states.pending}</p>
        )}
      </SubSection>
    </Section>
  );
}
