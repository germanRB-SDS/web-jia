/**
 * The tree without React: `mountTree(host, { palette, options, seed })` draws it inside `host` (any element with a
 * size) and returns a handle to resize or dispose it. Same engine, same options and palette as <Tree3D />. The host
 * should be decorative: give it `aria-hidden="true"` and `pointer-events: none`.
 */
import { TREE_DEFAULTS, TREE_DEFAULT_PALETTE, mergeOptions } from "./config.js";
import { TreeScene, webglAvailable } from "./tree-scene.js";
/** Returns null (and draws nothing) without WebGL 2. */
export function mountTree(host, { palette, options, seed = 7 } = {}) {
    if (!webglAvailable())
        return null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new TreeScene(host, mergeOptions(TREE_DEFAULTS, options), { ...TREE_DEFAULT_PALETTE, ...palette }, seed, reduced);
    const ro = new ResizeObserver(() => scene.resize());
    ro.observe(host);
    return {
        resize: () => scene.resize(),
        dispose: () => {
            ro.disconnect();
            scene.dispose();
        },
    };
}
