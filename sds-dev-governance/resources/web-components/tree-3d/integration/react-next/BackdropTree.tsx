"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Tree3D } from "@/components/tree-3d";
import type { TreeBackdropConfig } from "./tree.config";

type Props = { tree: TreeBackdropConfig; className?: string };

/**
 * The one bridge between a site and the portable `tree-3d` component: it mounts the tree only from the window width
 * the site sets (elsewhere nothing is mounted, so a phone never pays for a WebGL context) and hands it the site's
 * palette and options. Place it inside the section, after its background and before its content.
 */
export function BackdropTree({ tree, className }: Props) {
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
