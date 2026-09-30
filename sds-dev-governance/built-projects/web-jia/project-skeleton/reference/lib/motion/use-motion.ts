"use client";
import { useSyncExternalStore } from "react";
import { isMotionReduced, subscribeMotion } from "./policy";
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, isMotionReduced, () => true);
}
