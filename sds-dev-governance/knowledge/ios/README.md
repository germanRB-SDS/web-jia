# Knowledge · iOS

Recetas de iOS reutilizables, consultadas bajo demanda. No son reglas de gobernanza, no se precargan
en adapters y no autorizan instalar dependencias ni activar capacidades en una cuenta de Apple.

- [Gráfica de actividad semanal leída de HealthKit](how-to-healthkit-weekly-activity-chart.md):
  código SwiftUI completo de la pantalla «Tu semana» de UpNews, el lector de HealthKit, el doble de
  pruebas y la configuración del proyecto. **Retirado de producción por `Guideline 2.5.1`**: leer el
  aviso antes de reutilizarlo.

---

## Cómo implementar la gráfica semanal de forma efectiva

Orden pensado para que los errores caros salgan pronto, no al subir el binario.

### Paso 0 — La pregunta que decide el resto

**¿Tu app deja de tener sentido sin datos de Salud?**

Si la respuesta es no, **no implementes la lectura de HealthKit**. Salta al paso 1 y alimenta la
gráfica con otra fuente. No es cautela: es exactamente lo que le pasó a UpNews. El código era
correcto y aun así costó un rechazo, una semana de trabajo y una reescritura completa, porque
`2.5.1` juzga el encuadre de producto, no la calidad de la implementación.

Señales de que vas a chocar con `2.5.1`:

- La función es una pantalla secundaria, opcional o detrás de un interruptor apagado.
- La app se entiende entera sin ella.
- En un dispositivo limpio, o en iPad, sólo se ve un estado vacío. **El reviewer usa exactamente
  eso**: un dispositivo recién reseteado, y muchas veces un iPad.

Si decides seguir, ten preparada la respuesta a «¿qué función principal requiere estos datos?»
antes de escribir una línea. Y no caigas en la salida falsa de fabricar una feature de fitness para
justificar la capacidad: escribir en Salud datos que no has medido bien infringe `5.1.3`, que es peor.

### Paso 1 — Empieza por el modelo puro, no por HealthKit

Copia primero `HealthDayActivity`, `HealthWeekActivity` y su `week(endingAt:calendar:values:)`.
**Sin importar HealthKit.** En este punto ya puedes escribir todos los tests de la gráfica —
proporciones de barras, línea de media, semana vacía, formato de números— y ejecutarlos en
segundos.

Deja los tipos **no `Codable`** desde el principio, con su test. Si lo dejas para después no lo
haces, y entonces alguien los mete en una caché «temporal» y ya tienes datos de salud persistidos.

### Paso 2 — El protocolo antes que la implementación

Define `HealthActivityReading` y haz que la vista dependa **sólo** del protocolo. Es la decisión de
diseño que más rendimiento dio en UpNews: cuando hubo que quitar HealthKit entero, la pantalla
sobrevivió sustituyendo la implementación. Si la vista importa HealthKit, un rechazo te obliga a
reescribirla.

### Paso 3 — El doble de pruebas, antes que el lector real

Implementa `DebugHealthReader` con datos sintéticos y los argumentos de lanzamiento. Te da la
pantalla completa en simulador sin permisos y sin muestras, y te permite ver el diseño de verdad
mientras lo ajustas. Bajo `#if DEBUG` siempre: no puede existir en Release.

### Paso 4 — La vista y los tokens

Monta la hoja con todos los números y colores en un `enum` de tokens desde el primer momento. La
gráfica es SwiftUI puro: dos `HStack` en un `ZStack`, sin `Charts` ni dependencias.

Tres detalles que parecen menores y no lo son:

- **Altura mínima de barra.** Un día a cero debe verse como marca, no como hueco.
- **Etiqueta del valor sólo en hoy.** Siete etiquetas saturan; una ancla la lectura.
- **La gráfica se ignora para VoiceOver** (`.accessibilityElement(children: .ignore)`) y se
  sustituye por una frase completa. Barra a barra es ruido inservible.

### Paso 5 — Ahora sí, el lector real

Y sólo entonces la configuración del proyecto. Cuatro trampas, todas comprobadas en producción:

1. **Usa `HKStatisticsCollectionQueryDescriptor` con `.cumulativeSum`**, no sumes muestras a mano:
   HealthKit deduplica solapes entre iPhone, Watch y apps de terceros. Sumar da totales inflados.
2. **`anchorDate` al inicio del día local**, o los tramos salen desplazados.
3. **`NSHealthUpdateUsageDescription` es obligatoria aunque no escribas nada**, en cuanto el App ID
   declara la capacidad. Sin ella el upload se rechaza. Lo descubrimos en `[68-0]`, a base de
   rechazo.
4. **La denegación es indistinguible de «sin datos»**. HealthKit no te dice si el usuario concedió.
   Diseña un estado vacío que sirva para ambos casos y que remita a Ajustes › Salud › Acceso a
   datos. No intentes detectar la denegación: no puedes.

### Paso 6 — Permiso just-in-time

Pide la autorización **al encender el interruptor**, nunca al arrancar. Persiste sólo el booleano, y
escribe un test que enumere las claves de `UserDefaults` y falle si aparece cualquier otra.

### Paso 7 — Antes de enviar

- [ ] Purpose strings traducidas en todos los `.lproj`.
- [ ] `healthkit.access` vacío si no usas datos clínicos; sin `background-delivery` si no lo usas.
- [ ] App Privacy en App Store Connect con Health & Fitness declarado.
- [ ] Notas de revisión que expliquen **qué función principal** requiere los datos y **cómo verla**
      en un dispositivo limpio. Si no puedes escribir ese párrafo, vuelve al paso 0.
- [ ] Probado en **iPad**, no sólo en iPhone. Es donde revisan y donde no hay coprocesador de
      movimiento.

### Si algún día quitas HealthKit

Xcode **no** desactiva la capacidad en el App ID: la firma automática sólo añade. Hay que
desmarcarla a mano en el portal, borrar los perfiles cacheados en
`~/Library/Developer/Xcode/UserData/Provisioning Profiles/` y regenerar, o el
`embedded.mobileprovision` seguirá declarando HealthKit dentro del `.ipa` con el binario ya limpio.
Verificación:

```bash
security cms -D -i <ruta>.xcarchive/Products/Applications/<app>.app/embedded.mobileprovision \
  | plutil -p - | grep -c healthkit    # tiene que dar 0
```

Y recuerda que un build rechazado sigue ocupando su número en App Store Connect: el reenvío necesita
**build nuevo, misma versión**.
