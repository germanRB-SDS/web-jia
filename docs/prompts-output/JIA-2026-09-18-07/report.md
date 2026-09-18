# JIA-2026-09-18-07 — Carreta western cubierta en Blender (asset 3D para el mapa de Jornadas)

**Prompt:** `docs/prompts/JIA-2026-09-18-07-carruaje-3d-blender.md` · **Fecha:** 2026-09-18 · **Agente:** Claude Code ·
**Rol:** Technical Artist / ingeniero de gráficos en tiempo real · **Estado:** IMPLEMENTADO (fase Blender; Spline pendiente por alcance) ·
**Nivel:** LEVEL 2 (asset + scripts, sin cambios en la aplicación) · tmp/scratch: N/A (ejecución en una sesión; evidencia en `assets/3d/carruaje/previews/`).

## Resumen

| Punto | Qué se ha hecho | Dónde |
|---|---|---|
| Entorno | Raíz real `web-jia`; referencia `assets/images-website/carruaje.png`; paleta de `assets/style/JIA_IDENTIDAD_VISUAL.md`. Blender 5.2.1 LTS por **CLI** (`bpy`, background): el MCP de Blender está admitido solo en el hub «sin admisión heredada a hijos», así que no se ha usado. Fichero nuevo; sin tocar escenas ni preferencias del usuario. | — |
| Modelo | Carreta con caja de tablones y estacas, lona arqueada con 4 arcos y abertura delantera fruncida, pescante (estribo + cajón + respaldo), cofre lateral, 4 ruedas de 12 radios (0,35 delante / 0,44 detrás), ejes, bolsters y varal. 5 materiales PBR sin texturas. | `assets/3d/carruaje/jia-carruaje.blend` |
| Jerarquía | Contrato exacto del prompt: `JIA_Wagon_ROOT` › `JIA_Chassis`, `JIA_BodyMotion` (Body, Canvas, DriverSeat, Details), `JIA_FrontSteer` (FrontAxle, Wheel_FL/FR), `Wheel_RL/RR`. Pivotes: ROOT en el suelo entre ejes; BodyMotion en el plano inferior de la caja; FrontSteer en el centro del eje delantero; ruedas en el centro del buje, giro sobre X local. | `.blend` y `.glb` |
| Exportación | GLB estándar (sin Draco/Meshopt/KTX2, sin extensiones, sin cámaras/luces/suelo/animación), Y-up: frente Blender +Y → glTF −Z. | `assets/3d/carruaje/jia-carruaje.glb` |
| Cámaras | `JIA_Camera_Top` (ortográfica, cenital estricta, frente arriba, **activa al guardar**), `JIA_Camera_TopTilt` (12°), `JIA_Camera_Review` (3/4). Luz cálida de presentación + colección neutra de revisión. | `.blend` |
| Scripts | Generador reproducible con comprobación de rutas, config JSON centralizada y validador independiente. | `generate-carruaje.py`, `carruaje-config.json`, `validate-carruaje.py` |
| Previews | Cenital, cenital inclinada, 3/4 (cálida y neutra), legibilidad 96/160/256 px sobre papel, hoja de 8 orientaciones, evidencias de dirección/balanceo y vista inferior. PNG con alfa. | `assets/3d/carruaje/previews/` |
| Docs | Handoff (jerarquía, ejes, escala, radios, cámaras, materiales, contrato de recorrido, vías A/B, pasos Spline, limitaciones) y validación. | `HANDOFF-SPLINE.md`, `VALIDATION.md` |
| Prompt | Input del promotor guardado íntegro como prompt, con sus adendas (ubicación del mapa en `#jornadas-mapa`). | `docs/prompts/JIA-2026-09-18-07-carruaje-3d-blender.md` |

## Métricas

8 112 triángulos · 13 objetos / 10 mallas / 21 primitivas / 5 materiales · GLB 313 516 bytes (0,31 MB) ·
3,04 × 1,78 × 2,26 · distancia entre ejes 1,70 · vía 1,52.

## Verificación

Ejecutadas (todas PASS, detalle en `assets/3d/carruaje/VALIDATION.md`): apertura del .blend con cámara
cenital activa; reimportación del GLB en escena vacía con jerarquía idéntica; nombres únicos; pivotes de
rueda; giro 360° de cada rueda sin orbitar; dirección ±37° sin solapamientos nuevos (BVH); raíz 360°;
cuatro ruedas en z = 0; balanceo sin levantar ruedas; normales/manifold/materiales; GLB sin elementos
de presentación; legibilidad a 96/160/256 px; pose de reposo restaurada.
**No ejecutada:** importación en Spline v2 (fuera del alcance; pendiente de prueba real).

## Riesgos

- **Moderado:** la lona es más clara que el papel de la web; a 96 px la lectura depende de la sombra de
  contacto. Solución: probar en Spline y, si hace falta, bajar el tono de `JIA_Canvas_Cream` en
  `carruaje-config.json` (un cambio de color, regenerar).
- **Moderado:** Spline puede aplanar los empties vacíos o recentrar pivotes al importar. Solución: checklist §9 del
  handoff; recrear grupos y reparentar si ocurre.
- **Moderado:** el hueco disponible bajo el texto de `#jornadas-mapa` no está medido; el mapa con seis destinos y
  una carreta legible (≥ 96 px) puede no caber sin cambiar el layout, que el promotor ha pedido no ampliar.
  Solución: decisión de diseño en la fase del mapa (escala de mapa, o carreta como sprite a tamaños pequeños).
- **Severo:** ninguno nuevo. **Crítico:** ninguno nuevo (sin cambios en la aplicación, sin dependencias, sin secretos).

## Siguiente paso

Importar `jia-carruaje.glb` en una escena desechable de Spline v2 y ejecutar la checklist §9 del
handoff; después decidir vía A (Spline runtime) o B (GLB en Three.js) y abrir el prompt del mapa.
