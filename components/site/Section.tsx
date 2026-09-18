import type { ReactNode } from "react";
import type { MarkKind } from "@/lib/content";
import { Marks } from "@/components/primitives/Mark";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  title: string;
  /** Second line under the title: between title and lede in size (the `subtitle` class). */
  subtitle?: string | null;
  lede?: string | null;
  marks?: MarkKind[];
  markLabels: Record<MarkKind, string>;
  showMarks: boolean;
  tone?: "paper" | "sand" | "ink" | "ivory";
  /** "split" keeps the head inside the left column so a visual column can sit beside it. */
  layout?: "stack" | "split";
  children: ReactNode;
};

/** A main area: heading, optional lede, then the section's own composition. */
export function Section({ id, title, subtitle, lede, marks = [], markLabels, showMarks, tone = "paper", layout = "stack", children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} className={`${styles.section} ${styles[tone]}`} aria-labelledby={headingId}>
      <div className={`${styles.inner} ${layout === "split" ? styles.split : ""}`}>
        <header className={styles.head}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          {lede ? <p className={styles.lede}>{lede}</p> : null}
          <Marks marks={marks} labels={markLabels} show={showMarks} className={styles.marks} />
        </header>
        {children}
      </div>
    </section>
  );
}

type SubProps = {
  id: string;
  label: string;
  marks?: MarkKind[];
  markLabels: Record<MarkKind, string>;
  showMarks: boolean;
  children: ReactNode;
};

/**
 * A notebook spread: the running head sits in the left margin (sticky on
 * desktop) and the content fills the page. Used for the three blocks of Jornadas.
 */
export function SubSection({ id, label, marks = [], markLabels, showMarks, children }: SubProps) {
  const headingId = `${id}-title`;
  return (
    <div id={id} className={styles.sub} aria-labelledby={headingId} role="region">
      <div className={styles.margin}>
        <h3 id={headingId} className={styles.subTitle}>
          {label}
        </h3>
        <Marks marks={marks} labels={markLabels} show={showMarks} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
