# Checkpoint de continuidad — JIA-2026-09-18-10

- Estado: **EJECUTADO Y CERRADO** (2026-09-18). Informe en `../report.md`.
- Commits: `57258db` prompt ampliado · `dc7c525` camino + Intro + entradilla (rollback previo al cubo) · `7182dcc` Colabora ·
  `1b2af7f` cubo 3D · informe (commit siguiente).
- Módulos tocados: `components/site/jornadas-route/`, `components/site/IntroVideo.*`, `components/cube-carousel/`,
  `lib/content/sections/jornadas-intro-video.ts`, `lib/content/data/organizations.ts`, `scripts/qa-route.mjs`, `scripts/qa-cube.mjs`.
- Verificaciones vigentes: tsc, check:content, next build en verde; evidencias en `../evidence/`.
- Pendiente del promotor: alojamiento definitivo del vídeo (constante `JORNADAS_INTRO_VIDEO_URL`), revisión del cubo en iOS/Safari.
- Restricciones activas: push con `sds-dev-governance/scripts/git-safe-push.sh origin main`; el servidor de :3005 sirve `out/`
  (hacer `next build` antes de capturar); ffmpeg no está instalado en el sistema (se usó un binario estático temporal).
