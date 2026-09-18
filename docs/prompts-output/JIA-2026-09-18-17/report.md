# JIA-2026-09-18-17 — Hotfix: Experiencias sin el aviso de demostración ni la pista de uso

**Prompt:** `docs/prompts/JIA-2026-09-18-17-hotfix-experiencias-sin-aviso-ni-pista.md` · **Fecha:** 2026-09-18 ·
**Agente:** Claude Code · **Estado:** IMPLEMENTADO · **Nivel:** LEVEL 1 (hotfix) · tmp/scratch: N/A.

## Resumen

Eliminado el párrafo `.hint` de `Experiences.tsx` con su estilo, los campos `hint` y `demoNotice` del modelo
(`assemble.ts`), y las claves `states.hoverHint` y `experiencias.demoNotice` del copy y de sus tipos.

## Verificación

`tsc`, `check:content`, `next build`: OK. En el export, 0 apariciones de ambos textos. Captura en `evidence/`.

## Riesgos

- **Moderado:** las dos fichas siguen siendo de demostración (`status: "demo"`); sin el aviso, lo único que lo dice en
  pantalla es su título «Ejemplo de ficha: …» (y la marca «demo» solo con las marcas provisionales activadas).
  PRODUCT.md pide que un ejemplo nunca se publique como hecho. Propuesta: sustituirlas por casos reales o retirarlas
  antes de publicar.
- Sin severos ni críticos.
