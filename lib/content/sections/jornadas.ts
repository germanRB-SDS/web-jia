/** JORNADAS configuration: anchors, poster and which blocks render. */
export const jornadasConfig = {
  id: "jornadas",
  anchors: { programa: "programa", comoFuncionan: "como-funcionan", talleres: "talleres" },
  posterMediaId: "cartel-jia26" as string | null,
  /** The #JIA26 seal to the right of the statement, as tall as the paragraph (not on phones); null hides it. */
  sealMediaId: "sello-jia26" as string | null,
  /** Full-bleed photograph behind the section opening; null falls back to the dune veil alone. */
  bandMediaId: "jornadas-jinete-nina" as string | null,
  showTeam: true,
  /** The wagon exported from assets/3d/carruaje (copied to public/ by scripts/build-assets.sh); null disables the 3D road. */
  routeGlb: "/jornadas/jia-carruaje.glb" as string | null,
  /** The same wagon and its horse (assets/3d/caballo) driving the road behind «Programa» ([69-0]); null leaves the
      road without them (the prints and ruts stay). */
  programWagon: { wagon: "/jornadas/jia-carruaje.glb", horse: "/programa/caballo.glb" } as { wagon: string; horse: string } | null,
} as const;
