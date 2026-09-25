"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Copy } from "@/lib/content/copy/types";
import { chooseMotion, dismissMotionOffer, hasMotionAcceptance, shouldOfferMotion, subscribeMotion } from "@/lib/motion/policy";
import styles from "./MotionPreference.module.css";

export function MotionPreference({ copy }: { copy: Copy["motion"] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [automatic, setAutomatic] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const check = () => {
      setAccepted(hasMotionAcceptance());
      if (!shouldOfferMotion() || dialog.open || document.querySelector("dialog[open]")) return;
      setAutomatic(true);
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
  const choose = (enable: boolean) => { chooseMotion(enable); close(); };
  return <>
    <button type="button" className={styles.control} onClick={(event) => {
      if (document.querySelector("dialog[open]")) return;
      setAutomatic(false);
      setAccepted(hasMotionAcceptance());
      opener.current = event.currentTarget;
      ref.current?.showModal();
    }}>{copy.title}</button>
    <dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} aria-describedby={messageId}
      onCancel={(event) => { event.preventDefault(); close(); }}>
      <h2 id={titleId}>{copy.title}</h2>
      <p id={messageId}>{automatic ? copy.message : copy.settings}</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose(true)}>{copy.activate}</button>
        <button type="button" onClick={() => accepted && !automatic ? choose(false) : close()}>{accepted && !automatic ? copy.system : copy.decline}</button>
      </div>
    </dialog>
  </>;
}
