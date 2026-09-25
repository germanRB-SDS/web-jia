# Publicación de la versión aprobada — estado parcial

## 0. Metadata
2026-09-25 · Codex · REL-2026-09-25-02 · PARCIAL.

## 1. Objetivo
LEVEL 3, deployment: guardar la versión actual en GitHub y publicarla tal cual en producción. El propietario autoriza ambas acciones.

## 2. Resumen
main local y origin/main confirmados en 6ec0109. Paquete estático preparado; producción todavía no desplegada. No se altera diseño, rutas, analítica ni alojamiento.

## 3. Ficheros
Artefacto local: `/private/tmp/web-jia-6ec0109-production.tar.gz`; 202 archivos, 50463753 bytes.
SHA-256: `d92a90f740cbf3f0ead654154088c94d0f4d05e51e42b548e6a58a148404e4ec`.
La única diferencia en raíz es next-env.d.ts autogenerado por next dev (.next/dev/types); se conserva localmente, sin incluir rutas de desarrollo en la release.

## 4. Impacto
Web: exportación estática verificada del commit 6ec0109. Infraestructura: ninguna mutación realizada.

## 5. BBDD
N/A: sitio estático.

## 6. API
N/A: sin backend.

## 7. Validación
Fetch confirmó igualdad main/origin/main. Worktree del artefacto en el mismo commit y sin diferencias de código. Se reutilizan build, TypeScript, contenido y 66 aserciones de navegador documentados en el informe [53-1]; código sin cambios. Paquete comprobado: index.html presente, sin .env, claves PEM/KEY ni archivos .DS_Store. HTTPS/producción: NOT RUN, destino no confirmado.

## 8. Resultado
GitHub completo y paquete listo. No existe workflow de despliegue ni runbook prod.md en el proyecto; memoria deployment todavía pendiente. El prompt [48-0] está PREPARED — NOT EXECUTED y deja abiertas las opciones VPS Hostinger / Cloudflare Pages y la ruta de entrada. No se ejecuta ese prompt ni se amplía este pedido a analítica/UTM.

## 9. E2E
Local: PASS conforme a evidencia [53-1]. Producción: PENDING.

## 10. Decisiones y riesgos
No elegir un alojamiento por inferencia ni cambiar DNS/rutas. El ledger de capacidades no contiene destinos/modos admitidos. Hostinger conserva su bloqueo de aislamiento y no se ha intentado acceder por MCP, SSH ni API. No se han leído credenciales. Riesgo de publicar en destino incorrecto mitigado manteniendo la release local hasta identificar el alojamiento y su ruta controlada.

## 11. Memoria
Leída docs/memory/deployment.md; sin hechos suficientes para completarla. Sin cambios a gobernanza.

## 12. Checkpoint y siguiente paso
Pregunta enviada al propietario para identificar alojamiento actual/proyecto. Pendiente respuesta. Continuar desde la release 6ec0109, verificar destino/acceso admitido y rollback, publicar el artefacto y comprobar HTTPS, recursos y comportamiento móvil. No volver a pedir permiso para publicar: ya está autorizado. Registrar el resultado real cuando se complete; no presentar este paquete como despliegue.
