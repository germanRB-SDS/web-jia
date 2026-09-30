# JIA · carruaje — handoff técnico para Spline v2 / web

**Asset:** `assets/3d/carruaje/jia-carruaje.glb` (principal) · fuente `jia-carruaje.blend` · Blender 5.2.1 LTS.
**Fecha:** 2026-09-18 · **Prompt:** `docs/prompts/JIA-2026-09-18-07-carruaje-3d-blender.md`.
**Estado:** asset generado y validado en Blender. **La importación en Spline NO se ha realizado**: la
compatibilidad final allí queda pendiente de una prueba real (ver §9).

## 1. Jerarquía y contrato de control

Trece nodos, nombres únicos y sin espacios. Tres son transformaciones puras (empties sin geometría).

```
JIA_Wagon_ROOT            empty · origen en el suelo, centrado, a mitad entre ejes
├── JIA_Chassis           malla · eje trasero, bolster trasero, varal central (estático)
├── JIA_BodyMotion        empty · pivote (0, 0, 0.72): plano inferior de la caja
│   ├── JIA_Body          malla · tablones, estacas, barandas, largueros, travesaño delantero
│   ├── JIA_Canvas        malla · lona (abertura delantera, fruncido trasero)
│   ├── JIA_DriverSeat    malla · pescante: estribo, cajón de asiento, respaldo
│   └── JIA_Details       malla · cofre lateral derecho, flejes de esquina, ganchos de cuerda
├── JIA_FrontSteer        empty · pivote (0, 0.85, 0.35): centro del eje delantero
│   ├── JIA_FrontAxle     malla · eje delantero, bolster, pivote (kingpin)
│   ├── JIA_Wheel_FL      malla · origen en el centro del buje (-0.76, 0.85, 0.35)
│   └── JIA_Wheel_FR      malla · origen en el centro del buje ( 0.76, 0.85, 0.35)
├── JIA_Wheel_RL          malla · origen en el centro del buje (-0.76, -0.85, 0.44)
└── JIA_Wheel_RR          malla · origen en el centro del buje ( 0.76, -0.85, 0.44)
```

Coordenadas anteriores en el convenio de autoría de Blender (§3). Izquierda/derecha se definen desde
el vehículo mirando hacia delante (FL = delantera izquierda = X negativa).

| Nodo | Controla | Eje y signo (Blender) | Rango probado |
|---|---|---|---|
| `JIA_Wagon_ROOT` | posición y rumbo del vehículo completo | traslación libre; rumbo = rotación Z | 360° (8 orientaciones renderizadas) |
| `JIA_BodyMotion` | balanceo sutil de caja + lona + pescante + detalles | roll = rot. Y, pitch = rot. X, sobre z = 0.72 | probado 2° / 1,5°: las ruedas no se mueven (no son hijas) |
| `JIA_FrontSteer` | giro conjunto del tren delantero (eje + dos ruedas) | rotación Z; positivo = giro a la izquierda | **±37° sin solapamiento nuevo**; a 38° la rueda toca los tablones. Rango útil recomendado ±30° |
| `JIA_Wheel_*` | giro de cada rueda | rotación sobre su **X local** | 360° sin desplazamiento del buje |

Escala de todos los nodos = (1, 1, 1); ninguna rotación residual en reposo. Sin constraints, drivers
ni animación en el GLB. Las ruedas izquierdas son mallas espejadas (tapa del buje hacia fuera), no
objetos con escala negativa.

## 2. Dimensiones (unidades = metros en Blender)

| Magnitud | Valor |
|---|---|
| Longitud total (Y) | 3,04 (de −1,42 fruncido trasero a +1,62 estribo) |
| Anchura total (X) | 1,78 (tapas de buje incluidas); lona 1,42; vía 1,52 |
| Altura total (Z) | 2,26 (cima de la lona) |
| Distancia entre ejes | **1,70** (eje delantero y = +0,85; trasero y = −0,85) |
| Radio rueda delantera / trasera | **0,35 / 0,44** (centros a esas alturas: las cuatro apoyan en Z = 0) |
| Anchura de llanta | 0,07 · buje 0,17 de largo (tapa exterior +0,045) |
| Plano inferior de la caja | z = 0,72 (pivote de `JIA_BodyMotion`) |
| Radio de giro mínimo (centro eje trasero) | R = L / tan δ → 2,94 a δ = 30°; 2,26 a δ = 37° |

Escala coherente y uniforme; el mapa deberá escalar el `ROOT` completo (nunca nodos internos).

## 3. Ejes: Blender vs GLB

Autoría en Blender: **+Y avance, +X derecha del vehículo, +Z arriba, suelo Z = 0**.

Exportación glTF con `export_yup=True`, verificada en el JSON del GLB (traslación de
`JIA_FrontSteer` = `[0, 0.35, -0.85]`, ruedas traseras `[±0.76, 0.44, 0.85]`):

