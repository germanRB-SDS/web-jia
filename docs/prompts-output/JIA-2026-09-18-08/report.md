# JIA-2026-09-18-08 — Carruaje sobre un camino de seis paradas en «LAS JORNADAS» (Three.js + GSAP)

**Prompt:** `docs/prompts/JIA-2026-09-18-08-carruaje-camino-threejs-gsap.md` · **Fecha:** 2026-09-18 · **Agente:** Claude Code ·
**Estado:** IMPLEMENTADO (evidencia de tablet incompleta, ver riesgos) · **Nivel:** LEVEL 2 · tmp/scratch: N/A.

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Stack | `three@0.186.0`, `gsap@3.15.0`, `@types/three` añadidos; sin R3F, sin física, sin Spline. | `package.json` |
| Modelo | El GLB de JIA-2026-09-18-07 se publica tal cual en `public/jornadas/jia-carruaje.glb` (313 516 bytes) desde el script de assets. | `scripts/build-assets.sh` |
| Contenido | Seis etiquetas fijas «Parada 1…6», nombre de región y textos de los controles en la capa de copy; el modelo `jornadas.route` se ensambla en `assemble.ts`; ruta del GLB en la config de sección. | `lib/content/copy/es/sections/jornadas.ts`, `copy/es/buttons.ts`, `copy/types.ts`, `sections/jornadas.ts`, `assemble.ts` |
| Componente | `<JornadasRoute>` (cliente) montado en `#jornadas-mapa` bajo el párrafo, sin tarjeta ni fondo; canvas transparente con `aspect-ratio` reservado antes de cargar. Etiquetas HTML ancladas a los discos proyectados (px CSS relativos al contenedor), controles «Pausar/Reanudar» y «Repetir recorrido» en estilo quiet. Fallback sin WebGL/GLB: lista estática con puntos terracota. | `components/site/jornadas-route/JornadasRoute.tsx`, `.module.css`, `components/site/Jornadas.tsx` |
| Escena | Un renderer, cámara ortográfica cenital fija (`up` = −Z), plano XZ, +Y arriba. Camino = cinta plana con `drawRange` para el revelado; discos `CircleGeometry`; sombra de contacto real (`ShadowMaterial`) que también inclina con la carrocería. Colores desde los tokens CSS (`--jia-sand-deep`, `--jia-line`, `--jia-terracotta`). | `route-scene.ts` |
| Movimiento | Única fuente de verdad `anim.distance`; `u = d / curve.getLength()`; `getPointAt/getTangentAt(u)`. Rumbo por quaternion (sin saltos 0/360). Dirección desde la curvatura local con tope ±34°. Ruedas: `−d/r` sobre X local respecto a la pose de reposo (0,35 / 0,44). Balanceo en `JIA_BodyMotion`: roll con la distancia y la velocidad, cabeceo con la aceleración, tres baches configurables con respuesta amortiguada. | `route-scene.ts`, `config.ts` |
| Timeline | GSAP: revelado 1,0 s → discos → carruaje 0,25 s → seis tramos con ease trapezoidal (rampas 0,55/0,65 s) relacionados con su longitud + esperas de 0,85 s; llegadas por `tl.call` (una vez por reproducción). Repetir invalida y reinicia; pausa/reanuda; pausa automática fuera de pantalla o pestaña oculta y reanudación al volver. Bucle de render solo mientras hay movimiento. | `route-scene.ts` |
| Trazado | A petición del promotor durante la ejecución: empieza abajo-izquierda y termina arriba-derecha; tres tramos verticales unidos por dos curvas amplias en U (R ≈ 15 u, compatible con la distancia entre ejes 10,2 u a 34°). Disposición «wide» (100×74) y «narrow» (100×104, < 600 px). | `config.ts` |
| Evidencia | Capturas por CDP con estados reales (inicio, parada 3, final, pausado, movimiento reducido, sin GLB) en escritorio, portátil y móvil. | `evidence/`, `scripts/qa-route.mjs` |

## Verificación

- `tsc --noEmit`, `check:content`, `next build`: OK. Sin errores de consola (solo el aviso de `PCFSoftShadowMap`, ya corregido a `PCFShadowMap`).
- Desarrollador (medido en `evidence/qa-route-report.json`): seis paradas en orden (etiquetas 0 → 3 → 6); pausa mantiene el canvas idéntico; repetir reinicia a 0 etiquetas y vuelve a `playing`; canvas 477×353 px CSS con ratio 1 en el headless. Rango de dirección y radios: validación previa del asset (±37°) y trazado con R ≈ 15 u.
- Diseñador: fotografía, título y párrafo intactos; el camino se lee sobre la duna sin panel; etiquetas a la derecha sin colisiones; el carruaje mide ~87 px en escritorio y ~64 px en móvil.
- **No ejecutado / incompleto:** tablet (768 px) no alcanzó la parada 3 en 40 s bajo SwiftShader (el suavizado de retardo de GSAP frena la línea de tiempo cuando el render por software va lento); solo hay captura inicial. Resize durante la reproducción y desmontaje/remontaje no se han probado con herramienta; están implementados (`setLayout` conserva tramo y progreso; `dispose` libera renderer, timeline, observadores).

## Riesgos

- Moderado: en dispositivos muy lentos la línea de tiempo se ralentiza (lag smoothing de GSAP) en lugar de saltar; aceptable pero no medido en hardware real.
- Moderado: el carruaje a ~64 px en móvil está en el límite de legibilidad probado (96 px).
- Sin severos ni críticos nuevos.

## Siguiente paso

JIA-2026-09-18-09: nombres de talleres como constantes con número variable de paradas, botón circular de repetir sin texto, sin pausa, parada más breve, Y distinta por parada, retirar el distintivo JIA26 del pie.
