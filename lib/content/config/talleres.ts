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

/** Todas las constantes en orden; el recorrido usa las `NUMERO_DE_TALLERES` primeras. */
const TALLERES_DEFINIDOS = [TALLER_1, TALLER_2, TALLER_3, TALLER_4, TALLER_5, TALLER_6] as const;

if (NUMERO_DE_TALLERES > TALLERES_DEFINIDOS.length) {
  throw new Error(`NUMERO_DE_TALLERES (${NUMERO_DE_TALLERES}) supera las constantes TALLER_N definidas (${TALLERES_DEFINIDOS.length}).`);
}

export const TALLERES: readonly string[] = TALLERES_DEFINIDOS.slice(0, NUMERO_DE_TALLERES);
