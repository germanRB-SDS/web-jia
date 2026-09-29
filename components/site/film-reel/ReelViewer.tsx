"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { Media } from "@/lib/content";
import { isMotionReduced } from "@/lib/motion/policy";
import { CloseIcon } from "@/components/icons";
import { Picture } from "@/components/primitives/Picture";
import { FILM_REEL as TUNE } from "./config";
import styles from "./ReelViewer.module.css";

type Props = {
  /** The poster on show; null keeps the viewer shut. It stays set while the viewer fades out. */
  poster: { media: Media; label: string; alt: string } | null;
  closeLabel: string;
  /** Called once the viewer is shut, after its fade. */
  onClose: () => void;
};

/**
 * The enlarged poster. A native modal <dialog>, like the workshop sheets (SheetDialog): it lives in the top layer,
 * so the reel's clip, mask and transform never touch it; the page behind is inert and focus stays inside.
 * It closes with its X, a click on the dimmed ground, Escape, or — for a real mouse only — the pointer leaving the
 * poster-and-X group after having been in it, with a short delay that a return cancels.
 */
export function ReelViewer({ poster, closeLabel, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pressedOnGround = useRef(false);
  const armed = useRef(false);
  const leaveTimer = useRef<number | null>(null);
  const closing = useRef(false);
  const open = poster !== null;

  const clearLeave = () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
  };

  const requestClose = () => {
    const el = dialog.current;
    if (!el?.open || closing.current) return;
    closing.current = true;
    clearLeave();
    el.dataset.closing = "";
    window.setTimeout(() => el.close(), isMotionReduced() ? 0 : TUNE.viewerFade);
  };

  /* Open, and hold the page still while open. The lock is undone by this effect's cleanup, which runs once the
     viewer has shut (the parent clears `poster` on close), and is safe to run twice. */
  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    // The page must not scroll under the viewer; the gutter keeps it from shifting sideways when the bar goes.
    const root = document.documentElement;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    const bar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (bar > 0) root.style.paddingRight = `${bar}px`;
    if (!el.open) {
      closing.current = false;
      armed.current = false;
      delete el.dataset.closing;
      el.showModal();
      closeButton.current?.focus({ preventScroll: true });
    }
    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [open]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const handleClose = () => {
      clearLeave();
      closing.current = false;
      onClose();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => clearLeave, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={poster?.label}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onPointerDown={(e) => {
        pressedOnGround.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressedOnGround.current) requestClose();
        pressedOnGround.current = false;
      }}
    >
      {poster ? (
        <div
          className={styles.stage}
          style={{ "--viewer-ratio": poster.media.ratio } as CSSProperties}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            armed.current = true;
            clearLeave();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse" || !armed.current) return;
            clearLeave();
            leaveTimer.current = window.setTimeout(requestClose, TUNE.leaveDelay);
          }}
        >
          <Picture
            media={poster.media}
            alt={poster.alt}
            sizes="(min-width: 1280px) min(40vw, 640px), (min-width: 760px) min(60vw, 560px), 70vw"
            className={styles.image}
            priority
          />
          <button ref={closeButton} type="button" className={styles.close} aria-label={closeLabel} onClick={requestClose}>
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
