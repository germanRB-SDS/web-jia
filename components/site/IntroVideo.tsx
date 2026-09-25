"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { IntroVideoModel } from "@/lib/content";
import { FullscreenExitIcon, FullscreenIcon, PauseIcon, PictureInPictureExitIcon, PictureInPictureIcon, PlayIcon, ShareIcon, SoundOffIcon, SoundOnIcon } from "@/components/icons";
import styles from "./IntroVideo.module.css";

type Props = { intro: IntroVideoModel };

/** iOS Safari only offers fullscreen on the video element itself, through its own prefixed method. */
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitDisplayingFullscreen?: boolean };

/**
 * The "Intro" block before the programme: one full-width video, no taller than the rider band
 * (its limit comes from lib/content/sections/jornadas-intro-video.ts). The file is only
 * requested when the block nears the viewport; it then plays muted, pauses when it leaves the
 * screen and never autoplays under prefers-reduced-motion. Round controls sit top-right:
 * share (phones only: the Web Share API with a coarse pointer), fullscreen (the frame goes full screen so the
 * controls stay; iOS uses the player's own), minimise (picture in picture, where the browser has it: the video
 * goes on playing in a floating window while the page is read), sound, play/pause. Entering fullscreen or
 * picture in picture enables sound; the initial in-page autoplay stays muted.
 */
export function IntroVideo({ intro }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [canMinimize, setCanMinimize] = useState(false);
  const onScreen = useRef(false);

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
        onScreen.current = visible;
        // Minimised (picture in picture) it goes on playing while the visitor reads the rest of the page.
        if (!visible && document.pictureInPictureElement === video) return;
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

  // Fullscreen: offered only where some API exists; the state follows the document, not the click.
  useEffect(() => {
    const video = videoRef.current as IOSVideo | null;
    setCanFullscreen(Boolean(document.fullscreenEnabled || video?.webkitEnterFullscreen));
    const sync = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [load]);

  // Share: only where the system share sheet exists and the pointer is a finger (a phone or a tablet).
  useEffect(() => {
    setCanShare(typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const share = useCallback(() => {
    const url = `${location.origin}${location.pathname}#${intro.anchor}`;
    navigator.share({ title: document.title, text: intro.shareText, url }).catch(() => {});
  }, [intro.anchor, intro.shareText]);

  // Picture in picture: offered only where the browser has it; the state follows the video's own events (the
  // floating window has its own close button). Back in the page and off screen, it rests as usual.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setCanMinimize(Boolean(document.pictureInPictureEnabled && typeof video.requestPictureInPicture === "function"));
    const enter = () => setMinimized(true);
    const leave = () => {
      setMinimized(false);
      if (!onScreen.current) video.pause();
    };
    video.addEventListener("enterpictureinpicture", enter);
    video.addEventListener("leavepictureinpicture", leave);
    return () => {
      video.removeEventListener("enterpictureinpicture", enter);
      video.removeEventListener("leavepictureinpicture", leave);
    };
  }, []);

  const toggleMinimized = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
      return;
    }
    // The floating window needs the file: ask for it now if the block had not yet.
    setLoad(true);
    const open = () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (video.muted) {
        video.muted = false;
        setMuted(false);
      }
      video.requestPictureInPicture().then(() => video.play().catch(() => {})).catch(() => {});
    };
    if (video.readyState >= 1) open();
    else video.addEventListener("loadedmetadata", open, { once: true });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const frame = frameRef.current;
    const video = videoRef.current as IOSVideo | null;
    if (!frame || !video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.fullscreenEnabled) {
      if (video.muted) {
        video.muted = false;
        setMuted(false);
      }
      frame.requestFullscreen().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      if (video.muted) {
        video.muted = false;
        setMuted(false);
      }
      video.webkitEnterFullscreen();
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
      <div ref={frameRef} className={styles.frame} style={intro.poster ? { backgroundImage: `url(${intro.poster})` } : undefined}>
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
            {canShare ? (
              <button type="button" className={styles.control} onClick={share} aria-label={intro.controls.share} title={intro.controls.share}>
                <ShareIcon size={24} />
              </button>
            ) : null}
            {canFullscreen ? (
              <button type="button" className={styles.control} onClick={toggleFullscreen} aria-label={fullscreen ? intro.controls.exitFullscreen : intro.controls.fullscreen} title={fullscreen ? intro.controls.exitFullscreen : intro.controls.fullscreen} aria-pressed={fullscreen}>
                {fullscreen ? <FullscreenExitIcon size={24} /> : <FullscreenIcon size={24} />}
              </button>
            ) : null}
            {canMinimize ? (
              <button type="button" className={styles.control} onClick={toggleMinimized} aria-label={minimized ? intro.controls.exitMinimize : intro.controls.minimize} title={minimized ? intro.controls.exitMinimize : intro.controls.minimize} aria-pressed={minimized}>
                {minimized ? <PictureInPictureExitIcon size={24} /> : <PictureInPictureIcon size={24} />}
              </button>
            ) : null}
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
