# JIA-2026-09-18-13 — Camino de grosor uniforme con paradas circulares y Talleres sin texto introductorio

**Fecha:** 2026-09-18 · **Origen:** mensaje del promotor en chat tras JIA-2026-09-18-12. Ejecutado en la misma sesión.
**Adjunto:** `docs/prompts/assets/JIA-2026-09-18-13-camino-actual.png` (estado del camino antes del cambio).

## Encargo (transcripción)

«El trazo puede mantener ese dibujo de arriba con un loop pero… que la línea tenga grosor uniforme y que los "puntos"
pintados sean círculos porfa <3. Y este texto "Cada taller lleva nombre de película y una propuesta práctica para el
aula. Abre la ficha para ver quién lo imparte y de qué trata. / Pasa el cursor, toca o usa el teclado para abrir cada
ficha." lo eliminamos completamente.»

Añadidos durante la ejecución:

- «Debajo de "VER FICHA" que haya un "DESCARGAR DOSIER" y se proveerá de link para cada uno, pero dicho link en fichero
  de configuración de dicha section ;)»
- [Captura del botón «Quiero acoger las JIA» en hover] «El botón está genial, pero cuando se hace hover cambia el fondo;
  que también cambie el color de las letras a uno clarito ;) (como el del fondo de esa section).»

## Alcance

1. Camino: mismo trazado con lazo; ancho constante y discos circulares (se desactiva el carácter «a mano» de -10).
2. Talleres: fuera la entradilla y la pista (render, modelo y copy de la entradilla). La pista compartida sigue en
   Experiencias, que no se ha pedido tocar; la marca de «provisional» de Talleres se conserva cuando las marcas están activas.
3. Talleres: bajo «Ver ficha», «Descargar dosier» por taller. Enlaces en `lib/content/config/talleres.ts`
   (`TALLER_N_DOSIER`, hoy `null`); sin enlace se muestra como pendiente (no es un botón muerto) y pasa a enlace real al
   pegar la URL. Etiquetas en copy.
4. Botón no disponible («Quiero acoger las JIA»): en hover el fondo ya pasaba a terracota profunda; ahora el texto pasa
   a marfil (`--jia-ivory`).
5. Verificación, commit, informe y push.
