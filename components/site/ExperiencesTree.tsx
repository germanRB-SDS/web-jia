"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { LandingModel } from "@/lib/content";
import { Tree3D } from "@/components/tree-3d";

type Props = { tree: NonNullable<LandingModel["experiencias"]["tree"]>; className?: string };

/**
 * The tree of knowledge behind the content of «Experiencias» (JIA-2026-09-19-34): the portable `tree-3d` component,
 * mounted only from the window width the site sets (the wide layout), with the site's palette tokens. Elsewhere
 * nothing is mounted, so a phone never pays for a WebGL context.
 */
export function ExperiencesTree({ tree, className }: Props) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(tree.media);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [tree.media],
  );
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(tree.media).matches, () => false);
  return wide ? <Tree3D className={className} palette={tree.palette} options={tree.options} seed={tree.seed} /> : null;
}
