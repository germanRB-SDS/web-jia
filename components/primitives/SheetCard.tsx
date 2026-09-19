"use client";

import { useCallback, useId, useState } from "react";
import type { MarkKind, SheetModel } from "@/lib/content";
import { ArrowIcon, DownloadIcon } from "@/components/icons";
import { Marks } from "./Mark";
import { SheetDialog } from "./SheetDialog";
import { Surface } from "./Surface";
import styles from "./SheetCard.module.css";

type Props = {
  sheet: SheetModel;
  /** DOM id so programme sessions and related links can point here. */
  anchorId: string;
  labels: {
    open: string;
    close: string;
    sheetOf: string; // pre-formatted accessible name
    pending: string;
    people: string;
    theme: string;
    marks: Record<MarkKind, string>;
  };
  showMarks: boolean;
  /** Sizes hint for the card image. */
  sizes?: string;
  variant?: "poster" | "wide";
  /** Proportion of the card's picture (width / height); defaults to the variant's own. */
  mediaRatio?: number;
  /** Heading level of the card title, so the outline stays in order. */
  heading?: "h3" | "h4";
};

/**
 * A card that reveals a preview on hover AND exposes the same information
 * through a real button that opens the full sheet in a dialog. Hover is an
 * enhancement; keyboard and touch reach everything (brief §7).
 */
export function SheetCard({ sheet, anchorId, labels, showMarks, sizes, variant = "poster", heading = "h4", mediaRatio }: Props) {
  const Heading = heading;
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const titleId = useId();

  return (
    <article id={anchorId} className={`${styles.card} ${styles[variant]}`} aria-labelledby={titleId} data-cursor="open">
      <div className={styles.media}>
        <Surface media={sheet.media} alt={sheet.alt} fallback={sheet.fallback} ratio={mediaRatio ?? (variant === "poster" ? 1414 / 2000 : 4 / 3)} sizes={sizes} className={styles.surface}>
          {sheet.summary ? (
            <div className={styles.reveal} aria-hidden="true">
              <p>{sheet.summary}</p>
            </div>
          ) : null}
        </Surface>
      </div>
      <div className={styles.body}>
        {/* Each line is clamped to two; `title` carries the whole text for a pointer that rests on it. */}
        <Heading id={titleId} className={`${styles.title} ${styles.clamp}`} title={sheet.title}>
          {sheet.title}
        </Heading>
        {sheet.subtitle ? (
          <p className={`${styles.subtitle} ${styles.clamp}`} title={sheet.subtitle}>
            {sheet.subtitle}
          </p>
        ) : null}
        {sheet.people.length ? (
          <p className={`${styles.people} ${styles.who} ${styles.clamp}`} title={sheet.people.map((p) => p.name).join(" · ")}>
            <span className={styles.peopleLabel}>{labels.people}</span>{" "}
            {sheet.people.map((p) => p.name).join(" · ")}
          </p>
        ) : null}
        {sheet.meta ? (
          <p className={`${styles.people} ${styles.theme} ${styles.clamp}`} title={sheet.meta}>
            <span className={styles.peopleLabel}>{labels.theme}</span> {sheet.meta}
          </p>
        ) : null}
        <div className={styles.foot}>
          {sheet.pending ? (
            <span className={styles.pending}>{labels.pending}</span>
          ) : (
            <button type="button" className={styles.open} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
              <span>{labels.open}</span>
              <ArrowIcon />
            </button>
          )}
          <Marks marks={sheet.marks.filter((m) => m !== "provisional")} labels={labels.marks} show={showMarks} />
        </div>
        {/* Under "Ver ficha": the workshop's dossier. Without a link yet it is a plain pending label, never a dead button. */}
        {sheet.download ? (
          sheet.download.href ? (
            <a className={styles.download} href={sheet.download.href} target="_blank" rel="noopener noreferrer">
              <span>{sheet.download.label}</span>
              <DownloadIcon size={18} />
            </a>
          ) : (
            <span className={`${styles.download} ${styles.downloadPending}`} aria-disabled="true" title={sheet.download.pendingNote}>
              <span>{sheet.download.label}</span>
              <DownloadIcon size={18} />
              <span className={styles.srOnly}>{sheet.download.pendingNote}</span>
            </span>
          )
        ) : null}
      </div>

      {sheet.pending ? null : (
        <SheetDialog open={open} onClose={close} label={labels.sheetOf} closeLabel={labels.close}>
          <div className={styles.sheet}>
            <div className={styles.sheetMedia}>
              <Surface media={sheet.media} alt={sheet.alt} fallback={sheet.fallback} ratio={variant === "poster" ? 1414 / 2000 : 4 / 3} sizes="(min-width: 900px) 320px, 60vw" priority={open} />
            </div>
            <div className={styles.sheetBody}>
              <h3 className={styles.sheetTitle}>
                <span>{sheet.title}</span>
                <Marks marks={sheet.marks} labels={labels.marks} show={showMarks} className={styles.sheetMarks} />
              </h3>
              {sheet.subtitle ? <p className={styles.sheetSubtitle}>{sheet.subtitle}</p> : null}
              {sheet.people.length ? (
                <p className={styles.people}>
                  <span className={styles.peopleLabel}>{labels.people}</span> {sheet.people.map((p) => p.name).join(" · ")}
                </p>
              ) : null}
              {sheet.summary && !sheet.sections.length ? <p>{sheet.summary}</p> : null}
              <dl className={styles.fields}>
                {sheet.sections.map((s) => (
                  <div key={s.label} className={styles.field}>
                    <dt>{s.label}</dt>
                    <dd>
                      {Array.isArray(s.body) ? (
                        <ul>
                          {s.body.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        s.body
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {sheet.related.map((group) => (
                <div key={group.label} className={styles.related}>
                  <p className={styles.peopleLabel}>{group.label}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} onClick={() => setOpen(false)}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {sheet.document ? (
                <a className={styles.doc} href={sheet.document.href} target="_blank" rel="noopener noreferrer">
                  {sheet.document.label}
                </a>
              ) : null}
            </div>
          </div>
        </SheetDialog>
      )}
    </article>
  );
}