| Concepto | Blender | glTF (fichero) |
|---|---|---|
| Derecha del vehículo | +X | +X |
| Arriba | +Z | +Y |
| Avance (frente) | +Y | **−Z** |
| Eje de giro de rueda | X local | X local |
| Eje de dirección (`JIA_FrontSteer`) | Z local | Y local |
| Eje de roll (`JIA_BodyMotion`) | Y local | Z local |

La conversión es una rotación (no un espejo): los signos se conservan. **Giro de rueda para avanzar
una distancia d:** ángulo sobre X local = **−d / r** (radianes) tanto en Blender como en glTF
(rotación positiva sobre X llevaría la parte superior de la rueda hacia atrás). **Giro a la
izquierda** = rotación positiva sobre el eje vertical en ambos sistemas.

No asumir que Spline (o cualquier importador) muestra estos ejes locales igual: comprobar tras la
importación con el signo de una rueda y del giro de dirección (§9).

## 4. Materiales (5, PBR Principled, sin texturas ni imágenes)

| Material | sRGB | Rugosidad | Metálico | Uso |
|---|---|---|---|---|
| `JIA_Wood_Honey` | `#C48B4F` | 0,72 | 0 | tablones, suelo, estribo, cofre |
| `JIA_Wood_Brown` | `#7B4A27` | 0,70 | 0 | estacas, barandas, ruedas, ejes, respaldo |
| `JIA_Canvas_Cream` | `#F7EDDB` | 0,88 | 0 | lona exterior |
| `JIA_Canvas_Shade` | `#D9C6A8` | 0,90 | 0 | cara interior y canto de la lona |
| `JIA_Iron_Dark` | `#2F1F14` | 0,55 | 0,35 | llantas, tapas de buje, flejes, ganchos, kingpin |

Paleta derivada de `assets/style/JIA_IDENTIDAD_VISUAL.md` (cobre mate / terracota profunda / tinta JIA /
marfil / pergamino), ajustada a la madera de la referencia. Sin iluminación horneada en el color base.
GLB sin extensiones (`extensionsUsed: []`, `extensionsRequired: []`), sin Draco/Meshopt/KTX2.

## 5. Geometría y presupuesto (medido)

| Métrica | Valor |
|---|---|
| Triángulos (GLB, índices) | **8 112** (objetivo 5 000–12 000) |
| Vértices exportados | 4 298 (antes de dividir por normales/materiales) |
| Objetos / mallas / primitivas glTF | 13 / 10 / **21** (una primitiva por par malla-material) |
| Materiales | 5 |
| Peso GLB | **313 516 bytes (0,31 MB)** · .blend 133 KB |
| Texturas | ninguna |

Por malla: Canvas 2 784 · Body 1 496 · Details 616 · ruedas 584 × 4 · FrontAxle 332 · Chassis 284 ·
DriverSeat 264. Las 21 primitivas son una cota superior de draw calls del asset; no es una medición
de navegador.

Bisel (modificador, ancho 6 mm) y Solidify de la lona (18 mm) se aplican **solo en la exportación**;
el .blend conserva la edición paramétrica.

## 6. Cámaras de revisión (en el .blend, NO en el GLB)

| Cámara | Tipo | Colocación | Uso |
|---|---|---|---|
| `JIA_Camera_Top` | ortográfica, escala 3,4 | (0, 0, 8), rotación (0, 0, 0): mira −Z; el frente (+Y) queda arriba de la imagen | **vista principal; activa al guardar** |
| `JIA_Camera_TopTilt` | ortográfica, escala 3,4 | inclinada 12° desde delante | alternativa con más volumen (no sustituye la cenital) |
| `JIA_Camera_Review` | perspectiva 50 mm | (4,0, 3,4, 2,6) mirando a (0, 0,05, 0,95) | tres cuartos frontal-derecha |

Iluminación: colección `JIA_Lighting_Warm` (sol cálido + área de relleno, render por defecto) y
`JIA_Lighting_Neutral` (sol blanco, desactivada en render). Plano de papel `JIA_TestGround` oculto,
solo para las pruebas de legibilidad. Nada de esto está bajo `JIA_Wagon_ROOT` ni en el GLB.

## 7. Contrato para el recorrido (fase siguiente; no implementado)

- **Recorrido separado del asset y configurable**: una curva (spline) en el espacio del mapa; los seis
  destinos son *marcas* sobre esa curva (parámetro o distancia acumulada), no sus puntos de control.
  El camino necesitará los puntos de control que exija su forma (curvas, bucle, retorno), que no
  tienen por qué ser seis.
- **Progreso por distancia**, no por parámetro: reparametrizar la curva por longitud de arco
  (tabla distancia→t) para que la velocidad sea uniforme entre tramos y las paradas sean reales.
