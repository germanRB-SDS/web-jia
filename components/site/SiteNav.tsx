"use client";

import { useEffect, useId, useState } from "react";
import type { NavItem } from "@/lib/content";
import { ChevronIcon, CloseIcon, MenuIcon } from "@/components/icons";
import styles from "./SiteNav.module.css";

type Props = {
  items: NavItem[];
  labels: { menu: string; close: string; submenu: string; region: string };
};

/**
 * Five areas in the brief's order. "Jornadas" carries a disclosure with its
 * three blocks: hover/focus reveals it on desktop, a button toggles it
 * everywhere, and on the phone panel it is simply open.
 */
export function SiteNav({ items, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <nav className={styles.nav} aria-label={labels.region}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span>{open ? labels.close : labels.menu}</span>
      </button>
      <ul id={panelId} className={styles.list} data-open={open ? "" : undefined}>
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const subId = `${panelId}-${item.key}`;
          const isSubOpen = subOpen === item.key;
          return (
            <li key={item.key} className={hasChildren ? styles.hasSub : undefined} data-sub-open={isSubOpen ? "" : undefined}>
              <span className={styles.itemRow}>
                <a href={item.href} className={styles.link} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
                {hasChildren ? (
                  <button
                    type="button"
                    className={styles.subToggle}
                    aria-expanded={isSubOpen}
                    aria-controls={subId}
                    aria-label={labels.submenu}
                    onClick={() => setSubOpen(isSubOpen ? null : item.key)}
                  >
                    <ChevronIcon />
                  </button>
                ) : null}
              </span>
              {hasChildren ? (
                <ul id={subId} className={styles.sub}>
                  {item.children!.map((child) => (
                    <li key={child.key}>
                      <a
                        href={child.href}
                        className={styles.subLink}
                        onClick={() => {
                          setOpen(false);
                          setSubOpen(null);
                        }}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
