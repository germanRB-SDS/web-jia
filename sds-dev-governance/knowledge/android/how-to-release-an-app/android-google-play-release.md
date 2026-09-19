# Android / Google Play — preparación, firma y publicación

| Campo | Valor |
|---|---|
| Propósito | Preparar desde cero y mantener releases Android verificables para Google Play |
| Alcance | Apps Android de South Desert Studio; primera publicación, actualizaciones, firma, recuperación y automatización |
| Audiencia | Ingeniería Android, DevSecOps/AppSec y la persona que opera Play Console |
| Proyectos de referencia | Repositorios Android SDS; caso histórico FIELDS |
| Owner | South Desert Studio — Engineering / Release |
| Estado | Activa |
| Última verificación oficial | **2026-09-01** |
| Guía de prompts | [`../prompts/android-google-play-agent-prompts.md`](../prompts/android-google-play-agent-prompts.md) |
| Gobernanza relacionada | [`../../practices/07-security-baseline.md`](../../practices/07-security-baseline.md), [`../../practices/05-git-branching.md`](../../practices/05-git-branching.md) |

> **Seguridad:** jamás guarde en Git un keystore, una clave privada, contraseñas, tokens, JSON de
> cuenta de servicio o recovery codes. Los ejemplos usan placeholders. El certificado público no
> contiene la clave privada y Google espera que se comparta para registrar huellas; aun así, la
> política SDS evita versionar `.pem` por tratarlo como metadato operacional sensible.

## 1. Regla operativa y puntos de parada

Esta guía separa tres niveles:

1. **Read-only / seguro:** inspeccionar Git, Gradle, SDK, manifiestos, AAB, certificados públicos,
   documentación oficial y estados ya exportados.
2. **Mutación local reversible:** rama/worktree, cambios de Gradle, tests, build, informes y
   artefactos locales. El agente puede realizarlos dentro del alcance y mostrar el diff.
3. **Acción externa, criptográfica sensible o irreversible:** crear/reemplazar una clave, registrar
   huellas, conceder permisos, crear credenciales, aceptar declaraciones, subir, hacer commit de un
   Edit, enviar a revisión, publicar o cambiar un rollout. **REQUIERE USUARIO / AUTORIZACIÓN
   EXPRESA** y, cuando haya secretos o criterio legal, interacción humana.

No confunda los estados de Play:

```text
Draft -> Save -> Ready to send for review -> Send for review -> In review
       -> Approved + managed publishing OFF -> publicación automática [G3]
       -> Approved + managed publishing ON  -> Ready to publish -> Publish changes -> Published [G3]
```

`Save` no envía a revisión. `In review` no significa publicada [G4]. Para evitar el cierre de una
cuenta inactiva Google exige **las dos cosas**: contacto email/teléfono verificado y una app o
actualización publicada [G5]. Una submission en revisión todavía no demuestra la segunda condición;
después de publicar hay que comprobar que el aviso de inactividad se haya retirado.

## 2. Modelo mental de firma Android

### 2.1. Flujo con Play App Signing

```text
SDS conserva                               Google Play conserva
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ keystore de upload           │           │ app signing key             │
│ └─ alias                     │           │ (infraestructura de Google) │
│    ├─ clave privada  SECRETA │           └──────────────┬───────────────┘
│    └─ certificado   PÚBLICO  │                          │ firma
└──────────────┬───────────────┘                          ▼
               │ firma AAB                    APK base + split APKs
               ▼                              distribuidos a usuarios
        app-release.aab
               │ upload
               ▼
      Google compara el certificado
      de upload con la huella registrada
```

El AAB subido está firmado por la **upload key**. Google verifica esa identidad, genera los APK
optimizados y los firma con la **app signing key**. Por eso un APK instalado desde Play presenta la
huella de app signing, no la huella local de upload. OAuth, Firebase, Maps, App Links y proveedores
similares suelen necesitar la huella de app signing que aparece en Play Console; algunos flujos de
desarrollo necesitan además la de debug/upload [G2].

Para apps nuevas cuya clave genera Google, Play App Signing usa firma híbrida preparada para
escenarios poscuánticos y muestra certificados distintos según la versión de Android [G2]. No
codifique una cantidad fija de huellas: descargue/registre todas las que muestre la sección
**App signing key** vigente en Play Console.

### 2.2. Términos sin ambigüedad

| Término | Qué es | Dónde vive | ¿Secreto? | Si se pierde |
|---|---|---|---|---|
| Keystore (`.jks`, `.keystore`) | Contenedor binario de claves privadas y certificados | Custodia SDS fuera de Git o secret store de CI | **Sí**, si contiene privada | Se pierde la clave contenida salvo backup |
| Clave privada | Componente que produce firmas | Dentro del keystore/KMS | **Sí crítico** | No se deriva del certificado; hay que recuperar backup o seguir reset/upgrade |
| Clave pública | Componente matemático que verifica firmas | En el certificado | Pública | Se vuelve a obtener del certificado/privada |
| Certificado público (`.pem`, `.der`) | Clave pública + identidad + vigencia firmadas | Exportado del keystore o descargado de Play | Público criptográficamente; operativo sensible | Se reexporta si queda la clave; no cambia identidad |
| Alias | Nombre de una entrada dentro del keystore | Metadato del keystore/configuración | No secreto, pero sensible | Puede listarse con credenciales válidas o recuperarse de configuración |
| Contraseña de almacén | Protege el keystore | Gestor de secretos separado | **Sí** | Recuperar de custodia; no existe reset universal del fichero |
| Contraseña de clave | Protege la entrada privada | Gestor de secretos separado | **Sí** | Recuperar de custodia; no crear otra identidad por reflejo |
| SHA-1/SHA-256 | Huella de bytes del certificado | Play, proveedores y evidencia SDS | Pública | Recalcular desde certificado |
| Upload key | Identidad usada para firmar el AAB que se sube | SDS/CI; su cert está registrado en Play | Privada sí; cert no | Con Play App Signing: nueva clave + reset; sin aceptación no sirve |
| App signing key | Identidad final de los APK instalados | Google si Play App Signing; SDS en legacy/self-hosted | **Sí crítico** | Google-managed no debe existir localmente; legacy perdida suele impedir actualizaciones |
| AAB | Formato de publicación, no instalable directamente | Build/artefactos/Play | No secreto por sí mismo; acceso restringido antes de release | Se reproduce desde código/ref+toolchain+clave |
| APK universal/splits | Formatos instalables generados desde AAB | bundletool o Google Play | No secreto por sí mismo | Regenerables desde AAB; Google los firma para distribución |

### 2.3. “Regenerar el certificado” puede significar dos cosas opuestas

- `keytool -exportcert` sobre el **mismo alias y clave** reexporta el certificado público. La
  identidad y las huellas siguen iguales; no requiere reset.
- `keytool -genkeypair` crea una **nueva clave privada** y, por tanto, otra identidad y otras
  huellas. Google no la acepta automáticamente: hay que registrarla para una app nueva o pedir un
  reset de upload key para una existente con Play App Signing.

## 3. Árbol de decisión inicial

Use este árbol antes de tocar Gradle:

```text
¿La app ya existe en Play?
├─ No -> primera publicación -> nueva upload key -> Play App Signing -> primer release
└─ Sí
   ├─ ¿Play App Signing está activo?
   │  ├─ Sí
   │  │  ├─ upload key disponible y aceptada -> actualización normal
   │  │  ├─ solo falta PEM/DER -> reexportar mismo certificado
   │  │  ├─ alias/contraseña desconocidos -> recuperar custodia; no crear clave aún
   │  │  ├─ upload privada perdida/comprometida -> nueva upload key + reset en Play
   │  │  └─ “app signing key perdida” -> Google la custodia; revisar huellas/upgrade, no buscar JKS
   │  └─ No / app legacy
   │     ├─ app signing key disponible -> conservarla, valorar opt-in oficial
   │     └─ app signing key perdida -> actualización normalmente irrecuperable; escalar a Play
   └─ firma rechazada -> comparar package + cert AAB + upload cert registrado antes de regenerar
```

### 3.1. Diagnóstico por escenario

| Escenario | Diagnóstico/riesgo | Acción local | Acción Play Console | Recuperación/actor |
|---|---|---|---|---|
| Primera app | No hay identidad previa | Crear upload key; build y validar | Crear app, elegir package, Play App Signing, declaraciones y release | Sí; agente prepara, usuario decide/acepta |
| Actualización normal | Riesgo de versión/API/firma errónea | Verificar base, máximo Play, API y cert; generar AAB | Upload, revisión, rollout | Sí |
| Solo PEM/DER perdido | Privada aún existe | Reexportar desde mismo alias y comparar huella | Ninguna, salvo volver a entregar el mismo cert | Sí, sin identidad nueva |
| Keystore/upload privada perdida | No se puede firmar como upload actual | Tras autorización crear nueva key+PEM | Solicitar upload key reset | Sí si Play App Signing está activo |
| Alias olvidado | Puede ser metadato recuperable | Buscar config; con credenciales, `keytool -list` | Ninguna | Sí si keystore/contraseña existen |
| Contraseña olvidada | No hay bypass seguro | Consultar custodia/backups autorizados; no fuerza bruta | Reset solo si equivale a upload key inaccesible y PAS activo | Condicionada |
| Upload key comprometida | Tercero podría enviar bundles | Preservar evidencia, retirar acceso, nueva key autorizada | Reset inmediato y revisar actividad | Sí con PAS; AppSec+owner |
| “App signing key perdida” con PAS | Normal: Google la conserva | Ver certificado descargable, no buscar privada local | Revisar key/upgrade en Play | No hay pérdida local |
| Legacy sin PAS y app signing key perdida | Android exige continuidad de firma | Buscar backups; no crear key sustituta | Escalar soporte; una nueva key no conserva identidad | Normalmente no recuperable |
| Cambio de equipo | Riesgo de copia insegura | Restauración cifrada, permisos, prueba de cert | Ninguna si huella no cambia | Sí |
| Incorporar CI | Mayor superficie del secreto | Secret store, runner protegido, logs y aprobación | Service account solo si se automatiza Play | Sí, con autorización |
| Certificado próximo a caducar | Vigencia afecta continuidad | `keytool -printcert`; planificar antes del fin | Reset/upgrade según tipo y soporte oficial | Condicionada; no esperar al último día |
| Huella rechazada | AAB firmado por clave distinta o package equivocado | `jarsigner`/`keytool`; comparar SHA-256 | Ver upload certificate vigente | Detener; no probar claves al azar |

## 4. Procedimiento desde cero

### 4.1. Prerrequisitos técnicos y de cuenta

1. Cuenta Play con identidad y email/teléfono verificados; usuarios individuales, mínimo privilegio
   y 2-Step Verification. No compartir una cuenta Google.
2. Para cuentas personales creadas después del 13-11-2023, comprobar el closed test obligatorio
   vigente (a 2026-09-01: 12 testers opt-in continuo durante 14 días) y acceso a producción [G12].
3. Revisar Android Developer Verification. Desde marzo de 2026 las nuevas apps Play se registran en
   la identidad del desarrollador; el despliegue regional de verificación comienza el 30-09-2026
   [G12].
4. JDK compatible con la versión de AGP; wrapper Gradle versionado y verificado; Android SDK y
   Build Tools del `compileSdk`; `keytool`, `jarsigner` y `bundletool` oficial.
5. Acceso de solo lectura al historial de releases/tracks o un operador que entregue el máximo
   `versionCode` y la huella de upload registrada.

Desde la raíz del repositorio:

```bash
git status --short
git branch --show-current
java -version
./gradlew --version
sed -n '1,120p' gradle/wrapper/gradle-wrapper.properties
```

Windows PowerShell usa `git`, `java` y `./gradlew.bat --version`. Éxito: worktree explicado, ref
correcta y combinación JDK/Gradle/AGP soportada. Use siempre el wrapper; al actualizarlo añada
`distributionSha256Sum` y valide el JAR/distribución con los checksums oficiales de Gradle.

### 4.2. Crear la app y fijar identidad

**REQUIERE USUARIO / AUTORIZACIÓN EXPRESA.** En Play Console, el package name debe coincidir con
`applicationId`; tras publicar no es un campo que se pueda “corregir” sin crear otra app. Decida
antes: cuenta propietaria, nombre público, package, países, monetización, categoría, política de
privacidad y quién acepta acuerdos. Para una app nueva deje que Play App Signing genere las claves
gestionadas salvo un requisito documentado multi-store/KMS.

En Gradle Kotlin DSL:

```kotlin
android {
    namespace = "<PACKAGE_NAME>"
    compileSdk = <CURRENT_COMPILE_SDK>
    defaultConfig {
        applicationId = "<PACKAGE_NAME>"
        minSdk = <SUPPORTED_MIN_SDK>
        targetSdk = <CURRENT_REQUIRED_TARGET_SDK>
        versionCode = <POSITIVE_MONOTONIC_CODE>
        versionName = "<HUMAN_VERSION>"
    }
}
```

`versionName` informa a personas. `versionCode` decide orden/aceptación: entero positivo,
estrictamente creciente y no reutilizable; Google Play admite como máximo `2100000000`. Un código
usado en cualquier track o upload previo puede bloquear la reutilización aunque no llegara a
producción. Git no es autoridad suficiente [G10].

### 4.3. Verificar el nivel de API actual

Desde el 31-08-2026, nuevas apps y actualizaciones para móvil deben apuntar a Android 16/API 36;
Wear OS y Automotive, API 35; TV y XR, API 34. Para disponibilidad a usuarios nuevos en dispositivos
con una versión Android posterior al target de la app, las apps existentes deben apuntar al menos a
API 35; las apps permanentemente privadas están exceptuadas y la ampliación oficial de plazo llega
al 01-11-2026 [G1]. Consulte siempre la tabla vigente y distinga app nueva, actualización,
disponibilidad de app existente, fecha, extensión y form factor. Para Android 16:

```kotlin
android {
    compileSdk = 36
    defaultConfig { targetSdk = 36 }
}
```

No trate el cambio como un número mecánico: lea behavior changes, ejecute tests y confirme que AGP
soporta el compileSdk. Para FIELDS, API 36 fue una decisión histórica, no una regla eterna; AGP
8.10.1 soporta API 36 con Gradle 8.11.1 y JDK mínimo 17 [G10]. El gate bloquea si el `targetSdk` del
manifest final no satisface el requisito vigente aplicable o si la migración carece de sus pruebas.

### 4.4. Crear una upload key segura

Crear una identidad criptográfica requiere autorización expresa. Desde el directorio de custodia,
fuera de cualquier repo, compruebe primero que el fichero no existe:

```bash
test ! -e '<UPLOAD_KEYSTORE_PATH>' || { echo 'STOP: el destino ya existe'; exit 1; }
umask 077
keytool -genkeypair -v \
  -keystore '<UPLOAD_KEYSTORE_PATH>' \
  -storetype JKS \
  -alias '<KEY_ALIAS>' \
  -keyalg RSA -keysize 2048 \
  -validity 10000
chmod 600 '<UPLOAD_KEYSTORE_PATH>'
```

`keytool` pregunta las contraseñas interactivamente; no añada `-storepass`/`-keypass` a la línea de
comandos. En PowerShell compruebe `Test-Path`, ejecute el mismo `keytool` interactivo y restrinja la
ACL con herramientas corporativas; no confíe en `chmod` de Windows. Android recomienda vigencia de
al menos 25 años; 10.000 días supera ese mínimo.

Señal de éxito: el fichero nuevo existe con permisos restrictivos y `keytool` termina sin error.
Nunca sobrescriba una clave existente para “renovarla”.

### 4.5. Inspeccionar alias, exportar certificado y huellas

Los comandos preguntan la contraseña sin mostrarla:

```bash
keytool -list -v -keystore '<UPLOAD_KEYSTORE_PATH>' -alias '<KEY_ALIAS>'

keytool -exportcert -rfc \
  -keystore '<UPLOAD_KEYSTORE_PATH>' \
  -alias '<KEY_ALIAS>' \
  -file '<UPLOAD_CERTIFICATE_PATH>.pem'

keytool -printcert -file '<UPLOAD_CERTIFICATE_PATH>.pem'
```

Éxito: el alias es `PrivateKeyEntry`; el PEM comienza/termina como certificado y `keytool` muestra
SHA-1/SHA-256 y vigencia. El PEM puede enviarse a Google; no contiene la privada. En SDS se conserva
fuera del repo junto a metadatos, porque revela identidad operativa.

### 4.6. Backup y registro mínimo

Antes de usar la clave:

- dos backups **cifrados e independientes**, en ubicaciones/proveedores con fallos no correlacionados;
- contraseñas en un gestor autorizado separado del fichero;
- metadatos no secretos: app/package, alias, SHA-1/SHA-256, algoritmo/tamaño, creación, expiración,
  custodios y fecha de última prueba;
- prueba de lectura de cada copia con `keytool -list` y credenciales recuperadas desde su custodia;
- prueba de recuperación periódica en entorno aislado: restaurar copia, exportar certificado y
  comparar SHA-256, sin firmar/publicar;
- proceso de offboarding: revocar acceso a backups/CI/Play, revisar logs y rotar si hubo exposición.

No guarde contraseñas, privada, contenido JKS o recovery codes en `sds-dev-governance`.

### 4.7. Configurar Gradle sin secretos versionados

Prefiera variables de entorno efímeras o el secret store de CI. Ejemplo Kotlin DSL:

```kotlin
val storeFileProvider = providers.environmentVariable("ANDROID_UPLOAD_STORE_FILE")
val storePasswordProvider = providers.environmentVariable("ANDROID_UPLOAD_STORE_PASSWORD")
val keyAliasProvider = providers.environmentVariable("ANDROID_UPLOAD_KEY_ALIAS")
val keyPasswordProvider = providers.environmentVariable("ANDROID_UPLOAD_KEY_PASSWORD")

val hasReleaseCredentials = listOf(
    storeFileProvider, storePasswordProvider, keyAliasProvider, keyPasswordProvider
).all { it.isPresent }

val signedReleaseRequested = gradle.startParameter.taskNames.any { requestedTask ->
    val task = requestedTask.substringAfterLast(':').lowercase()
    task.contains("release") &&
        listOf("bundle", "assemble", "publish").any { prefix -> task.startsWith(prefix) }
}

if (signedReleaseRequested) {
    check(hasReleaseCredentials) { "Release signing credentials are missing" }
}

android {
    signingConfigs {
        if (hasReleaseCredentials) {
            create("release") {
                storeFile = file(storeFileProvider.get())
                storePassword = storePasswordProvider.get()
                keyAlias = keyAliasProvider.get()
                keyPassword = keyPasswordProvider.get()
            }
        }
    }
    buildTypes {
        getByName("release") {
            if (hasReleaseCredentials) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }
}
```

Adapte los nombres de tareas a los plugins del proyecto. Esta guarda permite auditorías y tareas
read-only sin credenciales, pero detiene las tareas que producen/publican un release firmado. Otra
opción oficial es un `keystore.properties` **fuera de Git**; si se usa, aplique permisos restrictivos y confirme que
`.gitignore` cubre al menos:

```gitignore
*.jks
*.keystore
*.p12
*.key
*.pem
keystore.properties
secrets.properties
local.properties
*.aab
```

Aunque el PEM sea público, SDS evita commits accidentales de material de firma. No use
`signingConfigs.getByName("debug")` en `release`; la clave debug no sirve para Play.

### 4.8. Build limpio y secreto efímero

Desde la raíz del proyecto, macOS/Linux:

```bash
(
  export ANDROID_UPLOAD_STORE_FILE='<UPLOAD_KEYSTORE_PATH>'
  export ANDROID_UPLOAD_KEY_ALIAS='<KEY_ALIAS>'
  read -s -r -p 'Keystore password: ' ANDROID_UPLOAD_STORE_PASSWORD; printf '\n'
  read -s -r -p 'Key password: ' ANDROID_UPLOAD_KEY_PASSWORD; printf '\n'
  export ANDROID_UPLOAD_STORE_PASSWORD ANDROID_UPLOAD_KEY_PASSWORD
  ./gradlew clean :app:testReleaseUnitTest :app:lintRelease :app:bundleRelease
)
```

Los valores no aparecen en el historial ni como argumentos. Siguen existiendo brevemente en el
entorno del proceso; use una sesión confiable, sin `set -x`, y un secret store en CI. En Windows
PowerShell, desde la raíz del proyecto:

```powershell
$env:ANDROID_UPLOAD_STORE_FILE = '<UPLOAD_KEYSTORE_PATH>'
$env:ANDROID_UPLOAD_KEY_ALIAS = '<KEY_ALIAS>'
$storeSecret = Read-Host 'Keystore password' -AsSecureString
$keySecret = Read-Host 'Key password' -AsSecureString
$env:ANDROID_UPLOAD_STORE_PASSWORD = [Net.NetworkCredential]::new('', $storeSecret).Password
$env:ANDROID_UPLOAD_KEY_PASSWORD = [Net.NetworkCredential]::new('', $keySecret).Password
try {
    .\gradlew.bat clean :app:testReleaseUnitTest :app:lintRelease :app:bundleRelease
} finally {
    Remove-Item -Path @(
        'Env:\ANDROID_UPLOAD_STORE_FILE', 'Env:\ANDROID_UPLOAD_KEY_ALIAS',
        'Env:\ANDROID_UPLOAD_STORE_PASSWORD', 'Env:\ANDROID_UPLOAD_KEY_PASSWORD'
    ) -ErrorAction SilentlyContinue
}
```

La conversión es necesaria porque Gradle recibe texto; el valor existe brevemente en memoria y en el
entorno hijo, pero no en el historial ni en argumentos. En CI use secretos enmascarados del runner.

Éxito: `BUILD SUCCESSFUL` y AAB bajo `app/build/outputs/bundle/release/`. El warning “Unable to strip”
para una biblioteca nativa no es por sí solo fallo; evalúe el warning, pero la señal final es el
resultado del build y las validaciones posteriores. Sustituya `app` por el módulo real; si el proyecto
no crea `testReleaseUnitTest`, ejecute su tarea de test equivalente en lugar de inventarla.

