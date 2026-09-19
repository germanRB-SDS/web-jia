# Evidencia 01-2

- `regression/`: dos snapshots, hashes y diferencias 01-1, creados antes de nuevos cambios.
- `recovery-verification.json`: extracción real a carpetas nuevas y comparación de 363/406 archivos.
- `bootstrap-location-checks.json`: 10 tests dirigidos y tres smokes de entrada/dry-run.
- `home-location.patch`: cambio de ubicación HOME aislado de los cambios Sentinel anteriores.
- `validation.json`: estructura, hashes, preservación y comprobación del parche sobre baseline.

Evidencia local bajo la misma cuenta, sin custodia independiente. No hay tests con efectos
destructivos ni sesiones de modelos de ensayo. Los snapshots no contienen `.git` ni archivos
ignorados; el manifiesto describe el alcance y las omisiones.
