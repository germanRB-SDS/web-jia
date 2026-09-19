# Caja del cartel dentro de la ficha de taller — antes (HEAD fa835f1) y después (flip-card)

Medida con `getBoundingClientRect()` del `Surface` del cartel, Chrome por CDP, ficha «Por un puñado de bloques».

| Ventana | Antes (left / top / width / height) | Después, al terminar el giro | Botón «Cerrar» (left / top) |
|---|---|---|---|
| 1440×900 | 264 / 223,69 / 320 / 452,61 | 264 / 223,69 / 320 / 452,61 (transform = identidad) | 1089,94 / 195,69 (igual) |
| 390×844 | 64 / 95,84 / 183,94 / 260,16 | 64 / 95,84 / 183,94 / 260,16 (transform = identidad) | 271,94 / 83,84 (igual) |

Con `prefers-reduced-motion: reduce` a 1440: 264 / 223,69 / 320 / 452,61, `transform: none` a los 150 ms de abrir (sin giro).
Reapertura: a los 120 ms de reabrir la matriz es un giro en curso (cos ≈ −0,50 → ≈ 120°): gira en cada apertura.
Fichas con flip-card: 6 (talleres); en Experiencias: 0. Consola sin errores ni avisos.
