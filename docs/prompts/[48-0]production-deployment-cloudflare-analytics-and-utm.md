# [48-0] Production deployment, Cloudflare Web Analytics and UTM

## PREFACE — NON-EXECUTABLE

Este documento reúne las instrucciones del propietario del 20 de septiembre de 2026. Su creación no autoriza su ejecución: se ha solicitado preparar el prompt y guardarlo, sin implementar, desplegar, activar servicios ni hacer commits ahora.

Cuando el propietario solicite ejecutarlo, leer el documento completo y ejecutar desde `## Status` en adelante, respetando primero las decisiones pendientes.

- **Qué cambia:** preparación y despliegue de producción, dominio y rutas, empaquetado de recursos, analítica mínima, enlaces de difusión y documentación de cookies.
- **Por qué:** publicar las jornadas con mantenimiento mínimo, sin trackers publicitarios ni infraestructura adicional innecesaria.
- **Cómo:** descubrir el estado real, aprovechar alojamiento y funciones nativas, conservar el diseño, validar cada fase y cerrar con commits trazables.
- **Consecuencias:** pueden cambiar URLs, metadata, rutas de recursos y configuración de alojamiento. No se autoriza rediseñar, reescribir contenido editorial ni alterar animaciones.
- **Severidad prevista:** moderada por referencias rotas y medición incompleta; severa por redirects/canonical incorrectos, pérdida de assets o interrupción de producción; crítica si se expusieran secretos o afectaran servicios ajenos. La evaluación definitiva corresponde a cada fase conforme a Practice 14.
- **Estado de evidencia:** el stack figura en el adaptador del proyecto, pero no se ha ejecutado aquí una inspección técnica, build, test ni acceso a proveedores. No interpretar este prompt como evidencia de producción.

## Status

`PREPARED — NOT EXECUTED`.

Actualización autorizada del propietario (25-09-2026, alcance de entrega actual): el destino es el VPS Hostinger existente y se debe actualizar el mismo sitio sin duplicarlo. SSH verificó Caddy y la entrada /almeria-2026 con redirección de raíz existente; se conserva ese comportamiento. Esto resuelve alojamiento/ruta para la actualización actual y sustituye las alternativas de la tabla siguiente en ese alcance. No activa las fases adicionales de analítica/UTM de este prompt. Procedimiento y autorización SSH excepcional de una sola ocasión: `sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md`.

Objetivo: ejecutar por fases una publicación sencilla y reversible de `web-jia`, con Cloudflare Web Analytics y convención UTM, preservando el aspecto y comportamiento actuales.

**Dos decisiones contractuales pendientes impiden ejecutar sus cambios dependientes:**

| Decisión | Instrucciones recibidas | Resolución requerida |
| --- | --- | --- |
| Alojamiento | El propietario menciona «Cloudflare Pages (gratuita)» y termina con «Irá al hosting de nuestro servidor vps»; el bloque previo también exige Hostinger y prohíbe Pages. | Confirmar VPS de Hostinger con Cloudflare delante, o Pages gratuito. No desplegar en ambos ni decidir por silencio. |
| Entrada del dominio | Se indica `https://jornadasdeinnovacion.com`, aparece la expresión «no llevará» a `/almeria-2026` y se explica la nomenclatura de futuras ediciones. | Confirmar redirección de `/` a `/almeria-2026`, o portada en `/` sin redirección. |

Si estas decisiones ya están resueltas explícitamente en una instrucción posterior del propietario, registrarla aquí con fecha, fuente, alcance y sustitución de las cláusulas anteriores; no volver a preguntar. Si no lo están, solicitar únicamente esas decisiones y continuar solo tareas independientes. No materializar una de las alternativas en código o configuración antes de la resolución.

El dominio de producción **sí está expresamente indicado por el propietario**: `https://jornadasdeinnovacion.com`. Contrastar la configuración actual y corregirla durante la ejecución autorizada; no inventar otro dominio ni considerar la configuración antigua una sustitución del objetivo. `/granada-2027` es solo un ejemplo futuro: no crear esa edición ni una plataforma multievento.

## Governance and scope

