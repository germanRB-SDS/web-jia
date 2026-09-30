# Convertir una web terminada en un modelo modular

Caso aplicado: [web-jia](../../built-projects/web-jia/INDEX.md). El diseño se conserva como composición,
contratos de módulos, fuentes reproducibles y evidencia visual, no solo como una colección de screenshots.

- Separar identidad visual (paleta, fuentes, fotos) de jerarquía editorial y función de cada bloque.
- Asignar IDs de módulo estables; registrar orden original y recetas alternativas por negocio.
- Documentar estados y entradas: un screenshot de hover no explica tap, foco, cierre ni reduced motion.
- Exportar dependencias completas: TSX, estilos, motores, tipos, helpers, tokens, assets, lockfile y ejemplos.
- Mantener una sola fuente reusable por componente; enlazar los exports neutros desde cada modelo.
- Conservar snapshot de origen con commit y hashes como evidencia histórica, sin confundirlo con código vivo.
- Para foto/3D, conservar ratio/focal, máscara, cutout, marcador, GLB y fuente editable; las coordenadas
  deben depender de la imagen dibujada, no de la resolución de una captura.
- Distinguir reconstrucción visual offline (medios preservados) de build offline (necesita dependencias/fuentes).
- Mantener la skill fuera de rutas de autoactivación y cargar solo módulos seleccionados.

[Guía de estilo](../../built-projects/web-jia/STYLE-GUIDE.md) ·
[Composición reordenable](../../built-projects/web-jia/project-skeleton/COMPOSITION.md) ·
[Contratos por componente](../../built-projects/web-jia/web-components/INDEX.md).
