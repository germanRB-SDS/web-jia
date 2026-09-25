# [54-0] Animaciones por elección del visitante y ajustes de Talleres en el Saloon

## PREFACE — NON-EXECUTABLE

Documento preparado por petición del propietario el 25-09-2026. Esta sección es memoria, no instrucciones: **execute from `## Status` onward**, únicamente cuando el propietario ordene ejecutar este prompt después de limpiar contexto.

- **Qué cambia:** popup para activar animaciones solo en JIA, cookie únicamente de aceptación, carteles móviles algo menores dentro del mismo espacio y retorno del carrusel inactivo a baraja a los 5 segundos.
- **Por qué:** el propietario confirmó que Windows tenía desactivados los efectos de animación. No faltaban librerías. Quiere que el visitante pueda elegir sin salir de la web. Además, el tilt amplía los carteles dentro de un scroller que recorta sus bordes.
- **Cómo:** política de movimiento compartida entre CSS y JS, persistencia mínima de aceptación, popup accesible; reserva geométrica para tilt y máquina de estados del carrusel que distingue expansión de interacción real.
- **Implicaciones:** afecta consumidores de movimiento ya existentes; no cambiar diseños de escritorio, audio, reproducción ni contenido. Sitio estático Next export + Caddy: no introducir backend para esta preferencia.
- **Severidad prevista:** moderada por destellos de hidratación, fugas de listeners/RAF, clipping o temporizadores prematuros; severa si se fuerza movimiento antes de consentimiento, se oculta foco/contenido o el popup bloquea navegación. No se prevé riesgo crítico; confirmar en informe posterior, no darlo por descartado sin revisión.

## Status

**PREPARED — NOT EXECUTED.** La orden de esta sesión es comprobar, redactar, guardar y hacer commit LOCAL del prompt, y parar. No implementar, no ejecutar pruebas de una implementación inexistente, no push ni despliegue durante la preparación.

La ejecución futura empieza solo con una instrucción explícita del propietario para ejecutar este archivo. Su alcance por defecto será implementar, probar y guardar commits locales, dejando preview revisable. El push/despliegue solo se hará si la orden de continuación lo pide expresamente; consultar la guía vigente entonces. Este prompt no reactiva la autorización SSH excepcional del despliegue anterior.

## Alcance y autoridad

- Change ID: `REL-2026-09-25-03`. Áreas: frontend y security (preferencia no sensible/cookie). Deployment solo si se autoriza en la continuación. LEVEL 3 por política transversal de movimiento, varios motores y continuidad. No BBDD ni API.
- Leer `AGENTS.md` y el router SDS vigente. Aplicar Impeccable para interacción/accesibilidad y equivalente SDS de QA/ship. Cargar memorias solo de áreas afectadas.
- Instrucción nueva del propietario: conserva el movimiento reducido por defecto y permite sustituirlo **solo tras Activar**. Es MODIFICATION acotada de la prohibición absoluta de animar bajo `reduce` de [50-0], [51-0] y consumidores equivalentes. Fuera de esa elección se conserva el contrato anterior.
- El propietario corrige la propuesta previa de recordar también el rechazo: **no persistir rechazo**, ni en cookies ni localStorage/sessionStorage ni otros medios. Recordarlo solo en memoria de la visita actual.
- Cambios de geometría y autocierre: exclusivamente Talleres móvil (`max-width: 759.98px`, redescubrir si cambió). Popup/política de movimiento: todos los tamaños y sistemas compatibles.
- Preservar el trabajo concurrente, especialmente maestra/aula y otros cambios ajenos. La integración de su motor con la política de movimiento no autoriza rediseñar esa sección ni alterar sus efectos.

## Contexto comprobado y referencias

Base inspeccionada: main `e2d34ef`. Código servido por producción: `b410b77`, release `20260925-b410b77`. Revalidar estado al ejecutar; estos hashes no autorizan resetear ni sobrescribir trabajo posterior. El root tenía `next-env.d.ts` generado por next dev: conservarlo fuera del commit.

