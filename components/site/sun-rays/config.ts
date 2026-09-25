/**
 * The sun coming in through the classroom window ([51-0]). Every number that describes the photograph or the
 * light lives here; neither the scene nor the component holds a measurement of its own.
 *
 * The light is layer 2 of the Experiencias ground: over the photograph (layer 1) and under the teacher cut out
 * of that same photograph (layer 3), which is what makes the shafts pass BEHIND her.
 */
export const SUN_RAYS = {
  /** The photograph the window belongs to: assets/images-website/aula-maestra3.png. */
  frame: { width: 1919, height: 820 },

  /**
   * The window's lit glass, measured on that original in its own pixels. Measured, not guessed: the rectangle
   * was drawn over the frame and checked against the glazing bars. If the photograph is ever replaced, this is
   * the only thing that has to be measured again.
   */
  glass: { left: 755, right: 825, top: 87, bottom: 464 },

  fan: {
    /**
     * Where the light goes: down and to the LEFT, into the room and towards the teacher. The frame says so —
     * the window's left jamb is seen edge-on and the right one is barely there, so the wall recedes to the
     * right and the glass faces front-left. It is also the only direction that passes behind anybody, which
     * is the depth this whole layer exists for. Degrees off the vertical: 45, which is the angle the light
     * already falls at in the photograph (promoter, 25-09-2026). At 45 the whole fan crosses her skirt, so
     * the room fills with light and she stays dark inside it — which is exactly the depth being looked for.
     */
    tiltDeg: 45,
    /** Half-opening of the fan, in degrees. Wide: the promoter asked for the shafts to be more scattered. */
    spreadDeg: 23,
    /** How far the shafts carry, in frame widths. They leave the bottom of the frame before they die. */
    reach: 0.68,
    /** Where along that reach the light starts thinning out (0..1). */
    fadeFrom: 0.5,
    /**
     * The glazing bars cut the sheet of light into shafts. Two frequencies instead of one: a single cosine
     * gives a comb, and a comb reads as a pattern, not as light. Few and wide: the promoter asked for the
     * shafts to be blurrier and further apart.
     */
    bands: { a: 4.4, b: 2.2, phaseA: 0.7, phaseB: 2.3, mix: 0.62 },
    /**
     * How soft the edge of a shaft is. The lower the floor, the more of the band's range is spent fading in
     * and the less of it is a hard crest: this is the "blur" of the light, and it costs nothing to draw.
     */
    softness: -0.45,
    /** Peak strength of the shafts, 0..1. Down a fifth from where it was, at the promoter's request. */
    strength: 0.576,
    /**
     * How much light there is BETWEEN the shafts, as a share of a shaft. Without it the fan is a set of
     * stripes with nothing in between, which is a pattern; with it the whole wedge of air is lit and the
     * shafts are the bright places inside it. This is most of what reads as "a lot of light coming in".
     */
    fill: 0.46,
    /**
     * The glow on the glass itself, as its own opacity at the middle of the pane, 0..1. It is deliberately
     * higher than the shafts and it does NOT hang off `strength`: the promoter asked for the window to be
     * nearly too bright to look at while the light is in, and separately for the shafts to lose a fifth of
     * theirs. Two knobs, two requests. Set to 0 and the shafts stay, with no source.
     */
    glow: 0.83,
    /**
     * The size of that glow, as multiples of the glass's own half size. Wider than the glass on purpose: it
     * is not the pane lighting up, it is the room filling with what comes through it.
     */
    glowScale: { x: 4.5, y: 1.9 },
  },

  /**
   * One cycle, in seconds. Eased in and eased out at both ends (promoter, 25-09-2026): it no longer snaps
   * in, it swells and subsides. It went to two and a half seconds and then the promoter asked for double
   * that, so it is five: the chalk finishes writing at 2,5 s and the light stays in the room a while longer
   * before the cloud comes back. Every figure below is a share of `total`; move that one and the shape holds.
   */
  timing: {
    /** The cloud's edge sweeps the whole fan in this long. */
    wipe: 2.3,
    /** How soft that edge is, in fan half-widths. */
    wipeFeather: 0.55,
    /** The strength climbs from nothing to full in this long. */
    rise: 1,
    /** Full light from there until here. */
    holdUntil: 3.1,
    /** And gone by here. */
    total: 5,
  },

  /** Reduced motion: one still frame at this share of full strength, and nothing moves. */
  stillStrength: 0.55,

  /** The colour token, read from `:root`. Sampled from the glass of this very photograph. */
  colorToken: "--jia-sunbeam",

  render: {
    /** Device pixels per CSS pixel, capped: the frame is wider than the box on a narrow window. */
    maxPixelRatio: 1.75,
    /** And the backing store never goes past this, whatever the screen. */
    maxCanvasWidth: 2400,
  },

  /**
   * How much of the band has to be on screen before the light comes in — and comes in again, because the
   * promoter asked for it to happen on every return, not just the first time. It is a share of the band, so
   * the same number works for the tall crop on a phone and the wide one on a desktop.
   */
  triggerRatio: 0.28,
} as const;

/**
 * The name of the jornadas, written in chalk on the blackboard at the back of the classroom ([51-0]). It is
 * part of layer 1 — it is written on that board — but it is woken by the same moment as the light, so its
 * numbers live here, beside the ones that decide that moment.
 *
 * It is written LETTER BY LETTER (promoter, 25-09-2026), each one drawn left to right, in the same two and a
 * half seconds the light takes. `glyphTiming()` shares the time out over however many letters there are, so
 * nothing in the code knows what the board says or how many lines it breaks into.
 */
export const CHALK = {
  /** What the promoter asked for: two and a half seconds of writing, the same as the light beside it. */
  total: 2.5,
  /** How long one letter takes to be drawn. Short: it is a stroke, not a fade. */
  glyph: 0.22,
} as const;

/** Seconds per letter and seconds between one letter starting and the next, for `glyphs` letters. */
export function glyphTiming(glyphs: number): { duration: number; step: number } {
  const n = Math.max(1, glyphs);
  const duration = Math.min(CHALK.glyph, CHALK.total);
  return { duration, step: n > 1 ? (CHALK.total - duration) / (n - 1) : 0 };
}
