# JIA-2026-09-19-38 — Informe

**Prompt:** `docs/prompts/JIA-2026-09-19-38-arbol-con-profundidad-metido-al-fondo-y-sds-dev-governance-v1-28-0-en-la-raiz.md`
**Fecha:** 2026-09-19 · **Rama:** `main` · **Push:** no realizado (no se ha pedido). También sin subir: JIA-37.

| Fase | Commit | Contenido |
|---|---|---|
| 0 | `08bdd97` | Prompt, elaborado a partir del mensaje del promotor. |
| 1 | `8f26a02` | `sds-dev-governance` v1.28.0 en la raíz de `web-jia`. |
| 2 | `118976b` | Profundidad del árbol + hojas de casi blanco a oliva (corrección en ejecución). |
| 3 | (este) | Informe y estado del prompt. |

## 1 · `sds-dev-governance` en la raíz de `web-jia`

- **Última versión: v1.28.0** (etiqueta → `3b19500` = `origin/main`). La copia del hub ya estaba en ese commit.
  `web-jia` **no tenía** el kit: se instaló con `init.sh "web-jia" … --mode project --files-only` (sin instaladores,
  red, Git ni configuración global). Código de salida 3 = «originales preservados», por el único conflicto previsto.
- **Verificado:** `diff -rq` contra el hub → idéntico (solo difieren los `__pycache__` del hub). 811 ficheros en git;
  lo único que git ignora del kit son **logs de evidencia** de sus propias releases (`*.log`, regla nuestra), nada funcional.
- **`.gitignore` fusionado a mano** (secretos, editores, restos de herramientas; se omitieron las líneas de pilas que el
  proyecto no tiene: Xcode, Gradle, Maven, CocoaPods). Ningún fichero existente fue sobrescrito.
- **Adaptadores** `CLAUDE.md` y `AGENTS.md` con repositorio, rama (`main`) y stack reales. `GEMINI.md` trae otra
  plantilla sin esos huecos: se dejó como viene.
- `tsconfig.json` excluye `sds-dev-governance` (hoy el kit no trae `.ts`; es una guarda). `tsc`, `check:content` y
  `next build`: ok con el kit dentro.
- **`./check-governance.sh`: 1 FAIL, falso positivo del propio kit v1.28.0** — «routing surfaces reference governance
  paths that do not exist»: `resources/index-of-resources-and-working-patters.md` cita, en una columna de su tabla,
  rutas cortas (`border-glow/INDEX-AND-HOW-TO-USE-THEM.md`…) relativas a cada patrón; las carpetas **existen**
  (`resources/frontend-patterns/ui-animations/border-glow`, etc.). No se ha tocado el kit: es para corregir **aguas
  arriba** en `sds-dev-governance`. El resto de comprobaciones, OK.
- Ninguna capacidad nueva admitida (skills, MCP): instalado no es autorizado.

## 2 · El árbol, «metido al fondo»

Alejar el árbol y agrandarlo a la vez da **la misma imagen** en perspectiva, así que la profundidad se construyó con
señales (opciones nuevas del componente, apagadas o neutras por defecto; valores del sitio en `experienciasTree`):

1. **Hojas que vienen hacia el espectador** (`fall.direction` con z positiva, `distance` 6,5): salen de la copa, al
   fondo, y crecen hasta pasar grandes en primer plano antes de desvanecerse.
2. **Ángulo abierto** (`fovDeg` 22 → 36, `elevationDeg` 6 → 9): el corro de rocas se abre en elipse y el suelo se ve
   alejarse. El encuadre ahora se ajusta sobre la **proyección real** de la caja del árbol (iterativo), exacto a
   cualquier ángulo.
3. **Velo de aire** (`haze`, color `--jia-vellum-3`, 0,3): el lado lejano de la copa más pálido que el cercano.
4. **Sombra alargada hacia nosotros** (`shadow.depth` 1,9): dibuja el suelo sobre el que el árbol está lejos.

Efecto colateral deseado: la base sube ≈ 55 px en pantalla (en un suelo que se aleja, más lejos = más alto) y delante
queda suelo con sombra, que llega hasta la foto siguiente. El texto sigue libre a 1920, 1788 y 1440.

**Corrección en ejecución — color de las hojas:** del casi blanco de arriba (`--jia-tree-cream`) al oliva de la casa
(`--jia-olive`, #72715b), con `leaves.heightTone` (nuevo) para que el blanco quede arriba. **El lila original está
guardado como comentario**, con la explicación y cómo recuperarlo, en `lib/content/sections/experiencias.ts` y en
`app/theme/palette.css` (los tres tokens lila, comentados).

**Verificación:** `tsc`, `check:content`, `next build` ok; Chrome por CDP a 1920, 1788 y 1440 (`scrollWidth =
clientWidth`); tres fotogramas distintos de la secuencia; movimiento reducido sin hojas en el aire; `tree-3d` sigue
importando solo `react` y `three`. Evidencias en `evidence/`.

## Riesgos

**Críticos / graves:** ninguno.

**Moderados**
1. **Adaptadores nuevos en la raíz** (`CLAUDE.md`, `AGENTS.md`…): cambian lo que cargan los agentes al abrir
   `web-jia` (leerán la gobernanza del kit). Es lo buscado, pero la primera sesión nueva conviene vigilarla.
2. **Las memorias de `docs/memory/*.md` son plantillas vacías**: hasta rellenarlas, el «mapa de memoria» del adaptador
   no aporta contexto real. *Propuesta:* un encargo corto para volcar en `frontend.md` lo aprendido (paleta, contenido,
   componentes 3D, flujo de prompts).
3. **Borradores legales** en `docs/web-jia-policies/` (cookies, privacidad, términos): son plantillas del kit, **no
   texto revisado**; no publicar sin revisión.
4. **Profundidad = percepción:** validar en la pantalla del promotor. Palancas: `fall.direction[2]`/`distance` (hojas en
   primer plano), `haze.amount`, `camera.fovDeg`.
5. **Rendimiento** sigue sin medir en GPU real (hojas más grandes en primer plano = algo más de relleno).

**Menores:** FAIL aguas arriba del kit (arriba); la base del árbol ya no «toca» la foto siguiente: lo hace su sombra.
