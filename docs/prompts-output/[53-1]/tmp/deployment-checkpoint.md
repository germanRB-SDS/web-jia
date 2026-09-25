# Deployment closure — 2026-09-25

REL-2026-09-25-02 · IMPLEMENTADO. Código b410b77 publicado en el sitio existente https://jornadasdeinnovacion.com/almeria-2026. El propietario ejecutó activate-once.sh y autenticó sudo personalmente; ningún secreto entregado al agente.

Current verificado: releases/20260925-b410b77. Anterior releases/20260920-5b4d363 conservada. HTML origen/público SHA 369b27981351628cb0d3fab53d3008dace40c622b3db777b2e8016d9a1f08169. Caddy activo con PID 9241 y las mismas cuatro configuraciones; no se recargó ni reinició.

Verificación nueva: 10 comprobaciones HTTP, 42 recursos, vídeo Range 206 y 7 checks Chrome móvil/escritorio PASS. Evidencia production-http.json, production-server.json, production-browser.json y capturas bajo ../evidence/. Se conservan build, contenido, TypeScript y fixtures previos; no se presentan como reejecutados.

Guía canónica: sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md. Informe final: ../deployment-closure.md. No queda activación pendiente; no volver a ejecutar el launcher de esta ocasión. Autorización SSH excepcional consumida para este despliegue, MCP no activado. Futuras operaciones necesitan autorización/admisión propia. Mantener next-env.d.ts generado por el servidor local fuera del commit.
