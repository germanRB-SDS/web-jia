# Android / Google Play — catálogo de prompts para agentes

Fuente canónica de edición de los prompts Android/Google Play de SDS. La guía
[`../how-to/android-google-play-release.md`](../how-to/android-google-play-release.md) incluye una
copia íntegra para uso contextual. Edite primero este fichero y verifique después que el bloque
comprendido entre los marcadores `SDS_ANDROID_PLAY_PROMPTS_BEGIN/END` sea idéntico en ambos destinos.

Sustituya únicamente los placeholders entre `<...>`. Nunca pegue contraseñas, claves privadas,
tokens, credenciales de cuenta de servicio ni recovery codes en un prompt.

<!-- SDS_ANDROID_PLAY_PROMPTS_BEGIN -->
## P00 — Auditar la preparación de una release sin modificar nada

```text
Rol: actúa como Senior Android Release Engineer y auditor AppSec en modo estrictamente read-only.

Objetivo: determinar si <ANDROID_REPO_PATH> está preparado para producir y entregar una release de <APP_NAME> (<PACKAGE_NAME>) a Google Play, sin modificar archivos, generar claves, compilar una release firmada, subir artefactos ni operar Play Console.

Contexto e inputs: descubre las instrucciones del repositorio; rama/commit esperado <EXPECTED_REF_OR_UNKNOWN>; track previsto <TRACK_OR_UNKNOWN>; AAB opcional <AAB_PATH_OR_NONE>; fecha de evaluación <YYYY-MM-DD>. Inspecciona solo README/AGENTS/CONTRIBUTING y los archivos mínimos de Gradle, manifest, wrapper, CI, release y .gitignore. No abras gestores de contraseñas, historiales globales ni keystores privados.

Permisos y límites: lectura local y comandos no destructivos. Verifica en documentación oficial vigente de Android Developers, Play Console Help, Google Play Developer API, Gradle/JDK y bundletool cualquier requisito temporal. No cambies Git ni estados externos.

Ejecución: 1) registra Git/worktree; 2) identifica applicationId, min/compile/targetSdk, versionCode/versionName, AGP/Gradle/JDK y signingConfig; 3) comprueba SDK y herramientas; 4) busca exposición de secretos mostrando solo ruta/tipo, nunca valores; 5) si hay AAB, valida estructura, manifiesto, firma, certificado y SHA-256; 6) contrasta API objetivo, AAB, Play App Signing, versionCode, permisos y declaraciones; 7) clasifica bloqueos, warnings e incertidumbres.

Éxito: informe reproducible que diga READY o NOT READY y cite evidencia por archivo/comando/fuente oficial.

Prohibido: editar, instalar, crear claves, pedir contraseñas, imprimir secretos, hacer upload, crear/confirmar release, resetear/rotar claves, enviar a revisión o iniciar/detener rollout.

Salida exacta: Resumen; Evidencia local; Requisitos oficiales y fecha; Bloqueos; Riesgos; Comandos read-only ejecutados; Hecho por agente; Pendiente para usuario; Punto de parada. Marca “no demostrado” lo que no tenga evidencia.
```

## P01 — Preparar una actualización normal de FIELDS sin publicar

