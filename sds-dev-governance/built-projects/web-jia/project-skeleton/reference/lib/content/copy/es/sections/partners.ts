import type { Copy } from "../../types";

/** ORGANIZA / COLABORA. Names come from data/organizations.ts; this is the framing text and the carousel's labels. */
export const partners: Copy["partners"] = {
  kicker: "Organiza y colabora",
  title: "Quiénes somos",
  /** `{o-…}` placeholders are replaced by the organisation's name (linked when it has a URL). */
  text: "Las Jornadas de Innovación de Almería las organizan el {o-cep-almeria}, el {o-cep-ejido} y el {o-cep-cuevas}, dentro de la Consejería de Educación de la Junta de Andalucía.",
  thanks: "Agradecemos muy especialmente la valiosa y altruista colaboración de todas las empresas participantes; su compromiso ha sido una pieza clave en esta edición de las jornadas.",
  carousel: {
    label: "Entidades que organizan y colaboran",
    /** `{name}` */
    visit: "Visitar la web de {name} (se abre en una pestaña nueva)",
  },
};
