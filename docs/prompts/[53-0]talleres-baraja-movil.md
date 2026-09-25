# [53-0] Baraja de talleres y orden del menú móvil

## PREFACE — NON-EXECUTABLE

Execute from `## Status` onward. La sección Talleres móvil empieza como una mano de cartas y se despliega al primer toque en su carrusel actual. Se conserva la información completa en las fichas, se simplifica lo visible bajo cada cartel y se intercambian el sello y el menú de la cabecera móvil. Se reutilizan carteles, componentes, diálogos y tokens del proyecto. El escritorio conserva su presentación. Riesgo moderado: interacción táctil, foco, animación y aislamiento del componente compartido SheetCard; sin cambios de datos, servicios ni dependencias, ni riesgos severos/críticos previstos.

## Status

Petición del propietario del 2026-09-25, incluido su añadido sobre la cabecera. `LEVEL 2`, área `frontend`, cambio `UI-only/client-only`. Change ID: `REL-2026-09-25-02`.

## Objetivo y alcance

1. SOLO por debajo de 760 px, los carteles existentes de TODOS los talleres aparecen inicialmente superpuestos y girados formando una baraja en abanico, inspirada en las referencias aportadas. Usar los carteles reales con las caras de los talleristas.
2. El primer tap despliega la baraja con una transición al carrusel horizontal existente, conservando su anchura de tarjetas, desplazamiento y controles. Ese primer tap no abre una ficha. Permitir también teclado y hover real cuando esté disponible; no depender del hover en táctil. Mantener el carrusel desplegado durante la visita.
3. Desplegadas las cartas, tocar cada cartel o «Ver ficha» abre su diálogo existente con toda la información.
4. En móvil, ocultar bajo los carteles título, subtítulo, Imparte y Temática. Conservar la información y los nombres accesibles en las fichas. Mostrar únicamente «Ver ficha» y «Descargar dossier» bajo cada cartel, y únicamente mientras el carrusel está desplegado. Conservar la disponibilidad real de cada dossier; no inventar enlaces.
5. Cabecera móvil: colocar el sello circular a la izquierda del menú hamburguesa, y el menú a la derecha en la antigua posición del sello. Mantener el sello visible también en teléfonos estrechos. Conservar la cabecera de escritorio.
6. Mantener el escritorio y otras secciones que usan SheetCard; no modificar el trabajo de Claude en maestra, aula, foto o luces, ni el vídeo.
7. Añadido posterior del propietario: solo en móvil, sustituir el título «TALLERES» por «TALLERES EN EL SALOON». Guardar el texto en el catálogo de copy y conservar «TALLERES» en escritorio.

## Ejecución y constantes

Guardar y hacer commit de este prompt ANTES de implementar. Leer el prompt ya commiteado y ejecutar una fase de implementación en rama aislada. El CSS pegado repite el HTML; recrear el efecto a partir de las capturas y los patrones locales, sin dependencias nuevas.

Aplicar AGENTS.md y SDS, con las guías locales Impeccable y gstack. Copy nuevo en `lib/content/copy/`, contrato en `lib/content/copy/types.ts`; datos e imágenes existentes a través de `lib/content/assemble.ts` y su configuración de medios. Colores exclusivamente de los tokens actuales. Registrar continuidad en `docs/prompts-output/[53-0]/tmp/` y evidencia en `docs/prompts-output/[53-0]/evidence/`.

## Verificación y cierre

- Comprobar baraja, primer tap, swipe, ficha de todas las cartas y sus acciones; navegación por teclado, foco y movimiento reducido.
- Revisar capturas móviles estrechas y anchas, el límite de 760 px y escritorio; comprobar ausencia de desbordamiento horizontal de la página y el orden del sello/menú.
- Ejecutar TypeScript, check:content y build. Revisar el diff y limitar el staging a esta tarea.
- Commit de implementación verde y después informe de fase con resumen, evidencia, riesgos moderados/severos/críticos y soluciones propuestas, mostrado por terminal y commiteado aparte conforme a la práctica 14.
- Dejar una vista local para la validación visual del propietario. NO integrar ni hacer push a main hasta que el usuario confirme expresamente que el resultado visual es correcto. Tras esa validación, integrar exclusivamente estos cambios y publicar mediante el wrapper seguro de SDS.
