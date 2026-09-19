# Texto para pedir a Claude una revisión independiente

Copiar el siguiente bloque en una sesión de Claude situada en la raíz de este proyecto:

```text
Haz un preflight de desarrollo, sin ejecutar el prompt objetivo:
docs/prompts/[01-2-alpha]sentinel-guard-local-macos.md

Usa GOVERNANCE.md → practices/INDEX.md y la plantilla existente
scaffold/docs/prompts/prompt-revision-preflight.md, con su router sibling
scaffold/docs/prompts/preflight-module-index.md. En este checkout los equivalentes
materializados de docs/prompts/ no existen; usa las fuentes reales del scaffold,
resolviendo sus referencias en esa carpeta. No generes duplicados ni cargues frontend.

Lee el informe docs/prompts-output/[01-2]preparacion-guard-local.md y comprueba
los archivos/evidencias que sostienen sus afirmaciones. Revisa también el diff
aislado de instalación HOME: docs/prompts-output/[01-2]/evidence/home-location.patch.
El guard propuesto todavía no existe. Las 24 pruebas de 01-1 son puras; las
pruebas de ubicación de 01-2 no verifican Seatbelt ni protección de borrados.

Objetivo: un comando/script local en el Mac que impida borrados fuera del
proyecto con prácticamente cero tokens de supervisión. No un vigilante LLM,
ni VM como requisito diario, ni un nuevo motor de permisos.

Revisa especialmente: herencia real y herramientas externas; IPC/GUI/helpers;
enlaces, hardlinks, rename y truncado; caches/arranque sin ampliar HOME;
fallo de sandbox sin fallback; custodia de perfil/script; protección de
instalación antes de cualquier escritura; regresión sin perder cambios;
atribución A/B y control positivo; datos reales de tokens frente a hipótesis;
tramo 10–15% sin autorización automática y parada desde 15%; compatibilidad
del laboratorio con las políticas vigentes. No sugieras eludir el fallo 71.

Entrega hallazgos críticos/severos/moderados con archivo/línea, corrección
concreta, viabilidad del enfoque y veredicto listo/condicionado/no viable.
Distingue revisión de preparación y ejecución de guard, todavía pendiente.
Puedes guardar solo el informe en docs/prompts-output/[01-2]preflight.md
(o la siguiente variante numerada si ya existe). No edites código, prompt,
política, configuración ni paquetes de regresión; no ejecutes pruebas con
efectos ni sesiones de modelos, no hagas commits ni actives nada.
```

Tras corregir el prompt con esa revisión, el propietario podrá encargar su ejecución
explícitamente. Para auditar una ejecución posterior, pedir a Claude que contraste
`docs/prompts-output/[01-2]ejecucion-guard-local.md` y sus datos con los criterios del
prompt, sin reejecutar el experimento ni convertir métricas ausentes en resultados.
