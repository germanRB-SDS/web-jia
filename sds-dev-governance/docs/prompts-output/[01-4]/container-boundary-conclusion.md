# Sentinel — conclusión sobre contenedores de proyectos

Conclusión de la conversación, guardada el 2026-09-13. Diseño acordado para continuar;
no implementado ni activado. El propietario hará clear y avisará antes de implementar.

## Regla a llevar al diseño

La presencia de sds-dev-governance/ no concede permisos sobre toda su carpeta padre.
Si esa carpeta contiene uno o más descendientes con su propio sds-dev-governance/,
no se permite convertir el conjunto en un único ámbito de escritura o borrado. Cada
proyecto conserva su frontera. MAC-DEV-PROJECTS es un contenedor, no un proyecto.

La detección de kits anidados es una señal conservadora de frontera, no una prueba
única de clasificación: un monorepo también puede tener kits anidados. La ambigüedad
o una inspección incompleta nunca amplían permisos. La ausencia de otros kits tampoco
concede automáticamente autoridad sobre el padre. La raíz de proyecto se declara y
verifica por una política custodiada, no mediante un prompt, cwd o variable manipulable.

Incluso dentro de un proyecto válido, permiso de edición no autoriza borrar su raíz,
el kit, Sentinel ni sus protecciones. Fuera del proyecto, incluidos ancestros y hermanos,
se deniegan mutaciones del agente. Los procesos/herramientas no confinados quedan fuera
de cualquier garantía: el diseño debe resolver todos los canales de escritura.

## Recomendación comunicativa, nunca orden de borrado

Mensaje propuesto:

> Se han detectado varios proyectos con gobernanza propia bajo esta carpeta. El kit
> situado en el contenedor no habilita permisos sobre ellos. Se recomienda revisar su
> ubicación y, si es el repositorio de desarrollo del kit, alojarlo dentro de un proyecto
> dedicado. No se moverá ni eliminará automáticamente.

La protección debe funcionar aunque el kit del contenedor permanezca ahí. Retirarlo
o reubicarlo es una recomendación de organización; no es una condición de seguridad
ni una acción delegada al agente por esta conversación. No mover el repositorio actual.

## Aplicación al laboratorio y continuidad

Conservar las 62 definiciones y resultados históricos. Futuros ensayos de contenedores,
raíces, proyectos hermanos y autoprotección usarán exclusivamente árboles sintéticos
dentro de test-a/test-b; nunca ataques al contenedor, a otros proyectos o al kit reales.
Un prompt con supuesto permiso no cambia la política. STOP y memoria siguen siendo
refuerzo, no sustitutos de la barrera local con custodia independiente.

[Propuesta local completa](local-protection-proposal.md).
[Definiciones 1.md–62.md y 1-test–62-test](evidence/local-protection-design/README.md).
[Continuación vigente](tmp/RETOMAR-SENTINEL.md).
