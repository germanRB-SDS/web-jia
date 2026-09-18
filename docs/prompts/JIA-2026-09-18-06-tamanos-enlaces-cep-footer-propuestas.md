# JIA-2026-09-18-06 — Tamaños de etiquetas, enlaces a los CEP, distintivo como fondo del pie, Propuestas con título/subtítulo y columna visual

**Fecha:** 2026-09-18 · **Origen:** sexta ronda del promotor. Imagen aportada: cámara acorazada con libros JIA (columna visual de Propuestas).

## Encargo (transcripción del promotor)

1. Detectar en CSS la clase del texto «Organiza y colabora» y hacerla siempre 2 puntos relativos más
   grande. «Organiza» y «Colabora» (las etiquetas debajo) igual: +2 puntos relativos a su clase.
2. Footer: «CEP de Almería» enlaza a `https://www.juntadeandalucia.es/educacion/portales/web/cep-almeria`;
   «CEP de El Ejido» a `https://www.juntadeandalucia.es/educacion/portales/web/cep-ejido/datos-del-cep`;
   «CEP de Cuevas Olula» pasa a **«CEP de Cuevas-Olula»** y enlaza a
   `https://www.juntadeandalucia.es/educacion/portales/web/cep-cuevas-olula`.
3. Footer: el distintivo circular, en vez de pequeño, difuminado y fundido con el fondo en la esquina
   inferior derecha, ampliado ×4 o ×5 como fondo del pie, con un 60–65 % del círculo visible; que
   /impeccable valore el resultado.
4. En el párrafo «Las Jornadas de Innovación de Almería las organizan el CEP de Almería…», cada nombre
   de CEP enlaza a su URL.
5. Propuestas: el título pasa a «Tu propuesta JIA» (tamaño título). Crear, si no existe, una clase
   **subtítulo** (más pequeña que el título, mayor que el párrafo) para «Tu propuesta puede formar parte
   de las JIA», debajo del título. La mitad izquierda se mantiene; la mitad derecha pasa a ser una
   columna visual con la fotografía aportada.
6. Guardar el prompt, commit, ejecutar, commit y push.

## Decisiones de ejecución

- «2 puntos relativos» se interpreta como +0,125 rem sobre el valor actual de cada clase
  (`Partners .kicker` 0,75 → 0,875 rem; `Partners .groupLabel` 0,6875 → 0,8125 rem).
- Las URL de los CEP viven una sola vez en `lib/content/data/organizations.ts`; el párrafo de Socios se
  compone con marcadores `{cep-almeria}` etc. que se resuelven a enlaces desde los mismos datos.
- Subtítulo: nueva clase compartida `Section .subtitle` (Alegreya, itálica, `--t-subtitle`
  ≈ 1,375–1,75 rem), disponible para cualquier sección vía la prop `subtitle`.
- Propuestas: columna visual = fotografía en tarjeta a sangre por la derecha con velo Duna muy suave
  en el borde que toca el texto; sin brújula.

## Salida

`docs/prompts-output/JIA-2026-09-18-06/report.md`
