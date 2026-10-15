# Deployment Memory

## Contexto minimo

- Producción confirmada por el propietario: VPS Hostinger existente, Caddy, dominio jornadasdeinnovacion.com y entrada /almeria-2026.
- Configuración comprobada: /etc/caddy/web-jia.caddy, root /srv/web-jia/current, releases bajo /srv/web-jia/releases. Conservar el mismo sitio y las redirecciones actuales.
- Next exporta almeria-2026.html con trailingSlash:false. La landing de la edición reutiliza app/page.tsx; metadata deriva de lib/content/site.ts.
- Solo publicar export estático; no necesita Node/PM2 en servidor. No volver a ejecutar el instalador de primera instalación.
- Actualizador: deployment/update-web-jia-release.sh, con checksum, bloqueo, enlace atómico y rollback inicial. No recarga Caddy al actualizar archivos.
- SSH por clave existente funciona; sudo requiere autenticación independiente. Las autorizaciones explícitas del 25-09-2026 para [53-1] y [54-0] son excepcionales, incluida renovación explícita de [54-0] G; todas consumidas, no permiso persistente. MCP no se ha activado.

## Procedimiento canónico

[Cómo desplegar web-jia](../../sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md): inventario, preparación, transferencia, activación, verificaciones y mejoras recomendadas.

## Último estado verificado

2026-10-15 REL-2026-10-15-02: release activa `releases/20261015-7354062` (código 7354062, [68-0] + [69-0]); anterior `releases/20261015-3a723f6` retenida. Activación ejecutada por el propietario en su terminal (sudo); hash HTML build/origen/público idéntico, redirecciones, 404, GLB, vídeo206 y Chrome 1440/390 PASS. [Informe](../prompts-output/REL-2026-10-15-02/report.md).

Anterior: 2026-09-29 REL-2026-09-29-01: release activa `releases/20260929-bf682a8`, código bf682a8 (producto 0fa2287). El propietario ejecutó manualmente la activación preparada tras el rechazo del agente por la revisión automática de admisión/custodia Hostinger. HTML build/origen/público idéntico; 8 checks HTTP (193 recursos y vídeo206) y Chrome público 1440×900 / 390×844 PASS. Caddy/configuración/PID conservados; anterior `releases/20260925-b1adf52` retenida. [Informe final](../prompts-output/REL-2026-09-29-01/report.md) y [explicación de la activación manual](../prompts-output/REL-2026-09-29-01/por-que-activacion-manual.md). Autorización puntual consumida; no crea admisión permanente. HTTP con Python recibió 403; curl/Chrome y origen verificaron la entrega, sin cambiar controles.