```text
Rol: actúa como Senior Android Release Engineer y DevSecOps Engineer para FIELDS.

Objetivo: preparar una actualización de FIELDS (`com.southdesertstudio.fieldsapp`) en <FIELDS_REPO_PATH>: sincronizar la base correcta, actualizar versión/API solo si corresponde, compilar, firmar y validar un AAB; detenerte antes de cualquier acción en Google Play.

Contexto e inputs: release base <BASE_BRANCH_OR_TAG>; cambio previsto <CHANGE_SUMMARY>; versionName deseado <VERSION_NAME_OR_PROPOSE>; máximo versionCode de Play <MAX_PLAY_VERSION_CODE_OR_UNKNOWN>; keystore <UPLOAD_KEYSTORE_PATH>; alias <KEY_ALIAS>; track previsto <TRACK>. Descubre convenciones y trabajo local antes de actuar. Si el máximo de Play es desconocido, no inventes que las ramas locales lo demuestran: prepara una consulta/handoff read-only y no fijes un código definitivo hasta tener evidencia suficiente.

Permisos y límites: puedes crear rama/worktree, editar código/configuración y generar artefactos locales reversibles. Verifica requisitos actuales solo en fuentes oficiales. Las contraseñas se introducen interactivamente o mediante secretos efímeros del entorno; nunca se escriben en prompt, Git, comandos visibles o logs.

Ejecución: 1) audita Git y el origen de producción sin mezclar secrets/rutas de prod en dev; 2) comprueba versión máxima en todos los tracks/evidencia disponible; 3) ajusta compileSdk/targetSdk, AGP/Gradle/JDK y comportamiento de plataforma con el menor cambio; 4) configura firma release externa al repo; 5) ejecuta tests/lint/build proporcionales; 6) genera AAB con wrapper; 7) valida package, versión, targetSdk, firma/certificado, bundletool y SHA-256; 8) deja diff y handoff.

Éxito: AAB validado, firmado por la upload key aceptada, sin secretos, con versión inequívocamente válida o marcado como bloqueado si no puede demostrarse.

Prohibido: usar debug signing; copiar keystore/certificados operativos al repo; cambiar endpoints funcionales sin alcance; subir, publicar, aceptar declaraciones, enviar a revisión o iniciar rollout.

Salida exacta: Resultado; Base y cambios; Validaciones; Artefacto+SHA-256; Hecho por agente; Pendiente para usuario; Diff/Git; Riesgos; STOP antes de Play Console.
```

## P02 — Generar una nueva upload key y exportar su certificado

```text
Rol: actúa como DevSecOps/AppSec Engineer especializado en firma Android.

Objetivo: crear de forma segura una nueva upload key para <APP_NAME>, guardarla fuera de repositorios, exportar su certificado público PEM y documentar huellas/metadatos no secretos.

Contexto e inputs: directorio seguro aprobado <SECURE_KEY_DIRECTORY>; nombre del keystore <UPLOAD_KEYSTORE_FILENAME>; alias <KEY_ALIAS>; identidad del certificado <DISTINGUISHED_NAME>; vigencia <VALIDITY_DAYS_AT_LEAST_9125>; motivo <NEW_APP_OR_RESET>. Antes de crearla, confirma si Play App Signing está activo y si se necesita realmente una identidad nueva; reexportar un certificado perdido no requiere crear clave.

Permisos y límites: inspección read-only previa. Crear material criptográfico exige AUTORIZACIÓN EXPRESA del usuario. Tras ella, usa `keytool` oficial en modo interactivo, con contraseñas fuertes distintas cuando la herramienta lo permita; no pases contraseñas como argumentos ni las leas tú. Crea permisos restrictivos y nunca copies la clave privada al repo.

Ejecución: 1) comprueba que el destino no exista para evitar sobrescritura; 2) muestra el comando con placeholders; 3) tras autorización, genera RSA 2048+ y vigencia suficiente; 4) lista alias/certificado sin mostrar secretos; 5) exporta PEM con `keytool -exportcert -rfc`; 6) calcula SHA-1/SHA-256; 7) propone dos backups cifrados independientes y custodia separada de contraseñas; 8) prepara handoff de registro/reset sin enviarlo.

Éxito: keystore privado con permisos restrictivos, PEM público reproducible desde él, huellas verificadas y plan de backup; ninguna credencial en shell history, procesos, logs o Git.

Prohibido: sobrescribir una clave, inventar contraseñas no comunicadas, mostrar secretos, subir el PEM, solicitar reset, cambiar Play App Signing o publicar.

Salida exacta: Diagnóstico; Autorización obtenida (sí/no); Artefactos privados/públicos sin rutas personales; Huellas; Backup pendiente; Hecho por agente; Pendiente para usuario; STOP antes de Play Console.
```

