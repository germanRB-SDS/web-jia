import type { Action as ActionModel, ActionIcon } from "@/lib/content";
import { ArrowIcon, ExternalIcon, SheriffStarIcon } from "@/components/icons";
import styles from "./Action.module.css";

/** The icon names the content layer may declare (lib/content/sections/*.ts). An unknown or absent name falls back to
    the arrow the action already earned: an external link leaves the site, anything else moves within it. */
const ACTION_ICONS: Record<ActionIcon, typeof SheriffStarIcon> = { "sheriff-star": SheriffStarIcon };

type Props = {
  action: ActionModel;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
};

/**
 * The one button/link component. An unavailable action renders as a static,
 * clearly disabled label plus its visible explanation: never `href="#"`,
 * never a fake submit (brief §12). Supplying a URL in the section config is
 * all it takes to turn it into a working link.
 */
export function Action({ action, variant = "primary", className }: Props) {
  const cls = [styles.btn, styles[variant], className].filter(Boolean).join(" ");
  if (action.kind === "unavailable" || !action.href) {
    return (
      <div className={styles.unavailable}>
        <span className={`${cls} ${styles.disabled}`} aria-disabled="true">
          {action.label}
        </span>
        {action.note ? <p className={styles.note}>{action.note}</p> : null}
      </div>
    );
  }
  const external = action.kind === "external";
  const Declared = action.icon ? ACTION_ICONS[action.icon] : undefined;
  return (
    <a
      className={cls}
      href={action.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span>{action.label}</span>
      {Declared ? <Declared className={styles.badge} /> : external ? <ExternalIcon /> : <ArrowIcon />}
    </a>
  );
}
