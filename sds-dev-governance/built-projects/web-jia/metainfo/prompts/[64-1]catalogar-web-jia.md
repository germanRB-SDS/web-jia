# [64-1] — Conservar web-jia como modelo modular reutilizable

## PREFACE — NON-EXECUTABLE

Esta ampliación de [64-0] conserva el diseño validado de web-jia, sus 14 capturas aportadas
por el propietario y las implementaciones que permiten reconstruirlo sin depender del sitio online.
Añade un catálogo opcional, una skill manual y un esqueleto de referencia. No cambia la landing.
Riesgo moderado: confundir marca/contenido original con plantilla genérica, o reutilizar un efecto
sin sus dependencias. Mitigación: contratos por módulo, snapshot con huellas y documentación de
medios, configuración, límites y validación. No se anticipan riesgos severos/críticos nuevos.
Execute from `## Status` onward.

## Status

READY → ejecutar en el proyecto web-jia; Change ID REL-2026-09-30-01.
LEVEL 3 por promoción entre repositorios. Áreas: frontend y deployment (configuración de referencia).
La petición del propietario autoriza guardar el prompt aquí, fuera de docs/prompts del proyecto;
es una excepción explícita de ubicación, no un cambio de la regla general.

## Objetivo

Crear built-projects/INDEX.md y built-projects/web-jia con:
- INDEX.md: tabla humana de menú a footer, IDs estables, composición, jerarquía, comportamiento
  responsive, interacciones y enlaces a imágenes locales.
- .skills/build-web-jia-model/SKILL.md: skill breve de uso explícito, sin instalación, activación
  ni cambio de adapters. Guía la selección/reordenación de bloques y el cambio de negocio.
- project-skeleton/: base real congelada, configuración y dependencias fijadas, código y medios
  necesarios para reconstruir la referencia; instrucciones para convertirla en otro negocio.
- web-components/: contratos modulares, composición, dependencias, hover/tap/teclado/motion,
  fuentes exactas. Los tres exports portables existentes siguen siendo propietarios únicos.
- project-screenshots/: copiar las 14 imágenes adjuntas sin modificar, con dimensiones, SHA-256
  y mapa sección/estado. No simular capturas ausentes (móvil, reverso y Acoge JIA).
- server-config-info/: stack, versiones, i18n, constantes, assets, render estático, límites y
  configuración de servidor sin credenciales ni permiso implícito de despliegue.
- metainfo/: procedencia, manifiestos, validación, derechos de referencia y este prompt.

## Módulos

Menú; hero; enlaces rápidos; foto degradada + texto + ruta 3D; vídeo con transporte, fullscreen,
PiP y plegado; programa de dos jornadas (columnas escritorio/control deslizante móvil); texto+cubo;
catálogo de tarjetas (grid, baraja móvil, tilt, hover, modal, blur, flip); experiencias con film;
división recta texto/foto; alternativa foto degradada/texto; colaboradores; footer fotográfico 2D/3D.
Analizar tamaños relativos, familias, pesos, line-height, espaciado, paleta, recorte y capas.
Distinguir evidencia de captura, implementación y variante propuesta; no presentar film CSS como
WebGL ni un screenshot como prueba de una animación. Documentar Blender solo con fuentes existentes.

## Ejecución y entrega

Inspeccionar el código y las memorias afectadas. Preservar el comportamiento conocido en el snapshot.
Conservar fuentes Blender y GLB, configuración geométrica y assets derivados que usa el runtime;
no copiar node_modules, builds, secretos, originales de vídeo de varios GB ni backups editoriales.
Exportar a knowledge/ solo aprendizajes transferibles, enlazando el catálogo en lugar de duplicarlo.
Validar las huellas, enlaces, importaciones, skill y build de la referencia fuera del kit. Mantener
checkpoint y evidencia en docs/prompts-output/[64-1]/. Cerrar con commits y publicar el paquete en
el repositorio canónico sds-dev-governance; distribuir de forma aditiva a las copias activas admitidas
por el inventario, preservando cambios locales. Esta entrega continúa la autorización del propietario
de [64-0]; no publica ni despliega la web ni hace push de otros proyectos.
