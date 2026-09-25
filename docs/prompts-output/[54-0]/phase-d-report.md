# Fase D — carteles móviles completos

Resumen: 1531e1a reserva 5% por lado dentro de la misma celda, reduce el cartel visual al 90%, conserva ratio/pin y no altera acciones, fullscreen ni escritorio. Capturas revisadas tras corregir un selector del harness que abría la ficha en vez de expandir el mazo; aquella prueba no era evidencia válida de geometría expandida.

Verification: V2 | TypeScript; seis anchos y ocho poses máximas del tilt por cada ancho móvil | PASS. Mínimo margen geométrico medido: 1.80 px a 320, 1.52 px a 390 y 1.29 px a 440/759. Escala 1.07, rotación 12°, perspectiva existente. Evidencia: evidence/qa-geometry.json y workshops-*.png. No se confunde la siguiente carta parcialmente visible con recorte de la activa.

Moderado: las sombras decorativas pueden superar la envolvente de imagen; el contenido/pin cabe. Efectos reales de ratón/touch y última carta se amplían en F. Solución: mantener reserva y comprobar extremos tras cambios de TILT.

Severo: no se detecta ocultación de acciones/contenido ni reducción de targets (44px conservados). Crítico: ninguno nuevo detectado; cambio de presentación sin datos ni red.