- Ejecución futura: **LEVEL 3**. Áreas: `frontend`, `deployment`, `security`. Backend/API/BBDD: N/A salvo descubrimiento justificado; no introducirlos.
- Aplicar el orden de lectura de `AGENTS.md`, el router SDS y las prácticas seleccionadas. Practice 15 gobierna decisiones normativas; Practice 14, los cierres de cambios ejecutables. No precargar especialistas que no apliquen.
- Leer las memorias afectadas; descubrir el mapa de constantes. Textos en `lib/content/copy/`, datos y referencias públicas de medios en su capa propietaria, con una entrada de información de negocio. No dispersar dominio, campaña ni rutas por componentes.
- Aplicar las guías SDS de Impeccable para los cambios frontend y las equivalentes de gstack para QA, seguridad y release. Verificar admisión antes de invocar capacidades; no asumir que estar instalado equivale a estar autorizado.
- Trabajar desde la raíz del proyecto. Antes de cada comando `node`, `npm` o `npx`, si existe `.nvmrc`, usar en esa misma shell `source "$HOME/.nvm/nvm.sh" && nvm use` antes del comando.
- Leer todo el prompt antes de implementar. Preservar cambios del usuario; no incluirlos accidentalmente en commits. No ejecutar operaciones destructivas ni actualizar dependencias arbitrariamente.
- Todos los archivos nuevos tendrán nombres en inglés; la documentación y política pública pueden estar en español.
- Continuidad durante ejecución: `docs/prompts-output/[48-0]/tmp/`; evidencia sin secretos: `docs/prompts-output/[48-0]/evidence/`; resultado: `docs/prompts-output/[48-0]prompt-output.md`, conforme a la plantilla del proyecto. Actualizar checkpoint al cerrar cada fase o encontrar un bloqueo.
- La redacción de este prompt no inicia esos outputs de ejecución. Tmp/scratch de su redacción: N/A.

## Phase 0 — Decisions, admission and read-only inventory

1. Resolver los dos gates de `Status` y registrar la decisión autorizada. La documentación factual no decide por sí sola el destino deseado.
2. Inspeccionar arquitectura, `package.json`, lockfile, `.nvmrc`, configuración Next, rutas, metadata, canonical, sitemap/robots, variables requeridas sin revelar valores, fuentes, imágenes, modelos, vídeo y scripts de terceros.
3. Confirmar lo indicado por el adaptador: Next.js App Router con export estático a `out/`, React, TypeScript, Three.js y GSAP. Verificar versiones y comandos reales; no asumir que `npm start` sea necesario.
4. Identificar configuración de despliegue existente, DNS/Cloudflare documentados, dominios actuales, trackers, cookies, almacenamiento e integraciones embebidas. No eliminar sistemas existentes automáticamente.
5. Inspeccionar referencias directas, indirectas, dinámicas y generadas a la carpeta raíz `assets/`; distinguirla de `public/assets/` u otras carpetas homónimas necesarias en producción. Revisar build scripts, CSS, constantes, imports, loaders 3D, documentos descargables, metadata y enlaces.
6. Establecer baseline con los checks realmente existentes, sin instalar nuevas herramientas para llenar casillas. Registrar errores previos por separado. Obtener evidencia visual local comparable si hay herramientas admitidas.
7. Consultar documentación oficial vigente de Cloudflare durante la ejecución para el alojamiento elegido, integración Web Analytics, métricas, privacidad y soporte real de UTM/query strings. Registrar enlaces y fecha. No inventar rutas de dashboard, gratuidad de funciones o métricas disponibles.

**Solo si se elige VPS:** antes de toda llamada MCP, comprobar identidad efectiva y admisión exacta en `docs/governance/capability-registry.md` y ejecutar el control gestionado:

```sh
sds-dev-governance/scripts/sds-mcp check --server <verified-server-id> --client codex --project /Users/hrms/MAC-DEV-PROJECTS/web-jia
```

El marcador exige identificar el servidor real; no ejecutar literalmente. Hostinger permanece `BLOCKED_SECRET_ISOLATION` hasta verificar custodia independiente y admisión exacta del proyecto. Una denegación no autoriza acceso alternativo por SSH, shell, otro MCP o API. No asumir acceso porque el texto original lo afirma.

