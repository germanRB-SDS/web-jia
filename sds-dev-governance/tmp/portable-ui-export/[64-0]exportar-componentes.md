# [64-0] Exportar componentes interactivos de web-jia

## PREFACE — NON-EXECUTABLE
Se conservan tres implementaciones validadas por el propietario para reutilizarlas sin depender de
web-jia. Implica aislar dependencias y documentar integración, datos, recursos visuales y límites.
Riesgo moderado: perder estilos, interacciones o accesibilidad al extraer; severo: sobrescribir
mejoras de otras copias de gobernanza. No se prevén riesgos críticos nuevos. Execute from `## Status` onward.

## Status
Autorizado por el propietario el 2026-09-29. LEVEL 3; áreas: frontend, gobernanza/distribución.
Change ID: REL-2026-09-29-01. Una fase de implementación y un cierre documental separado.

## Excepción de ubicación autorizada
ADDITION / excepción concreta a práctica 02: por petición explícita del propietario, este prompt
vive en `sds-dev-governance/tmp/portable-ui-export/`, nunca en los prompts del proyecto.
La continuidad y el informe siguen en docs/prompts-output/[64-0].

## Objetivo y alcance
1. Descubrir el índice de resources y preservarlo; registrar cada nuevo recurso modular.
2. Extraer Quiénes somos completo (cabecera configurable + carrusel infinito + tilt/glow),
   tira de cine (imágenes, hover de ampliación, tap/clic/teclado con visor), y cubo de seis caras.
3. Conservar motores y geometría probados; aislar imports de aplicación, datos y tokens.
   No cambiar la web original. Cada recurso debe funcionar copiando sólo su carpeta.
4. Incluir tipos/props, estilos completos, configuración, soporte de motion, dependencias y
   versiones, ejemplo ejecutable, imágenes neutras, procedencia por archivo y guía de integración.
   No redistribuir fotografías, logos, dibujos ni fuentes de terceros sin licencia verificable.
5. Documentar diferencias respecto del original, requisitos de navegador, SSR, limpieza de
   listeners/RAF, teclado, touch, reduced motion, vacíos y limitaciones verificadas.
6. Exportar a knowledge/web-jia lo reutilizable de arquitectura, constantes, medios y animación.
7. Validar tipos, build e interacción real desktop/touch/reduced motion con herramientas existentes.
   Verificar índice, ausencia de imports huérfanos y recursos faltantes. No afirmar pruebas no hechas.
8. Promocionar el delta al repositorio canónico germanRB-SDS/sds-dev-governance mediante commits
   explícitos y git-safe-push. Preservar cambios ajenos; publicar versión nueva y distribución
   aditiva de recursos cuando una copia no pueda actualizarse entera sin perder sus deltas.
9. Registrar informe/riesgos y commits; comprobar remoto. Sin despliegue de web-jia.

## Contratos y aceptación
Seguir GOVERNANCE.md y prácticas enrutadas; aplicar manualmente guías SDS Impeccable y gstack.
El mapa original es lib/content/index.ts (negocio), copy/ (texto), media.ts (medios), palette.css
(colores), lib/motion (política). El destino debe ofrecer equivalentes por configuración.
Aceptación: pedir un recurso por nombre desde otro proyecto basta para localizarlo, copiarlo,
instalar dependencias declaradas, ejecutar su demo y adaptar datos/paleta sin buscar en web-jia.