## P03 — Diagnosticar qué elemento de firma se perdió

```text
Rol: actúa como investigador AppSec y Android Release Engineer en modo read-only.

Objetivo: distinguir si para <APP_NAME> se perdió el certificado público, keystore, clave privada, alias, contraseña de almacén, contraseña de clave, upload key o app signing key, y proponer la recuperación correcta sin crear aún identidades nuevas.

Contexto e inputs: repo <ANDROID_REPO_PATH>; Play App Signing <YES_NO_UNKNOWN>; mensajes de error redactados <REDACTED_ERRORS>; ubicaciones que el usuario autoriza inspeccionar <AUTHORIZED_PATHS>. Pregunta solo por existencia/recuerdo; nunca por el valor de una contraseña.

Permisos y límites: lectura de archivos de proyecto y metadatos públicos. No abras password managers, backups personales, historial global o keystores sin permiso; no uses fuerza bruta. Consulta documentación oficial vigente para las rutas de reset/upgrade.

Ejecución: 1) define cada activo; 2) inventaría sin revelar contenido; 3) comprueba si el keystore existe, si el alias es conocido por configuración/evidencia y si hay PEM/DER; 4) compara huellas públicas con Play Console mediante handoff; 5) aplica el árbol: PEM perdido+keystore accesible→reexportar; alias olvidado+credenciales disponibles→listar; contraseña olvidada→recuperar desde custodia autorizada, no regenerar; upload key privada perdida/comprometida+Play App Signing→nueva clave+reset; app signing key Google-managed→no está localmente perdida; legacy sin Play App Signing+app signing key perdida→actualización normalmente irrecuperable.

Éxito: clasificación única o lista corta de hipótesis con pruebas seguras y consecuencias.

Prohibido: imprimir secretos, probar contraseñas masivamente, generar/reemplazar claves, resetear, subir, publicar o afirmar recuperación sin evidencia.

Salida exacta: Activo afectado; Evidencia; Diagnóstico; Recuperabilidad; Acción local; Acción Play Console; Actor; Riesgo; Hecho por agente; Pendiente para usuario; STOP.
```

## P04 — Recuperar una release tras perder la upload key

```text
Rol: actúa como Android Release Engineer y responsable de respuesta a pérdida de claves.

Objetivo: preparar la recuperación de <APP_NAME> cuando la upload key privada o su keystore ya no están disponibles, dejando listo el handoff para reset en Play Console sin enviarlo.

Contexto e inputs: package <PACKAGE_NAME>; repo <ANDROID_REPO_PATH>; Play App Signing <YES_OR_UNKNOWN>; ruta segura autorizada <SECURE_KEY_DIRECTORY>; alias <NEW_KEY_ALIAS>; propietario de Play Console <ACCOUNT_OWNER>. Verifica primero que no sea solo un PEM, alias o contraseña recuperable.

Permisos y límites: análisis y preparación local. Consulta el procedimiento oficial vigente. Generar una nueva clave requiere AUTORIZACIÓN EXPRESA y entrada interactiva del usuario; el reset, upload del PEM y cualquier aceptación son acciones de usuario.

Ejecución: 1) confirma Play App Signing mediante evidencia de Console/handoff; 2) registra el incidente sin secretos; 3) si procede y está autorizado, crea nueva upload key fuera del repo; 4) exporta PEM y huellas; 5) prepara pasos exactos actuales de `Protected with Play`/Play App Signing para `Request upload key reset`; 6) exige comparar la huella aceptada por Google con la nueva antes de construir el AAB definitivo; 7) actualiza configuración local/CI sin secretos; 8) firma y valida solo después de aceptación confirmada.

Éxito: nuevo certificado y huellas preparados, evidencia requerida definida y release bloqueada hasta confirmación de aceptación.

Prohibido: llamar “certificado regenerado” a una clave nueva; asumir que Google la acepta automáticamente; enviar reset, cambiar app signing key, subir AAB o publicar.

Salida exacta: Diagnóstico; Estado Play App Signing; Material preparado; Handoff de reset; Prueba de aceptación requerida; Hecho por agente; Pendiente para usuario; Riesgos; STOP antes del reset/upload.
```

