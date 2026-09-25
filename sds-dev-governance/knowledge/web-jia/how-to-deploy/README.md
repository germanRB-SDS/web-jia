# Cómo desplegar web-jia

## Decisión autorizada y alcance

El 25 de septiembre de 2026 el propietario confirma que producción está en su VPS de Hostinger y ordena actualizar la instalación existente de web-jia, sin duplicar el sitio. Tras ser informado del bloqueo SDS de Hostinger y de la prohibición de recurrir a SSH, indica expresamente: «puedes utilizar ssh, yo te autorizo expresamente ahora mismo».

Esta instrucción posterior del mismo propietario se registra como MODIFICATION: excepción acotada que permite SSH directo para inspeccionar y actualizar únicamente el sitio existente de web-jia en este despliegue. Sustituye para esta operación la prohibición anterior de acceso alternativo por SSH. No activa el MCP de Hostinger, no admite otros proyectos ni autoriza exponer credenciales, cambiar DNS, duplicar el sitio, borrar recursos o reiniciar servicios ajenos. La autorización de despliegue ya estaba concedida.

La decisión sustituye la alternativa pendiente VPS/Cloudflare Pages del prompt [48-0] para esta entrega. Se conservan dominio, rutas y servidor existentes; no se ejecuta el alcance adicional de analítica/UTM de aquel prompt.

## Estado de investigación

Acceso SSH local descubierto; identidad remota, servidor web, ruta del sitio, método de publicación y rollback pendientes de comprobar. No se presentan recomendaciones como configuración verificada.

Artefacto local preparado a partir del código aprobado 6ec0109: exportación estática Next.js en out/, 202 archivos; SHA-256 del paquete: d92a90f740cbf3f0ead654154088c94d0f4d05e51e42b548e6a58a148404e4ec. No contiene fuentes privadas, credenciales ni dependencias de desarrollo.

## Secuencia prevista

1. Verificar identidad SSH y localizar el virtual host/contenedor que ya sirve web-jia.
2. Registrar destino y versión previa sin secretos; comprobar recursos y otros servicios.
3. Preparar copia de recuperación y subir el artefacto a una ubicación temporal del mismo sitio.
4. Validar archivos, permisos y configuración; activar conservando dominio y rutas.
5. Comprobar HTTPS, recursos, vídeo y comportamiento móvil; documentar el procedimiento real y rollback.

Esta guía se completará con hechos observados y recomendaciones separadas después de la inspección.
