# [53-1] Fichas y navegación móvil — informe de fase

Change ID: REL-2026-09-25-02 · 2026-09-25 · LEVEL 2 · frontend UI-only/client-only.
Implementación: cdd0472. Base compartida: 5b131c9. Continúa [53-0] (a815698, 6c6f152).

## Resumen

Las seis fichas de talleres ocupan toda la pantalla móvil. Cartel aproximadamente un 10 % menor, a la derecha bajo Cerrar; texto fluye a su alrededor. Cerrar permanece fijo mientras se desplaza el contenido. El diálogo mantiene foco nativo, retorno al disparador, bloqueo/restauración del scroll de fondo y reinicio de scroll al reabrir. Opt-in de talleres por debajo de 760 px; escritorio conserva el modal.

Al abandonar verticalmente la sección de talleres, la baraja se contrae y reinicia su posición, tanto hacia arriba como hacia abajo. No se contrae durante una ficha abierta. El carrusel horizontal mantiene su scroll. La cabecera móvil queda fija, con espacio reservado, sello a la izquierda del menú, sombra y botón completamente visible. El degradado superior del hero se reduce del 22 % al 11 % en su breakpoint móvil existente.

Se corrigió el desbordamiento previo que ampliaba el viewport móvil y desplazaba los controles fijos. Cabecera y Cerrar se dimensionan respecto a la pantalla; html/body contienen el desbordamiento horizontal solo por debajo de 960 px. La comparación antes/después muestra layout viewport 495 → 440 px y desplazamiento visual 113 → 0 en una pantalla de 440 px. No se modifican la sección de maestra/aula/foto/luces ni dependencias, servicios o datos. Las mejoras aprobadas de [53-0], incluyendo footer y título Saloon, se integran con esta fase.

## Verificación

Verification: V2 | PASS | ficha → scroll → cierre/retorno; sección → salida/retorno; cabecera → menú/footer; consumidores compartidos → escritorio.

- TypeScript y check:content: PASS. Exportación estática Next mediante webpack: PASS. Diff check: PASS.
- 66 aserciones Chrome/CDP PASS: 63 en mobile-review.json y 3 en header-review.json. Pantallas 320/390/440/759 px, seis fichas y viewport corto de 500 px; reapertura desde arriba, foco, bloqueo de fondo, botón Cerrar visible/estable, baraja contraída al salir en ambos sentidos, menú fijo visible/pulsable hasta footer, desplazamiento horizontal y escritorio de 1440 px.
- Capturas revisadas en evidence/: fichas, hero, cabecera/footer, baraja de retorno y modal de escritorio. Se comprueba visualViewport y hit test además de posiciones DOM; la prueba detectó y llevó a corregir la versión intermedia que aún desplazaba la cabecera.
- [53-0] conserva su evidencia previa de 61 aserciones para baraja, teclado, hover, movimiento reducido, enlaces, título, footer y escritorio. No se presenta como una nueva ejecución en esta fase.
- Node 24.19.0. El export con webpack permite las dependencias enlazadas del worktree aislado, sin cambiar configuración.

## Análisis de riesgo y soluciones propuestas

Moderado: la emulación Chrome no sustituye Safari/iOS físico, especialmente áreas seguras y cambios de barras del navegador. Mitigación implementada: unidades dvh, safe-area, diálogo nativo y pruebas de altura reducida/scroll. Propuesta: comprobar estos casos en dispositivo físico durante la revisión habitual posterior; no impide la publicación explícitamente autorizada.

Moderado resuelto: el overflow global previo desplazaba los controles móviles aunque el DOM indicase top=0. Corrección inmediata aplicada a html/body solo en móvil, con aserciones del viewport visual, capturas y carrusel horizontal operativo. Escritorio conserva su comportamiento. No queda un fix pendiente por este hallazgo.

Severo: no se detectaron riesgos severos nuevos tras revisar el diff completo y verificar consumidores compartidos/desktop. Sin dependencias, contratos de servicios, credenciales ni operaciones de datos. No se propone corrección adicional.

Crítico: no se detectaron riesgos críticos nuevos. Staging explícito en worktree aislado y publicación mediante wrapper SDS; cambios ajenos excluidos. No se propone corrección adicional.

## Entrega y continuidad

El propietario validó visualmente la baraja y autorizó guardar/publicar. Esa autorización sustituye el gate histórico de [53-0]. No queda aprobación pendiente. Implementación guardada; este informe/evidencia se guardan en commit documental separado antes de integrar por fast-forward y publicar en main.

Fetch previo confirma origin/main = main = 5b131c9, sin commits remotos nuevos. Se preserva next-env.d.ts modificado por el servidor dev de la raíz. node_modules enlazado queda fuera de Git. Vista compilada disponible en localhost:3005; el servidor dev del propietario no se reinicia.

Tmp/scratch: APLICA; checkpoint y evidencia consolidados aquí. PR/MR: N/A, entrega directa a main solicitada; no se crea PR ni se atribuye una firma humana ficticia. Rollback: revertir cdd0472; para retirar además [53-0], revertir 6c6f152 y a815698 en orden inverso. Nunca reescribir historia compartida.
