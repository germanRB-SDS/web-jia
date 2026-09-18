# JIA · carruaje — validación

**Fecha:** 2026-09-18 · Blender 5.2.1 LTS (CLI `/opt/homebrew/bin/blender --background`), motor de
render EEVEE. Datos brutos: `previews/generation-metrics.json` y `previews/validation-data.json`.

## Entorno y método

- Blender MCP: instalado y admitido en el ledger del hub (`docs/governance/capability-registry.md`)
  con la constraint «sin admisión heredada a hijos»; web-jia es un repositorio hijo sin admisión
  propia. **No se ha usado el MCP.** Se ha usado Blender por CLI con scripts `bpy` en modo
  background, que además no toca ninguna sesión abierta del usuario ni preferencias globales.
- Generación: `generate-carruaje.py` + `carruaje-config.json` (fichero nuevo y vacío en cada
  ejecución; solo escribe dentro de `assets/3d/carruaje/`; se niega a sobrescribir sin `--overwrite`).
- Validación: `validate-carruaje.py` abre el .blend sin guardarlo, ejecuta las pruebas, renderiza
  evidencias en `previews/validation/` y reimporta el GLB en una escena vacía independiente.
- Comandos ejecutados (desde `assets/3d/carruaje/`):

```
blender --background --python generate-carruaje.py -- --overwrite
blender --background --python validate-carruaje.py
```

## Resultados

| # | Prueba | Resultado | Evidencia / dato |
|---|---|---|---|
| 1 | Abrir el .blend guardado | PASS | `validate-carruaje.py` lo abre; cámara activa `JIA_Camera_Top`, ortográfica, rotación (0,0,0) |
| 2 | Reimportar el GLB y comparar estructura | PASS | 13 objetos, 10 mallas, 5 materiales, jerarquía idéntica al contrato, 8 112 triángulos, ruedas en z = 0, frente en +Y |
| 3 | Nombres únicos y cuatro pivotes de rueda | PASS | bbox de cada rueda centrado en su origen en Y/Z (tolerancia 1e-4); en X la tapa del buje sobresale hacia fuera por diseño |
| 4 | Girar cada rueda 360° (pasos de 90°) | PASS | desplazamiento del centro 0,0; apoyo z = 0 en todos los pasos (no orbitan) |
| 5 | Giro del tren delantero a ambos lados | PASS | sin solapamiento nuevo hasta **±37°**; primer contacto a 38° (rueda contra tablones). Solapamientos de reposo tolerados: kingpin en el suelo de la caja y en el varal (pasador en su alojamiento) |
| 6 | Girar la raíz 360° | PASS | dimensiones a 90° intercambian X/Y (3,04 × 1,78), a 360° iguales a 0°; hoja de 8 orientaciones `previews/orientations-160px.png` |
| 7 | Cuatro ruedas en el mismo plano | PASS | z mínimo = 0,0 en las cuatro, con radios distintos (0,35 / 0,44) |
| 8 | Balanceo de la caja no levanta ruedas | PASS | roll 2° + pitch 1,5° en `JIA_BodyMotion`: las cuatro ruedas siguen en z = 0 |
| 9 | Normales, manifold, materiales | PASS con nota | todas las mallas cerradas salvo la lona base (97 aristas de borde: abertura delantera y borde inferior, cerradas por Solidify en la exportación); `mesh.validate()` sin incidencias; 0 caras sin material; lona con normales hacia fuera comprobadas visualmente (cara exterior crema, interior sombra) |
| 10 | GLB sin elementos de presentación | PASS | 13 nodos exactos, 0 cámaras, 0 luces, 0 animaciones, 0 imágenes, `extensionsUsed: []` |
| 11 | Legibilidad a 96 / 160 / 256 px | PASS con nota | `previews/legibility-96-160-256.png` sobre papel `#F1E7D8`: a 160 y 256 px se leen lona, bandas de arco, ruedas, bujes y pescante; a 96 px se lee la silueta, las ruedas y la barra del pescante, las bandas casi desaparecen |
| 12 | Pose de reposo antes de exportar | PASS | ROOT/BodyMotion/FrontSteer/ruedas a 0 tras los renders de orientación; verificado al reabrir |
| 13 | Materiales con luz neutra | PASS | `previews/review-3-4-neutral.png`, `top-neutral.png`: sin caras negras ni invertidas |
| 14 | Intersecciones relevantes en reposo | PASS | solo las de diseño (pasador/eje dentro de bujes y alojamientos); ninguna visible en los renders |
| 15 | Importación en Spline | **NO EJECUTADA** | fuera del alcance; queda pendiente de prueba real (HANDOFF-SPLINE.md §9) |

## Métricas

| Métrica | Valor |
|---|---|
| Triángulos (GLB) | 8 112 |
| Vértices | 4 298 |
| Objetos / mallas / primitivas / materiales | 13 / 10 / 21 / 5 |
| GLB | 313 516 bytes (0,31 MB), sin texturas, sin extensiones |
| .blend | 133 054 bytes |
| Dimensiones (X × Y × Z) | 1,78 × 3,04 × 2,26 |
| Distancia entre ejes / vía | 1,70 / 1,52 |
| Radios | delante 0,35 · detrás 0,44 |

Evolución durante la sesión: primera versión 13 656 triángulos (bisel en ruedas y lona densa) →
8 112 al quitar el bisel de las ruedas y aligerar la lona; rango de dirección 17° → 22° → 37° al
subir las estacas al nivel del suelo de la caja y elevar los flejes de esquina por encima de la cota
superior de la rueda delantera.

## Revisión artística (frente a `assets/images-website/carruaje.png`)

- Conservado: caja de tablones con estacas oscuras, lona clara y arqueada con bandas de arco
  (4 arcos, 3 tramos visibles como en la referencia), abertura delantera con fruncido, cuatro ruedas
  de radios con llanta oscura y buje, ejes y varal sencillos, cofre lateral delantero derecho, pescante
  de madera.
- Interpretado: ruedas traseras mayores (0,44 vs 0,35), ruedas de un mismo eje iguales, trasera
  cerrada con fruncido plano (la referencia no la muestra), ganchos de cuerda como tacos oscuros (la
  cuerda en zigzag se omite por ruido a tamaño de mapa).
- Omitido deliberadamente: caballos, varales largos, personas, texto, suciedad/microtextura.

## Advertencias

- La lona es más clara que el papel de la web: su lectura depende del sombreado y de la sombra de
  contacto; vigilar en Spline (posible ajuste de tono documentado en el handoff).
- Los renders usan EEVEE con «Standard» (sin AgX/Filmic) para no maquillar los colores; el aspecto
  en Spline/Three dependerá de su iluminación.
- Una reimportación correcta en Blender no acredita la importación en Spline.

## Bloqueos

Ninguno. Pendiente exclusivamente la prueba en Spline v2 y la decisión de vía de integración.
