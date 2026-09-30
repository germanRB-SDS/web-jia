# [64-1] — Modelo modular web-jia · informe de fase

## Resumen

Se ha creado built-projects/INDEX.md y el modelo web-jia: índice humano de 13 bloques, guía de
estilo, 14 capturas originales, skill manual archivada, contratos de interacción/composición,
notas de stack/i18n/medios/servidor y referencia reconstruible con 380 archivos de origen.
Incluye public optimizado y Blender/GLB; no incluye originales pesados, secretos ni dependencias
instaladas. Los tres exports portables anteriores siguen teniendo owner en resources.

Prompt: sds-dev-governance/built-projects/web-jia/metainfo/prompts/[64-1]catalogar-web-jia.md.
Change ID REL-2026-09-30-01; LEVEL 3 por promoción/distribución; áreas frontend y deployment.
Memorias: docs/memory/frontend.md y deployment.md. Sin cambios al runtime del sitio.
Implementación local: e7864e3a043ca58ec150753cb9eb4387583fd12a.
Implementación canónica publicada: 77184ff1eb168ab067729aee6cc242978e5d7dec; versión v1.32.0.

## Comprobación

- Instalación npm ci en copia independiente, Node 24.19.0: PASS.
- TypeScript y contenido (6 talleres, 56 personas, 2 experiencias, 96 medios): PASS.
- Builds Next 16.3.4 con webpack y comando normal Turbopack: PASS.
- 1847 checks estructurales: fuentes SHA-256, 14 PNG con dimensiones, enlaces, imports,
  formato skill/policy, sin symlinks ni builds dentro del catálogo: PASS.
- 425 archivos del catálogo incluidos en Git; SDS checker y AI assurance PASS.
- 12 copias activas reciben overlay aditivo: PASS; segunda pasada 0 cambios y todos los bytes
  del paquete idénticos. Reglas y VERSION de los receptores preservados.

Verification: V1 | delta de empaquetado, imports, recursos y build | PASS.
La UI original se conserva byte a byte; no se declara una nueva QA visual integral. Las capturas
son evidencia aportada por el usuario. Los exports P no cambiaron y mantienen su evidencia previa.
No hay pruebas de dispositivo físico nuevas ni admisión operativa de la skill.

## Riesgos moderados y soluciones

1. Snapshot contiene identidad, personas, logos y medios del evento; no confundirlo con stock
   neutro. Destino: guía MEDIA y skill obligan a sustituir negocio/medios en una nueva adaptación.
2. Falta screenshot de Acoge, baraja móvil y reverso. Destino: documentados desde código;
   ACCEPTANCE los incluye para la próxima adaptación, sin inventar evidencia visual.
3. Build desde máquina vacía necesita npm/fonts y generadores Blender no se prueban aquí.
   Destino: lockfile/runtime fijados, derivados locales, README declara límites; no correr assets
   sin originales. El snapshot mide unos 113 MiB por conservar PNG/MP4 originales de referencia.
4. Copias de gobernanza tienen divergencias preexistentes y SPLIT_VERSION v1.25.0.
   Destino: solo adición de corpus con comprobación previa de conflictos, recibo de hashes y
   append en índices; ningún upgrade íntegro ni sobrescritura de reglas o trabajo ajeno.
5. Código de referencia arrastra whitespace histórico y comentarios/documentos antiguos.
   Destino: preservar hashes, distinguir snapshot de contratos actuales y verificar delta redactado
   aparte. La skill queda archivada fuera del descubrimiento y sin autoactivación.

## Riesgos severos/críticos

No se identifican riesgos severos o críticos nuevos en el delta: no hay acceso al servidor,
backend, auth, migraciones, secretos ni cambio del producto en ejecución. Se conserva evidencia
histórica, sin reclamar una auditoría de seguridad exhaustiva de toda la aplicación original.

## Distribución y recuperación

Actualizadas 12 copias activas: auragenda-home, fields-android, fields-web/fieldsapp-web-main,
maryna-ventura, roots, checkout sds-dev-governance, south-desert-main-web/web-sds, teragenda,
upnews, upnews-android, web-3d y web-jia. Excluidos archivos/copias históricas y subtree de solo
lectura. Cambios de receptores quedan locales; sin commit/push en otros proyectos.

Canon: commit/push en sds-dev-governance. Web-jia: commits locales y cierre en main; sin push ni
despliegue de la web. Rollback: revertir commits del paquete; para overlays comprobar recibos y
retirar únicamente archivos cuyos hashes aún coincidan, preservando posteriores cambios locales.
Estado del objetivo: IMPLEMENTADO, validado y distribuido; skill manual no activada, como se pidió.
