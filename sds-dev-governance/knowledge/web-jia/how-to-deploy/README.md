# Cómo desplegar web-jia

## Último despliegue comprobado — [54-0]

El 25-09-2026 se actualizó el mismo sitio a `releases/20260925-5ff471c` (código `5ff471c`), conservando `releases/20260925-b410b77`. El propietario dio una **nueva** autorización: «te doy permiso para este despliegue también» y «permiso explícito por ssh». Autenticó sudo en su terminal mediante el launcher específico del nuevo staging `/home/sdsadmin/web-jia-release-review-X8Gv4D/`. No volver a ejecutar ese launcher. Esta excepción también queda consumida y no crea permiso permanente ni admisión MCP.

Paquete y updater se verificaron con SHA-256 antes de activar. HTML local, origen y dominio público coinciden; Caddy/configuración/proceso sin cambios. Smoke: 10 checks HTTP, 43 recursos, vídeo Range 206; 42 checks de navegador público PASS para preferencia/cookie, tarjetas compactas, touch/teclado y efectos. [Cierre y evidencia [54-0]](../../../../docs/prompts-output/[54-0]/deployment-closure.md), [manifiesto](../../../../docs/prompts-output/[54-0]/evidence/release-prepared.json).

Los comandos e inventario históricos de [53-1] que siguen documentan cómo se descubrió el procedimiento; sus identificadores no son la release actual. Para cada despliegue nuevo, autorización vigente, comprobación real de current, nuevos hashes/staging y launcher. sudo sigue requiriendo autenticación independiente; no recuperar ni publicar contraseñas. El aviso cp -n volvió a ser no fatal; la mejora de coreutils sigue pendiente y no se introdujo durante la publicación visual.

## Decisión autorizada y alcance histórico — [53-1]

El 25 de septiembre de 2026 el propietario confirma que producción está en su VPS de Hostinger y ordena actualizar la instalación existente de web-jia, sin duplicar el sitio. Tras ser informado del bloqueo SDS de Hostinger y de la prohibición de recurrir a SSH, indica expresamente: «puedes utilizar ssh, yo te autorizo expresamente ahora mismo».

Esta instrucción posterior del mismo propietario se registra como MODIFICATION: excepción acotada que permite SSH directo para inspeccionar y actualizar únicamente el sitio existente de web-jia en este despliegue. Sustituye para esta operación la prohibición anterior de acceso alternativo por SSH. No activa el MCP de Hostinger, no admite otros proyectos ni autoriza exponer credenciales, cambiar DNS, duplicar el sitio, borrar recursos o reiniciar servicios ajenos. La autorización de despliegue ya estaba concedida.

La decisión sustituye la alternativa pendiente VPS/Cloudflare Pages del prompt [48-0] para esta entrega. Se conservan dominio, rutas y servidor existentes; no se ejecuta el alcance adicional de analítica/UTM de aquel prompt.

## Instalación real comprobada

| Elemento | Valor observado el 25-09-2026 |
|---|---|
| Acceso | Alias SSH local `sds-prod-01`, usuario remoto `sdsadmin`; clave pública y host key existentes |
| URL pública | `https://jornadasdeinnovacion.com/almeria-2026` |
| Servidor | Caddy, unidad `caddy.service`, activa |
| Configuración del sitio | `/etc/caddy/web-jia.caddy`, importada desde `/etc/caddy/Caddyfile` |
| Document root | `/srv/web-jia/current` |
| Versión anterior conservada | `releases/20260920-5b4d363` |
| Propiedad | Directorios y enlace de publicación pertenecen a root; sdsadmin necesita sudo |
| Staging de esta ocasión | `/home/sdsadmin/web-jia-release-review-Xstzs4/`, fuera del document root |
| Versión activa y verificada | `current -> releases/20260925-b410b77`; código `b410b77` |

No hay que crear otro sitio, dominio, contenedor, servicio Node o virtual host. Tampoco hay que ejecutar el instalador antiguo de primera instalación. `current` es un enlace a la release servida por el sitio existente.

La rama histórica `feat/REL-2026-09-20-48-production-deployment` conservaba la preparación de producción que no llegó a main. Se han recuperado únicamente la compatibilidad de ruta y canonical sobre la interfaz actual; no se ha mezclado su interfaz antigua ni sus permisos históricos.

## Contrato de rutas que debe conservarse

Caddy redirige `/`, `/almeria-2026/` y `/almeria-2026.html` hacia `/almeria-2026`, preservando query strings. La ruta limpia se reescribe internamente a `almeria-2026.html`; HTTPS público devuelve 200. Los recursos `/_next/static/*` tienen caché larga con `immutable`; HTML es revalidable. No cambiar DNS, TLS ni estos redirects para subir una nueva versión.

