# Inventario técnico de la preferencia de animaciones

Esta nota describe la implementación; no constituye una política legal revisada.

| Propiedad | Implementación |
|---|---|
| Nombre / valor | `__Host-jia-motion=on` |
| Finalidad | Recordar que el visitante ha activado las animaciones de JIA |
| Cuándo se escribe | Solo al pulsar Activar; no se renueva al cargar |
| Duración | 180 días |
| Atributos | Secure; SameSite=Lax; Path=/; sin Domain |
| Retirada | Animaciones → Usar la preferencia del sistema; borra solo esta cookie |
| Rechazo | No se guarda; permanece únicamente en memoria del documento |

No contiene identificadores, información del sistema ni datos de seguimiento. JavaScript necesita leerla y escribirla en este export estático: no es HttpOnly. Secure exige transporte seguro; no cifra el valor ni impide que JavaScript lo lea. Si el navegador bloquea cookies, Activar funciona únicamente durante la visita actual. No se usa almacenamiento alternativo.
