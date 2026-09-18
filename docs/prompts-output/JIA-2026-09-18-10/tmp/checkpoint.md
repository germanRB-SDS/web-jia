# Checkpoint de continuidad — JIA-2026-09-18-10

- Objetivo activo: ejecutar `docs/prompts/JIA-2026-09-18-10-camino-boceto-intro-video.md` (camino según boceto con lazo
  y discos irregulares; bloque Intro con vídeo antes de #programa; constante de sección para el vídeo).
- Estado: prompt guardado y commiteado; NADA implementado aún. Pregunta del vídeo respondida en el prompt.
- Último módulo tocado (JIA-2026-09-18-09, ya en origin/main c8193e4): `components/site/jornadas-route/`,
  `lib/content/config/talleres.ts`, `components/site/SiteFooter.*`.
- Verificaciones vigentes: tsc, check:content, next build en verde; evidencias en docs/prompts-output/JIA-2026-09-18-09/.
- Restricciones activas: Blender solo por CLI en este repo (MCP admitido solo en el hub); push con
  `sds-dev-governance/scripts/git-safe-push.sh origin main`; sin Spline; el servidor de :3005 sirve `out/` (hacer
  `next build` antes de capturar); `http.postBuffer` ampliado en este repo.
- Comando para continuar: «Ejecuta docs/prompts/JIA-2026-09-18-10-camino-boceto-intro-video.md».
