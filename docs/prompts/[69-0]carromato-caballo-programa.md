# [69-0] El carromato de «Las Jornadas», con su caballo, recorre el camino de «Programa»

- Fecha: 2026-10-15 · Rama: `main` · LEVEL 2 (UI decorativa + asset 3D) · áreas `frontend`, asset 3D · skill Impeccable
- Base: [68-0] (huellas de carreta en «Programa», subido en `8193752`). Probable rollback: este prompt va en su propio
  commit antes de empezar.
- Salida: `docs/prompts-output/[69-0]/report.md` (+ `evidence/`)

## Entrada del promotor

> Podrías utilizar el carromato que aparece en la section "LAS JORNADAS" y generar un caballo en blender para
> "unirlo" (debe contar con dos palitos de madera que vayan al carro, y su sombra, como tiene el carro). Y ajustar el
> ancho del carro a las huellas actuales (no las marcas de rueda actuales y huellas al carro y al caballo) para que
> permanezca en el ancho que hay. No tiene que haber sincronía entre caballo y huellas, pero si pudieran hacerse la
> "velocidad" distinta a la que operan las huellas de caballo porque la animación del caballo fuese distinta (no es
> lo mismo "andando" que "al galope"), sería maravilloso.

## Interpretación

- El carromato 3D de Jornadas (`public/jornadas/jia-carruaje.glb`, sin cambios) y un caballo nuevo hecho en Blender
  recorren el camino de [68-0] en «Programa», dejando detrás las rodadas y las herraduras que ya existen.
- Se ajusta el carro a las huellas, no las huellas al carro: el camino, las rodadas (galga 2×21 px) y las herraduras
  no cambian. La escala del carro sale de su vía (1,52 m entre ruedas) = distancia entre rodadas.
- El caballo va entre dos varas de madera que salen del tren delantero del carro hasta sus costados (con collera), y
  proyecta sombra como el carro.
- Animación del caballo propia (no sincronizada pisada a pisada): al paso antes de la parada de mitad de pantalla,
  quieto en la parada, y al galope después (patas, cabeza y lomo distintos). El ritmo de las patas sale de la
  distancia recorrida, así que se para cuando para el carro.

## Alcance

1. `assets/3d/caballo/make-caballo.py` (Blender 5.2 headless): caballo low-poly en el estilo del carromato (mismos
   tonos de madera y hierro), con nodos articulados (cuerpo, cuello/cabeza, cola, muslo y caña de cada pata) y las
   dos varas con su collera. Exporta `caballo.glb` + `.blend`; `build-assets.sh` lo copia a `public/programa/`.
2. `components/site/wagon-trail/`: escena Three.js (cámara cenital ortográfica, 1 unidad = 1 px de la capa, sol y
   recogedor de sombras como en Jornadas) en una capa propia, a opacidad plena, detrás del contenido. Usa el mismo
   reloj que la pasada de las huellas; carro y caballo salen por la derecha al terminar y la escena se libera.
3. El retraso de las ruedas (`wheelLag`) pasa a derivarse de la longitud real caballo → eje delantero.
4. Sin WebGL o sin modelos, las huellas siguen como en [68-0]. Movimiento reducido: solo el camino hecho.
5. Rutas de los modelos desde `lib/content` (no en el componente).
6. Verificación: tsc, check:content, next build, CDP a 1440 (paso, parada, galope, salida) y 390 (nada).
