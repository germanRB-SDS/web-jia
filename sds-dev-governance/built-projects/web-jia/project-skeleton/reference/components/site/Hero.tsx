import type { LandingModel } from "@/lib/content";
import { StarIcon } from "@/components/icons";
import { Action } from "@/components/primitives/Action";
import { Marks } from "@/components/primitives/Mark";
import { Picture } from "@/components/primitives/Picture";
import { Surface } from "@/components/primitives/Surface";
import styles from "./Hero.module.css";

type Props = { hero: LandingModel["hero"]; brand: LandingModel["brand"]; markLabels: LandingModel["copy"]["states"]; showMarks: boolean };

/**
 * The render's first screen rebuilt as interface: a quiet paper zone on the
 * left carries the lockup, the edition title, one paragraph and two actions;
 * the photograph bleeds from the right and dissolves into the paper.
 */
export function Hero({ hero, brand, markLabels, showMarks }: Props) {
  const marks = { provisional: markLabels.provisional, demo: markLabels.demo, pending: markLabels.pending };
  return (
    <section id={hero.id} className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.photo}>
        <Surface media={hero.media} alt={hero.alt} fallback={hero.fallback} sizes="(min-width: 960px) 64vw, 100vw" className={styles.surface} priority />
        <span className={styles.light} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <h1 id="hero-name" className={styles.lockup}>
          <svg className={styles.wordmark} viewBox={`0 0 ${brand.wordmark.width} ${brand.wordmark.height}`} aria-hidden="true" focusable="false">
            <use href={`${brand.wordmark.src}#mark`} />
          </svg>
          {/* The seal stands for the lettering (it carries the same words); the heading keeps its name for everyone. */}
          {hero.seal ? (
            <>
              <span className={styles.srOnly}>{hero.nameLines.join(" ")}</span>
              <Picture media={hero.seal} alt="" sizes="(min-width: 1300px) 186px, (min-width: 740px) 14.4vw, 107px" className={styles.seal} priority />
            </>
          ) : (
            <span className={styles.name}>
              {hero.nameLines.map((line) => (
                <span key={line} className={styles.nameLine}>
                  {line}
                </span>
              ))}
            </span>
          )}
        </h1>

        <div className={styles.rule} aria-hidden="true">
          <StarIcon />
        </div>

        <p className={styles.title}>
          <span>{hero.title}</span>
          <Marks marks={hero.titleMarks} labels={marks} show={showMarks} className={styles.titleMark} />
        </p>
        {hero.dateline ? (
          <p className={styles.dateline}>
            <span>{hero.dateline}</span>
            <Marks marks={hero.datelineMarks} labels={marks} show={showMarks} />
          </p>
        ) : null}
        <p className={styles.lede}>{hero.lede}</p>

        <div className={styles.actions}>
          {hero.actions.map((a, i) => (
            <Action key={a.id} action={a} variant={i === 0 ? "primary" : "secondary"} />
          ))}
        </div>
      </div>
    </section>
  );
}
