/** JORNADAS configuration: anchors, poster and which blocks render. */
export const jornadasConfig = {
  id: "jornadas",
  anchors: { programa: "programa", comoFuncionan: "como-funcionan", talleres: "talleres" },
  posterMediaId: "cartel-jia26" as string | null,
  /** Full-bleed photograph behind the section opening; null falls back to the dune veil alone. */
  bandMediaId: "jornadas-jinete" as string | null,
  showTeam: true,
  /** The wagon exported from assets/3d/carruaje (copied to public/ by scripts/build-assets.sh); null disables the 3D road. */
  routeGlb: "/jornadas/jia-carruaje.glb" as string | null,
} as const;
