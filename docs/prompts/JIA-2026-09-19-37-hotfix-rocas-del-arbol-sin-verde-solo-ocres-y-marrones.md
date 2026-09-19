# JIA-2026-09-19-37 — Hotfix: las rocas de la base del árbol, sin verde: solo ocres y marrones de la paleta

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-19-36. **Nivel:** LEVEL 1 (hotfix;
resultado al final de este prompt, sin `report.md`). tmp/scratch: N/A. **Estado:** SIN EJECUTAR

## Encargo

Las piedras de la base del árbol de «Experiencias» tienen hoy **musgo amarillo‑verdoso** (tokens `--jia-tree-moss*`) en
las caras que miran al cielo y en la loma del pie. El promotor lo quiere **sin verde: solo tonos ocres y marrones que
vayan con la estética de la paleta**.

- Solo cambia la **configuración del sitio** (`lib/content/sections/experiencias.ts` › paleta `cicada`): `moss` y
  `mossDark` pasan a tierras hechas con tokens existentes (`--jia-dune-light`, `--jia-copper`,
  `--jia-terracotta-deep`) vía `color-mix`: caras altas en **ocre claro arenoso** (les da el sol), loma y huecos en
  **marrón**. Así las rocas conservan el facetado (caras claras arriba, cobre/terracota en los lados) sin un solo verde.
- **El componente `tree-3d` no se toca** (en él «moss» es solo el nombre de lo que cubre las caras altas; el color lo
  pone quien lo usa). Copa, tallos, sombra, tamaño y posición, intactos.
- Los tokens `--jia-tree-moss` y `--jia-tree-moss-deep` quedan sin uso: se retiran de `app/theme/palette.css`.

## Reglas

Prompt commiteado antes de ejecutar; commit al terminar; sin push salvo que el promotor lo pida. `git add` solo de
ficheros propios. Verificación: `tsc`, `check:content`, `next build`, captura por CDP a 1920 y detalle 2× de las rocas.
