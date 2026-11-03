# [70-0] Informe — «Recursos del taller» e «Inauguración de las JIA 2026»

- Fecha: 2026-11-03 · Prompt: `docs/prompts/[70-0]recursos-del-taller-e-inauguracion.md` · Estado: implementado,
  pendiente de validación visual del promotor; **sin push ni despliegue**.

## Resumen

1. **Talleres · tarjeta.** Tercer enlace «Recursos del taller ↗» (misma voz que «Ver ficha» / «Descargar dosier»),
   a la URL de cada taller en `lib/content/config/talleres.ts` (`TALLER_N_RECURSOS`), en otra pestaña. Desde 760 px
   los tres enlaces quedan a ~16 px entre textos (antes ~32 px): objetivo de 32 px de alto en lugar de 44 y sin hueco
   de fila. En móvil (< 760 px) la separación no cambia (44 px).
2. **Talleres · ficha.** Bajo «Dosier ↓», botón de cuero «Recursos ↗» del mismo ancho, en móvil y escritorio, con
   nombre accesible «Recursos del taller {título} (Padlet, se abre en otra pestaña)».
3. **Inauguración.** `components/site/InaugurationBand` bajo la Intro: misma barra de cine (alto 88 px a 1440, igual
   que la Intro), en el token nuevo `--jia-saddle`, «Vídeo» a la izquierda, «Inauguración de las JIA 2026» en la
   cursiva de la edición y un disco de play a la derecha. Toda la franja es un enlace a YouTube (otra pestaña). En hover
   o foco el cuero se calienta, el disco se llena de marfil y aparece «Ver en YouTube ↗»; al pulsar, el disco se hunde
   y suelta una onda. En móvil, título a la izquierda y disco a la derecha.
4. **Sin enlace roto.** Al primer gesto de intención se consulta la miniatura pública del vídeo (sin referrer, nunca
   al cargar la página). Si YouTube devuelve el marcador de 120×90 (vídeo retirado) o no hay URL, la pulsación no
   navega y abre una nota explicativa bajo la franja (cerrable, también con Escape).

## Mapeo de recursos (por título)

| Taller | Recursos |
|---|---|
| Por un puñado de bloques | padlet …/scratch-s023g0evjmgf8zwtzcsj |
| Dos renders y un destino | padlet …/video-s023g0eakkb3qqi2ci3c |
| El bueno, el feo… y el plano | padlet …/corto-s023g0d0yxrx7dud8rkb |
| Siete legos para siete planos | padlet …/recursos-para-hacer-y-disfrutar-haciendo-stop-motion-… |
| La profe que pintó a Liberty Valance | **pendiente** (`null`): «Recursos próximamente», sin botón en la ficha |
| La muerte tenía un micro | padlet …/radio-s023g0f0vknebi81rtlu |

## Verificación

- `npx tsc --noEmit` OK · `npm run check:content` OK · `npx next build` OK (export estático).
- Chrome headless por CDP a 1440 y 390 (`evidence/qa.mjs`, resultados en `evidence/qa.json`, capturas `*.png`):
  hrefs de los 6 talleres, botones de la ficha, franja en reposo/hover, nota de «no disponible» forzando el marcador
  de 120×90. Sin errores de consola propios.

## Riesgos (moderados o superiores)

- **Moderado — URL del taller 5 sin facilitar.** El input repite «Siete legos…» en 1.b.4 y 1.b.6. Mitigación: queda
  como pendiente visible, nunca como enlace muerto; basta rellenar `TALLER_5_RECURSOS`.
- **Moderado — detección de vídeo retirado por miniatura.** Es un comportamiento no documentado de YouTube. Si cambia,
  el resultado es «unknown/ok» y la franja se comporta como un enlace normal (YouTube mostraría su propio aviso), así
  que la degradación no rompe nada. Un vídeo privado (no borrado) puede no detectarse.
- Sin riesgos graves o críticos. Rollback: revert del commit de implementación de [70-0].