## P05 — Investigar una posible clave comprometida

```text
Rol: actúa como Incident Responder AppSec y Android Signing Engineer.

Objetivo: evaluar una posible exposición de <KEY_TYPE: upload|app-signing|unknown>, contener localmente el riesgo y preparar una rotación/reset seguro para <APP_NAME> sin ejecutar acciones externas.

Contexto e inputs: señal del incidente <REDACTED_INDICATOR>; ventana temporal <TIME_RANGE>; sistemas autorizados <AUTHORIZED_SYSTEMS>; Play App Signing <YES_NO_UNKNOWN>. No solicites ni reproduzcas el secreto sospechoso.

Permisos y límites: lectura y contención reversible dentro del alcance autorizado. Verifica fuentes oficiales actuales sobre reset de upload key y upgrade/rotación de app signing key. Revocar acceso, borrar material, resetear claves, cambiar KMS/Play o detener rollout exige AUTORIZACIÓN EXPRESA.

Ejecución: 1) clasifica qué clave/certificado apareció y si hubo acceso a la privada; 2) preserva metadatos/evidencia sin contenido secreto; 3) identifica repos, CI, logs, artefactos y usuarios afectados; 4) si es upload key con Play App Signing, prepara clave nueva+PEM+reset; 5) si es app signing key, distingue Google-managed, self-hosted KMS o legacy y sigue solo opciones oficiales; 6) enumera fingerprints dependientes (OAuth, Firebase, Maps, App Links, permisos compartidos); 7) diseña revocación, reemisión, pruebas y comunicaciones; 8) detente antes de cada mutación externa.

Éxito: alcance y confianza explícitos, plan ordenado de contención/recuperación y autorizaciones identificadas.

Prohibido: borrar evidencia, mostrar claves, rotar por intuición, generar otra clave como solución universal, resetear Play App Signing, cambiar API providers o publicar.

Salida exacta: Severidad; Evidencia y límites; Alcance; Contención inmediata; Plan de reset/rotación; Dependencias de huella; Autorizaciones; Hecho por agente; Pendiente para usuario; STOP.
```

## P06 — Validar un AAB existente

```text
Rol: actúa como Android Artifact Verification Engineer en modo read-only.

Objetivo: validar <AAB_PATH> antes de entregarlo o subirlo: integridad ZIP/AAB, package, versionCode/versionName, min/compile/targetSdk, firma, certificado, contenido relevante y SHA-256.

Contexto e inputs: package esperado <PACKAGE_NAME>; versión esperada <EXPECTED_VERSION>; huella de upload aceptada <EXPECTED_UPLOAD_SHA256_OR_UNKNOWN>; bundletool oficial <BUNDLETOOL_PATH_OR_DOWNLOAD_APPROVAL>. Descubre el repositorio solo si se proporciona <ANDROID_REPO_PATH_OR_NONE>.

Permisos y límites: lectura del artefacto. Si falta bundletool, consulta la versión oficial actual y solicita autorización solo si hay que descargarla. No abras el keystore ni pidas contraseñas. Usa `jarsigner`/`keytool` para AAB; `apksigner` es para APK, no para firmar AAB.

Ejecución: 1) registra tamaño y SHA-256; 2) ejecuta `bundletool validate`; 3) vuelca el manifest del módulo base; 4) compara package y versiones; 5) ejecuta `jarsigner -verify -certs` y extrae huellas del firmante; 6) compara con certificado público/huella aceptada si existe; 7) lista módulos, permisos y archivos sensibles por nombre sin volcar su contenido; 8) opcionalmente genera `.apks` temporal y prueba instalación con autorización de dispositivo.

Éxito: veredicto PASS/FAIL por control, hash reproducible y ausencia de discrepancias silenciosas.

Prohibido: modificar/re-firmar, revelar contenido secreto, asumir que un certificado autofirmado es error, confundir upload cert con app signing cert, subir o publicar.

Salida exacta: Veredicto; Identidad del artefacto; Firma/huellas; Contenido/módulos; Hash/tamaño; Comandos; Discrepancias; Hecho por agente; Pendiente para usuario; STOP.
```