### 4.9. Validar el AAB antes del upload

Use una versión de `bundletool` descargada desde el repositorio oficial y registre su versión/hash.
No use `apksigner` para firmar AAB; Android documenta `jarsigner` para AAB y `apksigner` para APK.

```bash
AAB_PATH='<AAB_PATH>'
BUNDLETOOL_JAR='<BUNDLETOOL_JAR>'

java -jar "$BUNDLETOOL_JAR" validate --bundle="$AAB_PATH"
java -jar "$BUNDLETOOL_JAR" dump manifest --bundle="$AAB_PATH" --module=base
jarsigner -verify -verbose -certs "$AAB_PATH"
keytool -printcert -jarfile "$AAB_PATH"
```

Hash:

```bash
# macOS
shasum -a 256 '<AAB_PATH>'
# Linux
sha256sum '<AAB_PATH>'
# Windows PowerShell
Get-FileHash '<AAB_PATH>' -Algorithm SHA256
```

Confirme desde **el artefacto**, no solo el fuente:

- package=`<PACKAGE_NAME>`;
- `versionCode` no usado y `versionName` esperado;
- `minSdk`, `compileSdk` y `targetSdk`;
- `jar verified` y SHA-256 del firmante igual a la **upload certificate** aceptada;
- módulos/permisos/tamaño esperados;
- hash del AAB copiado coincide con el AAB de salida.

Los warnings de `jarsigner` por certificado autofirmado o ausencia de timestamp son habituales para
certificados Android de larga vigencia; una firma no válida o huella distinta sí es STOP.

### 4.10. Probar APKs generados

El AAB no se instala directamente. Para recrear APKs de forma local:

```bash
java -jar '<BUNDLETOOL_JAR>' build-apks \
  --bundle='<AAB_PATH>' \
  --output='<TEMP_APKS_PATH>' \
  --mode=universal

# Solo con dispositivo autorizado y conectado:
java -jar '<BUNDLETOOL_JAR>' install-apks --apks='<TEMP_APKS_PATH>'
```

Para comprobar comportamiento real de entrega/firma Google, use un track interno/cerrado. El APK
local generado puede estar firmado con una clave de prueba según opciones de bundletool; no use su
huella como sustituto de la app signing key de Play.

### 4.11. Crear y enviar la release

Todo este subapartado **REQUIERE USUARIO / AUTORIZACIÓN EXPRESA**:

1. Revisar Dashboard, App content, Data Safety, privacidad, ads, target audience, rating, acceso de
   revisores, permisos sensibles, pricing/países y avisos de políticas.
2. Ir a **Test and release** → track elegido → crear release.
3. Subir el AAB; detenerse si package, code/name, targetSdk o certificado no coinciden.
4. Leer errores y warnings. Los errores bloquean; los warnings pueden no bloquear, pero se explican.
5. Añadir nombre/notas, país y rollout. Para riesgo normal, preferir testing y/o staged rollout; el
   100% requiere decisión consciente.
6. `Save` y revisar **Publishing overview**.
7. Pulsar **Send for review**. Conservar Submission ID/fecha/track/versión.
8. Mientras haya cambios `In review`, no pulsar **Publish changes**. Solo si Console demuestra que
   Managed publishing está activo, no queda nada en **Changes in review** y todos los cambios
   aprobados aparecen en **Changes ready to publish**, el usuario puede pulsar **Publish changes**.
   Si Managed publishing está desactivado, el comportamiento estándar para una actualización de una
   app existente es la publicación automática tras la aprobación [G3]. No infiera el estado de esta
   opción a partir de una intención o del estado de la submission.

No envíe cambios nuevos durante la revisión sin necesidad: Google advierte que puede reiniciar el
plazo. La revisión puede tardar horas, siete días o más en casos excepcionales [G3][G4].

### 4.12. Verificación post-upload y post-publicación

Cadena mínima de evidencia:

```text
commit/ref -> AAB local + SHA-256 -> bundle de Play + versionCode
-> release + track + países + rollout -> Submission ID/estado
-> Published -> ficha/instalación -> huella app signing + salud inicial
```

Compruebe Latest releases and bundles, Submission activity y Publishing overview. Tras publicación,
instale/actualice desde Play con una cuenta/dispositivo elegible, valide versión funcional, App Links,
Maps/OAuth/Firebase y observe crashes/ANR. Conserve solo metadatos, logs redactados y enlaces; no el
keystore ni secretos en el informe de release.

## 5. Actualización normal — checklist operacional

### 5.1. Preparación

- [ ] Leer instrucciones del repo; `git status --short`; identificar commit actualmente publicado.
- [ ] `git fetch --all --prune` si la red está autorizada; trabajar en rama/worktree aislado.
- [ ] Partir del código de producción más reciente. No fusionar en `dev` secretos, endpoints o rutas
  productivas solo para fabricar un bundle: mantenga la separación de entornos.
- [ ] Revisar diff funcional, dependencias, manifest, CI, `.gitignore` y signing config.
- [ ] Consultar todos los tracks y bundles históricos. Registrar el mayor `versionCode` usado.
- [ ] Seleccionar código `> max_usado`, positivo y `<= 2100000000`; actualizar `versionName` de forma
  coherente, sin tratarlo como control de aceptación.
- [ ] Consultar el requisito target API del día y el form factor; revisar behavior changes.
- [ ] Confirmar que la SHA-256 de la upload certificate aceptada coincide con la clave disponible.

### 5.2. Build y entrega

- [ ] Actualizar versión/API/toolchain con el menor diff y sin credenciales.
- [ ] Tests, lint, manifest merge y build de depuración/release proporcionales.
- [ ] Inyectar firma release fuera de Git; nunca usar debug signing.
- [ ] `clean` + `bundleRelease` con wrapper y secretos interactivos/CI protegidos.
- [ ] `bundletool validate` y `dump manifest`; `jarsigner`/`keytool`; tamaño y SHA-256.
- [ ] Comparar package, code/name, targetSdk y upload fingerprint contra valores esperados.
- [ ] Copiar el AAB a una ubicación de artefactos ignorada/restringida; verificar de nuevo el hash.
- [ ] Entregar handoff: track, notas, países, porcentaje, managed publishing y STOP conditions.
- [ ] Usuario: upload → revisar warnings → Save → **Send for review**.
- [ ] Usuario: solo con Managed publishing activo, `Changes in review` vacío y todos los cambios
  aprobados en `Changes ready to publish` → **Publish changes** [G3].
- [ ] Verificar track/estado/instalación/salud y archivar evidencia mínima.

### 5.3. Cómo demostrar el siguiente versionCode

La fuente ideal combina:

1. Play Console **Latest releases and bundles**/Bundle Explorer para artefactos históricos;
2. Production, open, closed, internal y tracks personalizados;
3. Google Play Developer API read-only (`applications.tracks.releases.list` o Edits/tracks según el
   flujo vigente), si ya existe identidad con mínimo privilegio;
4. tags/ramas/artefactos locales, solo como evidencia complementaria.

Si no puede demostrar todos los códigos usados, no declare “seguro” un valor por ser alto o basado
en fecha. Entregue un candidato condicionado y pida al operador el máximo de Play. La aceptación del
upload demuestra a posteriori que un código no estaba usado, pero no sustituye el preflight.

## 6. Pérdida, sustitución y compromiso de claves

### 6.1. Reexportar un certificado público perdido

