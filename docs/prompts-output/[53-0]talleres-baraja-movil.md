# [53-0] Talleres en el Saloon — informe de fase

Change ID: `REL-2026-09-25-02` · 2026-09-25 · `LEVEL 2` · frontend · UI-only/client-only.
Prompt: `docs/prompts/[53-0]talleres-baraja-movil.md`.
Implementación: `a815698306d831ebc3fe4f6a68cdd69e070499d2`; cierre con `6c6f152` (temática conservada dentro de las seis fichas móviles).
Base: `5b131c948f9cdd6c724d4d826c642b86eb2fd75c`.

## Resumen

En móvil, los seis carteles originales aparecen como una baraja en abanico. El primer toque la despliega en el carrusel nativo existente, sin abrir una ficha; desde ahí cada cartel y «Ver ficha» abren el diálogo completo. Título, subtítulo, Imparte y Temática quedan dentro de la ficha; las acciones solo aparecen bajo las cartas desplegadas. Los dosieres conservan su estado pendiente original, sin inventar enlaces. El título móvil es «TALLERES EN EL SALOON».

El sello circular precede al botón de menú en la cabecera móvil, cuya sombra difuminada semitransparente permite ver y tocar el contenido que pasa por debajo. La franja de atribución a South Desert Studio se presenta al principio del footer móvil, con su línea debajo y el gradiente siempre animado; con movimiento reducido la línea permanece iluminada y estática.

El escritorio conserva su presentación. No se modificaron el vídeo ni la sección de aula/maestra/foto/luces de Claude. Los cambios de SheetCard son opt-in para talleres. Se reutilizan medios, diálogos, controles y tokens; el copy nuevo está en `lib/content/copy/`, con su contrato TypeScript. La información de negocio y los medios siguen entrando por `lib/content/assemble.ts`.

## Evidencia de verificación

`Verification: V2 | PASS | talleres → baraja → carrusel → fichas; cabecera → menú; footer → crédito/línea; consumidores compartidos → escritorio.`

- TypeScript, `npm run check:content` y `git diff --check`: PASS.
- `npx next build --webpack`: PASS, exportación estática completada. Node 24.19.0; webpack permite reutilizar el node_modules instalado mediante enlace local en el worktree aislado. No se cambió configuración ni dependencias del proyecto.
- 61 aserciones de navegador PASS en los seis ficheros `*results.json` de [evidence](./[53-0]/evidence/): toque inicial, swipe sin abrir ficha, seis fichas, acción Ver ficha, Escape/retorno del foco, Enter/despliegue, hover real, movimiento reducido, enlace directo a la quinta carta, resize y menú.
- Capturas revisadas en 320, 390, 520 y 759 px; grid y título de escritorio en 760, 960 y 1440 px. Comparación contra main confirma mismos anchos/posiciones de tarjetas y cabecera de escritorio. Footer de escritorio conserva el crédito inferior y el comportamiento de hover.
- El carrusel no desborda su contenedor. La anchura global reportada por Chrome móvil (438 px en viewport de 390 px) ya existe en main y no aumenta; no se alteraron otras secciones para corregir ese comportamiento previo.
- Smoke de la exportación `out/`: baraja inicial, primer tap, ficha y enlace exacto a quinta carta PASS. Se espera la hidratación antes de comprobar interacciones.
- Los ajustes del arnés (navegación completa entre escenarios, mayúsculas visuales y pulsación completa de Enter por CDP) están documentados en `evidence/checks.txt`. No se presentan fallos del arnés como defectos de producto.

## Análisis de riesgo y soluciones propuestas

**Moderado:** la verificación táctil se realizó en Chrome con emulación; no equivale a una prueba física en Safari/iOS. Acción propuesta: revisión visual del propietario en su navegador objetivo antes de publicar, conforme a su gate explícito. La revisión local puede hacerse en `http://localhost:3005/#talleres` y recorriendo cabecera/footer. La animación dispone de alternativa sin movimiento; teclado y diálogos nativos se comprobaron.

**Severo:** no se detectaron riesgos severos nuevos tras revisar el diff y comparar los consumidores afectados en escritorio. No hay cambios de dependencias, contratos de servicios, credenciales, escrituras de datos ni infraestructura. No se propone corrección adicional.

**Crítico:** no se detectaron riesgos críticos nuevos. La implementación queda en rama aislada, con staging por rutas y sin publicación. No se propone corrección adicional.

## Estado de entrega y continuidad

- Prompts previos al código y añadidos: `dcc9df7`, `142a98f`, `7e9280f`, `2671a47`; leídos tras cada commit.
- Implementación terminada y commiteada en `feat/REL-2026-09-25-02-talleres-baraja`. Este informe y las evidencias se guardan en commit documental separado.
- Worktree: `/private/tmp/jia-talleres-worktree`; la raíz en main y su localhost:3000 no se alteraron. Vista aislada de producción servida en localhost:3005.
- Tmp/scratch: APLICA; checkpoint en `[53-0]/tmp/checkpoint.md`, evidencia consolidada en este informe. No quedan tareas de implementación pendientes.
- Integración/push: PENDIENTE de validación visual explícita del usuario. No se ha hecho push ni se ha integrado esta rama en main. Tras aprobación, fetch/revisión de cambios concurrentes e integración de estos commits; push mediante el wrapper SDS.
- PR/MR: N/A en este cierre local, no se ha solicitado ni creado una PR. El gate de aseguramiento se revisará al preparar la entrega a PR/MR si procede.
- Rollback: antes de integrar, descartar la propuesta sin tocar main; después de integrar, revertir los commits de implementación en orden inverso: `6c6f152`, `a815698`, nunca reescribir historia compartida.
