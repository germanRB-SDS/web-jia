# Fase E — retorno por inactividad

Resumen: 479fa43 distingue apertura y exploración; usa 5000ms y memoria de documento, no storage. Foco de teclado, modal, pointer activo, pestaña oculta y pérdida de foco impiden cierre. Desbloquear reinicia la ventana completa. El scroll programático no marca actividad; el swipe efectivo sí y su click residual no abre ficha. Salir de la sección conserva el cierre independiente. RAF de anchor y temporizadores se limpian.

Verification: V3 | TypeScript, cuatro checks básicos y 17 de resiliencia CDP | PASS. Sincronización de foco de Chrome headless necesaria: el primer ensayo sin foco pausaba correctamente el timer. Cambio final acotado de la ventana de supresión de click y cleanup de RAF revisado; pasada autoritativa de export en F cubrirá árbol final. Visibilidad y gestures en resiliencia incluyen eventos DOM sintéticos; no sustituyen dispositivo físico.

Moderado: un navegador físico puede diferir en secuencia pointercancel/scroll; destino F gesto touch nativo vía CDP y matriz de limitaciones. Resize/hover se completan en F. Severo: ocultación de foco/contenido por timer mitigada con guardas revalidadas, pruebas de foco y modal PASS; no defectos severos abiertos detectados. Crítico: ninguno nuevo detectado (sin backend ni datos sensibles).

Soluciones propuestas: conservar 5000ms/umbrales en configuración; no añadir almacenamiento de rechazo ni de exploración. Repetir solo pruebas afectadas si cambia el ciclo de eventos.