El código ahora exporta `/almeria-2026` reutilizando la misma landing de `app/page.tsx`; su canonical se obtiene de `edition.path` y `site.url`. `trailingSlash: false` genera el archivo plano esperado por Caddy. La raíz sigue disponible como preview local; se excluyen `index.html`, `index.txt` y los payloads RSC exclusivos de raíz del paquete público, evitando una segunda entrada publicada.

## Preparar una release

1. Partir de un commit revisado, con los cambios de interfaz guardados. Usar un worktree de build para no interferir con `next dev` ni su next-env.d.ts autogenerado.
2. Usar el runtime del proyecto. En esta entrega se verificó Node 24.19.0; si existe `.nvmrc`, prevalece ese pin. Instalar con `npm ci` solo cuando falten dependencias o cambie el lockfile.
3. Desde la raíz del worktree, ejecutar:

```sh
source "$HOME/.nvm/nvm.sh" && nvm use 24
npx tsc --noEmit
npm run check:content
NEXT_PUBLIC_SITE_URL=https://jornadasdeinnovacion.com npx next build --webpack
```

Webpack se usó por el enlace local a node_modules del worktree; no se actualizan dependencias. `next/font` descarga fuentes durante un build limpio y las incorpora al export. Hace falta acceso a Google Fonts al compilar, no en el navegador publicado.

Publicar únicamente archivos de `out/`. No subir repositorio, originales `assets/`, claves, .env, caches, scripts ni node_modules. Ejemplo de empaquetado desde la raíz (destino fuera del repo):

```python
from pathlib import Path
import tarfile
source = Path("out")
archive = Path("/tmp/web-jia-release.tar.gz")
with tarfile.open(archive, "w:gz") as output:
    for item in sorted(source.rglob("*")):
        if not item.is_file():
            continue
        relative = item.relative_to(source)
        if item.name == ".DS_Store" or str(relative) in ("index.html", "index.txt"):
            continue
        if relative.parent == Path(".") and relative.name.startswith("__next."):
            continue
        assert not item.is_symlink() and not item.name.startswith(".env")
        output.add(item, arcname=str(relative), recursive=False)
```

Calcular SHA-256 del paquete y de `almeria-2026.html`, y registrar commit, fecha, release y destino anterior. La evidencia de esta ocasión está en [production-release.json](../../../../docs/prompts-output/[53-1]/evidence/production-release.json). Sustituye el primer paquete 6ec0109, que era solo una preview de raíz y no era compatible directamente con la ruta publicada.

## Acceso y autenticación

La autorización SSH del propietario cubre solo esta ocasión. No supone acceso permanente ni cambia el estado bloqueado del MCP. En despliegues futuros aplicar el acceso admitido vigente o una nueva autorización del propietario.

La conexión comprobada fue:

```sh
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ConnectTimeout=10 sds-prod-01
```

SSH funciona sin recuperar contraseña. Sudo es independiente: `sudo -n true` requiere contraseña. Se buscaron únicamente metadatos de Keychain: entradas genéricas para servicio sds-prod-01/cuenta sdsadmin y entrada de Internet para sdsadmin; no se encontró una coincidencia accesible. No se recuperó ningún secreto.

Si el propietario identifica una entrada exacta válida, Keychain puede entregar su salida directamente a stdin de `ssh -T ... sudo -S -p '' ...`, sin que la contraseña aparezca en el chat, argumentos, variables persistentes o archivos. No ejecutar búsquedas que vuelquen todas las credenciales, no imprimir `security ... -w`, no activar shell tracing. Si no hay entrada, el propietario puede autenticar sudo en su propia terminal durante la activación. Un sudo previo en otra sesión no habilita la sesión del agente. No utilizar wrappers NOPASSWD de otros proyectos.

## Transferir y activar en el mismo sitio

Crear un staging privado del usuario, copiar por SCP el paquete y [update-web-jia-release.sh](../../../../deployment/update-web-jia-release.sh), y comparar SHA-256 local/remoto. Comprobar de nuevo `readlink /srv/web-jia/current` antes de activar. Los parámetros del actualizador son:

```text
sudo bash update-web-jia-release.sh ARCHIVE SHA256 RELEASE EXPECTED_CURRENT
```

El actualizador exige root y valida los argumentos; toma un bloqueo exclusivo de web-jia, comprueba el destino anterior, conserva una copia root del upload y valida su hash. Rechaza enlaces, archivos especiales y rutas que salgan del paquete. Crea una release nueva y conserva los recursos con hash anteriores para pestañas que aún tengan el HTML antiguo.

La activación sustituye atómicamente `current` mediante un enlace temporal y `mv -T`. No cambia configuración, DNS, TLS ni proceso de Caddy. A continuación descarga el HTML desde el origen con TLS verificado, compara su hash y confirma que configuración y PID de Caddy siguen iguales. Si falla una comprobación posterior al cambio, restaura el enlace anterior, siempre que ningún otro operador lo haya cambiado. Releases y evidencia quedan conservadas; un fallo requiere revisar el estado antes de reintentar.

### Comando ejecutado en esta ocasión