Una vez admitido, usar primero MCP Hostinger y su ruta controlada para identificar el VPS correcto. Inventariar solo lo necesario: distribución, CPU/RAM/disco, usuarios pertinentes, puertos, firewall, servicios, proxy de entrada, virtual hosts, certificados, directorios, procesos Node, Docker y systemd. No leer secretos ajenos. Si el MCP no permite una comprobación, marcarla pendiente y usar comandos de lectura solo por una ruta ya autorizada, nunca como bypass. No modificar producción en esta fase.

**Si se elige Pages:** omitir Hostinger y su inventario. Verificar acceso admitido a la cuenta/proyecto Cloudflare y compatibilidad con export estático y límites actuales del plan gratuito, especialmente tamaño de archivos y artefacto.

**Salida:** inventario compacto, decisiones registradas, baseline, dependencias y bloqueos reales. Cierre documental de fase; sin commit vacío de implementación.

## Phase 1 — Production routes and self-contained assets

### Domain and routing

- Aplicar el contrato de entrada confirmado. No usar `basePath` como atajo para una sola edición ni migrar a SSR para resolver un redirect.
- Si se confirma redirección: servir la edición en `/almeria-2026` con la convención de slash compatible con el export; `/` debe redirigir en el hosting/proxy o capa nativa apropiada, conservando los UTM. Elegir un redirect temporal mientras `/` represente la edición vigente, para permitir futuras ediciones sin fijar una redirección permanente cacheada. Mantener una canonical limpia para la página de destino.
- Si se confirma portada en `/`: servir allí sin redirección a la edición. Mantener canonical `https://jornadasdeinnovacion.com/`; no publicar además una copia indexable en `/almeria-2026` sin una decisión explícita sobre la URL principal.
- Revisar anchors, enlaces internos, rutas directas, recargas, 404, Open Graph, sitemap y robots cuando existan. No generar páginas por combinación UTM ni bloquear el rastreo de parámetros de forma que impida ver la canonical.
- Los query parameters no deben alterar SSR/SSG, hidratación, animaciones, contenido ni layout. No persistirlos ni propagarlos a toda la navegación.

### Assets excluded from upload

- La carpeta **raíz `assets/` no se sube al repositorio remoto ni al hosting en esta entrega**. No borrar los originales locales. No confundir esta exclusión con eliminar las carpetas públicas que el sitio sí necesita.
- Copiar únicamente los recursos necesarios a la ubicación pública o importable que corresponda al proyecto; actualizar referencias en su capa propietaria. Conservar formato, calidad y comportamiento visual. Usar nombres ingleses para copias nuevas y actualizar todas sus referencias.
- Para GLTF, CSS y otros contenedores, incluir las dependencias transitivas: texturas, `.bin`, fuentes y referencias relativas. Revisar también carga dinámica y rutas de descarga, no solo imports estáticos.
- Detectar symlinks y rutas absolutas locales; el artefacto no puede depender de la carpeta excluida ni de archivos fuera del proyecto.
- Revisar `.gitignore` y el empaquetado. Ignorar una carpeta no elimina archivos ya versionados. Si hay archivos rastreados, informar del alcance y preparar la exclusión preservando los originales; respetar la regla SDS de retirada de archivos remotos por el propietario, sin reescribir historial ni realizar borrados remotos prohibidos.
- Probar build desde una copia temporal aislada que omita `assets/` y reutilice el lockfile/runtime adecuados. No renombrar ni retirar la carpeta original para simular la prueba. Confirmar que el artefacto contiene todas las dependencias usadas y ninguna carpeta fuente excluida.
- En export estático desplegar solo `out/` validado. No transferir raíz del repo, `.git`, `.env`, caches, tests, `node_modules`, documentación interna ni temporales. No crear otra pipeline si el mecanismo existente basta.

**Aceptación:** build sin la carpeta fuente excluida, rutas correctas con UTM y sin ellos, canonical limpia, recursos cargados sin 404 y apariencia preservada. Commit de implementación verificada si hay cambios; después informe y commit separado.

## Phase 2 — Cloudflare Web Analytics, UTM and cookies documentation

### Analytics

Prioridad: integración nativa del alojamiento/dominio → configuración mínima → beacon oficial únicamente si la integración nativa no sirve. Cero sistemas propios.

