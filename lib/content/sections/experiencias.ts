import type { SurfaceToken } from "../data/types";

/**
 * Set `showDemo` to false to hide demo entries and show the pending state instead. The section's ground is a
 * full-bleed photograph (`mediaId`) whose clear left half carries the text; with no media it is plain vellum.
 *
 * Since [51-0] that ground is a stack of layers: the photograph (`mediaId`), the window light drawn over it, and
 * the same teacher cut out of the same frame (`cutoutMediaId`) laid back on top, so the light passes behind her.
 * Set `cutoutMediaId` to null and the section loses the depth but keeps the photograph and the text.
 */
export const experienciasConfig = {
  id: "experiencias",
  showDemo: true,
  mediaId: "experiencias-aula" as string | null,
  cutoutMediaId: "experiencias-maestra" as string | null,
  fallbackSurface: "card" as SurfaceToken,
  /**
   * The cards are the picture alone ([60-0]): no title under it and no «Ver ficha». The title stays for screen
   * readers and the picture itself is the button that opens the sheet. Set to false for the full card.
   */
  pictureOnly: true,
  /**
   * What the column shows ([61-0]): "reel" is the film strip with the success-story posters running through its
   * frames (components/site/film-reel); "cards" brings back the experience cards of [60-0]. While the reel is in use,
   * links to one experience (workshop sheets, programme) land on the section.
   */
  display: "reel" as "reel" | "cards",
  /** The posters in the reel's frames, in this order. The names and rewards that name them are in the copy. `pdf` is
      the success story itself ([65-0], originals in assets/experiencias-exito-pdf/): the viewer offers it under the
      poster; null leaves the viewer without the button. */
  reelPosters: [
    { id: "gabi-moral", mediaId: "exito-1", pdf: "/experiencias/descargas/experiencia-de-exito-gabi-moral.pdf" as string | null },
    { id: "ruben-lopez", mediaId: "exito-2", pdf: "/experiencias/descargas/experiencia-de-exito-ruben-lopez.pdf" as string | null },
    { id: "toni-navarro", mediaId: "exito-3", pdf: "/experiencias/descargas/experiencia-de-exito-toni-navarro.pdf" as string | null },
    { id: "gonzalo-carretero", mediaId: "exito-4", pdf: "/experiencias/descargas/experiencia-de-exito-gonzalo-carretero.pdf" as string | null },
    { id: "maria-lopez", mediaId: "exito-5", pdf: "/experiencias/descargas/experiencia-de-exito-maria-lopez.pdf" as string | null },
    { id: "pilar-diaz", mediaId: "exito-6", pdf: "/experiencias/descargas/experiencia-de-exito-pilar-diaz.pdf" as string | null },
    { id: "cristina-robles-leon", mediaId: "exito-7", pdf: "/experiencias/descargas/experiencia-de-exito-cristina-robles-leon.pdf" as string | null },
  ],
} as const;