Condición: existe el keystore, el alias correcto y sus credenciales. Ejecute `keytool -exportcert
-rfc` como en 4.5 y compare SHA-256 con Play. Esto **no** crea nueva clave, no cambia huellas y no
requiere reset. Si difiere, deténgase: quizá eligió otro alias/keystore.

### 6.2. Crear una nueva upload key

Solo procede para una app nueva, separación intencional o recuperación/reset. Crear el JKS es una
acción criptográfica sensible: autorización expresa, destino nuevo fuera de Git, entrada interactiva,
PEM y dos backups. La nueva huella no sirve para la app existente hasta que Play la registre.

### 6.3. Solicitar reset de upload key

Con Play App Signing activo:

1. crear nueva upload key y PEM;
2. **usuario/owner**: `Protected with Play` → gestión de Play App Signing → sección upload key →
   **Request upload key reset**;
3. seleccionar motivo, subir PEM y solicitar;
4. registrar el estado pendiente y esperar la confirmación/fecha de activación de Google [G2];
5. comparar la nueva SHA-256 mostrada por Play con el PEM/JKS;
6. solo tras activación confirmada, configurar la build definitiva, firmar un AAB y comprobar que
   Play lo acepta sin error de certificado;
7. cerrar con evidencia no secreta: solicitud/confirmación, fecha efectiva, huella comparada,
   versión del AAB de prueba y resultado de aceptación.

El reset no cambia la app signing key ni la identidad de los APK distribuidos. La navegación exacta
de Console cambia; siga el enlace oficial de fuentes si las etiquetas difieren.

### 6.4. Verificar aceptación antes de la release

No basta “el formulario terminó”. El owner ejecuta la solicitud y conserva la confirmación; el
agente solo prepara material local si está autorizado y valida evidencia no secreta. Evidencia válida:
Play muestra la nueva upload certificate SHA-256 idéntica a la exportada y la activación ya es
efectiva, o acepta un AAB firmado por ella sin error de certificado. Prefiera la comparación de
huellas antes del build final. No comparta la privada ni el JKS con Google [G2].

### 6.5. Clave comprometida

1. No borre evidencia ni publique con ella.
2. Determine si se expuso privada/JKS+credenciales o solo certificado/huella pública.
3. Retire acceso local/CI y preserve logs redactados.
4. Upload key + PAS: nueva key autorizada y reset inmediato.
5. App signing key: escale como incidente crítico y use únicamente upgrade/rotación oficial según
   versión/gestión; una upload reset no lo corrige.
6. Revise usuarios, service accounts, Edits, releases y actividad de cuenta.
7. Actualice todas las dependencias de fingerprint y pruebe actualización por rangos Android.

### 6.6. Alias o contraseña olvidados

- Busque alias en `signingConfig`, CI metadata, inventario y documentación sin secretos. Con
  contraseña de almacén válida, `keytool -list -keystore '<PATH>'` enumera entradas.
- Recupere contraseñas solo del gestor/backups autorizados. No las pida por chat, no haga fuerza
  bruta y no las registre en comandos/logs.
- Si la contraseña inaccesible hace inutilizable la upload key y PAS está activo, trate el caso como
  pérdida de upload key. Sin PAS y si esa era app signing key, el impacto puede ser irreversible.

### 6.7. App signing key gestionada por Google

La privada no está ni debe estar en el equipo SDS cuando Google la generó. Play permite descargar
certificados/huellas públicos y APKs generados, no recuperar la privada gestionada. Si alguien dice
“perdimos el JKS de app signing”, compruebe primero si en realidad perdió la upload key.

### 6.8. App signing key legacy no gestionada por Google

Android solo acepta actualizaciones con continuidad de firma. Si la privada se pierde y no existe
backup, crear una clave nueva normalmente no permite actualizar la app existente. Preserve backups,
contacte soporte con evidencia y no prometa recuperación. Si aún existe, evalúe opt-in a Play App
Signing siguiendo PEPK y el procedimiento oficial antes de perderla.

### 6.9. Upgrade/rotación de app signing key

Use la opción **Upgrade key** de Play App Signing únicamente por fortaleza/compromiso y tras analizar
compatibilidad. A 2026-09-01 la ayuda actual de Play describe:

- claves híbridas preparadas para Android 17+ en apps nuevas;
- upgrade anual para instalaciones Android 17+;
- clave clásica más reciente para Android 13–16;
- compatibilidad/Play Protect para Android 7–12;
- registro de las nuevas huellas clásicas/PQC con proveedores.

La página Android Studio aún resume el modelo anterior “nueva para Android 13+, antigua para
anteriores”. Ante esa diferencia entre fuentes oficiales, prevalece la ayuda de Play App Signing más
reciente y la configuración que muestre Console para la app. No rote desde una receta congelada.

Los endpoints `appsigning.enrollApp`/`rotateAppSigningKey` añadidos en la API son **avanzados**, para
organizaciones con custodia obligatoria en Google Cloud KMS; la propia documentación advierte no
usarlos para el alta estándar. Son externos, sensibles y fuera del flujo normal SDS [G2].

### 6.10. Dependencias de fingerprints

Tras un reset de **upload key**, normalmente no cambian los APK finales; proveedores que validan app
signing no deberían cambiar. Tras app signing upgrade/rotación sí revise:

- Google Cloud API restrictions (Maps u otras);
- OAuth clients/Google Sign-In y Firebase;
- `assetlinks.json` para Android App Links;
- SDKs de identidad/pagos/social login;
- permisos `signature`, shared UID/data y distribución fuera de Play;
- controles backend que pinnen certificados.

Registre todas las huellas que Play indique para cada rango Android, sin retirar la legacy antes de
demostrar compatibilidad.

## 7. Matriz agente / usuario / automatización

| Acción | Agente local | Requiere usuario | CI/API posible | Autorización expresa | Evidencia | Riesgo principal |
|---|---|---|---|---|---|---|
| Inspección proyecto | Sí, read-only | No | Sí | No | informe/ref/rutas | Omitir base correcta |
| Actualizar Gradle/API/versiones | Sí, reversible | Solo decisiones ambiguas | CI valida | No si alcance claro | diff+tests | Regresión/API behavior |
| Generar upload key | Solo tras permiso; usuario introduce secretos | Sí | HSM/KMS/runner, condicionado | **Sí** | cert/huellas, nunca privada | Crear/perder identidad |
| Exportar certificado | Sí si acceso autorizado | Contraseña interactiva | Sí | Sí si usa privada | PEM+fingerprint | Exponer ruta/credencial |
| Configurar signing local | Sí | Inyección de secretos | Sí | Para usar secretos | diff sin valores | Secretos en Git/logs |
| Build AAB | Sí si firma disponible | Puede introducir passwords | Sí | Para uso de clave real | BUILD SUCCESSFUL+AAB | Firma equivocada |
| Validar AAB | Sí, read-only | No | Sí | No | manifest/cert/hash | Validar solo el fuente |
| Calcular hash | Sí | No | Sí | No | SHA-256 | Hashear copia distinta |
| Hallar máxima versión | Sí con acceso read-only | Sí si solo Console | Sí API | Acceso externo sí | máximos por fuente | Reutilización histórica |
| Acceder a Play Console | No por defecto | **Sí** | Parcial API | **Sí** | Activity/Submission | Cuenta/consentimiento |
| Reset upload key | Prepara PEM/handoff | **Sí/owner** | No estándar | **Sí** | huella aceptada | Bloqueo o secuestro |
| Aceptar declaraciones/ToS | No | **Sí** | Algunas data labels; no todos los consentimientos | **Sí** | estado App content | Declaración legal falsa |
| Crear release | Prepara valores | Sí en Console | Sí Edits para app existente | **Sí** | release/track | Target incorrecto |
| Upload AAB | No sin permiso | Sí | Sí `edits.bundles.upload` | **Sí** | bundle response/hash | Artefacto irreversible/usado |
| Enviar/commit | No sin permiso | Sí | Sí `edits.commit` | **Sí** | submission/edit | Cambios entran en revisión/live |
| Rollout | No | **Sí** | Sí tracks update | **Sí** | %/país/estado | Impacto usuarios |
| Stop/halt rollout | Prepara diagnóstico | **Sí** | Sí | **Sí** | estado halted | Cortar disponibilidad |
| Verificación post-release | Sí read-only | Instalación/Console si hace falta | Sí parcial | No para lectura | cadena de evidencia | Confundir review/publicación |
| Actualizar gobernanza | Sí local reversible | No | Checker CI | No | diff/checker | Duplicación/desactualización |