- **Rumbo = tangente** de la curva en el punto actual. Aplicar como rotación (quaternion o
  `atan2(dx, dy)` con desenrollado) para evitar saltos al cruzar 0/360°.
- **Bucle / retorno**: la curva describe el círculo o la vuelta; la carreta nunca gira sobre sí
  misma. Un cambio de sentido brusco se resuelve con un lazo de radio ≥ radio de giro mínimo
  (§2, con δ útil ≤ 30° → R ≥ 2,9 en unidades del modelo, o 1,7 × longitud de eje).
- **Dirección**: `JIA_FrontSteer.rotZ = clamp(atan(L · κ), ±30°)` con κ la curvatura local, o
  simplemente proporcional al cambio de rumbo previsto; volver a 0 en recta.
- **Ruedas**: `θ_x = −Δs / r` acumulado (r = 0,35 delante, 0,44 detrás). Derivado de la distancia:
  con el vehículo parado la rueda no gira; en marcha atrás gira al revés.
- **Balanceo**: `JIA_BodyMotion` roll ±1–2° (rot. Y) con un seno lento ligado a la distancia
  recorrida, y pitch ±1° en arranques/paradas. Amplitud cero en reposo.
- **Paradas y reanudaciones** en cada destino: rampa de velocidad (ease) sobre la distancia, no sobre
  el parámetro t.

## 8. Dos vías de integración (decisión pendiente; no instalar nada ahora)

**A. Spline como escena y animación.** Importar el GLB en Spline v2, construir el mapa y el
recorrido allí (curva/estados/eventos) y publicar con el runtime de Spline; el control externo
(progreso por scroll o por destino) llegaría por variables/eventos expuestos por Spline. Las
animaciones creadas en Spline **no** se trasladan automáticamente a una exportación Three.js.

**B. GLB directo en Three.js.** Cargar `jia-carruaje.glb` con `GLTFLoader`, recuperar los nodos por
nombre (`getObjectByName('JIA_FrontSteer')`, etc.) e implementar recorrido, rumbo, ruedas y balanceo
en código siguiendo §7. GSAP puede gobernar tiempos y propiedades (progreso, easings de parada); no
sustituye al renderizador.

Restricción de maquetación recibida del promotor: el mapa vivirá dentro del `div#jornadas-mapa`
existente (`components/site/Jornadas.tsx`), debajo del párrafo introductorio, **sin ampliar la sección
en anchura ni altura y sin salir de la zona beis**. Ese panel es hoy una columna de texto de
`max-width: 40rem` con `align-content: center`; el mapa deberá caber en el hueco bajo el texto, con la
carreta legible a ~96–160 px de longitud (ver legibilidad en VALIDATION.md).

## 9. Pasos de importación pendientes en Spline (no ejecutados)

1. Importar `jia-carruaje.glb` (estándar, sin compresión) en una escena desechable.
2. Comprobar que llegan los 13 nodos con sus nombres y padres, y que los tres empties se conservan
   como grupos/transform (si Spline aplana empties vacíos, recrear los grupos y reparentar).
3. Verificar ejes y signos: girar `JIA_Wheel_FR` −90° sobre su X local → la parte superior avanza;
   girar `JIA_FrontSteer` +20° sobre el eje vertical → el tren delantero apunta a la izquierda.
4. Comprobar que los orígenes de rueda siguen en el centro del buje (Spline puede recentrar pivotes
   al importar: desactivarlo o corregirlo).
5. Revisar materiales (5 PBR, color + rugosidad; metálico solo en `JIA_Iron_Dark`) y que la cara
   interior de la lona se ve oscura a través de la abertura.
6. Escalar `JIA_Wagon_ROOT` al tamaño del mapa; nunca escalar hijos.
7. Decidir vía A o B y registrar la decisión en el output correspondiente.

## 10. Limitaciones conocidas

- Contraste de la lona sobre papel `#F1E7D8`: la lona es más clara que el fondo y se lee por su
  sombreado y por la madera; a 96 px la lectura depende de la sombra de contacto. Si en Spline se
  pierde, bajar ligeramente `JIA_Canvas_Cream` (p. ej. `#F0E2C8`) o añadir sombra de contacto suave.
- Rango de dirección ±37° geométrico; usar ≤ 30° para dejar holgura visual.
- `JIA_BodyMotion` balancea también el pescante y el cofre; los ejes no. Con roll > 3° el bolster
  trasero (chasis) se separa visiblemente del suelo de la caja.
- El GLB no incluye animaciones ni curvas de recorrido: cualquier movimiento debe crearse en la fase
  siguiente. Tampoco incluye sombra de contacto ni suelo.
- Sin LOD: a tamaños < 96 px conviene sustituir por un sprite o silueta.
- Reimportación correcta en Blender ≠ importación correcta en Spline (pendiente de prueba real).
