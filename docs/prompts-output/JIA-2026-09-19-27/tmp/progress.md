# JIA-2026-09-19-27 — progreso (memoria de ejecución)

| Fase | Puntos | Estado | Commit |
|---|---|---|---|
| 0 | prompt + estructura | hecho | 8876512 |
| 1 | 1, 2, 3, 7 | hecho (verificado 1440/390: Ver ficha a 861/1660 px por fila, reveal 50 %, 17 px) | 6f01724 · hotfix texto 0a9d5d7 |
| 2 | 4, 6 + hotfixes cursor/clic | hecho | 644797c |
| 3 | 5 | hecho | f495444 |
| 4 | 8 herradura Blender + colgada | hecho | 50528fa |
| 5 | 9 inclinada −14° + reubicada a la derecha, solo ≥ 1600 px (promotor) | hecho | 0caaf05 |
| 6 | 10 clic → cae + hotfix hero | hecho | bc79132 · 19b832d |
| 7 | 11 luz, sombra, reflejos | hecho | ba25a38 |
| 8 | informe | hecho | (commit del informe) |

Notas:
- Dev server del repo en :3000 (no arrancar otro). Blender 5.2.1 LTS en /Applications/Blender.app (headless).
- Push por `../sds-dev-governance/scripts/git-safe-push.sh origin main`.

Hallazgo ajeno al prompt: scroll horizontal previo (983 px a 960; 438 a 390) causado por «Cómo funcionan» / cubo del equipo. Se anota como riesgo en el informe.
