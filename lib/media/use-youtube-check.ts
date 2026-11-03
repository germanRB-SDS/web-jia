"use client";

import { useCallback, useRef, useState } from "react";

/** What YouTube says about a video: not asked yet, asking, still there, gone, or no answer (network, blocker). */
export type YouTubeStatus = "idle" | "checking" | "ok" | "gone" | "unknown";

/**
 * Is this YouTube video still there? ([70-0], shared since [71-0].) Nothing is asked when the page loads: call `check`
 * on the first sign of intent (pointer over, focus, press). It loads the video's public thumbnail, with no referrer;
 * YouTube answers a 120×90 placeholder once the video no longer exists. `isGone()` reads the answer synchronously, for
 * a click handler that must decide whether to follow the link. A timeout or a network error is «unknown», and the link
 * then behaves as a link: a slow or blocked check never stops the visitor.
 */
export function useYouTubeCheck(youtubeId: string | null, href: string | null) {
  const [status, setStatus] = useState<YouTubeStatus>("idle");
  const ref = useRef<YouTubeStatus>("idle");

  const settle = useCallback((next: YouTubeStatus) => {
    ref.current = next;
    setStatus(next);
  }, []);

  const check = useCallback(() => {
    if (ref.current !== "idle" || !href || !youtubeId) return;
    settle("checking");
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    const timer = window.setTimeout(() => settle("unknown"), 4000);
    img.onload = () => {
      window.clearTimeout(timer);
      settle(img.naturalWidth === 120 ? "gone" : "ok");
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      settle("unknown");
    };
    img.src = `https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/mqdefault.jpg`;
  }, [href, youtubeId, settle]);

  /** No link at all, or YouTube confirmed the video is gone. */
  const unavailable = !href || status === "gone";
  const isGone = useCallback(() => !href || ref.current === "gone", [href]);

  return { status, check, unavailable, isGone };
}
