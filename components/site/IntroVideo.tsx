"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { IntroVideoModel } from "@/lib/content";
import { PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "@/components/icons";
import styles from "./IntroVideo.module.css";

type Props = { intro: IntroVideoModel };

/**
 * The "Intro" block before the programme: one full-width video, no taller than the rider band
 * (its limit comes from lib/content/sections/jornadas-intro-video.ts). The file is only
 * requested when the block nears the viewport; it then plays muted, pauses when it leaves the
 * screen and never autoplays under prefers-reduced-motion. Round controls sit top-right.
 */
export function IntroVideo({ intro }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  // Ask for the file shortly before the block shows up.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !intro.src) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [intro.src]);

  // Play while on screen, rest while off it; a pause asked for by the visitor is kept.
  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video || !load) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (!visible) video.pause();
        else if (intro.autoplay && !calm && !userPaused.current) video.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [load, intro.autoplay]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const showControls = Boolean(intro.src) && load && !failed;

  return (
    <div
      ref={rootRef}
      id={intro.anchor}
      className={styles.intro}
      role="region"
      aria-labelledby={`${intro.anchor}-title`}
      style={{ "--intro-max-height": intro.maxHeight, "--intro-aspect": String(intro.aspect) } as CSSProperties}
    >
      {/* The cinema bar: the rider's dune always meets solid ink, never a random frame. */}
      <div className={styles.bar}>
        <h3 id={`${intro.anchor}-title`} className={styles.title}>
          {intro.title}
        </h3>
        <p className={styles.barText}>{intro.barText}</p>
      </div>
      <div className={styles.frame} style={intro.poster ? { backgroundImage: `url(${intro.poster})` } : undefined}>
        {intro.src && !failed ? (
          <video
            ref={videoRef}
            className={styles.video}
            aria-label={intro.videoLabel}
            poster={intro.poster ?? undefined}
            preload="none"
            muted
            playsInline
            loop={intro.loop}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          >
            {load ? <source src={intro.src} type={intro.type} onError={() => setFailed(true)} /> : null}
          </video>
        ) : null}
        {showControls ? (
          <div className={styles.controls}>
            <button type="button" className={styles.control} onClick={toggleSound} aria-label={muted ? intro.controls.unmute : intro.controls.mute} title={muted ? intro.controls.unmute : intro.controls.mute} aria-pressed={!muted}>
              {muted ? <SoundOffIcon size={24} /> : <SoundOnIcon size={24} />}
            </button>
            <button type="button" className={styles.control} onClick={toggle} aria-label={playing ? intro.controls.pause : intro.controls.play} title={playing ? intro.controls.pause : intro.controls.play}>
              {playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