- [Diagnóstico público](../prompts-output/[53-1]/production-animation-diagnosis.md): cinco efectos funcionan con movimiento normal; `reduce` reproduce la ausencia. El propietario confirmó la causa después del diagnóstico.
- [Carrusel expandido que motiva la reserva](../prompts-output/[54-0]/evidence/reference-expanded.png).
- [Baraja a la que volver](../prompts-output/[54-0]/evidence/reference-deck.png).
- [Guía de despliegue existente](../../sds-dev-governance/knowledge/web-jia/how-to-deploy/README.md).

Se inspeccionó `SheetCard` + `TiltCard`, no confundir con `PosterCard`: la tarjeta de taller pasa por `SheetCard.media > TiltCard > Surface`. `TILT.scale = 1.07`, rotación máxima 12°, perspectiva 1500 px. El scroller tiene `overflow-x:auto`, 10 px de reserva superior y ancho por carta `min(78cqw, 19rem)`. El recorte es coherente con esta geometría; reproducir y medir antes del ajuste exacto.

No se encontró una política central de movimiento ni uso de cookies en app/lib/components. Hay consultas CSS/JS distribuidas. No hay implementación nueva en el commit del prompt.

Fuentes técnicas consultadas el 25-09-2026:

1. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion): la preferencia se comunica desde Windows, GTK/GNOME, KDE y Android, entre otros.
2. [MDN: datos de compatibilidad](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/media.json), entrada `prefers-reduced-motion`: incluye Chrome/Firefox/Edge y Samsung Internet. Es compatibilidad de navegador, no certificación de cada distribución/equipo.
3. [MDN: atributos de cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie): Secure, SameSite, restricciones del prefijo __Host- y diferencia de HttpOnly.

## Fase A — Descubrimiento y diseño acotado

Crear rama/worktree aislados según SDS. Revalidar rutas y contratos; registrar checkpoint en `docs/prompts-output/[54-0]/tmp/` y evidencia en `evidence/`. Leer el prompt completo: no requiere cargador selectivo.

Mapa de constantes actual: `lib/content/index.ts` agrega negocio; `lib/content/copy/types.ts`, `copy/es/index.ts` y módulos ES son el texto; `lib/content/media.ts` los medios; `app/theme/palette.css` los colores. Todo texto nuevo sale del catálogo; tiempos, cookie y geometría en configuración con un propietario claro.

Inventariar con `rg` TODOS los consumidores de `prefers-reduced-motion`, incluidos negativos/aliases/event listeners. Superficies vistas:

- `app/layout.tsx`, `app/globals.css` y `components/primitives/Action.module.css`.
- SunRays, Horseshoe, StudioStrip/tumbleweed-field, JornadasRoute/route-scene.
- TiltCard, FlipCard, CursorMark, Hero, FooterShots, SiteFooter, IntroVideo.
- CubeCarousel, ProgramaDias, CollaboratorsCarousel/carousel-engine.
- SheetCard, SheetDialog, PosterCard, BulletHole y TalleresCarrusel, CSS y JS.

Producir una matriz consumidor → lectura actual → política nueva → actualización en vivo/cleanup → prueba. No basta cambiar solo los cinco efectos señalados. No sustituir globalmente `matchMedia`, ni usar APIs experimentales como requisito, ni convertir toda la landing de servidor en cliente o remontarla entera al pulsar Activar.

## Fase B — Política de movimiento, popup y cookie

### Comportamiento visible exacto

Mensaje: **«Estás viendo esta web sin animaciones. Actívalas (solo para esta página).»**

Botones: **«Activar»** y **«Seguir sin animaciones»**.

1. Popup dentro de la página (dialog), no ventana externa ni navegación a Configuración. Mostrar al hidratar solo si el navegador comunica `reduce`, no existe aceptación válida y no se ha descartado durante esta visita. Sin flash del popup en usuarios con animación normal o aceptación previa.
2. Respetar paleta, tipografía y estilo de JIA; responsive, legible y operable con touch y teclado. Nombre/descripción accesibles, foco visible, trap/foco de retorno y Escape. Cerrar/Escape equivale a seguir sin animaciones: no guardar elección. Si otro dialog está abierto, diferir el popup para no apilar bloqueos ni robar foco.
3. «Activar»: cerrar y poner en marcha la política animada **en vivo**, sin recargar la página ni perder scroll, ficha abierta, posición del carrusel o vídeo. Guardar solo aceptación.
4. «Seguir sin animaciones»: cerrar, conservar política del sistema y no reaparecer en esa visita. La siguiente carga completa/visita vuelve a preguntar si sigue `reduce`. Un cambio de hash no cuenta como visita nueva; un retorno de BFCache conserva el estado del mismo documento.
5. Control discreto «Animaciones» accesible desde menú o footer para revisar la elección (incluye equipos donde la detección del sistema sea incompleta). Debe permitir activar o volver a usar la preferencia del sistema. Al retirar aceptación, borrar solo su cookie, aplicar el sistema y no reabrir inmediatamente el popup. No persistir un valor de rechazo. Mantener el texto principal y los dos botones exactamente como se pidieron.

