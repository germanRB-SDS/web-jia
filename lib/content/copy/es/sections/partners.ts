import type { Copy } from "../../types";

/** ORGANIZA / COLABORA strip. Names come from data/organizations.ts; this is only the framing text. */
export const partners: Copy["partners"] = {
  kicker: "Organiza y colabora",
  title: "Quién hace posible las JIA",
  /** `{o-…}` placeholders are replaced by the organisation's name (linked when it has a URL). */
  text: "Las Jornadas de Innovación de Almería las organizan el {o-cep-almeria}, el {o-cep-ejido} y el {o-cep-cuevas}, dentro de la Consejería de Educación de la Junta de Andalucía, con la colaboración de las entidades que aparecen a continuación.",
  organiza: "Organiza",
  colabora: "Colabora",
  logosPending: "Los logotipos se incorporarán cuando la organización los facilite.",
};