- Pages, si fue elegido: comprobar la integración nativa y documentar su activación exacta, así como si requiere un nuevo despliegue.
- VPS, si fue elegido: comprobar si Cloudflare puede inyectar el beacon automáticamente para este dominio proxied, teniendo en cuenta configuración y restricciones reales; no concluir que alojar en VPS exige modificar Next.
- Si ya está activo, comprobarlo antes de añadir nada. Evitar duplicación entre inyección en edge y código. Si hace falta snippet, usar el mecanismo oficial vigente, una sola vez en el punto global correcto y con carga no bloqueante.
- No afirmar impacto cero sobre rendimiento: comparar con baseline, comprobar carga y ausencia de regresiones evidentes. No introducir listeners propios, cookies, fingerprinting, identificadores persistentes ni localStorage para analítica.
- Documentar las métricas que realmente exponga el producto/plan: visitas según su definición, page views, páginas, referrer, país, dispositivo, navegador, sistema operativo y rendimiento/Core Web Vitals disponibles. No confundir métricas de tráfico del proxy con Web Analytics ni prometer usuarios únicos si no lo son.
- **UTM no equivale a atribución disponible:** verificar expresamente si Web Analytics conserva/explota query strings y ofrece filtros o informes por `utm_source`, `utm_medium`, `utm_campaign` y `utm_content`. Si no los ofrece, declarar que la convención queda preparada para difusión pero no permite obtener esa atribución en ese dashboard. No deducir WhatsApp/QR/email de un referrer ausente ni construir una solución alternativa.
- Si falta acceso/token/activación, no introducir placeholders en un script productivo: dejar `PENDING — acción manual en Cloudflare`, con pasos exactos y comprobación posterior. No afirmar que llegan datos hasta observarlos.

### UTM convention

Usar valores en minúsculas, sin espacios ni tildes, legibles y estables; separar palabras con guion. No incluir correos, nombres de destinatarios ni otros datos personales. `utm_content` distingue piezas/ubicaciones/newsletters; `utm_term` queda omitido salvo necesidad real futura. No cambiar los valores de la siguiente matriz:

| Canal | utm_source | utm_medium | utm_campaign | utm_content |
| --- | --- | --- | --- | --- |
| Instagram | instagram | social | jia2026 | opcional |
| LinkedIn | linkedin | social | jia2026 | opcional |
| WhatsApp | whatsapp | messaging | jia2026 | opcional |
| Email | email | email | jia2026 | opcional, newsletter/pieza |
| Web CEP | cep | referral | jia2026 | opcional |
| QR físico | qr | offline | jia2026 | cartel / programa / entrada |

Enlaces al dominio indicado por el propietario, válidos tanto si `/` sirve contenido como si redirige preservando la query:

```text
https://jornadasdeinnovacion.com/?utm_source=instagram&utm_medium=social&utm_campaign=jia2026
https://jornadasdeinnovacion.com/?utm_source=linkedin&utm_medium=social&utm_campaign=jia2026
https://jornadasdeinnovacion.com/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=jia2026
https://jornadasdeinnovacion.com/?utm_source=email&utm_medium=email&utm_campaign=jia2026
https://jornadasdeinnovacion.com/?utm_source=cep&utm_medium=referral&utm_campaign=jia2026
https://jornadasdeinnovacion.com/?utm_source=qr&utm_medium=offline&utm_campaign=jia2026&utm_content=cartel
https://jornadasdeinnovacion.com/?utm_source=qr&utm_medium=offline&utm_campaign=jia2026&utm_content=programa
https://jornadasdeinnovacion.com/?utm_source=qr&utm_medium=offline&utm_campaign=jia2026&utm_content=entrada
```

Si se confirma una ruta estable para Almería 2026, generar también en la documentación las ocho URLs completas apuntando directamente a esa ruta, siguiendo su slash real. Recomendar esas URLs para material impreso duradero: un QR de 2026 no debería terminar en una edición futura cuando cambie `/`.

No añadir estos enlaces a la navegación interna. No crear generador UTM, almacenamiento, middleware de captura ni dashboard propio.

### Documentation and cookies policy

Crear o actualizar `docs/analytics.md` con tecnología, métricas disponibles y límites, qué no se mide, matriz, URLs completas, ruta verificada del dashboard y únicas operaciones manuales pendientes.

Completar el documento existente `docs/web-jia-policies/web-jia-cookies-policy.md`, sin crear una segunda política paralela. Debe ser breve, elegante, comprensible y en español. Por ahora es un documento del proyecto: no añadir página, botón, banner ni cambios de UI.

