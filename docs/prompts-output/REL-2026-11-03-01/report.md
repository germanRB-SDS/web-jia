# REL-2026-11-03-01 · Publicación de [70-0] + [71-0] (recursos del taller, inauguración y «El cierre de Tizaseca»)

- Fecha: 2026-11-03 · Commit `151e382` · release `20261103-151e382` · anterior conservada `releases/20261016-40d407d`
- Autorización del propietario en la conversación: «vale, commit y gh push a main. y súbelo a producción». Puntual,
  consumida; no crea admisión permanente ni activa el MCP de Hostinger.
- Procedimiento: `sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md`. Datos: `evidence/release.json`.

## Qué se hizo

1. Push de `main` con `git-safe-push.sh` (`40d407d..151e382`).
2. Build limpio en un worktree aparte (Node 24.19.0): tsc, check:content y `next build --webpack` con
   `NEXT_PUBLIC_SITE_URL` de producción, PASS. Paquete de `out/` (311 archivos, sin `index.*` ni payloads raíz).
3. SSH con clave (sin sudo): `current` comprobado (`releases/20261016-40d407d`), staging privado nuevo, paquete,
   actualizador y lanzador de un solo uso subidos; SHA-256 local y remoto coinciden.
4. Activación: **el propietario** ejecutó el lanzador en su terminal y autenticó sudo allí →
   `ACTIVATED 20261103-151e382`; Caddy sin cambios; aviso `cp -n` no fatal, como siempre.

## Verificación (solo lectura)

- `current -> releases/20261103-151e382`; HTML idéntico en build, origen y dominio público (`dcd84d08…`).
- Redirecciones con query conservada, 404, imágenes nuevas 200, vídeo Range 206.
- Chrome sobre producción a 1440 y 390 (`evidence/cierre/`, `evidence/talleres/`): orden acoge → cierre → socios;
  cinco enlaces de Padlet y uno pendiente; ficha con «Dosier» y «Recursos»; separación de 16 px a 1440 y sin cambios a
  390; avisos de «vídeo no disponible» forzados para el aftermovie y la inauguración; 0 errores de consola.
- Nota de QA: en una pasada a 1440 la pulsación llegó antes de que respondiera la comprobación (la página tarda más en
  hidratarse en producción) y la franja se comportó como enlace normal, que es lo previsto; repetido con margen
  (`evidence/qa-nota-1440.mjs`), el aviso se abre.

## Rollback

Con el bloqueo del actualizador, comprobar que `current` sigue en `releases/20261103-151e382` y devolverlo de forma
atómica a `releases/20261016-40d407d`. No hace falta recargar Caddy.

## Riesgos

- Moderado: URL de recursos de «La profe que pintó a Liberty Valance» pendiente (se ve «Recursos próximamente»).
- Moderado: texto de «El cierre de Tizaseca» propuesto por el agente y validado visualmente por el promotor.
- Pendiente de siempre: publicador restringido para que la activación no dependa de la terminal del propietario.
