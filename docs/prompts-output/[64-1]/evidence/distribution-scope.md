# Alcance de distribución

Inventario dinámico guardado en copies-before.tsv. El checker retorna1 por SPLIT_VERSION v1.25.0
preexistente (copias históricas y ramas locales divergentes). No se realiza upgrade/reemplazo de kits:
se publica solo el nuevo corpus opcional built-projects y su receta; índices se amplían sin cambiar
bytes existentes. Reglas, VERSION y cambios ajenos de receptores se conservan.

Las12 copias activas de la distribución anterior siguen existiendo y el inventario las confirma.
Se excluyen archivos AZURE_MIGRATION_VPS_DEPLOYMENT, copia project-based-on-teragenda,
upnews_backup_16_08_2026 y subárbol upnews-android/upnews de solo lectura. La copia de web-jia
es autora de v1.32; las demás reciben overlay identificable. No se hace commit ni push en receptores.

Dry-run: cero conflictos,430 archivos por receptor y1 recibo en web-jia. El distribuidor rechaza
symlinks, ficheros diferentes y cambios concurrentes; solo crea ausentes o añade al final de índices.
El snapshot contiene código que queda bajo sds-dev-governance, ya excluido en consumidores TypeScript
que lo requieren tras [64-0]. No se instala la skill ni se modifica ningún adapter del receptor.