- Comprobar antes cookies, storage, respuestas `Set-Cookie`, embeds y scripts, tanto de la aplicación como de las capas de hosting/seguridad que puedan intervenir. Distinguir ausencia de cookies analíticas de ausencia absoluta de cookies.
- Explicar finalidad estadística, datos agregados y ausencia de perfiles, publicidad e identificación persistente solo en los términos realmente verificables.
- No convertir «uso legítimo» en una afirmación automática de interés legítimo, exención de consentimiento o cumplimiento legal. Contrastar documentación oficial vigente de Cloudflare y orientación aplicable de AEPD/autoridad competente sobre RGPD y ePrivacy; evaluación breve, no auditoría legal completa.
- Si no se necesita consentimiento para la configuración verificada, explicarlo con precisión. Si se detecta una función que sí lo exige, reportarla antes de eliminarla o añadir un CMP. No declarar la política definitiva mientras falte esa comprobación.
- No afirmar «no tratamos datos personales» solo porque no se usan cookies. Distinguir estadísticas del tratamiento técnico de solicitudes y de proveedores.
- Usar únicamente identidad/contacto del responsable ya confirmados en el proyecto; si faltan, marcar el documento como borrador pendiente, sin inventarlos.
- Como orientación editorial condicionada a verificación: «Utilizamos estadísticas de navegación para conocer qué páginas se consultan y mejorar su funcionamiento. La configuración de analítica empleada no utiliza cookies analíticas ni crea perfiles publicitarios». Ajustar el texto a lo comprobado, no copiarlo como hecho anticipado.

**Aceptación:** una sola vía de integración, límites de UTM claros, URLs correctas y política sin afirmaciones no verificadas. Cierre con commits según el tipo de cambios.

## Phase 3 — Reproducible deployment preparation

Ejecutar únicamente la rama de alojamiento confirmada. No crear una arquitectura híbrida de hosting ni migrar de destino por conveniencia técnica.

### VPS branch

- Preferir export estático servido por el proxy existente. No instalar Node en producción ni crear `web-jia.service` si basta servir archivos.
- Adaptar directorio, usuario y permisos al inventario; mantener aislamiento de aplicaciones existentes. No inventar IP, hostname, ruta, puertos o usuario.
- Preparar release independiente y reversible: artefacto validado, manifiesto/hash de procedencia, release anterior conservada y activación atómica si el entorno lo permite. No usar `rsync --delete` contra carpetas compartidas.
- Preparar únicamente el virtual host/site block necesario. No sustituir configuración global, instalar otro proxy ni alterar otros dominios.
- Solo si hay evidencia de SSR imprescindible: runtime compatible, instalación reproducible, servicio independiente siguiendo la convención existente y puerto libre ligado exclusivamente a `127.0.0.1`. No introducir Docker/PM2 por defecto.
- Antes de mutaciones, tener backup y procedimiento exacto de restauración para cada archivo afectado. Validar sintaxis antes de reload; preferir reload frente a restart. Ante fallo, restaurar configuración/release previa y comprobar recuperación. No dejar un archivo inválido activo.
- No abrir puertos públicos adicionales ni tocar administración/firewall ajenos. Evaluar HSTS, `X-Content-Type-Options`, `Referrer-Policy` y CSP existentes; no duplicar políticas ni implantar CSP agresiva.
- HTTPS hasta origen y Cloudflare Full (strict) cuando se verifique certificado compatible. Nunca resolver problemas degradando a Flexible o desactivando validación.
- Cache largo solo para assets con hash; HTML revalidable. No cachear indiscriminadamente HTML o query strings mediante reglas globales.

### Pages branch

- Publicar el export estático validado mediante el mecanismo más sencillo existente y admitido. No desplegar como Worker SSR si el export basta; no introducir CI/CD ni nuevas dependencias si no son necesarias.
- Verificar exclusiones, límite de tamaño de archivos, redirect de entrada si fue autorizado, rutas estáticas, 404, headers y cache compatibles con Pages.
- Preparar rollback a la versión anterior usando las capacidades nativas verificadas. No asumir que cambios DNS se revierten instantáneamente.
- No tocar el VPS ni presentar Pages como servicio alojado en el VPS.

