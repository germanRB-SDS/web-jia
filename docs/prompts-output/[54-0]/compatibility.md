# Fase C — capacidades y matriz de plataformas

La política de movimiento es común. Delta G añade una excepción de oferta pedida por el propietario: Mac/iPad/iPhone no muestran popup automático. Se comprueba navigator.platform (incluido iPad con identidad Mac), sin inferir distribución Linux. `prefers-reduced-motion` y su variante no-preference determinan soporte; si ninguna responde, se adopta modo conservador y el popup permite activar al cargar fuera de Apple sin afirmar que el sistema desactive efectos; el control manual del footer fue retirado por orden del propietario. Puntero/hover/ancho/WebGL siguen siendo condiciones independientes.

| Entorno | Evidencia disponible | Límite |
|---|---|---|
| Chrome macOS | CDP, viewport/preferencia emulados, touch/teclado nativos CDP, WebGL SwiftShader | No hardware móvil ni Windows/Linux |
| Edge macOS | 13 checks de política/cookie HTTPS local PASS | No Edge Windows |
| Firefox macOS | Instalado, sin harness de automatización configurado para este proyecto | No verificado |
| Windows Chrome/Edge | Contrato común de capacidades, sin ramas SO | Dispositivo físico no verificado |
| Linux Chromium/Firefox | Contrato común de capacidades | Dispositivo físico no verificado |
| Guadalinex | No hay equipo/versión disponible | NO VERIFICADO; sin promesa para versiones históricas |
| Android Chrome/Samsung Internet | Touch, anchos y reduce emulados en Chrome | Navegadores físicos NO VERIFICADOS |

No se instalan frameworks, dependencias o polyfills para simular una certificación inexistente. La prueba G simula navigator.platform y capacidades táctiles para verificar la rama de oferta; no certifica navegadores de Windows/Android/iOS físicos.
