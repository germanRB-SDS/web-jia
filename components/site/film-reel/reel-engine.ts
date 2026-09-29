import { motionQuery } from "@/lib/motion/policy";
import { FILM_REEL as TUNE } from "./config";

type Options = {
  viewport: HTMLElement;
  track: HTMLElement;
  /** An empty box as wide as the fade: the CSS owns that width, the engine only reads it. */
  fadeProbe: HTMLElement;
  /** Frames in one set (one poster each). The track holds several identical sets; the second one is the real one. */
  count: number;
  /** Sets the track needs so that no gap ever shows at this width. */
  onCopies: (copies: number) => void;
  /** Whether the strip is drifting right now (for the pause button's state it is the manual flag that counts). */
  onDrift?: (drifting: boolean) => void;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * The reel's motion. The track is moved with one transform — film, windows and posters together — and wrapped
 * every set, so the loop has no seam and no jump. Left alone it drifts the way `direction` says (left to right); it stops for a mouse
 * over it, for keyboard focus inside, for the viewer, for the pause button, off screen and in a hidden tab, and
 * picks up again gently. It can be dragged with a mouse or swiped with a finger either way, and a release throws it
 * on that way, faster, until it slows back into the drift. Reduced motion: no drift and no throw; the arrows, the keyboard and a drag move it, without glides.
 *
 * Where the real set is painted is kept inside one window of offsets, [-T, P - T) with P a set and T the clear
 * start: any of its posters can then be brought to the clear side of the fade without the wrap moving it away.
 */
export function createReelEngine({ viewport, track, fadeProbe, count, onCopies, onDrift }: Options) {
  const calm = motionQuery;
  let moduleWidth = 0;
  let period = 0;
  let width = 0;
  let fade = 0;
  let posterLeft = 0;
  let posterWidth = 0;
  /** Distance travelled in px; unbounded, wrapped only when painted. */
  let x = 0;
  let target = 0;
  let gliding = false;
  let glideFrom = 0;
  let glideStart = 0;
  let glideTime = 0;
  let pace = 0;
  let raf: number | null = null;
  let last = 0;
  let hovered = false;
  let onScreen = true;
  let manual = false;
  let viewer = false;
  let drifting = false;
  let frames: { el: HTMLElement; copy: number; index: number; faded: boolean }[] = [];
  /** A drag in progress (mouse or finger): the strip follows it; on release it is thrown that way. */
  let pointer: { id: number; startX: number; startPos: number; dragging: boolean } | null = null;
  let samples: { t: number; x: number }[] = [];
  /** Speed left by a throw, px/ms; it dies away and the drift takes over again. */
  let thrown = 0;
  let swallowClick = false;

  const clearStart = () => fade + TUNE.focusMargin;
  /** Offset of the real set, kept in [-T, P - T). */
  const offset = () => mod(x + clearStart(), period) - clearStart();

  const paint = () => {
    if (!period) return;
    const w = offset();
    track.style.transform = `translate3d(${-(period + w)}px,0,0)`;
    const limit = fade * (1 - TUNE.fadedAt);
    for (const f of frames) {
      const centre = f.copy * period + f.index * moduleWidth + posterLeft + posterWidth / 2 - (period + w);
      const faded = centre < limit || centre > width + posterWidth / 2;
      if (faded !== f.faded) {
        f.faded = faded;
        f.el.toggleAttribute("data-faded", faded);
      }
    }
  };

  const focusInside = () => viewport.querySelector(":focus-visible") !== null;
  const mayDrift = () =>
    !calm.matches && !manual && !viewer && !hovered && !pointer && onScreen && !document.hidden && !focusInside();

  const report = (now: boolean) => {
    if (now === drifting) return;
    drifting = now;
    onDrift?.(now);
  };

  const stop = () => {
    if (raf !== null) window.cancelAnimationFrame(raf);
    raf = null;
  };

  const frame = (now: number) => {
    const dt = Math.max(0, Math.min(64, now - last));
    last = now;
    const drift = mayDrift();
    report(drift);
    const goal = drift ? (TUNE.direction * TUNE.speed) / 1000 : 0;
    pace += (goal - pace) * (1 - Math.exp(-dt / TUNE.ease));
    if (gliding) {
      const t = Math.min(1, (now - glideStart) / glideTime);
      x = glideFrom + (target - glideFrom) * (1 - (1 - t) ** 3);
      if (t >= 1) gliding = false;
    } else if (!pointer?.dragging) {
      x += (pace + thrown) * dt;
    }
    thrown *= Math.exp(-dt / TUNE.throwDecay);
    if (Math.abs(thrown) < 0.002) thrown = 0;
    paint();
    if (drift || gliding || thrown || Math.abs(pace) > 1e-4) {
      raf = window.requestAnimationFrame(frame);
    } else {
      pace = 0;
      raf = null;
    }
  };

  const wake = () => {
    if (raf !== null) return;
    last = performance.now();
    raf = window.requestAnimationFrame(frame);
  };

  const moveTo = (next: number) => {
    // A directed move owns the strip: no drift or throw left over to carry the real set past its wrap.
    pace = 0;
    thrown = 0;
    if (calm.matches) {
      x = next;
      gliding = false;
      paint();
      return;
    }
    glideFrom = x;
    target = next;
    glideStart = performance.now();
    glideTime = Math.min(TUNE.glide.max, TUNE.glide.min + Math.abs(next - x) * TUNE.glide.perPx);
    gliding = true;
    wake();
  };

  const collect = () => {
    frames = Array.from(track.querySelectorAll<HTMLElement>("[data-frame]")).map((el) => ({
      el,
      copy: Number(el.dataset.copy),
      index: Number(el.dataset.index),
      faded: el.hasAttribute("data-faded"),
    }));
  };

  const measure = () => {
    const first = track.querySelector<HTMLElement>("[data-frame]");
    const poster = first?.querySelector<HTMLElement>("[data-poster]");
    if (!first || !poster) return;
    const nextModule = first.getBoundingClientRect().width;
    if (moduleWidth && nextModule && nextModule !== moduleWidth) x *= nextModule / moduleWidth;
    moduleWidth = nextModule;
    period = moduleWidth * count;
    width = viewport.clientWidth;
    fade = fadeProbe.getBoundingClientRect().width;
    posterLeft = poster.offsetLeft;
    posterWidth = poster.offsetWidth;
    if (period) onCopies(2 + Math.ceil(width / period));
    collect();
    paint();
  };

  const resize = new ResizeObserver(measure);
  resize.observe(viewport);

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) wake();
  });
  visibility.observe(viewport);

  const onVisibility = () => { if (!document.hidden) wake(); };
  document.addEventListener("visibilitychange", onVisibility);

  const onEnter = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovered = true; wake(); } };
  const onLeave = (e: PointerEvent) => { if (e.pointerType === "mouse") { hovered = false; wake(); } };
  viewport.addEventListener("pointerenter", onEnter);
  viewport.addEventListener("pointerleave", onLeave);

  /** Keyboard focus on a poster brings it onto the clear side of the fade, whole. A mouse click never moves it. */
  const onFocusIn = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    wake();
    if (!el.matches(":focus-visible")) return;
    const index = Number(el.closest<HTMLElement>("[data-frame]")?.dataset.index);
    if (Number.isFinite(index)) bringIntoView(index);
  };
  const onFocusOut = () => wake();

  /* Drag or swipe: the strip follows the pointer, and on release keeps going that way, faster, then slows back into
     its drift. A drag never opens the poster it started on. Vertical swipes stay the page's (touch-action: pan-y). */
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || pointer) return;
    pointer = { id: e.pointerId, startX: e.clientX, startPos: x, dragging: false };
    samples = [{ t: e.timeStamp, x: e.clientX }];
    swallowClick = false;
  };
  const onMove = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const dx = e.clientX - pointer.startX;
    if (!pointer.dragging) {
      if (Math.abs(dx) < TUNE.dragThreshold) return;
      pointer.dragging = true;
      gliding = false;
      thrown = 0;
      viewport.setPointerCapture(e.pointerId);
      viewport.toggleAttribute("data-dragging", true);
    }
    x = pointer.startPos - dx * TUNE.dragGain;
    samples.push({ t: e.timeStamp, x: e.clientX });
    while (samples.length > 2 && e.timeStamp - samples[0].t > TUNE.velocityWindow) samples.shift();
    paint();
  };
  const onUp = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const was = pointer.dragging;
    pointer = null;
    viewport.removeAttribute("data-dragging");
    if (!was) return;
    swallowClick = true;
    const a = samples[0];
    const b = samples[samples.length - 1];
    const v = b && a && b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0;
    if (!calm.matches && e.type === "pointerup") {
      thrown = Math.max(-TUNE.throwMax, Math.min(TUNE.throwMax, -v * TUNE.dragGain));
    }
    wake();
  };
  const onClick = (e: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragStart = (e: DragEvent) => e.preventDefault();
  viewport.addEventListener("pointerdown", onDown);
  viewport.addEventListener("pointermove", onMove);
  viewport.addEventListener("pointerup", onUp);
  viewport.addEventListener("pointercancel", onUp);
  viewport.addEventListener("click", onClick, true);
  viewport.addEventListener("dragstart", onDragStart);
  viewport.addEventListener("focusin", onFocusIn);
  viewport.addEventListener("focusout", onFocusOut);

  const unsubscribeMotion = () => calm.removeEventListener("change", wake);
  calm.addEventListener("change", wake);

  function bringIntoView(index: number) {
    if (!period) return;
    const w = gliding ? mod(target + clearStart(), period) - clearStart() : offset();
    const from = gliding ? target : x;
    const left = index * moduleWidth + posterLeft - w;
    const start = clearStart();
    const end = width - TUNE.focusMargin;
    let next = w;
    if (left < start) next = index * moduleWidth + posterLeft - start;
    else if (left + posterWidth > end) next = index * moduleWidth + posterLeft + posterWidth - end;
    if (next < -start || next >= period - start) next = index * moduleWidth + posterLeft - start;
    if (next !== w) moveTo(from + (next - w));
  }

  measure();
  wake();

  return {
    /** Re-read the sets after React rendered more or fewer copies. */
    refresh: measure,
    setManualPause(paused: boolean) { manual = paused; wake(); },
    /** The viewer stops the strip dead, not with the drift's gentle slowdown: nothing may move behind it. */
    setViewerOpen(open: boolean) {
      viewer = open;
      if (open) { pace = 0; thrown = 0; gliding = false; }
      wake();
    },
    /** One frame forwards (1) or back (-1). */
    step(direction: 1 | -1) { moveTo((gliding ? target : x) + direction * moduleWidth); },
    bringIntoView,
    destroy() {
      stop();
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("click", onClick, true);
      viewport.removeEventListener("dragstart", onDragStart);
      unsubscribeMotion();
    },
  };
}

export type ReelEngine = ReturnType<typeof createReelEngine>;
