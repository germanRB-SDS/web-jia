import type { LandingModel } from "@/lib/content";
import { CollaboratorsCarousel } from "./collaborators-carousel/CollaboratorsCarousel";
import styles from "./Partners.module.css";

type Props = { partners: LandingModel["partners"] };

/**
 * Organiza / colabora, the last band before the footer: kicker with a rule, title, the framing text
 * (organisers linked) on the right, then a hairline and the collaborators' carousel, which runs the
 * whole width of the window.
 */
export function Partners({ partners }: Props) {
  return (
    <section id={partners.id} className={styles.section} aria-labelledby={`${partners.id}-title`}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <p className={styles.kicker}>
              <span>{partners.kicker}</span>
              <span className={styles.rule} aria-hidden="true" />
            </p>
            <h2 id={`${partners.id}-title`} className={styles.title}>
              {partners.title}
            </h2>
          </div>
          <div className={styles.texts}>
          <p className={styles.text}>
            {partners.text.map((part, i) =>
              part.kind === "text" ? (
                <span key={i}>{part.value}</span>
              ) : part.url ? (
                <a key={part.id} href={part.url} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                  {part.name}
                </a>
              ) : (
                <span key={part.id}>{part.name}</span>
              ),
            )}
          </p>
          <p className={styles.text}>{partners.thanks}</p>
          </div>
        </div>
      </div>
      <CollaboratorsCarousel carousel={partners.carousel} />
    </section>
  );
}
