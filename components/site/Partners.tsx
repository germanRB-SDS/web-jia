import type { LandingModel } from "@/lib/content";
import { Picture } from "@/components/primitives/Picture";
import styles from "./Partners.module.css";

type Props = { partners: LandingModel["partners"] };

/**
 * Organiza / colabora: the fields-web "Con quién trabajamos" strip adapted to
 * the notebook. Kicker with a rule, title, framing text on the right, then an
 * ivory plate with the logotypes; while a logo file is missing the name is set
 * in the display face at the same muted weight.
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
        </div>

        <div className={styles.colophon}>
          {partners.groups.map((group) => (
            <div key={group.key} className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <ul className={styles.names}>
                {group.items.map((item) => {
                  const content = item.logo ? (
                    <Picture media={item.logo} alt={item.name} sizes="120px" className={styles.logo} />
                  ) : (
                    <span className={styles.name}>{item.name}</span>
                  );
                  return (
                    <li key={item.id}>
                      {item.url ? (
                        <a href={item.url} className={styles.item} target="_blank" rel="noopener noreferrer">
                          {content}
                        </a>
                      ) : (
                        <span className={styles.item}>{content}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {partners.logosPending ? <p className={styles.pending}>{partners.logosPending}</p> : null}
      </div>
    </section>
  );
}
