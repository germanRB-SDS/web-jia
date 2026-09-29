/**
 * REVÓLVER DEL PROGRAMA ([56-0]) — configuración dictada por el promotor (29-09-2026).
 *
 * En «Programa», un revólver pequeño apunta al numeral de la sesión que se está celebrando en ese momento,
 * según la hora real de Almería. Solo aparece en las fechas de las jornadas (data/program.ts) y dentro del
 * horario de cada sesión; fuera de él, y en los huecos entre sesiones, no se ve nada.
 *
 * - `REVOLVER_HORA`: "ENABLED" lo activa; "DISABLED" lo apaga del todo (también la vista previa).
 * - `REVOLVER_VISTA_PREVIA`: `true` lo deja fijo en «I» de la Jornada 1 sea el día que sea, solo para revisarlo
 *   a ojo. En producción, `false`.
 * - `REVOLVER_ZONA_HORARIA`: la de Almería. El horario de verano/invierno lo resuelve el navegador.
 * - `REVOLVER_ESTILO`: "natural" (la acuarela tal cual) o "tinta" (la silueta, en terracota de la paleta).
 */
export const REVOLVER_HORA: "ENABLED" | "DISABLED" = "ENABLED";

export const REVOLVER_VISTA_PREVIA: boolean = true;

export const REVOLVER_ZONA_HORARIA = "Europe/Madrid";

export const REVOLVER_ESTILO: "natural" | "tinta" = "natural";
