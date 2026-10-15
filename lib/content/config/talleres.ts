/**
 * TALLERES DE LA EDICIÓN — configuración dictada por el promotor (JIA-2026-09-18-09).
 *
 * `NUMERO_DE_TALLERES` fija cuántos talleres tiene la edición; el camino animado de
 * «Las jornadas» dibuja una parada por taller y muestra su nombre. Para otra edición
 * basta cambiar el número y añadir/quitar constantes `TALLER_N`.
 *
 * Los títulos transcritos de los carteles viven en data/workshops.ts (con procedencia);
 * estas constantes son la forma dictada por el promotor y alimentan el recorrido.
 */
export const NUMERO_DE_TALLERES = 6;

export const TALLER_1 = "Por un puñado de bloques";
export const TALLER_2 = "Dos renders, un destino";
export const TALLER_3 = "El bueno, el feo y el plano";
export const TALLER_4 = "Siete legos para siete planos";
export const TALLER_5 = "La profe que pintó a Liberty Valance";
export const TALLER_6 = "La muerte tenía un micro";

/**
 * DOSIER DE CADA TALLER (JIA-2026-09-18-13): la URL que abre «Descargar dosier» en la tarjeta del
 * taller, bajo «Ver ficha». `null` = aún sin enlace: la tarjeta lo muestra como pendiente. Basta
 * pegar aquí la URL (https://…) o una ruta del sitio (/dosieres/archivo.pdf) para activarlo.
 * Mismo orden que TALLER_N y que data/workshops.ts. Desde [65-0] son los dosieres didácticos del promotor
 * (originales en assets/dosieres-didacticos/); una ruta del sitio se descarga, una URL externa se abre aparte.
 */
export const TALLER_1_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-por-un-punado-de-bloques.pdf";
export const TALLER_2_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-dos-renders-y-un-destino.pdf";
export const TALLER_3_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-el-bueno-el-feo-y-el-plano.pdf";
export const TALLER_4_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-siete-legos-para-siete-planos.pdf";
export const TALLER_5_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-la-profe-que-pinto-a-liberty-valance.pdf";
export const TALLER_6_DOSIER: string | null = "/talleres/dosieres/dosier-didactico-la-muerte-tenia-un-micro.pdf";

export const TALLERES_DOSIERES: readonly (string | null)[] = [TALLER_1_DOSIER, TALLER_2_DOSIER, TALLER_3_DOSIER, TALLER_4_DOSIER, TALLER_5_DOSIER, TALLER_6_DOSIER];

/** Todas las constantes en orden; el recorrido usa las `NUMERO_DE_TALLERES` primeras. */
const TALLERES_DEFINIDOS = [TALLER_1, TALLER_2, TALLER_3, TALLER_4, TALLER_5, TALLER_6] as const;

if (NUMERO_DE_TALLERES > TALLERES_DEFINIDOS.length) {
  throw new Error(`NUMERO_DE_TALLERES (${NUMERO_DE_TALLERES}) supera las constantes TALLER_N definidas (${TALLERES_DEFINIDOS.length}).`);
}

export const TALLERES: readonly string[] = TALLERES_DEFINIDOS.slice(0, NUMERO_DE_TALLERES);
