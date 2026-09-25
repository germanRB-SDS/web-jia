# Security Memory

## Contexto minimo

- Sitio estático; esta preferencia no añade autenticación, backend ni datos personales.
- La única persistencia nueva es aceptación exacta `__Host-jia-motion=on`, Secure, SameSite=Lax, Path=/, sin Domain, 180 días. Configuración: `lib/motion/config.ts`.
- Rechazo y exploración de Talleres solo viven en memoria del documento; no localStorage/sessionStorage.
- Lectura defensiva por nombre/valor; bloqueo de cookies degrada a memoria sin forzar consentimiento. No se renueva al montar.
- No HttpOnly: JavaScript necesita acceso en export estático. Secure no cifra el valor. Inventario técnico: `docs/web-jia-policies/web-jia-cookies-policy.md`.
- El ledger de capacidades no contiene admisión de MCP; no interpretar instalación como permiso. SSH productivo requiere la autorización específica vigente descrita en la guía de despliegue.

## Evidencia

`docs/prompts-output/[54-0]/evidence/` contiene pruebas de aceptación, rechazo, retirada, cookie inválida/bloqueada, foco/modal y atributos leídos mediante CDP. Las evidencias indican el origen exacto; HTTPS local no sustituye verificación pública tras despliegue.
