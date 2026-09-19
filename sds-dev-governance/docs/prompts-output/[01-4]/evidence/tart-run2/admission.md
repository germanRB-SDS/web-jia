# Admisión exacta de laboratorio Tart — 2026-09-13

Owner: propietario del repositorio, autorización explícita de continuar tras instalar Tart y
ejecutar laboratorio/métricas. Solo este KIT y almacén nuevo `/private/tmp/sds-sentinel-tart-KoUNwE`.
No admite Sentinel en uso ordinario ni proveedores MCP. El plano supervisor puede construir el
laboratorio; el sujeto queda restringido a la VM tras demostrar S0.

Tart2.37.0 instalado por openai/tools; binary SHA256
4bb842d1c9284c1c9cb56f017dde916dfce6995ef9844913d5af89ea54126df7.
Receipt tap HEAD9df0601f09dcafd260bf1e667486e9839bc486b9; archivo distribución
SHA256d531752c4dad5d4214ac7ff540cefc2647df1fca2338d413d3c01754f54b356b en fórmula local.
Firma: codesign --verify --strict devuelve0/valid on disk mediante escalación solo lectura
aprobada; error inicial en sandbox se conserva como diferencia de contexto, no binario corrupto.

Modo: public_manifest anónimo → clone imagen pública fijada por digest → arranque offline sin
shares/clipboard/audio/TTY → inspección administrativa via virtio → stop exacto propio.
Nada de push/login/delete/prune, modificar SUID o firewall global. Descarga máxima planificada
según manifest, comprobar capacidad antes de clone. Tiempo1800s provisión/7200s VM son límites
de recursos del piloto, no SLA, aceptación de rendimiento ni tamaño estadístico.

| Gate | Resultado y evidencia |
|---|---|
| G1 efectos | PASS_WITH_CONSTRAINTS: solo archivos nuevos en almacén dedicado, VM propia y descarga pública autorizada; no publicación |
| G2 autoridad/E | PASS_WITH_CONSTRAINTS: Tart no declara S7; evidencia host fuera del invitado, observador/sujeto separados antes de payloads |
| G3 persistencia | PASS_WITH_CONSTRAINTS: no settings de agentes/adapters/globales; TART_HOME nuevo, no HOME; sin auto-prune, E fuera storage/tmp |
| G4 colisión | PASS: helper llamado softnet solo en PATH de invocación está documentado como sumidero propio, no producto Softnet ni B Sentinel |
| G5 técnica/datos | PASS_WITH_CONSTRAINTS para provisión/validación: firma/hash, fuente tag2.37.0 inspeccionada, entorno mínimo sin TRACEPARENT. Credenciales registry par vacío presente precede Docker/Keychain y evita consultarlos. No invitados con datos/credenciales reales; sumidero AF_UNIX recibe/descarta, tests2/2 y revisión independiente de arquitectura |
| G6 reversión | PASS_WITH_CONSTRAINTS: stop solo nombre propio; dejar imágenes/evidencia identificadas, sin borrar árbol ajeno. Quitar modo de laboratorio no afecta gobernanza ni contratos |

Fuentes inspected: tarball oficial tag2.37.0; Config.swift, Root.swift, OTel.swift,
Credentials/EnvironmentCredentialsProvider.swift, DockerConfigCredentialsProvider.swift,
OCI/Registry.swift, Network/Softnet.swift, VM.swift, Commands/Run.swift, Clone.swift, Exec.swift.
No ejecutar payloads hasta acreditar la barrera con controles sintéticos. Los tests2/2 son del
sumidero Unix; no demuestran todavía la conexión efectiva de la NIC ni protección Sentinel.
Semántica del par registry vacío verificada por fuente; consulta anónima real debe funcionar
antes de descargar. Si falla, no recurrir a credenciales personales.

Fuentes propias iniciales: net_sink.py SHA25671302955eec293de05f72b13c991bf2545bcde16304a8affad0390cd69291176;
tart_host.py SHA25661a1fc6f8007a70801a8800c5d51c23db4a872e746b659e739ce305eb3ec8c3b;
public_registry.py SHA256884686e16235633be280f5e679a04e936ad281318e52c5b6c67a6fc4c372dd3a;
wrapper temporal SHA256a12a38fa3af38356edce28a404f1e1b388e070a4169bc1cd7d07eab19a53d321.
Cambios futuros reabren gates afectados y registran revisión antes de uso.

Revisión de modo G1/G3/G5: ghcr rechaza Basic vacío (403); petición pública sin
Authorization devuelve token anónimo (200). Se admite mirror efímero GET en 127.0.0.1,
puerto asignado por SO, solo manifest/digests de imagen fijada, sin escrituras remotas,
sin credenciales personales. Tart usa --insecure únicamente contra ese loopback y el
mirror usa HTTPS upstream. Se cierra antes del arranque. Errores de hash/transporte
invalidan clone aunque Tart devolviese0. No fallback a Docker/Keychain.
Imagen sha256:1b093499716409d29e8b5336844528e1cae375db97d2ad8e5aeff78cf0da201e;
capas comprimidas27312483923 bytes; disponible previo157397552 KiB. Recursos del piloto,
no métricas de protección. Dos tests del sumidero repetidos PASS (0.501s).

## Reapertura posterior: arranque BLOQUEADO

Clone ya iniciado con hashes anteriores; descarga pública puede terminar, sin arranque.
Fuente Registry.swift tag2.37.0: lookupCredentials solo ocurre tras HTTP401 y challenge;
mirror no emite401. Proxies ambientales consultados solo por nombres de esquema: lista vacía.
No hay evidencia de consulta a credenciales personales en ese flujo; la conclusión de no
lookup procede de código, no de trazado de Keychain.

Candidato posterior (no habilita arranque): tart_host.py
SHA25675d14c47b2d8aaab612ee12ba7d305be72d4932a50ed8ef20c51fee5f714cb43;
public_registry.py SHA256330439ae41b779c777531804adedf6ba568fd81051a36db360948bd447b696f0.
Elimina filtro registry hostname, desactiva proxies upstream, verifica sumidero/wrapper/Python,
captura16MiB por invocación y conserva10GiB libres; grupo propio TERM/KILL al finalizar.
Intérprete Python efectivo SHA256b502cb4c5b46b8d4192ec6bcb600ce8922f1afc396fcf646e8765c6eba74a0bf.
Estos son presupuestos preventivos del supervisor, no tolerancias de eficacia/rendimiento.

G6/S0 BLOQUEADO: tests supervisor3 PASS/2 ERROR en cada uno de dos contextos solicitados
(restringido y escalación aprobada). os.killpg devuelve EPERM; causa profunda desconocida.
No lanzar VM ni corpus hasta disponer de contexto expresamente autorizado y probar control
de ciclo de vida. No usar otro ejecutor automáticamente para obtener el efecto denegado.
El propietario recibe un test sintético para su Terminal: un resultado allí será evidencia
de OTRO contexto, no borrará los errores de esta sesión ni acreditará S0 por sí solo.

Revisión final de cierre seguro: tart_host.py
SHA256c23c0f2d68ebd58d861931dc2521c2bab739698276a4e700c82ad81ccafa2d16.
`run` devuelve78 ANTES de lanzar procesos o crear estado. Ningún flag permite omitirlo.
Mantiene funciones candidatas para revisión y prueba, no autorización de boot.
