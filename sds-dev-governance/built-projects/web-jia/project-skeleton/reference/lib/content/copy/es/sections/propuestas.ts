import type { Copy } from "../../types";

export const propuestas: Copy["propuestas"] = {
  title: "Tu propuesta JIA",
  subtitle: "¿Cuál debería ser la siguiente temática?",
  paragraphs: [
    "Tu participación nos ayudaría (¡mucho!) para preparar las próximas JIA. Envíanos tu idea respecto a qué temática te gustaría que se utilizara como hilo conductor para la próxima edición.",
    // The last paragraph ends with a drawn arrow pointing down at the action under it (Proposals.tsx), and now
    // says so out loud: "al pulsar aquí abajo" (promoter, 20-09-2026).
    "Toda la información la encontrarás al pulsar aquí abajo.",
  ],
  unavailable: null,
  status: "provisional",
};
