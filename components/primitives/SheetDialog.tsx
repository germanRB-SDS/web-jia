"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import styles from "./SheetDialog.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  mobileFullscreen?: boolean;
  children: ReactNode;
};

/**
 * Native <dialog>: modal focus containment, Escape to close and focus return
 * come from the platform. Focus is also restored explicitly to the opener so
 * the behaviour does not depend on browser differences (brief §7).
 */
export function SheetDialog({ open, onClose, label, closeLabel, mobileFullscreen = false, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || !mobileFullscreen) return;
    const query = window.matchMedia("(max-width: 759.98px)");
    const root = document.documentElement;
    const previous = root.style.overflow;
    const update = () => { root.style.overflow = query.matches ? "hidden" : previous; };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      root.style.overflow = previous;
    };
  }, [open, mobileFullscreen]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      if (mobileFullscreen && window.matchMedia("(max-width: 759.98px)").matches) {
        panel.current?.scrollTo({ top: 0, behavior: "instant" });
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, mobileFullscreen]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      onClose();
      const target = opener.current;
      if (target instanceof HTMLElement) target.focus();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog}${mobileFullscreen ? ` ${styles.mobileFullscreen}` : ""}`}
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div ref={panel} className={styles.panel}>
        <button type="button" className={styles.close} onClick={() => ref.current?.close()} data-autofocus>
          <CloseIcon />
          <span>{closeLabel}</span>
        </button>
        {children}
      </div>
    </dialog>
  );
}