El propietario ejecutó el siguiente launcher desde su terminal y autenticó sudo allí. El launcher verificó el script y usó el hash/release/destino anterior exactos. Se conserva el comando como registro, no como instrucción para volver a ejecutarlo:

```sh
ssh -t -o StrictHostKeyChecking=yes sds-prod-01 'bash /home/sdsadmin/web-jia-release-review-Xstzs4/activate-once.sh'
```

Ejecutado correctamente: `ACTIVATED 20260925-b410b77`. No volver a ejecutar ese launcher. Para otra release, preparar nuevos identificadores y comprobar el destino activo. El aviso de GNU cp sobre la portabilidad de `-n` fue no fatal; se verificó el resultado. En una futura revisión del actualizador, usar `--update=none` cuando la versión de GNU coreutils del servidor lo admita.

## Comprobar después de activar

- Origen y dominio público por separado: edición 200, canonical correcta, raíz y variantes redirigen sin perder parámetros, URL inexistente da 404.
- HTML publicado corresponde al nuevo commit; CSS, JS, imágenes y fuentes cargan sin errores. Si Cloudflare transforma HTML, comprobar el hash exacto en origen y el contenido/recursos en el dominio público.
- Vídeo responde a Range con 206; verificar MIME y reproducción.
- En móvil: cabecera visible, baraja inicial, primer tap despliega, ficha completa y Cerrar fijo, retorno de baraja. Escritorio conserva el diseño aprobado.
- Confirmar que no cambió Caddy ni los servicios de otros proyectos. Subir un archivo a staging no equivale a desplegarlo.

## Volver a la versión anterior

La release anterior se conserva íntegra. Si el problema se detecta después de que termine el actualizador, adquirir el mismo bloqueo, comprobar que `current` sigue apuntando a la release fallida y sustituirlo atómicamente por el destino anterior registrado. Verificar después HTTPS y hash antiguo. No sobrescribir una actualización concurrente ni borrar releases para hacer rollback. No hace falta recargar Caddy cuando solo cambia el enlace del document root.

## Cómo hacerlo mejor en las siguientes entregas

Estas son mejoras recomendadas, no cambios realizados en este despliegue:

1. Mantener ruta, configuración de build y esta guía en main para evitar que producción dependa de una rama olvidada.
2. Fijar el runtime en `.nvmrc` y crear un comando único de empaquetado que compruebe rutas, archivo canonical, inventario y hashes. Conservar un manifiesto por release y preparar el artefacto una sola vez.
3. Usar una identidad dedicada y un publicador limitado a web-jia, con permisos sobre su directorio, bloqueo, hash y verificación. Evitar depender de una contraseña sudo personal; no conceder sudo genérico ni compartir permisos de Fields. Revisar por separado cualquier delegación permanente.
4. Cuando ese acceso esté preparado, automatizar build, staging, activación y smoke con el mismo flujo, un único despliegue simultáneo y registro de commit/rollback. Un push a GitHub por sí solo no implica despliegue hoy.
5. Conservar varias releases y sus recursos con hash durante el periodo de caché. Definir una retención antes de borrar nada; el actualizador no hace limpieza destructiva.

## Fuentes técnicas

- [Next.js: export estático](https://nextjs.org/docs/app/guides/static-exports): out/ es el artefacto servido por un servidor estático.
- [Caddy root](https://caddyserver.com/docs/caddyfile/directives/root) y [file_server](https://caddyserver.com/docs/caddyfile/directives/file_server): relación entre document root, archivos, rewrites y códigos de respuesta.
- [Caddy CLI](https://caddyserver.com/docs/command-line): validar/reload solo si se cambia configuración; no se requiere para este cambio de archivos.
- [OpenSSH StrictHostKeyChecking](https://man.openbsd.org/ssh_config#StrictHostKeyChecking): conservar la verificación de identidad del servidor.

## Estado de esta ocasión

Build, TypeScript, contenido, siete comprobaciones del navegador para la ruta de producción y cinco simulaciones aisladas Linux del actualizador: PASS. Las simulaciones cubren éxito, checksum inválido, destino concurrente, enlace inseguro en archivo y rollback por fallo de salud; no equivalen a ejecutar sudo en producción. Activación realizada por el propietario y verificación productiva: PASS. Origen y HTML público coinciden con SHA `369b27981351628cb0d3fab53d3008dace40c622b3db777b2e8016d9a1f08169`. Diez comprobaciones HTTP (incluidos 42 recursos y vídeo Range 206) y siete comprobaciones Chrome móvil/escritorio: PASS. Configuración y proceso Caddy conservados; release anterior disponible. Se actualizó el mismo sitio sin duplicarlo. La autorización SSH excepcional queda consumida al cerrar este despliegue; futuros accesos requieren su propia autorización o admisión vigente. Evidencia y límites: [cierre del despliegue](../../../../docs/prompts-output/[53-1]/deployment-closure.md).
