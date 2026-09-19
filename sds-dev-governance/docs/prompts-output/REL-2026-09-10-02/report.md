# REL-2026-09-10-02 — Gobernanza MCP y preparación Hostinger

## 0. Metadata

2026-09-10. Codex; arquitectura, seguridad y release. LEVEL 3, high-risk.
Fase A implementada; encargo global PARCIAL. Base v1.26.0, `1dab87c`;
checkpoint `4b1d5a9`; implementación `bcdec45`; v1.27.0 preparada para publicar.
Publicación e instalación posteriores se verifican en la Fase B del hub.

## 1. Objetivo

Petición expresa del propietario: ejecutar el metaprompt Hostinger, publicar primero la
gobernanza portable y después instalar los cinco módulos para Codex y Claude Code.
Áreas security/deployment. Sin memoria técnica canónica aplicable. El prompt original
permanece en el hub; su referencia privada de credencial no se copia al kit.

## 2. Resumen de fase

Se implementa inventario offline, check/doctor, staging atómico recuperable, instalador de
versión fija, gateway cerrado y controles de custodia/lotes probados con fixtures.
**No se entrega acceso real seguro a Hostinger.** Falta custodia independiente, transporte
real admitido y canal humano auténtico. El gateway no abre credenciales ni ejecuta proveedores.
Reiniciar sólo recarga configuración; no resuelve esas carencias.

Se reutiliza el ledger existente; el inventario no admite. Otros modos MCP ya admitidos
conservan sus controles específicos. No se declara protección global ni se migra ningún producto.
La regla GitHub manual-owner-only permanece intacta, incluso ante dos confirmaciones.

## 3. Ficheros y sincronización

[Cambios por fichero](../../governance/governance-change-log.md),
[33 hashes de implementación](evidence/implementation-manifest.json).
`mcp/` posee tooling/perfil/lock; `scripts/sds-mcp` es el entrypoint. Práctica 07 posee
la regla completa; INDEX, admisión 11, skills y adapters sólo enrutan. Checker exige
la hoja completa; README/VERSION/CHANGELOG documentan la versión.

N/A: kernel ya enruta seguridad; init.sh ya copia el kit completo; nested adapters heredan
raíz; scaffold ledger sigue vacío; no copias de otros proyectos ni cambios UI/API/BBDD.

## 4. Matriz de requisito e impacto

| Requisito | Carencia / resultado | Evidencia |
|---|---|---|
| Admisión | Practice 11 ya existía; ledger único conservado | Registry y módulos |
| Inventario | Nuevo; UTC first-seen, fecha histórica desconocida, scopes separados | Tests de observación/overrides |
| Control | Hostinger sólo expone estado local; demás métodos denegados | MCP stdio y canales negativos |
| Custodia | Parser ficticio; aislamiento real no establecido | Tests de permisos/formato/links |
| Lotes | Dos eventos sintéticos exactos, no canal humano real | Forja/replay/expiry/concurrencia |
| Clientes | Codex/Claude fixtures; Gemini ausente | Staging, segundo proyecto y recuperación |
| Distribución | Hoja portable opcional; sin activación en bootstrap | Checkers proyecto/hub |

Linaje: config → parser → inventario → estado restrictivo del ledger → salida mínima;
MCP → perfil cerrado → estado/denegación; lote → política/precondiciones → fuente humana
sintética → proveedor sintético/journal → resultado. Ninguna ruta alcanza un producto real.

## 5. BBDD

N/A. Inventario/backups: escritura atómica local y lock. Journal de lotes en memoria,
exclusivamente para simulación; no duradero ni protegido contra un agente del mismo usuario.

## 6. API y procedencia

VERIFICADO 2026-09-10: @hostinger/mcp 1.58.0; source revision
`27e3b104a90c2292f178cbf2d251ab731aeabee1`; Node >=20. Tooling fija Node 24.19.0 ya instalado,
sin alterar productos. Lock con 131 dependencias, integridad y origen npm; sin lifecycle
install scripts. Tarball cotejado con SRI, 32 archivos JS/JSON fijados. Publisher observado:
GitHub Actions; referencia de provenance presente, firma no verificada criptográficamente.
Ambos nombres npm apuntan al repo oficial y versión 1.58.0; digests distintos. Sólo se
selecciona el paquete con scope. Catálogos: hosting 64, domains 40, DNS 8, Reach 52, VPS 64.
Esos hashes/conteos no admiten individualmente herramientas ni permisos.

Runtime upstream revisado: OAuth fallback, dotenv, base URL/cabeceras configurables,
operaciones compuestas, respuestas amplias y errores sin proyección SDS. No se lanza
directamente ni recibe el token. Cuenta, recursos, permisos y caducidad: POR_CONFIRMAR.

