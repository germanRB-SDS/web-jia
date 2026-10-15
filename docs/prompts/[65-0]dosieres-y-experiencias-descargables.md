# [65-0] Dosieres de talleres, experiencias de éxito descargables y tres tarjetas nuevas del cubo

- Fecha: 2026-10-15 · Rama: `main` · LEVEL 2 (UI + contenido, sin backend/auth)
- Áreas: `frontend` (`docs/memory/frontend.md`)
- Prácticas: 05, 06, 12, 14, 16 · skill Impeccable (ubicación del botón en la ficha)
- Salida: `docs/prompts-output/[65-0]/report.md` (+ `evidence/`)

## Entrada del promotor (resumen fiel)

1. Comprobar que tres tarjetas «Wanted · Asesora CEP» (Yolanda García, Ana I. García, Eli Iglesias) están en el cubo.
   Llegan como `assets/cube-staff-final/28 (1).png`, `29 (1).png`, `30 (1).png` (el nombre no cuenta).
2. TALLERES, en orden de izquierda a derecha: «Por un puñado de bloques», «Dos renders y un destino»,
   «El bueno, el feo… y el plano», «Siete legos para siete planos», «La profe que pintó a Liberty Valance»,
   «La muerte tenía un micro». Todas las imágenes con texto alternativo.
3. Copiar al sitio los seis dosieres didácticos (PDF) para que el enlace «dosier» de cada taller descargue el suyo.
4. En la ficha emergente de cada taller (clic/tap en la imagen) añadir un botón «Dosier» con flecha hacia abajo,
   colocado donde mejor quede (Impeccable), con su PDF.
5. Sección Experiencias: título «Experiencias de éxito»; entradilla «Aquí puedes descargar las experiencias de éxito
   (pulsando en la imagen correspondiente) que ya han pasado por el aula. Probadas a tiza. Reconocidas hasta en
   (Mini)Hollywood.»
6. En el visor emergente de cada cartel del rollo: degradado de abajo arriba, de color sólido a transparente, hasta
   el 40 % de la imagen, y un botón centrado abajo «Descargar» con el PDF de esa persona (correlación por nombre).
7. Commit antes de empezar, commit por fases y commit al terminar.

## Originales (commiteados tal cual antes de empezar)

- `assets/cube-staff-final/28 (1).png`, `29 (1).png`, `30 (1).png`.
- `assets/dosieres-didacticos/*.pdf` (numeración distinta a la del promotor; bytes idénticos a los de `~/Downloads`).
- `assets/experiencias-exito-pdf/*.pdf` (copiados de `~/Downloads`).

## Fases

- **F1 · Cubo.** Las tres tarjetas pasan a ser las 59-61 del cubo (renombradas desde «(1)»), con sus WebP y su
  persona en `lib/content/data/people.ts` (rol «Asesora CEP»).
- **F2 · Dosieres.** PDFs a `public/talleres/dosieres/`, rutas en `lib/content/config/talleres.ts`; enlace con
  descarga real; botón «Dosier ↓» en la ficha del taller. Alt de los carteles comprobado.
- **F3 · Experiencias.** Copia nueva en `lib/content/copy/`; PDFs a `public/experiencias/descargas/`, ruta por cartel en
  `lib/content/sections/experiencias.ts`; degradado + botón «Descargar» en `ReelViewer`.
- **Cierre.** `tsc`, `npm run check:content`, `next build`, captura en navegador a 1440 y 390 px; informe y commit.

## Restricciones

Textos solo en `lib/content/copy/`; colores solo con tokens de `app/theme/palette.css`; commits con rutas explícitas;
no se sube a `origin` sin confirmación.
