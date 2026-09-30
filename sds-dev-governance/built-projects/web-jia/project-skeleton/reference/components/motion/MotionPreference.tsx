"use client";

import { useEffect, useId, useRef } from "react";
import type { Copy } from "@/lib/content/copy/types";
import { chooseMotion, dismissMotionOffer, shouldOfferMotion, subscribeMotion } from "@/lib/motion/policy";
import styles from "./MotionPreference.module.css";

export function MotionPreference({ copy }: { copy: Copy["motion"] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const check = () => {
      if (!shouldOfferMotion() || dialog.open || document.querySelector("dialog[open]")) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    };
    const unsubscribe = subscribeMotion(check);
    const observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    check();
    return () => { unsubscribe(); observer.disconnect(); dialog.close(); };
  }, []);

  const close = () => {
    dismissMotionOffer();
    ref.current?.close();
    opener.current?.focus({ preventScroll: true });
  };
  return <dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} aria-describedby={messageId}
    onCancel={(event) => { event.preventDefault(); close(); }}>
    <h2 id={titleId}>{copy.title}</h2>
    <p id={messageId}>{copy.message}</p>
    <div className={styles.actions}>
      <button type="button" onClick={() => { chooseMotion(true); close(); }}>{copy.activate}</button>
      <button type="button" onClick={close}>{copy.decline}</button>
    </div>
  </dialog>;
}