Crear/actualizar `docs/deployment.md` o el runbook equivalente ya existente, sin duplicarlo: alojamiento realmente elegido, arquitectura, artefacto, comandos exactos de build/deploy/validación/rollback y requisitos. Añadir comandos reales `status`, logs y reload/restart solo si existe servicio; para estático, indicar que no hay runtime Node.

**Aceptación:** artefacto independiente, configuración revisable, rollback preparado y destino exacto. Registrar pendientes de acceso sin simular comandos exitosos. Commit de preparación verificada y commit separado de informe.

## Phase 4 — Publish, DNS, TLS and native analytics

Solo durante una ejecución expresamente solicitada, y con gates/admisiones satisfechos, realizar la publicación preparada. No pedir otra autorización para acciones ya autorizadas, pero respetar bloqueos reales de plataforma, contrato y alcance.

- VPS: subir únicamente el artefacto, validar permisos/configuración, activar la release y recargar el proxy tras validar su sintaxis. Comprobar que servicios ajenos conservan su estado; evitar reinicios globales.
- Pages: publicar en el proyecto/cuenta verificados y asociar el dominio siguiendo la ruta nativa actual.
- Consultar DNS existente antes de escribir: conservar MX/TXT y otros servicios. No asumir que un AAAA antiguo puede mantenerse si apunta a otro origen.
- Si falta acceso DNS, dejar aplicación preparada y documentar exactamente `Type`, `Name`, `Target`, `Proxy`, usando IP o destino efectivamente verificado. Si se desconoce `Target`, marcarlo pendiente: no inventarlo.
- Para VPS, configurar el proxy Cloudflare según la arquitectura confirmada. Para Pages, seguir la asociación de dominio del producto, sin inventar un A a una IP de Pages.
- Activar Web Analytics por la vía seleccionada o registrar `PENDING — acción manual en Cloudflare`. Guardar ruta exacta del dashboard y pasos verificados, sin tokens administrativos en documentación.
- Verificar salud antes de dar por activo el cambio. Si falla la publicación o afecta otro servicio, aplicar rollback preparado y reportar la causa.

**Aceptación:** producción accesible, TLS válido y estado real de analytics declarado. Una operación remota no crea un commit de código ficticio: registrar release/artefacto, cambios de configuración versionables y evidencia saneada en el informe de fase.

## Phase 5 — End-to-end verification and adversarial review

Ejecutar checks proporcionales del proyecto con el runtime fijado. Según el adaptador, verificar `npx tsc --noEmit`, `npm run check:content` y `npx next build`; confirmar antes los comandos vigentes. Ejecutar lint/tests si existen, sin inventar scripts o añadir dependencias para ello.

Validar localmente y en producción, distinguiendo evidencias:

- HTTP puede redirigir a HTTPS: aceptar redirect esperado y HTTPS final 200; no exigir HTTP 200 inseguro. Verificar cadena finita, host, destino y conservación de UTM.
- Probar `/`, la ruta de edición si fue elegida, recarga directa, anchors y una ruta inexistente con 404 real.
- URL limpia y URL con `?utm_source=instagram&utm_medium=social&utm_campaign=jia2026`: mismo contenido, canonical limpia correspondiente, sin hidratación errónea, redirects adicionales ni pérdida de query durante el redirect de entrada.
- Inspeccionar canonical en HTML servido y navegador. Revisar sitemap/robots/metadata modificados y ausencia de duplicados indexables creados por la implementación.
- HTML, CSS, JS, fuentes, imágenes, favicon, documentos, vídeo y modelos/texturas 3D: status y MIME correctos, sin 404 ni mixed content. Probar específicamente los recursos copiados desde `assets/`.
- Consola y red del navegador, desktop/móvil representativos, animaciones/Three.js/GSAP y comparación visual equivalente con baseline. Separar errores propios de bloqueos externos o extensiones.
- Una sola inclusión/inyección del beacon, aunque pueda enviar más de una petición legítima. Comprobar el HTML final atravesando Cloudflare, no solo `out/`. Revisar navegación cliente y medición nativa sin añadir tracking personalizado.
- Cookies y almacenamiento antes/después de navegar; no identificadores propios ni persistencia UTM introducidos. Registrar sistemas previos sin eliminarlos.
- Comparar señales de rendimiento disponibles con baseline; no prometer CWV de campo hasta disponer de datos. Reportar problemas graves de assets sin optimizaciones fuera de alcance.
- Si no se puede observar el dashboard o faltan datos por demora, registrar `NOT VERIFIED`/`PENDING`. No convertir configuración presente o una petición del beacon en prueba de informes recibidos.
- Verificar que rollback es viable con la release/configuración anterior y comandos documentados, sin provocar una interrupción innecesaria para demostrarlo.

