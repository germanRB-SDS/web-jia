import { ChevronIcon } from "@/components/icons";
import { Surface } from "@/components/primitives/Surface";
import type { LandingModel } from "@/lib/content";
import styles from "./CollaboratorsCarousel.module.css";

export type Collaborator = LandingModel["partners"]["carousel"]["items"][number];

type Props = {
  item: Collaborator;
  index: number;
  /** A repeat of the real set: it fills the endless strip, out of the tab order and the accessibility tree. */
  copy: boolean;
};

/**
 * A collaborator's card: the image (a solid palette surface if it is missing), the name under it,
 * starting on its left edge, and a round arrow that opens the entity's site. Only the arrow is a link, so the
 * rest of the card is free to be dragged.
 */
export function CollaboratorCard({ item, index, copy }: Props) {
  return (
    <li className={styles.card} data-card-index={copy ? undefined : index} aria-hidden={copy || undefined}>
      <Surface media={item.logo} alt="" fallback={item.surface} ratio={4 / 3} sizes="272px" className={styles.image} />
      <div className={styles.foot}>
        <p className={styles.name}>{item.name}</p>
        {item.link ? (
          <a href={item.link.href} className={styles.go} target="_blank" rel="noopener noreferrer" aria-label={item.link.label} title={item.link.label} tabIndex={copy ? -1 : undefined} draggable={false}>
            <ChevronIcon size={18} className={styles.goIcon} />
          </a>
        ) : null}
      </div>
    </li>
  );
}
