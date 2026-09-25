import { MOTION } from "./config";

let initialized = false;
let accepted = false;
let dismissed = false;
let reduced = true;
let supported = false;
let query: MediaQueryList | undefined;
const listeners = new Set<() => void>();

function publish() {
  reduced = !accepted && (dismissed || !supported || Boolean(query?.matches));
  document.documentElement.dataset.motion = reduced ? "reduce" : "on";
  listeners.forEach((listener) => listener());
}
function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    accepted = document.cookie.split(";").some((part) => part.trim() === `${MOTION.cookie}=${MOTION.value}`);
  } catch { /* Storage can be blocked: a choice still works for this document. */ }
  if (typeof window.matchMedia === "function") {
    query = window.matchMedia(MOTION.reduceQuery);
    supported = query.matches || window.matchMedia(MOTION.normalQuery).matches;
  }
  publish();
}
const systemChanged = () => publish();
export function subscribeMotion(listener: () => void) {
  initialize();
  if (!listeners.size) {
    if (query?.addEventListener) query.addEventListener("change", systemChanged);
    else query?.addListener(systemChanged);
    publish();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      if (query?.removeEventListener) query.removeEventListener("change", systemChanged);
      else query?.removeListener(systemChanged);
    }
  };
}
export function isMotionReduced() { initialize(); return reduced; }
export function hasMotionAcceptance() { initialize(); return accepted; }
export function shouldOfferMotion() {
  initialize();
  // Owner-requested Apple exception, including iPad desktop mode reporting Mac.
  const appleDevice = /^(Mac|iPhone|iPad|iPod)/.test(navigator.platform);
  return !appleDevice && !accepted && !dismissed;
}
export function dismissMotionOffer() { dismissed = true; publish(); }
export function chooseMotion(enable: boolean) {
  initialize();
  accepted = enable;
  dismissed = true;
  try {
    document.cookie = `${MOTION.cookie}=${enable ? MOTION.value : ""}; Max-Age=${enable ? MOTION.maxAge : 0}; Path=/; Secure; SameSite=Lax`;
  } catch { /* No alternate storage and no rejection cookie. */ }
  publish();
}
/** Query-shaped adapter for existing imperative engines; never patches matchMedia. */
export const motionQuery = {
  get matches() { return isMotionReduced(); },
  addEventListener(_type: "change", listener: () => void) {
    const dispose = subscribeMotion(listener);
    subscriptions.set(listener, dispose);
  },
  removeEventListener(_type: "change", listener: () => void) {
    subscriptions.get(listener)?.();
    subscriptions.delete(listener);
  },
};
const subscriptions = new Map<() => void, () => void>();