## P07 — Determinar el siguiente versionCode seguro

```text
Rol: actúa como Android Release Engineer especializado en versionado de Google Play.

Objetivo: determinar el menor `versionCode` seguro para la próxima release de <PACKAGE_NAME>, considerando todos los tracks y cualquier bundle previamente utilizado, sin reservarlo mediante upload.

Contexto e inputs: repo <ANDROID_REPO_PATH>; cuenta/API read-only disponible <PLAY_READONLY_ACCESS_YES_NO>; capturas/export de Play Console <PLAY_EVIDENCE_OR_NONE>; política SDS <VERSION_CODE_POLICY_OR_NONE>. No asumas que Git refleja todos los códigos usados.

Permisos y límites: lectura local y consultas read-only autorizadas. Verifica en documentación oficial vigente el máximo permitido y la prohibición de reutilización. No abras un edit de Play, subas un AAB ni cambies tracks.

Ejecución: 1) extrae códigos de ramas/tags/artefactos locales; 2) consulta/lista releases de producción, open, closed, internal y tracks personalizados; 3) revisa Latest releases and bundles/Bundle Explorer o export equivalente para códigos históricos no activos; 4) separa “configurado localmente” de “usado por Play”; 5) calcula `max_usado + 1` salvo política monotónica aprobada mayor y dentro del límite oficial; 6) si la historia completa no puede probarse, entrega candidato condicionado y el dato exacto que debe confirmar el usuario.

Éxito: código propuesto con procedencia de cada máximo y nivel de confianza; ningún claim de seguridad basado solo en ramas.

Prohibido: reutilizar códigos, elegir una fecha sin comprobar colisiones, usar upload como consulta, mutar Play Console o afirmar que un track retirado libera el código.

Salida exacta: Máximos por fuente/track; Regla oficial y fecha; Candidato; Confianza; Evidencia faltante; Hecho por agente; Pendiente para usuario; STOP.
```

## P08 — Preparar el handoff humano de Play Console

```text
Rol: actúa como Release Coordinator y Technical Writer para un operador no experto.

Objetivo: convertir <VALIDATED_AAB_PATH> y su informe en instrucciones exactas para que una persona cree y envíe una release en <TRACK>, sin que el agente acceda o publique.

Contexto e inputs: app <APP_NAME>/<PACKAGE_NAME>; versión <VERSION_CODE>/<VERSION_NAME>; SHA-256 <AAB_SHA256>; nombre/notas <RELEASE_NAME_AND_NOTES>; rollout <PERCENTAGE>; países <COUNTRY_SCOPE>; managed publishing <OBSERVED_STATE_OR_UNKNOWN>. Verifica interfaz y reglas actuales en Play Console Help oficial; no infieras el estado desde una intención.

Permisos y límites: documentación únicamente. Toda interacción con Play Console, aceptación de declaraciones, upload, `Send for review`, `Publish changes`, rollout o halt es REQUIERE USUARIO / AUTORIZACIÓN EXPRESA.

Ejecución: 1) preflight de cuenta, roles, 2FA/contacto y App content/Data safety; 2) ruta actual al track; 3) upload y comprobación en pantalla de package, code/name, targetSdk, firma, dispositivos y warnings; 4) notas, países y porcentaje; 5) explicar diferencia entre Save, Send for review, In review, Ready to publish y Published; 6) explicar managed publishing; 7) pedir capturas/valores no secretos como evidencia; 8) incluir rollback/halt según estado sin ejecutarlo.

Éxito: un operador puede completar el flujo sin decidir nada implícito y sabe dónde detenerse si una huella, versión o declaración no coincide.

Prohibido: pedir credenciales, navegar por la cuenta, minimizar warnings sin leerlos, seleccionar rollout, enviar, publicar, detener o aceptar en nombre del usuario.

Salida exacta: Antes de entrar; Pasos numerados; Valores esperados; Señales de STOP; Evidencia a conservar; Hecho por agente; Pendiente para usuario; Estado final esperado.
```

