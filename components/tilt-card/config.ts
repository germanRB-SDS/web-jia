/**
 * Tilt card — the one place that tunes the 3D card (JIA-2026-09-19-27, from the promoter's reference).
 * Colours are palette tokens set in TiltCard.module.css; nothing here is a brand HEX.
 */
export const TILT = {
  /** Only a fine pointer that can hover gets the effect; touch and reduced motion leave the card flat. */
  media: "(hover: hover) and (pointer: fine)",
  /** Uniform scale while the pointer is over the card. */
  scale: 1.07,
  /** Pointer offset from the centre (px) divided by this gives the rotation axis (x, y). */
  axisDivisor: 100,
  /** Rotation (degrees) = ln(distance from the centre, px) × this… */
  angleFactor: 2,
  /** …capped here, so a wide card never flips too far. */
  maxAngleDeg: 12,
  /** Depth of the perspective the card turns in (px). */
  perspectivePx: 1500,
  /** The glow's centre moves twice as far as the pointer from the card's centre. */
  glowTravel: 2,
} as const;
