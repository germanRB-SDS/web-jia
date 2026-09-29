/**
 * The Experiencias film reel ([61-0]) — the one place that tunes it.
 *
 * Geometry is in pixels OF THE DERIVED MODULE (public/experiencias/reel/fotograma-400.webp, see
 * scripts/build-assets.sh): one frame of the promoter's drawing, cut from the middle of one divider to the middle
 * of the next. The component turns these into percentages of the module box, so the film, its window and the
 * poster in it are one composition that scales as a whole.
 */
export const FILM_REEL = {
  /** The module: 400 x 412, the film's full height (edges, sprocket holes and window). */
  module: { width: 400, height: 412 },
  /** The window of the frame, measured on the drawing (x 502-871, y 292-581 of cine-fotogramas.png). */
  window: { x: 14, y: 61, width: 370, height: 290 },
  /** Poster proportion (1414 x 2000). */
  posterRatio: 1414 / 2000,
  /** Paper left above and below the poster, as a share of the window's height: the header and the reward line of
      every poster stay clear of the window's rounded edge. */
  posterInset: 0.055,
  /** The stains drawing (the whole artwork, paper taken to white): its size and where the film band sits in it. */
  stains: { width: 1774, height: 887, bandTop: 231 },
  /** Drift, in CSS pixels per second. */
  speed: 18,
  /** Which way it drifts: 1 is right to left, -1 left to right (promoter, [61-0] on the fly: the posters come out
      of the fade on the left and leave by the right edge). A drag goes wherever it is dragged either way. */
  direction: -1 as 1 | -1,
  /** Time constant, in milliseconds, of the drift picking up and slowing down. */
  ease: 450,
  /** A glide (an arrow, a poster brought into view by the keyboard): ease-out, its time grows with the distance
      between these bounds, in milliseconds. */
  glide: { min: 250, max: 700, perPx: 0.35 },
  /** Drag / swipe ([61-0], on the fly): pixels before a press becomes a drag (and stops being a click). */
  dragThreshold: 6,
  /** The strip moves this many times the pointer's travel: dragging sends it that way, faster. */
  dragGain: 1.6,
  /** Milliseconds of pointer history the release speed is measured over. */
  velocityWindow: 90,
  /** Top speed of a throw, px/ms (about 1 800 px/s), and its decay time constant in ms. */
  throwMax: 1.8,
  throwDecay: 420,
  /** Pixels kept between a poster brought into view and the end of the fade / the right edge. */
  focusMargin: 12,
  /** A poster whose centre is this far into the fade (share of the fade's width, from its clear end) stops taking clicks. */
  fadedAt: 0.35,
  /** Viewer: milliseconds between the mouse leaving the enlarged poster and the viewer closing. */
  leaveDelay: 150,
  /** Viewer: milliseconds of its fade in and out. */
  viewerFade: 180,
} as const;

/** The module-relative boxes the CSS needs, in percent: the poster centred in the window, with its own proportion. */
export function reelGeometry() {
  const { module: m, window: w, posterRatio, posterInset } = FILM_REEL;
  const posterHeight = w.height * (1 - 2 * posterInset);
  const posterWidth = posterHeight * posterRatio;
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(4)}%`;
  return {
    "--reel-module-ratio": `${m.width} / ${m.height}`,
    "--reel-module-per-band": `${m.width / m.height}`,
    "--reel-poster-left": pct(w.x + (w.width - posterWidth) / 2, m.width),
    "--reel-poster-top": pct(w.y + w.height * posterInset, m.height),
    "--reel-poster-width": pct(posterWidth, m.width),
    "--reel-poster-height": pct(posterHeight, m.height),
    "--reel-stains-width": `${FILM_REEL.stains.width / m.width}`,
    "--reel-stains-height": `${FILM_REEL.stains.height / m.width}`,
    "--reel-stains-top": `${FILM_REEL.stains.bandTop / m.width}`,
  };
}
