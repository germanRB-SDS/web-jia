import type { MarkKind } from "@/lib/content";
import styles from "./Mark.module.css";

type Props = {
  marks: MarkKind[];
  labels: Record<MarkKind, string>;
  /** Off in production once content is validated (site.preview.markProvisional). */
  show: boolean;
  className?: string;
};

/** Small visible chip that tells reviewers a piece of content is provisional/demo/pending. */
export function Marks({ marks, labels, show, className }: Props) {
  if (!show || marks.length === 0) return null;
  return (
    <span className={[styles.marks, className].filter(Boolean).join(" ")}>
      {marks.map((m) => (
        <span key={m} className={`${styles.mark} ${styles[m]}`}>
          {labels[m]}
        </span>
      ))}
    </span>
  );
}
