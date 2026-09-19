# JIA-2026-09-19-29 — Hotfix del pie: la herradura cae, rebota y rueda a la derecha hasta el límite

**Fecha:** 2026-09-19 · **Origen:** mensaje del promotor en chat tras JIA-28. **Nivel:** LEVEL 1 (resultado aquí).

## Encargo

La herradura, al pulsarla, **cae, rebota y rueda hacia la derecha** por el suelo **hasta apoyarse contra el límite
derecho** (el borde de la ventana). Después, como hasta ahora, vuelve sola a su clavo a los 5 s.

## Resultado

- Aterriza casi de pie sobre su canto (vuelco hacia la cámara de solo −18°, para poder rodar), rebota dos veces y
  **rueda a la derecha** girando en el sentido de las agujas del reloj (`config.fall.roll`: 1,5 vueltas en 1,7 s,
  frenándose); mientras rueda, un ajuste por fotograma la mantiene **apoyada en el suelo** (el punto más bajo de su
  caja en la línea del pie), de modo que, al no ser una rueda, cabecea como una herradura real. Se detiene con su
  punto más a la derecha a 4 px del borde de la ventana. A los 5 s sube de nuevo al clavo.
- Verificación: `tsc`, `check:content`, `next build`; Chrome por CDP a 1920 (fotogramas tras la caída, rodando y
  apoyada en el borde; vuelta al clavo). Capturas en `docs/prompts-output/JIA-2026-09-19-29/evidence/`.

## Riesgos

- **Menor:** el trayecto de rodadura depende de dónde cuelgue (a 1600 px es corto, ~150 px); la vuelta de giro se
  mantiene y la herradura simplemente patina un poco más en pantallas estrechas.