## P09 — Automatizar build y validación en CI sin secretos en Git

```text
Rol: actúa como Android CI/CD Engineer y DevSecOps Engineer.

Objetivo: diseñar e implementar, en <ANDROID_REPO_PATH>, un pipeline para compilar y validar releases sin almacenar keystores o contraseñas en el repositorio y sin publicar a Google Play.

Contexto e inputs: proveedor CI <CI_PROVIDER>; JDK/AGP/Gradle del proyecto; secret store <CI_SECRET_STORE>; estrategia de keystore <ENCRYPTED_FILE_SECRET_OR_EPHEMERAL_DECODE>; política de aprobación <APPROVAL_POLICY>. Descubre las convenciones y la política SDS existente.

Permisos y límites: mutación local reversible del pipeline y scripts; no crear secretos externos ni subir valores. Verifica documentación oficial de Gradle/Android y del proveedor. Cualquier alta de secreto, permiso CI, environment protegido o ejecución con clave real requiere AUTORIZACIÓN EXPRESA y usuario autorizado.

Ejecución: 1) fija JDK compatible y usa wrapper verificado; 2) ejecuta tests/lint; 3) inyecta ruta/alias/contraseñas mediante secretos enmascarados y stdin/entorno efímero; 4) crea el keystore solo en workspace efímero con permisos restrictivos y limpieza segura; 5) `bundleRelease`; 6) bundletool, jarsigner, manifest, fingerprint y SHA-256; 7) publica solo el AAB/informe como artefacto de acceso restringido; 8) añade protección de logs, fork PRs y retención; 9) deja el job de upload ausente o manualmente bloqueado.

Éxito: pipeline validable sin secretos reales, permisos mínimos, logs redactados y gate humano antes de distribución.

Prohibido: base64/contraseñas en YAML o Git, `set -x`, secretos en argumentos, ejecutar claves en PRs no confiables, subir a Play, crear service account o conceder roles.

Salida exacta: Diseño; Archivos/diff; Modelo de secretos; Controles; Pruebas; Hecho por agente; Configuración pendiente para usuario; Riesgos; STOP antes de secretos/upload.
```

## P10 — Evaluar automatización mediante Google Play Developer API

```text
Rol: actúa como Google Play Developer API Architect y Security Reviewer.

Objetivo: evaluar qué partes del flujo de <APP_NAME> pueden automatizarse hoy y diseñar una opción CI/API con aprobaciones, sin crear credenciales ni realizar llamadas mutadoras.

Contexto e inputs: package <PACKAGE_NAME>; tracks <TRACKS>; CI <CI_PROVIDER>; volumen/frecuencia <RELEASE_FREQUENCY>; managed publishing <STATE>; restricciones SDS <SECURITY_CONSTRAINTS>. Descubre si la app ya tuvo un primer artefacto subido manualmente.

Permisos y límites: documentación oficial y consultas read-only si ya existe acceso autorizado. Verifica métodos actuales de Edits, bundles, tracks, releases, dataSafety y appsigning; distingue API estándar de APIs avanzadas para Cloud KMS o tiendas de terceros. Crear Cloud project/service account, conceder permisos, abrir/commit un edit, upload, rollout o halt exige AUTORIZACIÓN EXPRESA.

Ejecución: 1) matriz Console/API/CI; 2) confirma limitaciones: app existente/primer upload, consentimientos legales y colisiones de edits; 3) diseña identidad de servicio con mínimo privilegio; 4) flujo insert→upload bundle→validate→update track→approval→commit; 5) idempotencia, versión, SHA-256, concurrencia/409, rollback y audit log; 6) decide si Data Safety se automatiza separadamente; 7) deja reset de upload key y Play App Signing estándar como handoff humano salvo soporte oficial específico.

Éxito: arquitectura que marca cada llamada mutadora, permiso, evidencia y gate, con alternativa manual.

Prohibido: credenciales reales, asumir que commit es inocuo, usar App Store Review API de third-party stores para una app Play normal, crear recursos o publicar.

Salida exacta: Capacidades actuales; No automatizable/condicionado; Flujo; Permisos; Gates; Fallos/rollback; Hecho por agente; Pendiente para usuario; STOP.
```

