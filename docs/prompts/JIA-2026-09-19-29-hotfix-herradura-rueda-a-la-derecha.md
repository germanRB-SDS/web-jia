# JIA-2026-09-19-29 — Hotfix del pie: la herradura cae, rebota y rueda a la derecha hasta el límite

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat tras JIA-28. **Nivel:** LEVEL 1 (resultado aquí).

## Encargo

La herradura, al pulsarla, **cae, rebota y rueda hacia la derecha** por el suelo **hasta apoyarse contra el límite
derecho** (el borde de la ventana). Después, como hasta ahora, vuelve sola a su clavo a los 5 s.

Añadidos por el promotor en chat durante la ejecución:

2. **Colgada, de frente.** Mientras cuelga se ve de frente (no desde arriba); la caída y el ángulo en el suelo se
   mantienen tal cual.
3. **Entera sobre la línea.** La línea horizontal del pie es donde «termina»: al caer sobre ella la herradura debe
   verse completa (se veía parcialmente, recortada por abajo).
4. **Sello #JIA26** a la derecha del texto de introducción de «Las jornadas», adaptativo, con la **misma altura** que
   ocupa ese párrafo; **en móvil no se muestra**. Imagen aportada en chat (1080×1080).
5. **Tarjetas de colaboradores:** al pasar el ratón (el carrusel ya se detiene) la tarjeta bajo el puntero recibe
   **el mismo efecto 3D** que las tarjetas de los talleres.

## Resultado

- Aterriza casi de pie sobre su canto (vuelco hacia la cámara de solo −18°, para poder rodar), rebota dos veces y
  **rueda a la derecha** girando en el sentido de las agujas del reloj (`config.fall.roll`: 1,5 vueltas en 1,7 s,
  frenándose); mientras rueda, un ajuste por fotograma la mantiene **apoyada en el suelo** (el punto más bajo de su
  caja en la línea del pie), de modo que, al no ser una rueda, cabecea como una herradura real. Se detiene con su
  punto más a la derecha a 4 px del borde de la ventana. A los 5 s sube de nuevo al clavo.
- **Grúa de cámara.** El ojo está a la altura del centro del bloque mientras cuelga (de frente, pared 1:1) y
  sube a 380 px durante la caída (1,4 × su duración), de modo que el suelo se ve desde arriba como antes; baja al
  volver ella al clavo. `setCamera()` en la escena; las poses se miden con el ojo donde estará al final.
- **Suelo elevado lo justo.** El nivel del suelo se calcula por clic para que el punto más bajo de la herradura
  **en pantalla** quede 2 px por encima de la línea (`fall.floorMarginPx`); el plano de sombra se coloca ahí. Con el
  ojo inclinado, la posición en pantalla depende de la altura del punto, así que el tope derecho se mide a la
  altura real de reposo y, además, cada fotograma de la rodadura comprueba la caja proyectada y no deja pasar del
  borde (a 1920: reposa con su punto derecho a 1910 px y el inferior a 330 de 332).
- Nota técnica: `Box3.setFromObject` no actualiza las matrices de los hijos; las poses se miden tras
  `updateMatrixWorld(true)` (`poseBox()`), o se medía la pose del último render.
- **Sello #JIA26:** `assets/images-website/sello-jia26.png` → `public/jornadas/sello-jia26-{240,480}.webp`
  (`build-assets.sh`), medio `sello-jia26`, `jornadasConfig.sealMediaId`, modelo `jornadas.seal`. Fila flex con el
  párrafo y un cuadro `aspect-ratio: 1` estirado a la altura de la fila (medido a 1440: párrafo 194 px, sello 194 ×
  194); `display: none` por debajo de 760 px. Decorativo (`aria-hidden`).
- **Tarjeta de colaborador 3D:** el `li` es el hueco de la cinta y el cuerpo de la tarjeta va dentro de `TiltCard`
  (nuevo `innerClassName`), con su luz cenital de JIA-26 y, al girar, la sombra larga de los talleres. Medido: giro
  activo y `matrix3d` bajo el puntero; solo puntero fino (el arrastre sigue funcionando).
- Verificación: `tsc`, `check:content` (57 medios) y `next build` OK; Chrome por CDP a 1920 (colgada de frente,
  rodando, apoyada en el borde y entera sobre la línea, vuelta al clavo), 1440 (sello y tarjeta 3D) y 390 (sello
  oculto). Capturas en `docs/prompts-output/JIA-2026-09-19-29/evidence/`.

### Hotfix posterior (promotor, chat): la sombra del hover no se corta

La franja del carrusel recorta (`overflow: clip`) y dejaba 1,75 rem bajo las tarjetas: la sombra larga de la tarjeta
girada se cortaba por abajo. El hueco pasa a 1,5 rem arriba y 4,5 rem abajo (relleno y margen negativo iguales, así
el carrusel no se mueve). Verificado a 1440: la sombra completa cabe dentro del recorte.

## Riesgos

- **Menor:** el trayecto de rodadura depende de dónde cuelgue (a 1600 px es corto, ~150 px); la vuelta de giro se
  mantiene y la herradura simplemente patina un poco más en pantallas estrechas.
