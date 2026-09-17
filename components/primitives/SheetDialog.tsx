"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import styles from "./SheetDialog.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  children: ReactNode;
};

/**
 * Native <dialog>: modal focus containment, Escape to close and focus return
 * come from the platform. Focus is also restored explicitly to the opener so
 * the behaviour does not depend on browser differences (brief §7).
 */
export function SheetDialog({ open, onClose, label, closeLabel, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

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
      className={styles.dialog}
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.close} onClick={() => ref.current?.close()} data-autofocus>
          <CloseIcon />
          <span>{closeLabel}</span>
        </button>
        {children}
      </div>
    </dialog>
  );
}
