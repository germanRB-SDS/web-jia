# JIA-2026-09-19-30 — Informe

**Fecha:** 2026-09-19 · **Prompt:** `docs/prompts/JIA-2026-09-19-30-herradura-doble-clic-y-tarjeta-que-gira-al-abrir-la-ficha.md`
**Resultado:** ejecutado entero, con seis correcciones del promotor recibidas por chat durante la ejecución (recogidas
al final del prompt y abajo). Verificación en cada cierre: `tsc`, `check:content`, `next build`, Chrome real por CDP.

## Commits (todos en `origin/main`)

| Commit | Contenido |
|---|---|
| 827e7f1 | Fase 1 — herradura: doble clic, caída vertical, dos rebotes, vuelco hacia atrás; el clavo no se mueve |
| fa835f1 | Hotfix — fuera la línea horizontal sobre las tarjetas de colaboradores |
| e49337c | Fase 2 — `components/flip-card/` e integración en las fichas de taller |
| b83fa2d | Fase 3 — sombra del sello en «Las jornadas», +10 % colgado de arriba, ancho propio |
| e6edb3a | Hotfix — hero: el sello sustituye al rótulo junto a «JIA», con la altura de las letras |
| 8958ed4 | Hotfix — segundo giro de la tarjeta (1,2 s) con parada de 0,1 s en el reverso |
| 51dd276 | Hotfix — fuera la pista «Arrastra a izquierda o derecha» |
| 2cae206 | Hotfix final — la herradura termina apoyada en el suelo (sin vuelco) |

## Encargo 1 — Herradura

- Disparador: **doble clic** (el clic simple no hace nada: caja del botón idéntica 1,5 s después); teclado: Enter o
  Espacio. Sin selección de texto; `FooterShots` ya ignoraba botones. Etiqueta: «Herradura de la suerte: haz doble clic».
- Animación, tal como la definió el promotor con ejes x/y/z: en la caída y en los **dos rebotes solo cambia la y** (la
  duración de cada rebote sale de su altura: 2 × caída × √altura); gira en su plano sobre su propio centro para apoyarse
  en el arco; queda **de pie sobre la línea** y ahí termina (estado final, commit 2cae206). A los 5 s vuelve al clavo.
  **Tiempo total: 7,5 s** (medido; con el vuelco de la fase 1 eran 8,7 s).
- El **vuelco hacia atrás** (fase 1) sigue en el código tras `fall.tipOver: false`: lento al principio, acelera un poco,
  sin rebote; la grúa de cámara sube solo entonces y se coloca delante de la herradura (vista desplazada, pared 1:1).
  Desviación del prompt: con `landTipDeg` **positivo** (+70°) la herradura se ve **de canto** desde el ojo elevado; el
  signo que aleja los extremos de la U de la cámara y enseña la cara superior es el **negativo** (−74°). Comprobado.
- **Clavo:** con la grúa arriba se dibuja en una segunda pasada desde la cámara de frente: misma posición en pantalla
  colgada y tumbada (evidencia `herradura-clavo-colgada-vs-tumbada-1920.png`). Sin vuelco, la cámara no sube.
- Pose colgada: **0 px de diferencia** respecto a HEAD anterior. Movimiento reducido: nada.
- `returns: false` la dejaría de pie hasta recargar. **Decisión a confirmar:** he mantenido la vuelta a los 5 s.

## Encargo 2 — Tarjeta que gira en la ficha de taller

- `components/flip-card/`: `FlipCard.tsx`, `flip-card.ts` (GSAP), `config.ts`, `FlipCard.module.css`. Frontal = el
  cartel íntegro; reverso = sello #JIA26 al 88 % sobre **`--jia-ink`** (elegido frente al cobre: es el fondo con el
  que el sello ya convive en el cubo y da más contraste). Variante nueva del sello de 640 px.
- Giro: reverso → frontal en 900 ms (`power3.out`) y, por petición posterior, **segundo giro de 1,2 s** con **parada
  de 0,1 s en el reverso** (500 ms + 100 ms + 700 ms). Después, inclinación ±12° hacia el puntero (solo puntero fino).
  Gira en cada apertura; al cerrar vuelve al reverso sin animar. Movimiento reducido: frontal quieto (`transform: none`).
- **Caja final = caja de antes**, a 1440 (264 / 223,69 / 320 / 452,61) y a 390 (64 / 95,84 / 183,94 / 260,16);
  «Cerrar» no se mueve ni queda tapado. 6 fichas con flip-card; Experiencias: 0. Consola limpia.

## Encargo 3 — Sello de «Las jornadas»

- `filter: drop-shadow` en dos capas con `--jia-ink-rgb` (contacto 0 2px 3px / 0,25; larga 0 18px 28px / 0,28). Estático.
- +10 % y colgado de arriba (crece hacia abajo): ancho propio `clamp(6.5rem, 32 %, 11.35rem)` → 182 px a 1920
  (165 × 1,1).
- **Fallo de JIA-29 corregido de paso:** el ancho del sello dependía del alto del párrafo y este del ancho del sello;
  el bucle ensanchaba la columna y **a 1440 el sello se salía de la ventana** (ya se ve cortado en la evidencia de
  JIA-29). Ahora cabe a todos los anchos; se oculta < 760 px y en columnas < 22rem. A 1440 mide 153 px (antes 194,
  pero cortado): ahí **no** es un 10 % mayor; más ancho estrangularía el párrafo (292 px).

## Otros hotfixes pedidos durante la ejecución

- Colaboradores: sin línea superior (el ancla del motor queda, invisible) y sin la pista de arrastre.
- Hero: sello en lugar del rótulo, altura = letras «JIA» (150,2 px ambos a 1440; 85,8 a 390), `heroConfig.sealMediaId`
  (null devuelve el rótulo). El `<h1>` conserva su nombre con texto oculto.

## Riesgos

- **Moderado — cambios ajenos sin commit en el árbol:** `lib/content/site.ts` (título de la edición → «Jornadas de
  Innovación de Almería» y **`fullName: ""`**), `copy/es/sections/jornadas.ts` («dado»), `.impeccable/design.json`,
  prompt JIA-12 y varios assets. No los he tocado ni subido. Ojo: `fullName` vacío deja sin nombre el pie y el
  `aria-label` del logotipo de la cabecera. Propuesta: restaurar `fullName` antes de subir ese cambio.
- **Moderado — scroll horizontal previo** (no causado por este prompt): 1194 px a 1180, 925 a 900, 864 a 768, 438 a
  390. A 1180 desbordan `Hero .light` y la pista del carrusel. Propuesta: hotfix propio (ya estaba pendiente el del cubo).
- **Menor — accesibilidad del carrusel:** sin la pista visible no queda instrucción de uso; sigue pendiente el botón
  de pausa (WCAG 2.2.2).
- **Menor — `title` del botón de la herradura** muestra «haz doble clic» también a quien usa teclado.
- **Menor — tiempos medidos con SwiftShader** (Chrome sin GPU): en un equipo real la animación es más fluida; las
  duraciones son las de `config.ts`.
- Sin riesgos severos ni críticos.

## Evidencias

`docs/prompts-output/JIA-2026-09-19-30/evidence/`: herradura (colgada, secuencias, apoyada, de vuelta, clavo; las
«tumbada» son de la fase 1), ficha de taller (secuencias del giro a 1440 y 390, doble giro, final, inclinada, tabla
antes/después), sello antes/después, hero a 1440/768/390, colaboradores sin línea ni pista.
