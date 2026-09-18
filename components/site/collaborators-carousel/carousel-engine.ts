import { COLLABORATORS_CAROUSEL as TUNE } from "./config";

type Options = {
  viewport: HTMLElement;
  track: HTMLElement;
  /** An element on the page's left edge of the container: the first card rests under it. */
  anchor: HTMLElement;
  /** Cards in one set. The track holds several identical sets, the second one being the real one. */
  count: number;
  /** Sets the track needs so that no gap ever shows at this width. */
  onCopies: (copies: number) => void;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * An endless, draggable strip: the track is moved with a transform, wrapped every set, so five cards can be
 * dragged either way at any width. A release glides and settles on a card; a drag never clicks the link
 * under it. Reduced motion: no glide and no easing, the track stays where it was left.
 */
export function createCarouselEngine({ viewport, track, anchor, count, onCopies }: Options) {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  let step = 0;
  let inset = 0;
  /** Position in pixels; unbounded, wrapped only when painted. */
  let x = 0;
  let target = 0;
  let raf: number | null = null;
  let last = 0;
  let wheelTimer: number | null = null;

  let pointer: { id: number; startX: number; startPos: number; dragging: boolean } | null = null;
  let samples: { t: number; x: number }[] = [];
  let swallowClick = false;

  const paint = () => {
    const set = step * count;
    if (!set) return;
    track.style.transform = `translate3d(${inset - set - mod(x, set)}px,0,0)`;
  };

  const stop = () => {
    if (raf !== null) window.cancelAnimationFrame(raf);
    raf = null;
  };

  /** Ease towards `target`, exponentially: the same curve as a glide that loses speed. */
  const run = () => {
    stop();
    if (calm.matches) {
      x = target;
      paint();
      return;
    }
    last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      x = target + (x - target) * Math.exp(-dt / TUNE.glide);
      if (Math.abs(target - x) < 0.4) {
        x = target;
        raf = null;
        paint();
        return;
      }
      paint();
      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);
  };

  const settle = (from: number) => {
    if (!step) return;
    target = Math.round(from / step) * step;
    run();
  };

  const measure = () => {
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(card).marginRight) || 0;
    const next = card.offsetWidth + gap;
    if (!next) return;
    const index = step ? x / step : 0;
    step = next;
    inset = anchor.getBoundingClientRect().left - viewport.getBoundingClientRect().left;
    stop();
    x = target = Math.round(index) * step;
    onCopies(Math.min(TUNE.maxCopies, Math.max(TUNE.minCopies, Math.ceil(viewport.clientWidth / (step * count)) + 2)));
    paint();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swallowClick = false;
    stop();
    target = x;
    pointer = { id: e.pointerId, startX: e.clientX, startPos: x, dragging: false };
    samples = [{ t: e.timeStamp, x: e.clientX }];
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const dx = e.clientX - pointer.startX;
    if (!pointer.dragging) {
      if (Math.abs(dx) < TUNE.dragThreshold) return;
      pointer.dragging = true;
      swallowClick = true;
      viewport.setPointerCapture(e.pointerId);
      viewport.dataset.dragging = "";
    }
    samples.push({ t: e.timeStamp, x: e.clientX });
    while (samples.length > 2 && e.timeStamp - samples[0].t > TUNE.velocityWindow) samples.shift();
    x = target = pointer.startPos - dx;
    paint();
  };

  const onPointerEnd = (e: PointerEvent) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const wasDragging = pointer.dragging;
    pointer = null;
    delete viewport.dataset.dragging;
    if (!wasDragging) return;
    if (calm.matches) return;
    const first = samples[0];
    const lastSample = samples[samples.length - 1];
    const dt = lastSample.t - first.t;
    // Stale samples mean the pointer had stopped before letting go: no throw.
    const speed = dt > 0 && e.timeStamp - lastSample.t < TUNE.velocityWindow ? (first.x - lastSample.x) / dt : 0;
    settle(x + speed * TUNE.glide);
  };

  /** A press that turned into a drag must not open the link it started on. */
  const onClick = (e: MouseEvent) => {
    if (!swallowClick) return;
    swallowClick = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    stop();
    x = target = x + e.deltaX;
    paint();
    if (wheelTimer !== null) window.clearTimeout(wheelTimer);
    if (!calm.matches) wheelTimer = window.setTimeout(() => settle(x), TUNE.wheelSettle);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    settle(target + (e.key === "ArrowRight" ? step : -step));
  };

  /** Tab reaches a card that may be out of sight: bring it to the resting place, by the shorter way round. */
  const onFocusIn = (e: FocusEvent) => {
    const card = (e.target as Element | null)?.closest<HTMLElement>("[data-card-index]");
    if (!card || !step) return;
    const set = step * count;
    const at = Number(card.dataset.cardIndex) * step;
    const left = mod(at - x, set);
    if (left + step <= viewport.clientWidth - inset) return;
    target = x + (left > set / 2 ? left - set : left);
    run();
  };

  /** `overflow: clip` cannot scroll; where it falls back to `hidden`, focus must not scroll the viewport. */
  const onScroll = () => {
    viewport.scrollLeft = 0;
  };

  const observer = new ResizeObserver(measure);
  observer.observe(viewport);
  if (track.firstElementChild) observer.observe(track.firstElementChild);
  measure();

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerEnd);
  viewport.addEventListener("pointercancel", onPointerEnd);
  viewport.addEventListener("click", onClick, true);
  viewport.addEventListener("wheel", onWheel, { passive: false });
  viewport.addEventListener("keydown", onKeyDown);
  viewport.addEventListener("focusin", onFocusIn);
  viewport.addEventListener("scroll", onScroll);

  return () => {
    stop();
    if (wheelTimer !== null) window.clearTimeout(wheelTimer);
    observer.disconnect();
    viewport.removeEventListener("pointerdown", onPointerDown);
    viewport.removeEventListener("pointermove", onPointerMove);
    viewport.removeEventListener("pointerup", onPointerEnd);
    viewport.removeEventListener("pointercancel", onPointerEnd);
    viewport.removeEventListener("click", onClick, true);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("keydown", onKeyDown);
    viewport.removeEventListener("focusin", onFocusIn);
    viewport.removeEventListener("scroll", onScroll);
  };
}
