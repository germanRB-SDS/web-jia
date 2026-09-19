/**
 * FOOTER. The strip under the rule credits the production studio; tumbleweeds roll across it while the
 * pointer is on the footer, and a small link beside the credit says what they are.
 */
export const footerConfig = {
  tumbleweedsUrl: "https://es.wikipedia.org/wiki/Estepicursor",
  /** Bullet holes the footer keeps (a click anywhere that is not a link); the oldest goes first. */
  maxShots: 12,
  /** Each hole, on its own: milliseconds it stays before it starts to fade, and how long the fade takes. */
  shotLifeMs: 3000,
  shotFadeMs: 700,
  /** The horseshoe's model, built by Blender headless (assets/3d/herradura) and copied by build-assets.sh. */
  horseshoeGlb: "/footer/herradura.glb",
} as const;