### Estado efectivo, CSS y motores

- Sin elección: seguir la preferencia del navegador. Con aceptación válida: permitir animaciones de JIA aunque el sistema comunique `reduce`. Retirar aceptación: volver al sistema. Escuchar cambios del sistema mientras no haya override.
- Una fuente compartida para CSS y JS. Si se usa atributo en html, conservar una alternativa de media query para antes de inicialización/sin JS. No permitir un primer fotograma animado bajo `reduce` antes de conocer una aceptación válida.
- Iniciar/destruir o actualizar motores individualmente; limpiar RAF, GSAP timelines, observers, media listeners y contextos WebGL. Proteger imports asíncronos ya iniciados al cambiar modo/desmontar. Evitar efectos duplicados en Strict Mode.
- Cursor, hover, touch, ancho mínimo y WebGL siguen siendo condiciones independientes. Activar animaciones no fuerza cursor de ratón en Samsung ni herradura de escritorio en móvil. Sin WebGL2 o si falla el motor/modelo, mantener el fallback sin ocultar contenido ni dejar una promesa rechazada.
- Vídeo: no activar sonido, modificar mute/volumen, saltar tiempo ni forzar reproducción contra las reglas del navegador. La aceptación de efectos visuales no es consentimiento de audio. Conservar los controles/pantalla completa actuales.

### Persistencia mínima

Nombre propuesto centralizado: `__Host-jia-motion`; único valor aceptado `on`; atributos `Secure; SameSite=Lax; Path=/`, sin Domain; duración propuesta 180 días (`Max-Age=15552000`). Solo escribir tras Activar, nunca al montar ni al detectar sistema. No renovar indefinidamente en cada carga. No identificadores, tracking ni información del sistema en la cookie. El borrado usa mismo nombre/path/seguridad.

Es una preferencia cliente no sensible: no puede ser HttpOnly porque JavaScript debe leerla/escribirla en este export estático. Documentar esa limitación, sin prometer HttpOnly ni inventar backend/cifrado. Secure protege transporte, no cifra el valor ni impide acceso de JS. No rebajar Secure en producción; verificar realmente por HTTPS. Para preview HTTP, usar HTTPS local o probar modo efímero documentado; no afirmar persistencia segura no comprobada.

Lectura defensiva por nombre/valor exactos; cookies inválidas se ignoran. Si lectura/escritura falla o está bloqueada, Activar sigue funcionando en memoria esa visita, sin crash ni bucle de popup ni falsa garantía de persistencia. No usar localStorage como almacenamiento alternativo oculto. Revisar documentación de cookies existente si la hay y describir la nueva preferencia técnicamente sin inventar textos legales.

## Fase C — Linux, Guadalinex y Samsung

No usar ramas por nombre de SO ni detectar Guadalinex por user-agent: el navegador puede no identificar la distribución. Consultar capacidades y `prefers-reduced-motion` de forma común; funciona para Linux y Android cuando el navegador transmite la preferencia.

En Guadalinex, navegador/versión y configuración de escritorio son variables no conocidas. No prometer compatibilidad con todas las instalaciones históricas. Si no se soporta/detecta la media query, ofrecer el control manual sin afirmar que el sistema tenga desactivadas las animaciones; adoptar degradación conservadora donde no se pueda determinar estado. No cambiar ajustes de Linux/Windows/Android ni recomendar actualizaciones del sistema como paso obligatorio para usar la web.

