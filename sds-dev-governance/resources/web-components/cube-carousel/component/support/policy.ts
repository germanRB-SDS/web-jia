// Portable default: system preference, no cookies or device exceptions.
// Replace this module with the target project's one motion authority when integrating.
const query = () => typeof window === "undefined" ? null : window.matchMedia("(prefers-reduced-motion: reduce)");
export function isMotionReduced() { return query()?.matches ?? true; }
export function subscribeMotion(listener: () => void) {
  const media = query();
  media?.addEventListener("change", listener);
  return () => media?.removeEventListener("change", listener);
}
const subscriptions = new Map<() => void, () => void>();
export const motionQuery = {
  get matches() { return isMotionReduced(); },
  addEventListener(_type: "change", listener: () => void) {
    subscriptions.get(listener)?.();
    subscriptions.set(listener, subscribeMotion(listener));
  },
  removeEventListener(_type: "change", listener: () => void) {
    subscriptions.get(listener)?.(); subscriptions.delete(listener);
  },
};