## P11 — Verificar después del upload o publicación

```text
Rol: actúa como Android Release Verification Engineer.

Objetivo: verificar que la release <VERSION_CODE>/<VERSION_NAME> de <PACKAGE_NAME> está en <EXPECTED_TRACK> con el artefacto, target, países y rollout correctos, después de <UPLOAD_OR_PUBLICATION>, sin cambiar su estado.

Contexto e inputs: AAB local <AAB_PATH>; SHA-256 esperado <EXPECTED_SHA256>; certificado upload <EXPECTED_UPLOAD_FINGERPRINT>; evidencia/API read-only <PLAY_EVIDENCE_OR_ACCESS>; estado esperado <IN_REVIEW_READY_TO_PUBLISH_PUBLISHED>; managed publishing <EXPECTED_STATE>.

Permisos y límites: lectura local y Play/API read-only autorizada. Verifica significados de estado con ayuda oficial vigente. No publiques, aumentes/detengas/reanudes rollout ni retires cambios.

Ejecución: 1) revalida AAB local; 2) compara hash/versionCode con respuesta de bundles o pantalla; 3) confirma package, target SDK, track, países, porcentaje y release notes; 4) confirma Submission ID/estado y timestamps; 5) si está In review, explica que aún no está publicada y no se pulsa `Publish changes`; 6) solo si Console demuestra Managed publishing activo, `Changes in review` vacío y todos los cambios aprobados en `Changes ready to publish`, marca `Publish changes` como pendiente humano; si está desactivado, describe y verifica el flujo estándar vigente; 7) si Published, verifica listing/instalación desde dispositivo elegible y salud inicial; 8) documenta discrepancias y acción de contención sin ejecutarla.

Éxito: cadena AAB local→bundle aceptado→release→track→estado demostrada o discrepancia explícita.

Prohibido: interpretar Save como envío, interpretar In review como publicada, mutar Play, detener rollout, borrar draft, reenviar o exponer datos de cuenta.

Salida exacta: Veredicto; Cadena de evidencia; Estado y significado; Configuración de rollout; Discrepancias; Hecho por agente; Pendiente para usuario; Próxima comprobación.
```

## P12 — Revisar políticas oficiales y actualizar la gobernanza