En Samsung comprobar Chrome Android y Samsung Internet si hay dispositivo/entorno disponible. Sin esa disponibilidad, emular touch, tamaños y preferencias, declarando claramente que no es validación del navegador físico. La misma aceptación debe activar los efectos permitidos en móvil; mantener restricciones de puntero/ancho y fallback gráfico. No añadir dependencias/polyfills generales para sistemas antiguos sin necesidad demostrada dentro de este alcance.

## Fase D — Carteles móviles sin recortes durante hover

Solo carrusel móvil expandido de Talleres. Conservar anchura/altura de la celda contenedora, paso del carrusel, separación y espacio exterior de sección; reducir el cartel visual dentro de la reserva (punto de partida ~90 %, ajustar según medición). Mantener ratio íntegro y centrado, nunca object-fit recortado.

Medir la envolvente máxima del tilt (escala 1.07 + rotación/perspectiva) y el pin en los bordes y esquinas. Reservar aire en los cuatro lados para que el cartel completo y su movimiento quepan cuando la celda esté completamente visible. No confundir el siguiente cartel parcialmente visible intencionalmente con el clipping de la carta activa.

No aplicar una escala global al article: reduciría textos/acciones y chocaría con el transform de abanico. No reemplazar el transform escrito por Tilt. Separar reserva estable y contenido visual con escala/padding/wrapper compatible. No intentar resolverlo solo con overflow-y:visible en un scroller horizontal: comprobar cómo computa overflow en ambos ejes. Mantener hit area coherente, foco visible, pin alineado, acciones Ver ficha/Descargar dossier bajo su carta y áreas táctiles >=44px.

Baraja cerrada conserva el aspecto aprobado de la segunda referencia. El popup de ficha/fullscreen y la rejilla de escritorio no se reducen. Comprobar 320, 390, 440, 759 y 760 px, ratón en ventana estrecha y touch sin hover; escritorio 1440 px sin cambio visual.

## Fase E — Volver a mazo a los 5 segundos sin explorar

Definición operativa de «esta sesión»: vida del documento/visita actual, mantenida en memoria; no cookie/localStorage/sessionStorage. Reload/nueva carga empieza de cero; hash, cambio de viewport, salida/entrada de sección o apertura/cierre de ficha no borran la actividad ya registrada.

- Se conserva inicio contraído y primer tap/hover de ratón despliega. **El gesto de desplegar no cuenta como explorar una ficha.**
- Al desplegar en móvil, visible y sin exploración previa de Talleres en esta visita, iniciar temporizador de **5000 ms**. Si no se explora, volver al mazo y llevar scroll horizontal al inicio sin animación de scroll. Configurar el tiempo en un único lugar.
- Exploración que cancela permanentemente este autocierre durante la visita: click/tap sobre cualquier carta ya desplegada, Ver ficha, enlace real de dossier, flechas anterior/siguiente, gesto horizontal que produzca desplazamiento efectivo, navegación horizontal por teclado o enlace directo que busca un taller concreto. Da igual si es la primera carta u otra. Un swipe no debe abrir accidentalmente una ficha.
- No cuentan: primer tap de apertura, hover solo, movimiento del cursor sin click, scroll vertical, resize, scrollTo de reset/anchor o scroll-snap programático sin gesto del usuario. Distinguir intención y cambio real; umbral pequeño en configuración para ruido táctil. El enlace directo cuenta por la acción, no por el scroll programático que genera.
- No cerrar con ficha abierta, con foco de teclado dentro de los controles del carrusel, durante drag/pointer activo ni con otro modal abierto. Si no se ha marcado exploración, reiniciar una ventana completa de 5 s al desaparecer el bloqueo. Revalidar estado en el callback; no usar cierres obsoletos.
- Pausar/cancelar al ocultar pestaña o perder visibilidad; evitar cierre inmediato por tiempo acumulado en segundo plano. Limpiar temporizadores al contraer/desmontar/pasar a escritorio. Al volver a móvil solo rearmar si procede.
- Mantener la regla existente de contraer al salir completamente de la sección y volver, excepto con ficha abierta; es independiente del temporizador. Haber explorado evita el autocierre por 5 s, no elimina el retorno a mazo al abandonar la zona ya pedido anteriormente.
- Evitar bucle hover → abrir → timer → cerrar → abrir sin mover el puntero: tras autocierre por hover, exigir salida/reentrada real o nuevo tap para abrir de nuevo.
- Con movimiento reducido el mismo resultado se aplica sin transición animada. Jamás ocultar el foco mediante inert mientras alguien está utilizando un control.

