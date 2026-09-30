# Servidor y exportación estática

La referencia usa output export, trailingSlash false, images.unoptimized true, React strict mode y
agentRules false en next.config.ts. `/` y `/almeria-2026` comparten landing; la ruta de edición
produce almeria-2026.html. Assets con URLs absolutas desde raíz. Si se aloja bajo un prefijo distinto,
adaptar referencias/basePath deliberadamente; no basta con mover la carpeta y asumir que funcionan.

El servidor sirve out como archivos estáticos, con HTML limpio, MIME correctos, HTTPS y soporte de
Range para MP4 (206). No hace falta proceso Node/PM2 en producción. El hosting original es VPS+Caddy;
esta composición puede alojarse en cualquier host estático que cumpla esos contratos.

Para un nuevo sitio, definir dominio/rutas/redirects/caché de HTML y assets según destino. Revisar
metadataBase, títulos, OpenGraph, idioma y links externos en constantes. No copiar datos de contacto,
créditos ni direcciones de infraestructura del origen como valores de la nueva marca.

La guía de operación específica del sitio original pertenece a knowledge/web-jia/how-to-deploy en
la copia de proyecto; no es dependencia del modelo ni permiso para conectarse a infraestructura.
No se incluye inventario SSH, secretos, Caddy activo ni scripts de activación del servidor.
Este paquete no instala ni despliega automáticamente nada.
