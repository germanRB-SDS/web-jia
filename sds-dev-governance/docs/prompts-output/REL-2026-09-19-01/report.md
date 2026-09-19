# REL-2026-09-19-01 — web-components, tree-3d y reestructura de knowledge

**Versión:** v1.29.0 · **Fecha:** 2026-09-19 · **Origen:** petición del owner en una sesión de proyecto (incubadora):
auditar el árbol 3D validado, exportarlo al Kit con su how-to, mover el how-to de Android a `knowledge/android/`,
documentar y publicar como versión nueva.

## Resumen

1. **Categoría nueva `resources/web-components/`** — componentes completos y validados promocionados desde un
   proyecto: fuente que funciona en `component/` (se copia sin cambios; sin imports de proyecto ni colores de sitio),
   integración validada en `integration/` (para mapear, no pegar) y un `INDEX-AND-HOW-TO-USE-THEM.md` con
   procedimiento para el agente y lista de aceptación. Indexada en el índice único de recursos.
2. **Primera hoja `tree-3d`** — árbol 3D procedural animado con Three.js (sin modelo, vídeo ni GSAP). Incluye wrapper
   React, `mount-tree.ts` sin framework, demo `vanilla/` sin build (renderizada y comprobada), `AUDIT.md` (ficheros
   de origen, constantes de color, opciones, decisiones y descartes) y tres capturas.
3. **`knowledge/` publicado y reestructurado** — la guía de release Android/Google Play pasa de `resources/how-to/` a
   `knowledge/android/how-to-release-an-app/` (contenido intacto, `git mv`), con `knowledge/android/README.md`; el
   índice de recursos y el catálogo de prompts P00–P13 apuntan a la ruta nueva. Se publican también
   `knowledge/README.md`, la receta imagen→SVG y la de iOS/HealthKit, que existían sin seguimiento en el canónico y
   que el README de knowledge ya enlazaba.
4. **Arreglo del checker** — `routing_ref_resolves` usaba `printf … | grep -q` con `pipefail`; en copias con muchos
   ficheros el `printf` moría por SIGPIPE y cuatro referencias válidas se daban por inexistentes. Here-strings.

## Verificación

Checker sobre fixture `--files-only`: 639 OK, 0 FAIL. Suites heredadas verdes; dos notas de entorno, ambas ajenas
al cambio y detalladas en `evidence/README.md` (`tomllib` exige Python ≥ 3.11; un test de timeout sensible al tiempo).

## Riesgos

- **Moderado:** `tree-3d` es código fuente dentro del Kit y envejece con los *majors* de Three.js (demo fijada a
  0.186). Recuperación: retirar la hoja y su fila del índice.
- **Moderado:** se publica material de `knowledge/` que estaba sin seguimiento en el canónico (nombra proyectos de
  origen, como ya hacen otros recursos). El repositorio es privado; si alguna receta no debía publicarse, revertir
  ese fichero.
- **Menor:** la copa de las capturas procede de una web de cliente; se recortó la fotografía del sitio.
- Severos: ninguno. Críticos: ninguno.

## Propuestas

Añadir al checker una puerta para `web-components` (que `component/` no importe nada fuera de la hoja); un test
offline que compile `vanilla/js` desde `component/` para detectar deriva; distribuir v1.29.0 a las copias.
