# Diagnóstico de animaciones en producción

2026-09-25 · REL-2026-09-25-02 · LEVEL 2 · diagnóstico verificado; causa en el equipo Windows del propietario pendiente de confirmar.

## Resultado
No se reprodujo una falta de librerías ni de recursos. En la URL pública, con movimiento normal, se verificaron luz de la maestra, herradura, estepicursores, estrella y reflejo. Activar prefers-reduced-motion: reduce reproduce la ausencia de movimiento observada por el propietario. Es una hipótesis respaldada para su equipo, no una lectura de su configuración Windows.

## Evidencia
Chrome headless macOS a 1440x1000 con WebGL SwiftShader y media emulada. Se instrumentaron draw calls WebGL sin alterar archivos publicados: la luz pasa de 6 a 89 llamadas durante la muestra y la herradura de 56 a 264 tras doble clic. Con reduce: luz fija en 3 y herradura en 56. Las matrices CSS registran el giro de la estrella, el barrido del reflejo y tres posiciones crecientes del estepicursor. En reduce el reflejo tiene animation-name: none. Sin fallos de red ni excepciones de ejecución en el recorrido.

Ver [evidencia detallada](evidence/production-animation-diagnosis.json). No es una prueba física de Edge/Chrome en Windows. El aviso Three PCFSoftShadowMap usa fallback PCFShadowMap y no impide el renderizado; no explica los efectos CSS desactivados.

## Contrato y solución condicionada
Los prompts [50-0], [51-0] y la especificación de herradura requieren respetar movimiento reducido. No se eliminó esa preferencia para forzar animaciones. En Windows 11, comprobar Configuración → Accesibilidad → Efectos visuales → Efectos de animación. Si están desactivados y el propietario quiere movimiento, activarlos y recargar la página: las escenas JS leen la preferencia al montar. En Windows 10, Accesibilidad → Pantalla → Mostrar animaciones en Windows.

Fuente: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

## Impacto y límites
No hay cambios ejecutables ni despliegue en esta investigación. No se usaron SSH, MCP ni credenciales. La autorización para publicar un arreglo no exige republicar el mismo artefacto cuando no se ha identificado un defecto del servidor. Pregunta pendiente al propietario sobre el ajuste Windows; si está activado, continuar con el valor real de matchMedia, dimensiones, consola y soporte WebGL en su navegador. BBDD/API: N/A, sitio estático.

Verification: V2 | artefacto público -> recursos dinámicos -> WebGL/GSAP/CSS -> modo de movimiento y entradas del puntero | PASS en entorno controlado; Windows del propietario NOT VERIFIED.
