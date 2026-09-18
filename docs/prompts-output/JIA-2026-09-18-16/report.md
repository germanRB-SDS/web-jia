# JIA-2026-09-18-16 — «Cómo ir», enlaces de colaboradores, sin nota del programa y banda de Propuestas más densa

**Prompt:** `docs/prompts/JIA-2026-09-18-16-como-ir-enlaces-colaboradores-propuestas-honda.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 1 · tmp/scratch: N/A.

## Resumen

- **«Cómo ir»:** enlace de texto subrayado en terracota con una flecha que apunta a la palabra (se acerca 3 px al
  pasar el ratón); nombre accesible «Cómo ir a {lugar}: abrir en Google Maps (pestaña nueva)». El icono `MapPinIcon`
  se retira del código; `assets/icons/map.svg` se conserva.
- **Nota del programa:** eliminada del copy, del tipo, del modelo y del componente.
- **Propuestas:** el tono `sand` usa la receta nueva `--jia-bg-deep` (arena profunda `#e2cfb2`); «Quién hace posible»
  no se ha tocado. La receta `--jia-bg-arrive` desaparece (no tenía otro uso). DESIGN.md y palette.css actualizados.
- **Colaboradores:** las cuatro URL que faltaban están en `lib/content/data/organizations.ts`; el pie y «Quién hace
  posible» ya enlazaban con `target="_blank" rel="noopener noreferrer"` cuando hay URL.

## Verificación

`tsc`, `check:content`, `next build`: OK. En el export: 0 apariciones de la nota, 2 «Cómo ir», y cada colaborador
enlazado en «Quién hace posible» y en el pie con `target="_blank"`. Contraste sobre `#e2cfb2`: texto 7,0:1, tinta
11,0:1, terracota 4,55:1. Capturas en `evidence/`.

## Riesgos

- **Moderado:** sobre la arena profunda, `--jia-text-muted` da 3,96:1. Hoy la banda no muestra texto secundario
  (la nota de acción está vacía); si se añade, debe ir en `--jia-text`.
- **Moderado:** las URL de los colaboradores no se han abierto para comprobarlas (se transcriben tal como las dio el
  promotor). Propuesta: revisarlas a mano antes de publicar.
- Sin severos ni críticos.
