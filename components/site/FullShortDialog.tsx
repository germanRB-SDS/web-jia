"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { IntroVideoModel } from "@/lib/content";
import { isMotionReduced } from "@/lib/motion/policy";
import { CloseIcon, ExternalIcon } from "@/components/icons";
import styles from "./FullShortDialog.module.css";

type Props = {
  short: NonNullable<IntroVideoModel["fullShort"]>;
  open: boolean;
  /** Called once the dialog is shut, after its fade. */
  onClose: () => void;
};

const FADE_MS = 180;

/**
 * The full short ([66-0]): a native modal <dialog> like the reel's viewer (top layer, the page inert behind it), with
 * Drive's player in a 16:9 frame. The iframe exists only while the dialog is open, so nothing is asked of Google
 * until the visitor wants the film, and closing it stops the playback. It closes with its X, Escape or a click on
 * the dimmed ground. Under the player, a way out to Drive for when its player does not start.
 */
export function FullShortDialog({ short, open, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const pressedOnGround = useRef(false);
  const closing = useRef(false);

  const requestClose = () => {
    const el = dialog.current;
    if (!el?.open || closing.current) return;
    closing.current = true;
    el.dataset.closing = "";
    window.setTimeout(() => el.close(), isMotionReduced() ? 0 : FADE_MS);
  };

  /* Open, and hold the page still while open (the scrollbar's gutter keeps it from shifting sideways). */
  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    const root = document.documentElement;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    const bar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (bar > 0) root.style.paddingRight = `${bar}px`;
    if (!el.open) {
      closing.current = false;
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
      closing.current = false;
      onClose();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={short.labels.dialog}
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
      {open ? (
        <div className={styles.stage} style={{ "--short-ratio": String(short.aspect) } as CSSProperties}>
          <div className={styles.screen}>
            <iframe
              className={styles.player}
              src={short.embed}
              title={short.labels.frameTitle}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          {short.link ? (
            <a className={styles.fallback} href={short.link} target="_blank" rel="noopener noreferrer">
              <span>{short.labels.fallback}</span>
              <ExternalIcon size={16} />
            </a>
          ) : null}
          <button ref={closeButton} type="button" className={styles.close} aria-label={short.labels.close} onClick={requestClose}>
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
