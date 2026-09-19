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
  /** The footer's ground above the rule: the stable (media.ts). `null` leaves plain ink and the shoe by the window's edge. */
  stableMediaId: "footer-establo" as string | null,
  /** Where the lit face of the post is in that image, as percentages of its box: the face's left edge and width,
      and how far down the nail goes. The footer lays an invisible marker there and the horseshoe reads it. */
  stablePost: { leftPct: 74.4, widthPct: 9.4, nailTopPct: 21 },
} as const;
