import { motion } from "./motion";
import type { Copy } from "../types";
import { buttons } from "./buttons";
import { a11y, metadata, nav, states } from "./common";
import { footer } from "./sections/footer";
import { experiences, resources, workshops } from "./entities";
import { acoge } from "./sections/acoge";
import { dosieres } from "./sections/dosieres";
import { experiencias } from "./sections/experiencias";
import { hero, waypoints } from "./sections/hero";
import { jornadas } from "./sections/jornadas";
import { partners } from "./sections/partners";
import { propuestas } from "./sections/propuestas";

/** The Spanish dictionary, assembled from its section files. */
export const dictionaryEs: Copy = {
  motion,
  metadata,
  nav,
  a11y,
  states,
  buttons,
  hero,
  waypoints,
  jornadas,
  dosieres,
  experiencias,
  propuestas,
  acoge,
  partners,
  footer,
  entities: { workshops, experiences, resources },
};
