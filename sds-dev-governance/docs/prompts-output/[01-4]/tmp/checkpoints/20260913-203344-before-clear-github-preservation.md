# Sentinel — estado final antes de clear, preservación local y GitHub

Fecha UTC: 2026-09-13T20:33:44.412584+00:00. Rama: main. HEAD: 79aa7ffce2563e0e3abc189b19054187daf1a43d.
Worktree dirty previo preservado; cambios de esta fase exclusivamente documentales.
Sin implementación, VM, comandos destructivos, acceso GitHub, credenciales o permisos
nuevos. No host commits/checkout/reset/stash.

## Pausa indicada por el propietario

Guardar ahora; el propietario hará clear y avisará para implementar después. No tratar
la lectura de este checkpoint como ese aviso. Mantener autorización sin preguntas
genéricas cuando llegue la instrucción explícita de continuación. No mover/borrar el kit.

## Leer al retomar

1. [Conclusión GitHub refinada](../../github-preservation-conclusion.md).
2. [Conclusión de contenedores](../../container-boundary-conclusion.md).
3. [Propuesta local](../../local-protection-proposal.md).
4. [Estado completo anterior](20260913-203155-before-clear-container-boundary.md).
5. [62 definiciones y comandos](../../evidence/local-protection-design/README.md).

## Refinamiento que no debe perderse

Codex/Claude/Gemini y delegados no borran GitHub. Creación solo en ámbito autorizado;
no interpretar creación como permiso implícito de sobrescritura/actualización ni admitir
un push mixto sin analizar todos sus efectos. No borrar repos, ramas, tags, archivos,
releases/assets, artefactos ni otros recursos; no force-push ni debilitar protecciones.
Si hace falta borrar, pedir actuación MANUAL al usuario explicando motivo, owner/repo,
rama/ref o N/A, tipo y nombre/ruta/ID exactos, impacto y alternativas. No ejecutar después
por recibir una confirmación en chat. No ha ocurrido borrado: prevención, no incidente.

La regla de no borrado ya existe en kernel/práctica 07. Objetivo nuevo: garantizarla
técnicamente en todos los canales con custodia independiente y permisos mínimos.
La barrera local no gobierna GitHub. No asumir que un token de escritura sea create-only
ni que rulesets de rama impidan borrar el repo. Evaluar git/gh/API/MCP/navegador/workflows
y delegados; pruebas destructivas mediante dobles locales, nunca recursos GitHub reales.
Lectura/verificación admitida permitida. Ninguna capacidad o excepción admitida ahora.

## Estado local conservado

MAC-DEV-PROJECTS es contenedor, no P. Kits descendientes impiden ampliar permisos al
padre; ambigüedad/monorepos se clasifican conservadoramente. Recomendar revisar ubicación
del kit como mensaje, sin moverlo. Proteger exterior, raíz, kit y Sentinel; memoria con
historia y política no modificable por texto del agente. Custodia independiente del
servicio/configuración y canales de escritura, no chmod como garantía.

62 N-test existentes 0644; 62 N.md definidos por bytes/SHA/rutas, no materializados.
test-a/test-b ausentes; último cierre VM detenida, sin nueva inspección guest. Futuras
cargas solo a objetos sintéticos dentro de ambas carpetas, incluso exterior/kit falsos.
Anterior A/B de plantilla perdió 62/62 por condición: 41 borrados, 21 alterados, 0 intactos,
0 % mejora; NO_GO del candidato. Fallos/persistencia/cierre adicional y bundle preservados.
Sin modelos ensayados, API ni gasto extra. <8 % ideal, ≥8 y <40 % admitido anotando,
≥40 % fuera de ampliación. Coste inconcluso, versión publicada v1.27.0.

## Siguiente paso

Esperar aviso tras clear. Entonces concretar diseño técnico de custodia y confinamiento,
incorporar frontera de contenedores y regla GitHub, sin afirmaciones de protección antes
de validar. Avanzar lo autorizado independientemente; no solicitar secretos o presupuesto
genérico. Mantener separación entre pruebas locales, modelo, remoto y parada del agente.
Últimos archivos: github-preservation-conclusion.md, local-protection-proposal.md y
RETOMAR-SENTINEL.md. Todo el checkpoint anterior permanece vigente salvo este añadido.

## Addendum previo al clear: pipe/fork sentinel-gh

Propietario propone vigilar gh por stdin/PID o proceso paralelo. Guardado como posible
segunda capa de contención; no garantía de impedir solicitudes ya enviadas. El diseño
principal recibe solicitudes estructuradas antes de ejecutar/enviar, rechaza el primer
borrado, valida lotes y cuerpos, custodia credenciales y elimina rutas alternativas.
`gh … | sentinel-gh` recibe stdout cuando gh ya corre; no usarlo como puerta preventiva.
Wrappers gh-safe.sh y git-safe-push.sh solo inspeccionados, no ejecutados o modificados;
no afirmar custodia/cobertura completa. Pruebas futuras con doble local y métrica cero
despachos destructivos; nunca borrados reales en GitHub. Sigue pendiente aviso tras clear.