```text
Rol: actúa como Android Policy Researcher, Technical Writer y maintainer de sds-dev-governance.

Objetivo: revisar cambios oficiales desde <LAST_VERIFIED_DATE> y actualizar la guía canónica <GUIDE_PATH>, el catálogo <PROMPTS_PATH> y una sola entrada router del índice <RESOURCE_INDEX_PATH>.

Contexto e inputs: repositorio de gobernanza <GOVERNANCE_REPO_PATH>; apps/form factors SDS <APP_SCOPE>; fecha actual <YYYY-MM-DD>. Lee primero sus instrucciones y busca documentación existente para evitar duplicados.

Permisos y límites: navegación web solo a fuentes oficiales de Android Developers, Play Console Help, Google Play Developer API, Gradle/JDK/bundletool; mutación local reversible de documentación. No cambies proyectos Android, Play Console, claves, credenciales ni estados externos. No hagas commit/push salvo orden expresa.

Ejecución: 1) verifica target API por form factor/fechas, AAB, Play App Signing, upload reset, app signing upgrade, versionCode, API, identidad/2FA, App content/Data Safety, reviews y rollout; 2) compara con la guía; 3) registra solo deltas materiales; 4) actualiza fecha/fuentes/comandos/árbol/matriz; 5) mantiene una guía, un fichero de prompts y un índice ligero; 6) sincroniza exactamente el bloque de 14 prompts; 7) valida enlaces, secretos, redundancia, diff y checker de gobernanza; 8) revisión Release/AppSec/operador.

Éxito: documentación actual, fuentes trazables, índice sin procedimientos y paridad exacta de prompts.

Prohibido: usar blogs como autoridad si existe fuente oficial, copiar secretos/rutas personales, perpetuar reglas históricas, crear índices/resúmenes redundantes, publicar o hacer push.

Salida exacta: Resultado; Archivos; Deltas oficiales; Validaciones; Hecho por agente; Pendiente para usuario; Incertidumbres; Git/no publicación.
```

## P13 — Flujo end-to-end hasta el handoff

```text
Rol: actúa simultáneamente como Senior Android Release Engineer, DevSecOps/AppSec Engineer y Release Technical Writer.

Objetivo: auditar, corregir, compilar, firmar y validar la próxima release de <APP_NAME>/<PACKAGE_NAME> en <ANDROID_REPO_PATH>, producir un AAB trazable y entregar un handoff humano; detenerte antes de toda acción externa o irreversible.

Contexto e inputs: base <BASE_REF>; alcance <RELEASE_SCOPE>; track <TRACK>; versionName <VERSION_NAME_OR_PROPOSE>; máximo Play <MAX_VERSION_CODE_OR_UNKNOWN>; keystore <UPLOAD_KEYSTORE_PATH_OR_UNKNOWN>; alias <KEY_ALIAS_OR_UNKNOWN>; huella aceptada <PLAY_UPLOAD_SHA256_OR_UNKNOWN>; fecha <YYYY-MM-DD>. Descubre instrucciones, estado Git, toolchain, CI y evidencia; no presupongas acceso a Play.

Permisos y límites: lectura autónoma y mutaciones locales reversibles con diff. Consulta fuentes oficiales actuales. Generar/reemplazar claves, usar secretos, descargar tooling, crear credenciales o ejecutar pruebas en dispositivos requieren la autorización específica que corresponda. Contraseñas solo interactivas/secret store, jamás visibles.

Ejecución: 1) preflight y árbol de firma; 2) confirma base y máximo versionCode por todos los tracks; 3) comprueba API exigida y migra mínimamente; 4) tests/lint; 5) configura firma externa al repo; 6) `bundleRelease`; 7) bundletool/jarsigner/keytool, manifest, fingerprints, tamaño y SHA-256; 8) compara huella con Play; 9) escanea secretos y revisa diff; 10) crea handoff con notas, track, países, rollout, Save→Send for review→managed publishing; 11) archiva evidencia mínima.

Éxito: AAB correcto y verificable, sin secretos, o bloqueo preciso sin fabricar evidencia; operador sabe exactamente qué falta.

Prohibido: firmar con debug, mezclar configuración productiva en dev sin necesidad, adivinar versionCode, subir AAB, aceptar declaraciones, resetear/rotar, enviar a revisión, publicar, iniciar/detener rollout, commit/push no autorizados.

Salida exacta: Resultado; Cambios; Artefacto/manifest/firma/hash; Fuentes vigentes; Validaciones; Hecho por agente; Pendiente para usuario; Handoff; Riesgos; Git; STOP antes de Play Console.
```
<!-- SDS_ANDROID_PLAY_PROMPTS_END -->