Revisar la solución desde tres perspectivas, sin requerir agentes adicionales:

1. **Frontend/performance:** retirar código y runtime innecesarios; preferir funciones nativas; comprobar alcance de JS añadido y conservación visual.
2. **Privacidad:** minimización, ausencia de identificadores propios, precisión de la política y límites reales de medición.
3. **SEO:** rutas estables, redirects, canonical sin query, indexación y continuidad de enlaces de campañas.

Corregir hallazgos dentro del alcance y repetir solo las verificaciones afectadas. No cerrar verde con riesgos severos o críticos sin resolver. Actualizar documentación y memorias solo con hechos verificados.

## Phase commits and reports

Durante la ejecución, cada fase cierra antes de la siguiente conforme a Practice 14:

1. Revisar diff y validar los cambios de esa fase; preparar únicamente archivos propios.
2. Crear uno o más commits de implementación verificada cuando haya cambios ejecutables. Ejemplo de asunto: `feat(deployment): prepare static production release [48-0 phase-3]`.
3. Después generar el informe terminal `docs/prompts-output/[48-0]/phase-N-report.md`: resumen, evidencia, pendientes, riesgos moderados/severos/críticos y correcciones propuestas.
4. Commit separado del informe, con resumen y análisis de riesgos en el cuerpo. No modificar implementación dentro de ese commit documental.

Fases puramente documentales o de inspección: commit de su resultado, sin commits de implementación vacíos. Si hay bloqueo, registrar estado parcial/bloqueado, no fingir cierre verde. Git no versiona por sí solo el estado remoto: correlacionar commit de artefacto/configuración y release desplegada.

No hacer commits ahora, al redactar este prompt. En su ejecución no usar force-push, reset destructivo, clean, borrados globales, prune ni upgrades del sistema. Push, si hace falta y está autorizado, únicamente mediante el wrapper SDS a `origin main`; cumplir el guardrail de acciones remotas reservadas al propietario.

Al cierre de cambios ejecutables, aplicar la garantía AI-code assurance y la plantilla/validador de entrega solo en el momento que indica `AGENTS.md`, sin inventar identidad del responsable ni crear/publicar una PR si no procede.

## Final delivery

Responder con un resultado autocontenido y enlazar los documentos:

1. **Estado:** `IMPLEMENTADO`, `IMPLEMENTACIÓN PARCIAL — requiere acción manual` o `BLOQUEADO`, con causa real. No marcar implementado si no se publicó o no se verificó lo requerido.
2. **Qué se encontró:** stack, arquitectura previa, destino confirmado, servicios pertinentes y tracking existente.
3. **Qué se cambió:** lista exacta de archivos, recursos copiados y exclusiones; commits por fase y release desplegada.
4. **Alojamiento y Cloudflare:** URL final, comportamiento de `/`, canonical, DNS/TLS, vía de Web Analytics y estado observado.
5. **UTM:** matriz definitiva y URLs completas listas para difusión; limitaciones de atribución verificadas.
6. **Validación:** `Build`, `TypeScript`, `Content`, `Lint`, `Tests`, `Routing UTM`, `Canonical`, `Assets without source folder`, `HTTPS`, `Visual`, `Analytics` y `Rollback`, usando `PASS / FAIL / N/A / NOT RUN / NOT VERIFIED` según evidencia. Explicar brevemente cada pendiente; no usar PASS para checks no ejecutados.
7. **Acciones manuales:** únicamente las estrictamente necesarias, con valores comprobados y pasos concretos.
8. **Riesgos/observaciones:** problemas reales, estado de la política de cookies, limitaciones del proveedor y rollback.

La calidad se mide también por lo poco que cambia el proyecto: sin GA4, GTM, Meta Pixel, Hotjar, Plausible, PostHog, base de datos, backend de analítica, dashboards propios, cookies nuevas para tracking, persistencia UTM, banners innecesarios, rediseños ni refactors ajenos.
