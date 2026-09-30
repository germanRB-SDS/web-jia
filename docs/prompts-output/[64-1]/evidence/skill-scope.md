# Skill archivada [64-1]

Petición explícita: guardar skill en sds-dev-governance, no activarla en raíz. Se redactó como
borrador/manual usando instrucciones textuales de skill-creator; no se invocan init/generate ni
plugins. No hay symlinks hacia rutas de agentes. G1/G2: sin efectos ni autoridad delegada;
G3: solo draft versionado; G4: nombre propio, enlaza owners existentes; G6: retirada local reversible.
G5 de futura ejecución/instalación no evaluado; ledger QUARANTINED hasta esa evaluación concreta.
El catálogo archivado no autoriza su ejecución ni crea una obligación de activarlo.

Validación de formato: quick_validate.py inspeccionado (sha256
ee6dba90f44d37171c5a6edb8095979c54919ff6822c1a907afca2e78c48738c), pero PyYAML
no está disponible. No se instaló una dependencia opcional. Se aplica verificación estructural
local de frontmatter simple, nombre, descripción, policy y referencias junto al paquete.