`edits.commit` es una mutación externa aunque la API lo llame transaccional. Los cambios de Console
pueden invalidar un Edit concurrente; diseñe locks, idempotencia y aprobación humana.

## 8. Qué se automatizó realmente en FIELDS

La capacidad técnica no prueba ejecución. Esta tabla se limita a la evidencia disponible:

| Agente / automatizado | Usuario / Play Console | Evidencia |
|---|---|---|
| Inspeccionó `main`, `dev`, historial y worktrees; determinó que producción 1.0.7 estaba en `main` | — | refs Git; `main` en `8df1d96`, `dev` en `ed01f2b` |
| Creó worktree/branch de release desde `main` y commit local `6d7bb5a` | — | Git diff/commit |
| Cambió compile/target 35→36, version 12/1.0.7→20260901/1.0.8 y sustituyó debug signing por env vars | — | `app/build.gradle.kts` en `6d7bb5a` |
| Corrigió cinco bloqueos de lint de forma mínima, sin features visuales/funcionales | — | diff de tres fuentes/recursos |
| Preparó el comando seguro de build | Ejecutó el comando e introdujo dos contraseñas ocultas | salida aportada: `BUILD SUCCESSFUL`, 51 tasks |
| Validó y copió el AAB; comprobó manifest, bundletool, certificado y SHA-256 | — | artefacto local e informes repetibles |
| No generó ni reseteó una clave en el flujo reconstruible | Se aportó que Google había aceptado el AAB firmado; el detalle del alta/reset no está reconstruido | cert público local+AAB aceptado; sin evidencia suficiente del procedimiento histórico |
| No accedió a Play Developer API ni publicó | Subió AAB, eligió Production, 100%, países, nombre/notas, pulsó Save y Send for review | capturas Play Console |
| Interpretó el estado observado, sin demostrar la configuración de Managed publishing | Submission 10 quedó `In review` a las 17:27 Europe/Madrid | captura Submission activity; no equivale a `Published` |

El `versionCode 20260901` era muy superior al 12 conocido localmente, pero antes del upload no se
demostró la historia completa de todos los tracks. Play lo aceptó y demostró después que no estaba
usado. Esta guía corrige el procedimiento: consultar Play primero.

## 9. Troubleshooting por síntoma

| Síntoma | Causa probable | Comprobación no destructiva | Corrección / actor | STOP cuando |
|---|---|---|---|---|
| `versionCode already used` | Código usado en cualquier upload/track | Console bundles+tracks/API read-only | Elegir `> máximo`; agente cambia, usuario confirma Play | Historia incompleta |
| Package incorrecto | Base/flavor/applicationId equivocado | `bundletool dump manifest` | Rebuild desde configuración correcta | No coincide con app Play |
| Target API insuficiente | Requisito temporal cambió | Manifest AAB + tabla oficial | Migrar compile/target, behavior tests | AGP no soporta API |
| AAB con clave equivocada | debug/otro JKS/alias | `keytool -printcert -jarfile` | Configurar upload key aceptada y rebuild | Huella no coincide |
| Upload certificate no reconocido | Nueva clave no registrada/reset pendiente | Comparar SHA-256 PEM/AAB/Play | Usuario completa reset y espera aceptación | Antes de upload |
| Alias inexistente | Typo/otro keystore | `keytool -list` con acceso autorizado | Elegir alias real; no crear por reflejo | Credenciales desconocidas |
| Password incorrecta | Store/key password confundidas | Un intento interactivo controlado + custodia | Recuperar del gestor; reset si upload inaccesible+PAS | Evitar fuerza bruta |
| Keystore no encontrado | Ruta partida/typo/worktree | `test -f`/`Test-Path`, ruta entre comillas | Corregir ruta externa; no copiar al repo | Destino dudoso |
| Keystore corrupto | Copia truncada/formato incorrecto | hash backup, `keytool -list` | Restaurar backup cifrado | No sobrescribir original |
| JDK/Gradle/AGP incompatible | Matriz de versiones no soportada | `java -version`, wrapper, plugins | Alinear según release notes oficiales | Antes de upgrade masivo |
| SDK/build-tools ausentes | SDK path/plataforma no instalada | SDK Manager/directorios | Instalar paquete oficial o fijar `sdk.dir` local | No inventar rutas |
| Manifest/resources falla | merge, permisos, traducción o recursos | task fallida + merged manifest/lint | Corrección mínima y tests | Cambia comportamiento no aprobado |
| `bundletool validate` falla | AAB inválido/corrupto | hash, ZIP, versión bundletool | Rebuild; no reparar ZIP manualmente | Siempre antes de upload |
| Draft/conflicto en track | Release/Edit abierto o Console invalidó Edit | Publishing overview/API get edit | Resolver/descartar con usuario | Toda pérdida de draft requiere permiso |
| Play muestra otra huella | upload vs app signing confundidas o clave distinta | Etiquetas Play+cert AAB | Comparar tipo correcto; actualizar proveedores | No rotar sin diagnóstico |
| PAS confundido con upload | Se espera que AAB tenga huella final | Cert AAB vs App signing section | Documentar dos identidades | No cambiar key |
| Build en otra máquina genera dudas | Toolchain/deps/secret source distintos | ref, wrapper, dependency lock, manifest/hash | Rebuild controlado; SBOM/provenance si existe | Hash solo no prueba equivalencia |
| Revisión bloqueada | App content/Data Safety/login/política pendiente | Dashboard/Needs attention/errores | Usuario completa declaraciones exactas | Agente no decide respuestas legales |
| Save pero nada en review | Falta Send for review | Publishing overview | Usuario pulsa Send for review | No afirmar enviado |
| Approved pero no live | Managed publishing activo y cambios listos | `Changes in review` vacío y todos en `Changes ready to publish` | Usuario pulsa Publish changes | No afirmar publicado ni inferir que la opción está activa |
| App rechazada tras firma válida | Política/contenido, no criptografía | motivo oficial redactado | Corregir causa y reenviar | No regenerar claves |

## 10. Seguridad, backup y continuidad SDS

La práctica canónica es [`../../practices/07-security-baseline.md`](../../practices/07-security-baseline.md);
esta sección la aplica a Android sin duplicar su contrato:

- ubicación admitida: almacenamiento SDS cifrado fuera de repositorios y runners de CI protegidos;
- dos copias cifradas e independientes; al menos una fuera del equipo habitual;
- contraseñas separadas del JKS, con custodios y recuperación definidos;
- alias/huellas/fechas pueden inventariarse sin passwords ni rutas personales;
- prueba semestral o tras migración: restaurar, `keytool -list/-exportcert`, comparar SHA-256;
- traslado de equipo: canal cifrado, verificación de hash, permisos restrictivos, borrar copia temporal
  solo tras demostrar backup/recepción y con autorización;
- CI: secrets en environment protegido, runner confiable, sin forks, logs enmascarados, retención corta,
  aprobación para usar la clave y mínimo privilegio de service account;
- offboarding: revocar Play/CI/backup, revisar audit logs y resetear upload key si no puede excluirse copia;
- compromiso: preservar evidencia y rotar/resetear según tipo, no según extensión del fichero.

### 10.1. API keys Android

Primero identifique la API o SDK concreto y aplique su modelo oficial; no generalice una receta. Una
API key embarcada en una app distribuida no es confidencial frente a extracción. Secrets Gradle
Plugin, propiedades locales, variables o secretos CI evitan versionarla, pero no la vuelven secreta
dentro del artefacto [G6].

Las restricciones de aplicación y API son defensa en profundidad, no confidencialidad. En producción
use, cuando proceda, package y huella del certificado que firma el artefacto instalado —normalmente
la **app signing key** de Play—; desarrollo usa la huella de su variante. La upload key no sustituye
la firma distribuida [G7]. Revise por separado cuotas/límites efectivos, topes, presupuestos, alertas
y monitorización: un presupuesto con alertas no limita por sí solo el uso ni el gasto; algunas APIs
permiten cuotas y ciertos servicios admiten topes específicos, que deben comprobarse para la API
concreta [G8][G9].

Los SDK cliente oficiales deben seguir su propio modelo de restricciones y cuotas. Operaciones
privilegiadas, credenciales servidor y acceso sensible van a backend cuando la API y la arquitectura
lo permitan; esto no obliga a intermediar por backend todo SDK cliente con coste. La API key real de
FIELDS queda fuera de esta rama: no se reproducen keys ni huellas reales y su auditoría específica
sigue pendiente.

Puede guardarse en gobernanza: proceso, roles, placeholders, algoritmos mínimos, huellas de ejemplo
claramente ficticias, criterios y fuentes. Nunca: JKS/P12, privada, contraseñas, tokens, JSON de cuenta
de servicio, recovery codes, rutas personales o secretos reales. Las huellas reales de una app son
públicas pero pertenecen al registro de release/inventario restringido, no a esta guía reusable.

## 11. Checklists finales por escenario

### Primera publicación

- [ ] Cuenta/identidad/contacto/2FA/roles y requisitos de testing listos.
- [ ] Package definitivo y app creada manualmente.
- [ ] API actual, behavior tests, versión inicial.
- [ ] Upload key autorizada, PEM, huellas, backups; Play App Signing seleccionado.
- [ ] AAB firmado/validado/hash; App content/Data Safety/listing/pricing completos.
- [ ] Track de prueba, evidencia; producción y rollout autorizados; estado Published verificado.

### Actualización normal

- [ ] Base productiva, worktree limpio, máximo versionCode Play, target API vigente.
- [ ] Diff mínimo, tests/lint, firma upload aceptada, AAB validado/hash.
- [ ] Handoff: track/notas/países/%/managed publishing.
- [ ] Save→Send for review; aprobación→Publish changes si aplica; post-checks.

### Nueva upload key

- [ ] Motivo real y autorización; destino nuevo no existente.
- [ ] Generación interactiva, alias/vigencia, PEM y SHA-1/SHA-256.
- [ ] Dos backups cifrados y passwords separadas.
- [ ] Registro/reset humano; huella aceptada comparada antes del AAB.

### Upload key perdida o comprometida

- [ ] Confirmar que no sea solo PEM/alias/password.
- [ ] Confirmar PAS; preservar evidencia y restringir acceso.
- [ ] Nueva key autorizada; PEM; Request upload key reset por owner.
- [ ] Confirmación de huella; CI/local actualizados; bundle nuevo validado.

### Handoff a operador Play Console

- [ ] AAB path/nombre, SHA-256, package, code/name, targetSdk y upload SHA-256.
- [ ] Track, release notes, país, porcentaje y decisión managed publishing.
- [ ] Declaraciones que requieren juicio humano y STOP conditions.
- [ ] Evidencia requerida: bundle row, warnings, Submission ID/estado.
- [ ] Recordatorio: Save no envía; In review no publica; managed ON retiene.

### Después de publicación

- [ ] Estado Published y versión en track/país/% correctos.
- [ ] Instalación/actualización desde Play; versión y funciones críticas.
- [ ] App signing fingerprints y servicios externos operativos.
- [ ] Crashes/ANR/feedback; staged rollout aumentado solo con autorización.
- [ ] Evidencia mínima y backups/artefactos con retención adecuada.

## 12. Google Play Developer API y CI

### 12.1. Qué puede automatizarse

Para una app existente y con una identidad de servicio autorizada, la Publishing API permite [G11]:

- crear/validar/commit un **Edit**;
- subir AAB y obtener `versionCode`, SHA-1 y SHA-256 de la carga;
- listar/actualizar tracks y releases, incluido staged rollout y halt/resume;
- gestionar listings, imágenes y otros metadatos soportados;
- escribir Data Safety mediante `applications.dataSafety` con el CSV oficial;
- consultar releases actuales con los recursos de tracks.

Flujo conceptual —todas las llamadas mutadoras requieren autorización/gate—:

```text
preflight read-only
  -> edits.insert
  -> bundles.upload
  -> comprobar versionCode + SHA-256 devueltos
  -> edits.validate
  -> tracks.update(status=draft|inProgress|completed)
  -> aprobación humana
  -> edits.commit
  -> verificación read-only
```

Un commit puede iniciar revisión o despliegue y es una acción externa de alto impacto. Console y API
no deben editar la misma app simultáneamente: un cambio en Console puede invalidar el Edit abierto.

### 12.2. Qué sigue humano, limitado o condicionado

- La API Edits solo modifica una app existente con un primer artefacto ya subido; creación, primer
  upload y consentimientos legales de publicación requieren Play Console según la guía oficial
  [G11].
- La API no sustituye la responsabilidad humana sobre App content, Data Safety, privacidad, target
  audience, acceso de revisores o declaraciones. Que exista endpoint no autoriza respuestas legales.
- Alta estándar de Play App Signing, reset de upload key y decisiones de upgrade se gestionan en
  Console. Los endpoints de `appsigning` con Cloud KMS son un modo enterprise avanzado, no sustituto
  [G2].
- Managed publishing y revisión pueden alterar cuándo queda live un commit; verifique estado real
  [G3][G4].

### 12.3. Identidad y mínimo privilegio

El alta requiere **REQUIERE USUARIO / AUTORIZACIÓN EXPRESA**: proyecto Google Cloud, API habilitada,
service account/OAuth y permisos Play específicos. Google ya no exige enlazar el developer account a
un Cloud Project, pero la cuenta de servicio se invita desde Users and permissions [G11]. Use:

- una identidad por entorno/propósito, sin llaves JSON de larga vida cuando el CI admita federación;
- permisos de solo lectura para auditoría y release-to-track solo para el job aprobado;
- environment protegido, reviewers, audit log, locks por package y expiración/rotación;
- dry-run/`edits.validate`, comparación de AAB hash y versión, y un gate justo antes de commit;
- respuesta a 409/concurrencia descartando/recreando el Edit tras revalidar, no reintentando a ciegas.

