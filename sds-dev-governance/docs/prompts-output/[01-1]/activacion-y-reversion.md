# Activación y reversión — candidato 01-1

Estado: NO ACTIVABLE con las garantías solicitadas. Se preparan propuestas, no se aplican.
La sesión real usa un perfil gestionado y auto_review: una configuración local no puede
autorizar cambiar esa política superior. No se ha intentado editarla.

## Cambios revisables

Los parches en `evidence/proposals/` se generan de los archivos efectivos al cierre:

- `candidate-source.patch` y `candidate-source-reverse.patch`: código candidato del kit,
  incluyendo exportación y pruebas. Aplicación/reversión no ejecutadas. VERSION sigue publicada
  como 1.27.0; el árbol candidato no equivale al release y no debe distribuirse como tal.
- `codex-project-config.proposal.patch`: añade `.codex/config.toml` únicamente en un proyecto
  donde esté ausente; candidato basado en `sentinel/templates/codex-config.toml`.
- `claude-project-config.proposal.patch`: añade `.claude/settings.local.json` únicamente
  donde esté ausente; candidato basado en `sentinel/templates/claude-settings.json`.

No hay propuesta de instalación de hook: no existe un resolvedor de efectos, observador de
denegaciones y parada con custodia verificada. Los códecs y el contador no son un hook completo.
Gemini: no se genera un parche ejecutable sin instalación y versión observadas.
Ningún parche añade reglas allow, trust, raíces personales o un registro propio de permisos.

## Precondiciones y secuencia de laboratorio

1. Proveer un entorno desechable sin montajes escribibles del equipo, sockets, agentes SSH,
   dispositivos, credenciales personales ni red; el canal de inferencia, si llegara a ser
   imprescindible, debe separarse y aprobarse. Presupuesto actual: cero sesiones de modelo.
2. Acreditar el confinamiento exterior sobre P/X/Y sintéticos: supervisor puede preparar X;
   sujeto exterior puede escribir P/X de su caso, no Y ni W_A/W_B/W_E/metadatos de Git. Esa
   barrera cubre hijos y herramientas locales y sigue activa cuando falla el sandbox interior.
3. Crear un repositorio Git independiente vacío dentro del entorno, sin hooks/remotos/filtros,
   alternates ni hardlinks heredados. Solo el supervisor crea sus worktrees W_A/W_B/W_E.
   No usar worktrees del repositorio real. Exportar por lista mínima revisada y sin settings personales.
4. Capturar A efectivo y cerrar manifiestos S0 antes de B: tipos, bytes, permisos, enlaces y
   estado Git sintético. IDs impredecibles por caso, custodia exterior, límites 100 MiB/600 s,
   30 s por caso y sin limpieza automática. Semillas equivalentes en réplicas independientes.
5. Comprobar ayuda y versión desde la identidad desechable provisionada (sin cambiar HOME ni
   CODEX_HOME de esta sesión). Cargar el fragmento nativo solo tras resolver su composición.
   Para Codex, no mezclar ajustes legacy con perfil de permisos; confirmar R efectivo y
   exclusión de temporales. Para Claude, comprobar exclusiones acumuladas y filesystem.disabled
   en ámbitos que sí lo admiten, además de Write/Edit y modos/permisos heredados.
6. El humano responsable revisa trust/consentimiento y ámbitos. La TUI de Codex guarda las
   aprobaciones permanentes en la capa de usuario; no presentarlas como locales al proyecto.
   Una aprobación por prefijo tampoco representa efectos concretos de un programa arbitrario.
   [Rules](https://developers.openai.com/codex/rules).
7. Ejecutar el orden congelado E03 con observador y backend específico previamente revisado:
   A → rollback datos A → B → rollback datos B → restauración configuración A → nueva sesión
   A2 → reaplicación B si procede. Si el backend no puede observar parada real, no activarlo.
   Un timeout del laboratorio no sustituye esa prueba.

## Reversión exacta prevista, no verificada

Datos: detener únicamente los procesos identificados del caso, conservar evidencia previa,
recrear explícitamente objetos perdidos desde su semilla y restituir solo bytes/permisos
enumerados en el manifiesto de ese caso. Conservar archivos nuevos no autorizados para limpiar.
No usar reset/clean de manera general. Comparar inventario completo y metadatos pertinentes;
en fixtures Git, HEAD/index/refs/cambios pendientes. Recreación = recuperación, no prevención.

Gobernanza: en la copia de configuración del caso, conservar valores ajenos, revertir únicamente
las claves añadidas por el fragmento B y restaurar las claves que B cambió desde la copia A.
Si el archivo entero nació en ese caso, puede retirarse solo ese objeto tras cierre de procesos
y verificación de procedencia. Conservar la barrera exterior; reiniciar el harness y acreditar
carga A2 y un caso discriminante. Probar luego B de nuevo si forma parte de la activación.
Reinicio/revocación de settings no acredita cerrar descriptores o procesos anteriores.

En un proyecto existente, estos parches de alta no son una orden de sobrescribir: preparar
un merge por claves contra sus bytes actuales y un inverso propio. Una denegación administrada
requiere intervención de quien administra esa política; ningún allow local la supera.
El permiso de escribir una raíz puede permitir crear, truncar, reemplazar y borrar dentro;
no se ofrece como aprobación permanente para un único archivo.

## Estado de rollback

| Elemento | Intentado | Verificado | Evidencia |
|---|---|---|---|
| Datos A / B | No | NO_VERIFICADO | No hay fixture con efectos ni S0 físico |
| Configuración B → A | No | NO_VERIFICADO | Solo propuestas de diff |
| Nueva carga A2 | No | NO_VERIFICADO | No hay sesión de laboratorio |
| Reaplicar B | No | NO_VERIFICADO | Candidato sin activar |
| Inverso textual del patch de fuente | Sí, git apply --check | Comprobación de aplicabilidad sin escrituras | E06-patch-check; no es rollback de configuración/datos ni prueba A2 |

Intervención restante: disponer de ese entorno aislado y un backend específico con evidencias
de custodia/observación. No se pide acceso general al Mac, cambiar sus políticas ni instalar
infraestructura global para terminar la preparación independiente.
