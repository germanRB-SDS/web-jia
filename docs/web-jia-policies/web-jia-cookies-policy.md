# Inventario técnico de la preferencia de animaciones

Esta nota describe la implementación; no constituye una política legal revisada.

| Propiedad | Implementación |
|---|---|
| Nombre / valor | `__Host-jia-motion=on` |
| Finalidad | Recordar que el visitante ha activado las animaciones de JIA |
| Cuándo se escribe | Solo al pulsar Activar animaciones; no se renueva al cargar |
| Duración | 180 días |
| Atributos | Secure; SameSite=Lax; Path=/; sin Domain |
| Retirada | Eliminar esta cookie desde los ajustes del navegador; control de footer retirado por delta G |
| Rechazo | Dejar sin animaciones/Escape no se guarda; mantiene esa visita sin efectos y vuelve a preguntar en la siguiente carga, excepto Apple |

No contiene identificadores, información del sistema ni datos de seguimiento. JavaScript necesita leerla y escribirla en este export estático: no es HttpOnly. Secure exige transporte seguro; no cifra el valor ni impide que JavaScript lo lea. Si el navegador bloquea cookies, Activar animaciones funciona únicamente durante la visita actual. No se usa almacenamiento alternativo.