## Fase F — Verificación y entrega futura

Verificación V3 dirigida: política de movimiento → CSS/JS/motores → cookie/dialog; estado del carrusel → foco/geometría/timer. No repetir suites ajenas por ritual. Pruebas mínimas:

1. Sistema normal sin cookie: no popup y efectos existentes. Reduce sin cookie: popup, efectos quietos y contenido disponible. Activar: cinco efectos reportados cambian sin reload; consumidores inventariados coherentes y sin callbacks/contextos duplicados.
2. Cookie válida + reduce al recargar: no popup, efectos activos. Rechazo/Escape: cero persistencia, no reaparece por hash, vuelve tras reload. Cookie inválida/bloqueada: fallback correcto; controles siguen operables. Retirar aceptación: cookie borrada y sistema aplicado.
3. Cambio del sistema durante visita con/sin aceptación; SSR/hidratación, teclado/trap/retorno, contraste y modal no superpuesto. No audio automático ni pérdida de estado de vídeo/ficha/scroll.
4. Geometría del cartel en reposo y extremos del tilt; contenedor estable; primer/último cartel; botones y móvil fullscreen intactos. Capturas comparables en los anchos anteriores, con media touch y ratón, incluyendo escritorio.
5. Timer: sigue abierto antes de 5 s y contrae después sin actividad; abrir ficha, swipe, flecha, dossier o teclado cancelan para la visita. Segunda apertura tras explorar no autocierra. Reset programático no simula actividad. Foco/modal/drag/pestaña oculta cancelan/difieren correctamente. Salir y volver sigue contrayendo; no bucle de hover; un nuevo documento reinicia sesión.
6. Matriz Windows Chrome/Edge, Linux Firefox/Chromium (anotar Guadalinex real NO VERIFICADO si no se tiene), Android Chrome/Samsung Internet. Separar dispositivos reales, emulación y compatibilidad documental; no fingir cobertura por cambiar user-agent.
7. Runtime del proyecto: si existe .nvmrc cargar nvm y pin en la misma shell. Base comprobada usa Node 24.19. `npx tsc --noEmit`, `npm run check:content`, build estático con NEXT_PUBLIC_SITE_URL descubierto de lib/content/site.ts. En worktree con node_modules enlazado se usó `npx next build --webpack`; justificar elección vigente. Rutas /almeria-2026, canonical y export compatibles con Caddy.
8. No instalar un framework de tests por este prompt: aprovechar herramientas disponibles y pruebas de comportamiento reales; registrar comandos/hashes/capturas y limitaciones. No basta afirmar cookie segura desde document.cookie: comprobar atributos con herramientas del navegador sobre HTTPS.

Cada fase ejecutable futura sigue práctica 14 (checkpoint verde, informe/riesgos, commit documental separado). Output completo en `docs/prompts-output/[54-0]/prompt-output.md`, memoria frontend/security afectada y checkpoint actualizado. Aplicar assurance al cerrar código según router; no firmar como humano ni afirmar pruebas que no se ejecutaron.

Entregar preview y commits locales. Si la continuación autoriza publicar, seguir la guía y wrappers vigentes, verificar mismo sitio/ruta, CSS/JS dinámicos, cookie HTTPS, efectos y móvil después de activar. No activar MCP ni reutilizar credenciales/SSH de una ocasión anterior por inferencia.

## Delta autorizado durante ejecución — tarjetas compactas

Registro histórico documental: el propietario pide antes del despliegue el 25-09-2026 eliminar Imparte y Temática de cada tarjeta de Talleres y acercar el subtítulo a Ver ficha/Descargar dossier. MODIFICATION acotada de la presentación de las tarjetas, incluido escritorio; sustituye para ese alcance la instrucción anterior de no cambiar escritorio. La ficha completa conserva sus datos. Las tarjetas de otras secciones mantienen su contrato. No cambia negocio, autoría, temática ni sus constantes.

El propietario confirma después que esta ampliación debe figurar en el prompt como historial y ejecutarse antes de producción, con commit y despliegue incluidos. Se integra en la misma release de [54-0], previa verificación.
