# [68-0] Huellas de carreta y caballos de fondo en «Programa»

- Fecha: 2026-10-15 · Rama: `main` · LEVEL 2 (UI decorativa) · área `frontend` · skill Impeccable
- Salida: `docs/prompts-output/[68-0]/report.md` (+ `evidence/`)

## Entrada del promotor

En la zona de «Programa» (Jornada 1 / Jornada 2), solo en tablet y escritorio (no en móvil): de fondo, las huellas
que deja una carreta (las dos rodadas de las ruedas) y los caballos que tiran de ella, trazando una filigrana no
recta, como un camino que queda detrás.

## Alcance

- Capa decorativa (aria-hidden, sin puntero) detrás del contenido de la subsección, de borde a borde, desde 760 px.
- Trazado curvo generado según el tamaño real de la sección: dos rodadas paralelas y, entre ellas, las herraduras
  de dos caballos (el `horseshoe-icon` del promotor), orientadas en la marcha.
- Tinta de la paleta muy tenue para no competir con el texto. Al entrar en pantalla el camino se «hace» una vez
  (la carreta pasa); con movimiento reducido aparece hecho.
- Verificación: tsc, check:content, next build, CDP a 1440, 1024/768 y 390 (sin huellas).

## Hotfix on the fly 1 (2026-10-15)

- Un solo caballo, con sus huellas centradas entre las rodadas. El trazado del camino no cambia.
- La carreta no se dibuja a velocidad constante: ritmo orgánico, que varía ligeramente.
- A mitad de pantalla (en ancho relativo) se para un poquito (0,5 s) y luego arranca al galope; las huellas pasan de
  paso a galope (pisadas agrupadas y zancadas largas).

## Hotfix on the fly 2 (2026-10-15)

- Al dibujarse, las rodadas iban por delante de las huellas. Debe ser al revés: las ruedas van detrás de las patas
  traseras del caballo.
