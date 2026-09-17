/** JORNADAS configuration: anchors, poster and which blocks render. */
export const jornadasConfig = {
  id: "jornadas",
  anchors: { programa: "programa", comoFuncionan: "como-funcionan", talleres: "talleres" },
  posterMediaId: "cartel-jia26" as string | null,
  showTeam: true,
} as const;