Fuentes: [Hostinger](https://github.com/hostinger/api-mcp-server),
[npm fijado](https://registry.npmjs.org/@hostinger/mcp/1.58.0),
[Codex MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli),
[Claude MCP](https://code.claude.com/docs/en/mcp),
[Gemini policy](https://geminicli.com/docs/reference/policy-engine/).
Clientes locales contrastados: Codex 0.153.4, Claude Code 2.1.267; Gemini no instalado.

## 7. Verificación

Verification: V4 | [acceptance](evidence/acceptance.json) | PASS.
21 grupos canónicos; suites heredadas y bootstrap/clasificador/lector/frescura en Bash
3.2/5.3, checkers proyecto/hub y MCP. Suite MCP: 21 tests. Fixture de instalación:
dos ejecuciones sin duplicados, conservación/recuperación y rechazo de archivo alterado.
AST, bash -n, diff --check y lock audit PASS. Fallos de presupuesto 3064/3007 conservados;
corregidos hasta 3000/3000 sin aumentar el límite. Últimos cambios de referencias reutilizan
evidencia sin delta y repiten suite MCP/fixture afectados.

Cubierto: cero/una/dos confirmaciones sintéticas, eventos duplicados, forja en argumentos,
replay/nonce, cambio de scope/política/schema, servidor mixto según argumentos, precondiciones,
ocho retries concurrentes, timeout reconciliado/desconocido, canaria en éxito/error,
parser/links/modos, idempotencia/configs/overrides y canales MCP. No prueba exfiltración universal.

NO VERIFICADO: token/API real, aislamiento OS/memoria/proceso, canal humano, journal duradero,
shell/API/SSH alternativos, flags/IDE/Desktop/conectores remotos y ciertos plugins indirectos.
No se simula un PASS de esas garantías. Bootstrap no instala globalmente ni auto-admite.

## 8. Resultado y gates

G1 efectos acotados; G2 sin auto-admisión; G3 persistencia explícita recuperable; G4 ledger
único; G5 origen/bytes/entrada/salida comprobados para offline, UNKNOWN para acceso real;
G6 retirada opcional sin pérdida de contratos. Tooling offline ADMITTED_WITH_CONSTRAINTS;
proveedor real QUARANTINED. No se crea PR/MR ni se firma una auditoría humana por el owner:
su sign-off es N/A a la publicación main/tag expresamente autorizada. Auditoría técnica de
todos los archivos, API/imports, pruebas, límites y linaje contrastada con bytes staged;
wrappers existentes sin ampliar. No se fabrica firma para satisfacer un checker de PR.

## 9. E2E

- [x] Gobernanza, bootstrap, ledger, fixtures de clientes y gateway coherentes.
- [x] Pruebas negativas, recuperación y concurrencia; cero efectos del proveedor.
- [ ] Custodia independiente y canal humano reales: bloqueados.
- [ ] Sesiones reales tras reinicio y conexión Hostinger: no verificadas en Fase A.

## 10. Riesgos y soluciones

**Críticos nuevos detectados:** ninguno en las rutas cerradas publicadas. El gateway no
contiene red, spawn de proveedor, extracción ni switch para habilitar efectos. Esto no
certifica un futuro broker que añada esas funciones.

**Severo: aislamiento ausente.** 0600, wrapper o daemon del mismo usuario no bastan.
Solución pendiente: identidad de servicio separada o sandbox verificado, código/política/
credencial/proceso protegidos, transporte mínimo e integración/admisión probados. Requiere
intervención local del propietario y trabajo de continuación; no sólo reiniciar o enabled=true.

**Severo: canal humano/journal duradero ausentes.** Solución pendiente: canal auténtico
independiente y persistencia protegida antes de efectos reales. Destrucción permanece bloqueada.

**Moderado: cobertura parcial de clientes.** Doctor informa incertidumbre; los modos
previos conservan sus gates, sin declarar protección global ni deshabilitarlos por inferencia.

**Moderado: concurrencia de configuradores.** Lock/CAS cubren cooperadores; no son una
transacción indivisible frente a todo editor ni aislamiento. Backups y restore exigen hash
esperado; cambios ajenos necesitan reconciliación.

**Moderado: supply chain/API variables.** Pin/SRI no prueban confianza total. Sin scripts,
token ni lanzamiento upstream; reevaluar revisión/catalog/schema/permisos antes de activar.

## 11. Memoria y consumo

Tmp/evidence consolidados aquí. No se duplican reglas en memoria de producto. Métrica
sintética de 21 muestras: frío 38.633 ms; caliente mediana 38.703 ms/p95 39.148 ms;
stdout 143 bytes, stderr 0. No tokens medidos, factura LLM ni servicios de pago activados.

## 12. Continuidad y recuperación

Siguiente: publicar/verificar main y tag v1.27.0 con wrappers; después instalar y configurar
ambos clientes globalmente. Recibos/inventario privado fuera del canónico; Fase B en el hub.
Uso cotidiano: `sds-mcp inventory --compact`. Solicitud: «Prepara el lote exacto de esta
operación para revisión». Aún no hay operaciones reales ni canal para aprobar su ejecución.

Recuperación: `sds-mcp restore --receipt <recibo-local>` sólo si el archivo no cambió;
source mediante forward fix/revert revisado. Sin eliminar recursos, refs ni evidencia.