FIELDS no tenía service account ni flujo API configurado en la release histórica; toda la operación
de Play fue manual.

## 13. Caso real FIELDS — 1 de septiembre de 2026

La reconstrucción de actores está en [§8](#8-qué-se-automatizó-realmente-en-fields). Este apéndice
conserva solo lo transferible y la evidencia mínima:

| Dato | Clasificación | Evidencia/uso futuro |
|---|---|---|
| `com.southdesertstudio.fieldsapp` | Verificable localmente | Manifest del AAB; identidad que nunca debe cambiar en updates |
| `1.0.8`, `versionCode 20260901`, API 36 | Verificable localmente y Play | Manifest+captura bundle; histórico, no reutilizar |
| `build/release-artifacts/FIELDS-1.0.8-20260901.aab` | Verificable localmente si el artefacto existe | Ruta relativa ignorada; no es fuente canónica |
| SHA-256 `badf66348e519856442cb754336279e3dbeb99d3ff5f2d6fdb0d0d6fddc01e63` | Verificable localmente | Integridad de ese AAB exacto; irrelevante para otro build |
| Certificado AAB=certificado upload exportado | Verificable localmente | Comparación DER/huella; no se publican aquí las huellas reales |
| Production, `1.0.8 [Actualización técnica]`, 100% | Solo Play Console/capturas | Decisión histórica, no default reusable |
| Submission 10, 17:27 Europe/Madrid, `In review` | Solo Play Console/captura | Estado final conocido ese día; no equivale a Published |
| Configuración de Managed publishing | No demostrada | Debe comprobarse en Console; no se infiere de `In review` |
| Cómo se creó/reseteó la nueva upload key | No reconstruido con evidencia suficiente | No inventar; solo se prueba que Play aceptó el AAB firmado |

**Punto de continuación de ese caso histórico:** el último estado demostrado es `In review`, no
`Published`. No se pulsa `Publish changes` mientras siga en revisión. Después de la aprobación, solo
se pulsa si Console muestra Managed publishing activo y todos los cambios en `Changes ready to
publish`; si está desactivado, se comprueba el resultado del flujo estándar automático [G3]. Al final
debe verificarse la ficha pública/track y comprobarse de nuevo el aviso de inactividad y el contacto;
ninguno de estos pendientes se declara resuelto para FIELDS. Son acciones de Play Console y usuario.

Cambios transferibles: construir desde la rama productiva, no contaminar `dev` con rutas/secrets de
producción; quitar debug signing; inyectar firma por entorno; validar el AAB real; y distinguir Save,
Send for review y Publish changes. La actualización no introdujo features ni cambios visuales.

Se conserva como pendiente una auditoría específica de la API key de FIELDS, fuera de esta rama. No
se reconstruye aquí su valor, API/SDK, restricciones, cuotas ni certificado aplicable; cualquier
corrección debe seguir [§10.1](#101-api-keys-android) sin presentar almacenamiento local como
confidencialidad dentro del artefacto.

## 14. Fuentes oficiales verificadas y registro de cambios

Consulta: **2026-09-01**. Se usaron fuentes primarias; si una interfaz difiere, vuelva a abrir la
fuente antes de ejecutar una acción externa.

| ID | Fuente oficial | Fecha de consulta | Alcance verificado |
|---|---|---|---|
| [G1] | [Target API requirements](https://developer.android.com/google/play/requirements/target-sdk) | 2026-09-01 | Requisitos desde 31-08-2026, disponibilidad, extensión, excepción y form factors |
| [G2] | [Use Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en), [Sign your app](https://developer.android.com/studio/publish/app-signing) y [advanced KMS API](https://developers.google.com/android-publisher/api-ref/rest/v3/appsigning/enrollApp) | 2026-09-01 | Alta, custodia, app/upload keys, certificados, reset/activación, upgrade, variantes Android y límite del API avanzado |
| [G3] | [Managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654?hl=en) | 2026-09-01 | Flujo estándar, activación, `Changes ready to publish` y `Publish changes` |
| [G4] | [Publishing status](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en) | 2026-09-01 | `In review`, `Published` y demás estados |
| [G5] | [Inactive accounts](https://support.google.com/googleplay/android-developer/answer/11605267?hl=en) | 2026-09-01 | Contacto y publicación exigidos; revisión posterior del aviso |
| [G6] | [Android security tips](https://developer.android.com/privacy-and-security/security-tips?hl=en) | 2026-09-01 | Extracción de API keys y separación del control de versiones |
| [G7] | [Google Maps API security](https://developers.google.com/maps/api-security-best-practices) | 2026-09-01 | Restricciones Android package/certificado/API y uso cliente/backend |
| [G8] | [Capping API usage](https://docs.cloud.google.com/apis/docs/capping-api-usage) | 2026-09-01 | Cuotas y límites efectivos por API |
| [G9] | [Cloud Billing budgets](https://docs.cloud.google.com/billing/docs/how-to/budgets) | 2026-09-01 | Presupuestos, alertas y topes de gasto compatibles |
| [G10] | [AGP 8.10](https://developer.android.com/build/releases/agp-8-10-0-release-notes?hl=en) y [versioning](https://developer.android.com/studio/publish/versioning) | 2026-09-01 | API 36/toolchain; `versionCode` creciente, no reutilizable y máximo |
| [G11] | [Developer API setup](https://developers.google.com/android-publisher/getting_started?hl=en), [Edits](https://developers.google.com/android-publisher/edits), [bundles](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.bundles), [releases](https://developers.google.com/android-publisher/api-ref/rest/v3/applications.tracks.releases), [tracks](https://developers.google.com/android-publisher/tracks) y [Data Safety](https://developers.google.com/android-publisher/api-ref/rest/v3/applications/dataSafety) | 2026-09-01 | Identidad, permisos, límites de Edits, upload, hashes, releases/tracks, Data Safety y concurrencia |
| [G12] | [Personal account testing](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-GB) y [developer verification](https://support.google.com/android-developer-console/answer/16561738?hl=en) | 2026-09-01 | Testing de cuentas personales e hitos de verificación |

### Deltas respecto al procedimiento histórico FIELDS

- API 36 entró en vigor el día anterior y FIELDS ya la aplicó correctamente como dato histórico
  [G1], no como regla futura fija.
- La documentación vigente de Play App Signing describe claves híbridas/rotación por rangos Android;
  no existe evidencia suficiente para reconstruir cómo se creó o reseteó la upload key de FIELDS ni
  para afirmar una rotación de su app signing key.
- La Publishing API actual expone listados de releases, Data Safety y modos avanzados Cloud KMS, pero
  FIELDS no tenía API/CI y su publicación fue manual.
- La guía histórica implícita no demostró todos los versionCode antes de elegir uno alto; ahora es un
  gate explícito.
- Android Developer Verification tiene hitos de 2026 que deben revisarse para nuevas apps/cuentas;
  no fue una acción demostrada en la release FIELDS.

### Registro de revisiones de esta guía

| Fecha | Cambio |
|---|---|
| 2026-09-01 | Versión inicial basada en fuentes oficiales vigentes y reconstrucción de FIELDS 1.0.8 |

## 15. Apéndice — prompts reutilizables

La fuente canónica de edición es
[`../prompts/android-google-play-agent-prompts.md`](../prompts/android-google-play-agent-prompts.md).
El siguiente bloque debe ser idéntico al de ese fichero; se duplica expresamente para poder usar la
guía sin cargar otro recurso.

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
