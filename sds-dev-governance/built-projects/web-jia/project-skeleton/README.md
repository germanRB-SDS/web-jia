# Esqueleto y referencia reconstruible

[reference/](reference/) conserva el código real, lockfile, medios derivados de public y fuentes Blender
seleccionadas de web-jia. Es una referencia histórica con contenido JIA, no una aplicación activa de
la gobernanza. Tiene hashes en [source-manifest.json](../metainfo/source-manifest.json).

## Arranque en una carpeta de trabajo independiente

Copiar **el contenido de reference/** a la carpeta del proyecto de destino; no ejecutar builds dentro
del kit distribuido. La copia añade `.nvmrc` (24.19.0), `.gitignore` y declaraciones next-env mínimas;
el resto de archivos del manifiesto conserva los bytes originales.

```bash
source "$HOME/.nvm/nvm.sh" && nvm use
npm ci
npm run typecheck
npm run check:content
npm run build
npm run dev
```

Node24.19.0 debe estar disponible. `npm ci` necesita registro/cache; next/font necesita las fuentes
en su build/cache. No se promete reconstrucción sin red desde una máquina vacía. Los medios de la
página y las 14 capturas sí están preservados localmente. El build genera `out/`; `dev` es solo preview.
No ejecutar `npm run assets` en esta referencia: los derivados ya existen y los originales pesados
no están incluidos. Se conserva el script como receta. `lint` es un script heredado no usado como gate;
los checks autoritativos de esta entrega son TypeScript, contenido y build.

## Mapa de archivos iniciales

| Ruta en reference | Responsabilidad |
|---|---|
| `app/page.tsx` | Composición ordenada; punto inicial para seleccionar secciones. |
| `app/layout.tsx`, `app/globals.css`, `app/theme/palette.css` | Fuentes, metadata, wrappers, tokens, reset y motion global. |
| `app/almeria-2026/page.tsx` | Alias de edición; reemplazar o retirar al cambiar negocio. |
| `lib/content/index.ts`, `assemble.ts` | Entrada única y ensamblaje de datos + diccionarios + medios. |
| `lib/content/data/`, `sections/`, `site.ts` | Entidades, relaciones, configuración y negocio. |
| `lib/content/copy/`, `languages/` | Textos/aria por idioma; registro ES. |
| `lib/content/media.ts`, `public/` | Registro de imagen/ratio/focal y archivos servidos. |
| `components/site/`, `primitives/` | Secciones compuestas y piezas compartidas. |
| `components/cube-carousel/`, `tilt-card/`, `flip-card/` | Motores y CSS de interacción. |
| `lib/motion/` | Política local y limpieza de recursos. |
| `assets/3d/` | Fuentes de carruaje/herradura y sus generadores/configuración. |
| `scripts/check-content.ts` | Relaciones, claves y medios; no reemplaza QA visual. |
| `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig*.json` | Dependencias y build real de referencia. |

## Dos formas de reutilizar

**Modelo completo:** partir de esta base y seguir [COMPOSITION](COMPOSITION.md) para seleccionar
bloques, actualizar constantes/copy/media/identidad, volver a validar y sustituir assets JIA.

**Una pieza:** comenzar por [web-components](../web-components/INDEX.md). Cubo, película y
colaboradores tienen exports neutros probados en resources; para los demás hay fuente íntegra y
contratos de extracción. No copiar solo un TSX olvidando estilos, tipos, soporte y assets.

El snapshot no recibe fixes silenciosos: una evolución del modelo requiere nueva procedencia y
validación. El código vivo sigue perteneciendo al proyecto web-jia.
