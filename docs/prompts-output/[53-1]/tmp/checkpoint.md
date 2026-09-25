# Continuidad [53-1] — REL-2026-09-25-02

- El propietario validó visualmente [53-0] y autorizó guardar, integrar y publicar. Sustituye el gate pendiente del informe histórico [53-0].
- Prompts previos: e35fc2d, 60ee302, bdc66ef. Añadido posterior: menú móvil completamente dentro de la pantalla.
- Fichas móviles a pantalla completa, cartel reducido a la derecha con texto alrededor, Cerrar fijo y reinicio de scroll al reabrir. Opt-in solo talleres, con foco nativo y bloqueo/restauración del scroll de fondo.
- Baraja contraída al salir de sección arriba/abajo, salvo ficha abierta. Cabecera móvil fija con espacio reservado, ancho 100vw; degradado hero 22% → 11%.
- Diagnóstico de viewport: el desbordamiento previo ampliaba layout viewport (495 px para pantalla de 440), desplazando controles. Contención horizontal en html/body solo en móvil permite alinear viewport y pantalla; carruseles conservan sus scroll internos.
- TypeScript, contenido y exportación webpack verdes. QA final: 66 aserciones PASS (63 de fichas/cabecera/baraja y 3 de viewport/carrusel a 440 px). Capturas revisadas; evidencia en evidence/.
- Base compartida 5b131c9. next-env.d.ts ajeno en raíz se preserva. node_modules enlazado solo local; nunca incluir. Sin cambios a maestra/aula/foto/luces.
- Implementación cdd0472 verde; informe/evidencia consolidados en commit documental separado. Fetch confirma main/origin en 5b131c9 sin cambios concurrentes nuevos; siguiente paso integración fast-forward y safe push ya autorizados.
