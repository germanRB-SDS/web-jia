/**
 * NAVIGATION STRUCTURE. Order is the brief's (§3): Experiencias sits third.
 * Labels come from copy.nav; anchors are the section ids declared in each
 * section's config, so a renamed anchor changes in one place.
 */
import { acogeConfig } from "./acoge";
import { dosieresConfig } from "./dosieres";
import { experienciasConfig } from "./experiencias";
import { jornadasConfig } from "./jornadas";
import { propuestasConfig } from "./propuestas";

export type NavKey = "jornadas" | "dosieres" | "experiencias" | "propuestas" | "acoge";
export type NavChildKey = "programa" | "comoFuncionan" | "talleres";

export const navStructure: readonly { key: NavKey; anchor: string; children?: readonly { key: NavChildKey; anchor: string }[] }[] = [
  {
    key: "jornadas",
    anchor: jornadasConfig.id,
    children: [
      { key: "programa", anchor: jornadasConfig.anchors.programa },
      { key: "comoFuncionan", anchor: jornadasConfig.anchors.comoFuncionan },
      { key: "talleres", anchor: jornadasConfig.anchors.talleres },
    ],
  },
  { key: "dosieres", anchor: dosieresConfig.id },
  { key: "experiencias", anchor: experienciasConfig.id },
  { key: "propuestas", anchor: propuestasConfig.id },
  { key: "acoge", anchor: acogeConfig.id },
];
