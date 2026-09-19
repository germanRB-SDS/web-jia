# Recuperar el estado previo a Sentinel

Punto de referencia: `79aa7ffce2563e0e3abc189b19054187daf1a43d`, v1.27.0 (commit del
10 de septiembre; seguía siendo HEAD antes de implementar Sentinel el 13). No se inventó
un commit del día 12 ni una copia histórica de todo el disco.

El paquete [regression/](evidence/regression/) contiene:

- `pre-sentinel.tar.gz`: árbol completo versionado, 363 archivos, sin código Sentinel.
- `estado-local-antes-01-2.tar.gz`: 406 archivos; versión local con candidato 01-1 y documentos
  no versionados, antes de esta tarea. Permite conservar también el trabajo de anoche.
- `manifest.json` y `SHA256SUMS`: contenidos, modos Git, tamaños y hashes.
- `tracked-forward.patch` / `tracked-reverse.patch`: siete archivos versionados cambiados
  por 01-1. El inverso no retira los nuevos archivos ni representa por sí solo todo el rollback.

No contienen `.git`, archivos ignorados ni credenciales globales. Los tres `.DS_Store` quedaron
intactos fuera del paquete. El estado no versionado previo al 12 no tenía una copia íntegra:
los antecedentes actuales están conservados, no se afirma reconstrucción histórica de esos bytes.
Las copias están en este repositorio y bajo la misma cuenta; no son inmutables ni W_E.

## Recuperación sencilla y conservadora

Desde la raíz del repositorio, estos comandos verifican el paquete y recuperan la fuente
previa **en una carpeta nueva**, sin tocar la actual:

```bash
SDS_REGRESSION="$PWD/docs/prompts-output/[01-2]/evidence/regression"
(cd "$SDS_REGRESSION" && shasum -a 256 -c SHA256SUMS) && \
SDS_RECOVERED="$(mktemp -d /private/tmp/sds-pre-sentinel.XXXXXX)" && \
tar -xzf "$SDS_REGRESSION/pre-sentinel.tar.gz" -C "$SDS_RECOVERED" && \
printf 'Fuente recuperada: %s\n' "$SDS_RECOVERED"
```

Para recuperar el candidato anterior a esta tarea, usar el segundo archivo en otra carpeta
nueva. Ninguna copia se activa automáticamente. No extraer encima del repositorio actual:
mezclaría archivos nuevos con viejos y podría sobrescribir trabajo posterior. Para retomar
con Git se conserva el SHA del commit en el repositorio original; el tar es una fuente sin Git.
`/private/tmp` puede limpiarse: conservar los archivos tar del paquete para recuperación duradera.

La restauración a directorios nuevos **se ejecutó** y verificó contra el manifiesto para ambos
archivos: [evidencia](evidence/recovery-verification.json). Se comprobaron contenido, inventario
y modos ejecutables. No se ejecutaron scripts de la copia, instaladores ni pruebas destructivas.
No se han probado restauración de configuración activa, rollback in-place ni protección Sentinel.

## Si se decide retirar Sentinel del árbol actual

Primero conservar cualquier cambio posterior a los hashes del paquete. Preparar un diff de
retirada solo de 01-1 y mover sus archivos nuevos a una carpeta de archivo única, manteniendo
prompts/resultados como historial. No usar reset, clean, stash ni aplicar el inverso a ciegas.
Los siete archivos versionados incluyen documentación compartida: preservar las adiciones de 01-2.

La protección HOME solicitada en esta tarea es independiente de Sentinel y no existía en el
baseline. Su parche aislado está en [home-location.patch](evidence/home-location.patch):
conservarla si se abandona Sentinel. Su aplicabilidad al baseline se comprueba por separado;
el archivo pre-sentinel permanece exacto y sin esta adición. No aplicar parches sobre datos
posteriores que no coincidan. Una retirada en el árbol actual se prepara contra esos bytes.
