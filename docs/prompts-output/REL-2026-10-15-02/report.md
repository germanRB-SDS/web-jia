# REL-2026-10-15-02 · Publicación de [68-0] + [69-0] (camino y carromato con caballo en «Programa»)

- Fecha: 2026-10-15 · Commit `7354062` · release `20261015-7354062` · anterior conservada `releases/20261015-3a723f6`
- Autorización del propietario en la conversación: «guarda en gh push. y sube a producción». Puntual, consumida; no
  crea admisión permanente ni activa el MCP de Hostinger.
- Procedimiento: `sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md`. Datos: `evidence/release.json`.

## Qué se hizo

1. Push de `main` a origin (`8193752..7354062`).
2. Build limpio en un worktree aparte (Node 24.19.0): tsc, check:content y `next build --webpack` con
   `NEXT_PUBLIC_SITE_URL` de producción, todo PASS. Paquete de `out/` (308 archivos, sin `index.*` ni payloads raíz).
3. Por SSH con clave (sin sudo): comprobación de `current` y subida del paquete y el actualizador a un staging privado
   nuevo; SHA-256 local y remoto coinciden.
4. Activación: **el propietario** ejecutó el comando preparado en su terminal y autenticó sudo allí (el agente no
   ejecuta sudo en el VPS: falta custodia independiente y admisión, ver REL-2026-09-29-01). Resultado
   `ACTIVATED 20261015-7354062`; Caddy sin cambios. El aviso `cp -n` no es fatal, como en las releases anteriores.

## Verificación (solo lectura)

- `current -> releases/20261015-7354062`; HTML con el mismo hash en el build, el origen y el dominio público.
- Redirecciones con query conservada, 404, modelos 200, vídeo Range 206.
- Chrome sobre producción: a 1440 el carromato con su caballo recorre el camino, 0 recursos fallidos y 0 errores
  (`evidence/prod-1440.webp`); a 390 la capa está oculta y no se pide el GLB del caballo.

## Rollback

Con el bloqueo del actualizador, comprobar que `current` sigue en `releases/20261015-7354062` y devolverlo de forma
atómica a `releases/20261015-3a723f6`. No hace falta recargar Caddy.

Riesgos moderados/severos/críticos: ninguno nuevo. Pendiente de siempre: publicador restringido para que la activación
no dependa de la terminal del propietario.
