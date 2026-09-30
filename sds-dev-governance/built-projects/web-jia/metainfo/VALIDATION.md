# Validación de la conservación — 2026-09-30

Origen: web-jia `4fa5c890ed73a41bfa72515dfc4a5b38999d3d0d`. Se preservan380 archivos de referencia
con SHA-256 y14 capturas originales; las adiciones de arranque se enumeran en source-manifest.json.

| Alcance | Resultado y evidencia |
|---|---|
| Instalación aislada | PASS: npm ci con lockfile, ignore-scripts, Node24.19.0;37 paquetes instalados. |
| Tipos | PASS: npm run typecheck en copia fuera del kit. |
| Datos/medios | PASS: npm run check:content;6 talleres,56 personas,2 experiencias,0 recursos,96 entradas de media. |
| Build | PASS: npm run build (Turbopack) y next build --webpack con Next16.3.4; export de /, /almeria-2026 y rutas auxiliares. |
| Integridad y referencias | Verificación reproducible con `python3 metainfo/verify-package.py`: fuentes byte a byte,14 PNG/dimensiones, enlaces de docs, imports locales, skill y ausencia de symlinks/builds. |
| Skill | Frontmatter nombre/description, referencias y policy explícita comprobados. quick_validate oficial requiere PyYAML ausente; se usó comprobación local de formato sin instalar dependencias. No se probó invocación: debe permanecer archivada. |
| UI de origen | Conservación por identidad de fuente; no se declara una nueva sesión QA visual de toda la landing. Las14 imágenes son aportadas por el usuario. |
| Exports P | Validación previa propia en cada resource: demos aisladas + desktop/touch/reduce. Sin cambios en esos componentes; no se repitió su QA. |

Verification: V1 | empaquetado/imports/build + integridad de medios | PASS tras cierre de referencias.
La fuente original no se ha refactorizado. La verificación detectó durante redacción enlaces a este
informe aún no creado; se completó el documento y se volvió a verificar antes de cerrar.

## Límites

No se certifica otra versión de dependencias, instalación sin red ni soporte idéntico de APIs de
vídeo en todos los dispositivos. No hay capturas móviles/Acoge/reverso aportadas. La skill está
archivada sin instalación ni admisión operativa. Una adaptación a otro negocio debe aplicar
[ACCEPTANCE](ACCEPTANCE.md) con sus propios datos, arte y plataforma.

No ejecutar asset-build sin originales pesados: se conservan derivados completos de runtime.
Generadores Blender y QA históricos se guardan como referencia; esta entrega no los ejecuta ni
asegura que funcionen en una versión distinta de Blender/navegador.
