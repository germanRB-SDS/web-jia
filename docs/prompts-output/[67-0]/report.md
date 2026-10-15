# [67-0] Iconos nuevos en los accesos directos del hero · informe

- LEVEL 1 · commits: prompt + originales, implementación (ver `git log`) · tmp/: N/A
- Resultado: Programa → `HoofprintsIcon` (dos herraduras escalonadas, punta hacia delante), Talleres → `BoardIcon`,
  Experiencias → `LampIcon`. Trazados copiados de `assets/icons/*.svg` a `components/icons/index.tsx`, con
  `currentColor` (terracota del bloque), sin ficheros nuevos en `public/`.
- Verificación: tsc PASS · check:content PASS · next build PASS · capturas 1440/390 en `evidence/`.
- Riesgo moderado: son siluetas rellenas junto a una familia lineal; en este bloque las tres son del mismo tipo y
  se leen coherentes. Los iconos lineales anteriores quedan en la familia por si se quieren recuperar
  (`hero.ts`, campo `icon`). Severos/críticos: ninguno.
