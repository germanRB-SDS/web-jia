import type { LandingModel, MarkKind } from "@/lib/content";
import { Marks } from "@/components/primitives/Mark";
import { Picture } from "@/components/primitives/Picture";
import { SheetCard } from "@/components/primitives/SheetCard";
import { Surface } from "@/components/primitives/Surface";
import { CubeCarousel, type CubeItem } from "@/components/cube-carousel";
import { SubSection } from "./Section";
import { IntroVideo } from "./IntroVideo";
import { JornadasRoute } from "./jornadas-route/JornadasRoute";
import { ProgramaDias } from "./programa-dias/ProgramaDias";
import { TalleresCarrusel } from "./talleres-carrusel/TalleresCarrusel";
import styles from "./Jornadas.module.css";

type Props = {
  jornadas: LandingModel["jornadas"];
  copy: LandingModel["copy"];
  showMarks: boolean;
};

/**
 * Area 1: the jornadas. One section, three notebook spreads (programme, how
 * it works, workshops) plus the team cube. Workshops stay a distinct entity
 * from experiences even though both use SheetCard.
 */
export function Jornadas({ jornadas, copy, showMarks }: Props) {
  const markLabels: Record<MarkKind, string> = { provisional: copy.states.provisional, demo: copy.states.demo, pending: copy.states.pending };
  const cardLabels = {
    open: copy.buttons.sheet.open,
    close: copy.buttons.sheet.close,
    pending: copy.states.sheetPending,
    people: copy.jornadas.workshops.peopleLabel,
    theme: copy.jornadas.workshops.themeLabel,
    marks: markLabels,
  };

  // The WANTED cards as items of the cube (the cube knows nothing about people or media).
  const teamItems: CubeItem[] = (jornadas.team?.cards ?? []).map((card) => {
    const largest = card.media?.variants[card.media.variants.length - 1];
    return {
      id: card.id,
      title: card.name,
      subtitle: card.roleLabel,
      alt: card.alt,
      image: card.media && largest
        ? { src: largest.src, srcSet: card.media.variants.map((v) => `${v.src} ${v.width}w`).join(", "), width: largest.width, height: Math.round(largest.width / card.media.ratio) }
        : null,
    };
  });

  return (
    <section id={jornadas.id} aria-labelledby={`${jornadas.id}-title`}>
      {/* The opening: the two riders over the valley behind a dune-coloured veil that
          is dense where the text sits and opens toward the landscape; the poster
          is pinned on the right and opens at full size. */}
      <div className={styles.band}>
        <div className={styles.bandPhoto} aria-hidden="true">
          <Surface media={jornadas.band} alt={jornadas.bandAlt} fallback="sand" sizes="(min-width: 900px) 58vw, 100vw" className={styles.bandSurface} />
          <span className={styles.veil} />
        </div>
        {/* "jornadas-mapa": the text panel beside the photograph; under the text, the wagon
            travels a six-stop road drawn straight on the dune (JIA-2026-09-18-08). */}
        <div id="jornadas-mapa" className={styles.jornadasMapa}>
          <div className={styles.bandText}>
            <h2 id={`${jornadas.id}-title`} className={styles.bandTitle}>
              {jornadas.title}
            </h2>
            {/* The seal floats at the statement's top right and the text runs round it: beside it while it lasts, the
                whole width under it (its right edge is the text's right edge); phones skip it. */}
            <div className={styles.statement}>
              {jornadas.seal ? (
                <div className={styles.seal} aria-hidden="true">
                  <Picture media={jornadas.seal} alt="" sizes="240px" className={styles.sealImg} />
                </div>
              ) : null}
              {jornadas.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <JornadasRoute route={jornadas.route} />
        </div>
      </div>

      {/* ---- Intro: the video, edge to edge, before the programme ---- */}
      <IntroVideo intro={jornadas.introVideo} />

      <div className={styles.spreads}>

      {/* ---- Programa ---- */}
      <SubSection id={jornadas.anchors.programa} label={jornadas.program.title} markLabels={markLabels} showMarks={showMarks}>
        <ProgramaDias days={jornadas.program.days} copy={copy} markLabels={markLabels} showMarks={showMarks} />
      </SubSection>

      {/* ---- Cómo funcionan ---- */}
      <SubSection id={jornadas.anchors.comoFuncionan} label={jornadas.how.title} markLabels={markLabels} showMarks={showMarks}>
        {/* One reading column (prose, then who is behind it) and the cube beside it: no gap between the two texts. */}
        <div className={styles.how} data-team={jornadas.team ? "true" : "false"}>
          <div className={styles.howText}>
            <div className={styles.prose}>
              {jornadas.how.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {jornadas.team ? (
              <div className={styles.teamHead}>
                <h4 className={styles.teamTitle}>{jornadas.team.title}</h4>
                <p className={styles.teamLede}>{jornadas.team.lede}</p>
              </div>
            ) : null}
          </div>
          {jornadas.team ? (
            <div className={styles.teamCube}>
              <CubeCarousel items={teamItems} labels={jornadas.team.cube} />
            </div>
          ) : null}
        </div>
      </SubSection>

      {/* ---- Talleres ---- */}
      <SubSection id={jornadas.anchors.talleres} label={jornadas.workshops.title} markLabels={markLabels} showMarks={showMarks}>
        {showMarks && jornadas.workshops.marks.length ? (
          <p className={styles.hint}>
            <Marks marks={jornadas.workshops.marks} labels={markLabels} show={showMarks} />
          </p>
        ) : null}
        {jornadas.workshops.items.length ? (
          <TalleresCarrusel labels={{ region: copy.jornadas.workshops.carouselLabel, prev: copy.buttons.workshops.prev, next: copy.buttons.workshops.next }}>
            {jornadas.workshops.items.map((sheet) => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                anchorId={`${jornadas.anchors.talleres}-${sheet.id}`}
                labels={{ ...cardLabels, sheetOf: copy.a11y.sheetOf.replace("{title}", sheet.title) }}
                showMarks={showMarks}
                sizes="(min-width: 1100px) 300px, (min-width: 640px) 45vw, 90vw"
                flipBack={jornadas.seal}
              />
            ))}
          </TalleresCarrusel>
        ) : (
          <p className={styles.note}>{copy.states.pending}</p>
        )}
      </SubSection>
      </div>
    </section>
  );
}
