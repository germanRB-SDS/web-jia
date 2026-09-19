# Gráfica de actividad semanal leída de HealthKit (SwiftUI)

Código real de **UpNews**, versión `1.1 (0)`, escrito en `[67-0]` Fases 3 y 7 y **eliminado del
producto el 16 de septiembre de 2026** en `[69-0]`. Se recuperó de
`132735c^` en el repositorio `upnews` y se guarda aquí porque el diseño y la mecánica de lectura
son reutilizables; el encuadre de producto **no lo es**. Leer primero el aviso.

---

## ⚠️ Por qué este código salió de producción: `Guideline 2.5.1`

Apple rechazó UpNews el 2026-09-16 (Submission `9de3c902-5214-40ef-8154-5fd1fc2abad2`, revisado en
un iPad Air 11-inch M3):

> The app's binary includes references to HealthKit components, but the app does not appear to
> include any primary features that require health or fitness data.

**El código no era el problema.** Era correcto, sólo lectura, sin persistencia y con la copy bien
escrita. El problema fue el encuadre: una app de noticias declaraba la capacidad HealthKit para una
hoja semanal **secundaria y opcional**. `2.5.1` exige que la capacidad exista al servicio de una
función *principal*.

Se agravaba con dos hechos del dispositivo de revisión:

1. En un dispositivo limpio **no hay muestras de Salud**, así que el reviewer sólo veía el estado
   vacío.
2. En **iPad no hay coprocesador de movimiento**, así que tampoco había nada que lo alimentara.

El reviewer no podía ver la función funcionando ni una sola vez.

**Antes de reutilizar esto, responde honestamente:** ¿la app deja de tener sentido sin estos datos?
Si la respuesta es no, HealthKit te va a costar un rechazo, por limpio que esté el código. Y si la
salida es fabricar una feature de fitness para justificar la capacidad, eso es peor: `5.1.3`
sanciona escribir en Salud datos inexactos o inventados.

Lo que hizo UpNews: quitar HealthKit y reconstruir la misma pantalla sobre Core Motion, que ya
alimentaba el producto y ya estaba explicado en `NSMotionUsageDescription`.

---

## Qué es exactamente

Una hoja modal «Tu semana» con cuatro piezas:

| Pieza | Qué muestra |
|---|---|
| Cifra | Pasos totales de 7 días + media diaria |
| Gráfica | Una barra por día (cápsula), hoy en color pleno y el resto al 22 %, con línea de media discontinua superpuesta y el valor de hoy encima de su barra |
| Rejilla 2×2 | Distancia a pie, energía activa, plantas subidas, distancia en bici, cada una con su punto de color |
| Pie | Candado + nota de privacidad |

Arquitectura en tres capas, y esto es lo que hace el código reutilizable:

```
HealthWeekActivity   ← modelo puro, sin HealthKit, con toda la matemática de la gráfica
      ↑
HealthActivityReading ← protocolo: el único punto que toca HealthKit
      ↑
HealthWeeklyHistorySheet ← SwiftUI puro, no importa HealthKit
```

La vista **no importa HealthKit**. Sólo conoce el protocolo. Por eso los tests y los XCUITest
corren sin permisos del sistema, y por eso migrar la pantalla a Core Motion en `[69-0]` fue
sustituir una implementación del protocolo, no reescribir la pantalla.

---

## 1. Modelo y lector

`upnews/Health/HealthJourneyReader.swift`. Contiene el modelo puro, el protocolo y la única
implementación que habla con HealthKit.

Tres decisiones deliberadas:

- **`HealthDayActivity` y `HealthWeekActivity` NO son `Codable`.** Es intencional y hay un test que
  lo afirma: si nadie puede serializarlos, nadie puede filtrarlos a `UserDefaults`, a un fichero, a
  un log o a la red por descuido.
- **`toShare: []`.** Sólo lectura. Nunca `HKWorkout`, nunca `store.save(`.
- **La denegación es invisible.** HealthKit no dice si el usuario concedió: devuelve «sin datos».
  Por eso la interfaz trata igual «sin permiso» y «sin datos», y `requestReadAuthorization()`
  devuelve `false` sólo si la petición no pudo completarse.

```swift
//
//  HealthJourneyReader.swift
//  upnews
//
//  `[67-0]` Fase 3: lectura de Salud SÓLO en memoria para el historial semanal
//  de Recorrido. Nada de lo que se lee se escribe en UserDefaults, ficheros,
//  logs, notificaciones, Siri, Worker ni caché. Sin escritura en HealthKit,
//  sin background delivery y sin datos clínicos.
//
//  La denegación de lectura es invisible para la app (HealthKit devuelve
//  "sin datos"), así que la interfaz trata igual «sin permiso» y «sin datos».
//

import Foundation
import HealthKit

/// Actividad de un día leída de Salud. Deliberadamente NO es `Codable`.
nonisolated struct HealthDayActivity: Equatable, Sendable {
    let day: Date
    let steps: Double
    let walkingRunningMeters: Double
    let cyclingMeters: Double
    let activeEnergyKilocalories: Double
    let flightsClimbed: Double

    var hasData: Bool {
        steps > 0 || walkingRunningMeters > 0 || cyclingMeters > 0
            || activeEnergyKilocalories > 0 || flightsClimbed > 0
    }
}

/// Semana leída de Salud. Deliberadamente NO es `Codable`.
nonisolated struct HealthWeekActivity: Equatable, Sendable {
    let days: [HealthDayActivity]

    var hasData: Bool { days.contains(where: \.hasData) }
    var totalSteps: Double { days.reduce(0) { $0 + $1.steps } }
    var totalWalkingRunningMeters: Double { days.reduce(0) { $0 + $1.walkingRunningMeters } }
    var totalCyclingMeters: Double { days.reduce(0) { $0 + $1.cyclingMeters } }
    var totalActiveEnergyKilocalories: Double { days.reduce(0) { $0 + $1.activeEnergyKilocalories } }
    var totalFlightsClimbed: Double { days.reduce(0) { $0 + $1.flightsClimbed } }
    var maximumDailySteps: Double { days.map(\.steps).max() ?? 0 }

    // `[67-0]` Fase 7: cálculos puros de la pantalla «Tu semana».

    var averageDailySteps: Double {
        days.isEmpty ? 0 : totalSteps / Double(days.count)
    }

    /// Altura relativa de la barra de un día (0…1) frente al máximo semanal.
    func stepsRatio(for day: HealthDayActivity) -> Double {
        guard maximumDailySteps > 0 else { return 0 }
        return min(1, max(0, day.steps / maximumDailySteps))
    }

    /// Posición relativa de la línea de media (0…1) sobre la misma escala.
    var averageRatio: Double {
        guard maximumDailySteps > 0 else { return 0 }
        return min(1, max(0, averageDailySteps / maximumDailySteps))
    }

    /// Siete días locales que terminan hoy, rellenando con ceros los días sin
    /// muestras. Pura para poder probarla sin HealthKit.
    static func week(
        endingAt now: Date,
        calendar: Calendar,
        values: [Date: HealthDayActivity]
    ) -> HealthWeekActivity {
        let today = calendar.startOfDay(for: now)
        let days = (0..<7).reversed().compactMap { offset -> HealthDayActivity? in
            guard let day = calendar.date(byAdding: .day, value: -offset, to: today) else {
                return nil
            }
            return values[day] ?? HealthDayActivity(
                day: day,
                steps: 0,
                walkingRunningMeters: 0,
                cyclingMeters: 0,
                activeEnergyKilocalories: 0,
                flightsClimbed: 0
            )
        }
        return HealthWeekActivity(days: days)
    }
}

@MainActor
protocol HealthActivityReading: AnyObject {
    var isAvailable: Bool { get }
    /// Pide lectura de los tipos declarados. Devuelve `false` sólo si la
    /// petición no pudo completarse; nunca informa de si el usuario concedió.
    func requestReadAuthorization() async -> Bool
    func weeklyActivity(endingAt now: Date, calendar: Calendar) async -> HealthWeekActivity?
}

@MainActor
final class HealthJourneyReader: HealthActivityReading {

    /// Tipos de lectura, y sólo estos. Nunca escritura.
    nonisolated static let readTypeIdentifiers: [HKQuantityTypeIdentifier] = [
        .stepCount,
        .distanceWalkingRunning,
        .distanceCycling,
        .activeEnergyBurned,
        .flightsClimbed
    ]

    private lazy var store = HKHealthStore()

    var isAvailable: Bool { HKHealthStore.isHealthDataAvailable() }

    private var readTypes: Set<HKObjectType> {
        Set(Self.readTypeIdentifiers.map { HKQuantityType($0) })
    }

    func requestReadAuthorization() async -> Bool {
        guard isAvailable else { return false }
        do {
            try await store.requestAuthorization(toShare: [], read: readTypes)
            return true
        } catch {
            return false
        }
    }

    func weeklyActivity(endingAt now: Date, calendar: Calendar) async -> HealthWeekActivity? {
        guard isAvailable else { return nil }
        let today = calendar.startOfDay(for: now)
        guard let start = calendar.date(byAdding: .day, value: -6, to: today),
              let end = calendar.date(byAdding: .day, value: 1, to: today)
        else { return nil }

        async let steps = dailySums(.stepCount, unit: .count(), start: start, end: end, anchor: today)
        async let walking = dailySums(.distanceWalkingRunning, unit: .meter(), start: start, end: end, anchor: today)
        async let cycling = dailySums(.distanceCycling, unit: .meter(), start: start, end: end, anchor: today)
        async let energy = dailySums(.activeEnergyBurned, unit: .kilocalorie(), start: start, end: end, anchor: today)
        async let flights = dailySums(.flightsClimbed, unit: .count(), start: start, end: end, anchor: today)
        let (stepValues, walkingValues, cyclingValues, energyValues, flightValues) =
            await (steps, walking, cycling, energy, flights)

        var values: [Date: HealthDayActivity] = [:]
        var day = start
        while day < end {
            values[day] = HealthDayActivity(
                day: day,
                steps: stepValues[day] ?? 0,
                walkingRunningMeters: walkingValues[day] ?? 0,
                cyclingMeters: cyclingValues[day] ?? 0,
                activeEnergyKilocalories: energyValues[day] ?? 0,
                flightsClimbed: flightValues[day] ?? 0
            )
            guard let next = calendar.date(byAdding: .day, value: 1, to: day) else { break }
            day = next
        }
        return HealthWeekActivity.week(endingAt: now, calendar: calendar, values: values)
    }

    private func dailySums(
        _ identifier: HKQuantityTypeIdentifier,
        unit: HKUnit,
        start: Date,
        end: Date,
        anchor: Date
    ) async -> [Date: Double] {
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end)
        let descriptor = HKStatisticsCollectionQueryDescriptor(
            predicate: HKSamplePredicate.quantitySample(
                type: HKQuantityType(identifier),
                predicate: predicate
            ),
            options: .cumulativeSum,
            anchorDate: anchor,
            intervalComponents: DateComponents(day: 1)
        )
        guard let collection = try? await descriptor.result(for: store) else { return [:] }
        var sums: [Date: Double] = [:]
        collection.enumerateStatistics(from: start, to: end) { statistics, _ in
            if let quantity = statistics.sumQuantity() {
                sums[statistics.startDate] = quantity.doubleValue(for: unit)
            }
        }
        return sums
    }
}
```

### Notas de implementación del lector

- **`HKStatisticsCollectionQueryDescriptor` con `.cumulativeSum` e `intervalComponents: DateComponents(day: 1)`**
  es lo que hace el trabajo: HealthKit agrupa por día y deduplica solapes entre fuentes (iPhone,
  Watch, apps de terceros). Sumar muestras a mano da totales inflados.
- **`anchorDate: today`** alinea los tramos al inicio del día local. Con otro ancla, los días salen
  desplazados.
- Las cinco consultas van en paralelo con `async let`: cinco viajes secuenciales al store se notan
  al abrir la hoja.
- `HealthWeekActivity.week(endingAt:calendar:values:)` es **pura**: rellena con ceros los días sin
  muestras y garantiza siempre 7 días terminando hoy. Al ser pura, toda la matemática de la gráfica
  se prueba sin HealthKit y sin simulador con datos.

---

## 2. La vista

`upnews/Health/HealthWeeklyHistorySheet.swift`. SwiftUI puro, sin `Charts`, sin dependencias.

La gráfica se construye con dos `HStack` apilados dentro de un `ZStack`, no con un framework:

- El área de barras es `chartHeight - chartLabelHeight`, y la barra máxima resta además
  `chartValueLabelHeight` para que la etiqueta del valor de hoy quepa sin desbordar.
- Cada barra es una `Capsule` con `height = max(barMinimumHeight, ratio * maximumBar)`. El mínimo
  evita que un día a cero desaparezca: se ve la marca del día, honesta, en vez de un hueco.
- La línea de media es un `Rectangle` transparente con un `Shape` de un solo segmento y
  `padding(.bottom, ratio * maximumBar)`. Así flota a la altura correcta sobre las barras sin
  depender de coordenadas absolutas.
- `.onDisappear { week = nil }` — los datos viven en `@State` y mueren al cerrar la hoja.

```swift
//
//  HealthWeeklyHistorySheet.swift
//  upnews
//
//  `[67-0]` Fase 3: historial semanal de Recorrido leído de Salud. Los datos
//  viven en el `@State` de la hoja y desaparecen al cerrarla.
//  `[67-0]` Fase 7: presentación «Tu semana» del owner (captura + HTML en
//  `docs/prompts/resources/[67-0]/`): cifra de pasos, barras por día con línea
//  de media, rejilla 2×2 de métricas y nota de privacidad. SwiftUI puro,
//  válido en iOS 26 y 27. Sólo cambia la presentación.
//

import SwiftUI

struct HealthWeeklyHistorySheet: View {

    let reader: any HealthActivityReading
    let onClose: () -> Void

    @Environment(\.strings) private var strings
    @State private var week: HealthWeekActivity?
    @State private var hasLoaded = false

    private var tokens: DesignTokensV2.WeekHistory.Type { DesignTokensV2.WeekHistory.self }

    var body: some View {
        ZStack {
            tokens.background.color.ignoresSafeArea()
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    header
                    Text(strings.healthHistoryTitle)
                        .font(.system(size: tokens.titleSize, weight: .medium))
                        .tracking(tokens.titleSize * tokens.titleTracking)
                        .foregroundStyle(tokens.textPrimary.color)
                        .padding(.top, tokens.titleTop)
                        .accessibilityAddTraits(.isHeader)

                    if !hasLoaded {
                        ProgressView()
                            .tint(tokens.textSecondary.color)
                            .frame(maxWidth: .infinity, minHeight: tokens.loadingHeight)
                    } else if let week, week.hasData {
                        figure(week)
                        chart(week)
                        metrics(week)
                    } else {
                        Text(strings.healthHistoryEmpty)
                            .font(.system(size: tokens.captionSize))
                            .foregroundStyle(tokens.textSecondary.color)
                            .fixedSize(horizontal: false, vertical: true)
                            .padding(.top, tokens.figureTop)
                            .accessibilityIdentifier(NewsIdentifier.healthHistoryEmpty)
                    }

                    footer
                }
                .padding(.horizontal, tokens.horizontalPadding)
                .padding(.top, tokens.topPadding)
                .frame(maxWidth: tokens.maximumContentWidth)
                .frame(maxWidth: .infinity)
            }
        }
        .preferredColorScheme(.dark)
        .dynamicTypeSize(...DesignTokensV2.Typography.maxDynamicTypeSize)
        .accessibilityIdentifier(NewsIdentifier.healthHistory)
        .task {
            _ = await reader.requestReadAuthorization()
            week = await reader.weeklyActivity(endingAt: Date(), calendar: .autoupdatingCurrent)
            hasLoaded = true
        }
        .onDisappear { week = nil }
    }

    // MARK: - Cabecera y pie

    private var header: some View {
        HStack {
            if let week, let first = week.days.first?.day, let last = week.days.last?.day {
                Text(strings.healthHistoryDateRange(start: first, end: last))
                    .font(.system(size: tokens.captionSize, weight: .medium))
                    .foregroundStyle(tokens.textSecondary.color)
            }
            Spacer(minLength: 0)
            Button(action: onClose) {
                Image(systemName: "xmark")
                    .font(.system(size: tokens.closeGlyphSize, weight: .medium))
                    .foregroundStyle(tokens.closeGlyph.color)
                    .frame(width: tokens.closeDiameter, height: tokens.closeDiameter)
                    .background(Color.white.opacity(tokens.closeFillOpacity), in: Circle())
                    .frame(
                        minWidth: AppDesign.Size.minimumTapTarget,
                        minHeight: AppDesign.Size.minimumTapTarget
                    )
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(strings.settingsClose)
            .accessibilityIdentifier(NewsIdentifier.healthHistoryClose)
        }
        .frame(minHeight: AppDesign.Size.minimumTapTarget)
    }

    private var footer: some View {
        VStack(spacing: tokens.footerSpacing) {
            Image(systemName: "lock")
                .font(.system(size: tokens.footerGlyphSize))
                .foregroundStyle(tokens.textMuted.color)
                .accessibilityHidden(true)
            Text(strings.healthHistoryPrivacyNote)
                .font(.system(size: tokens.footnoteSize))
                .lineSpacing(tokens.footnoteSize * (tokens.footnoteLineHeight - 1))
                .foregroundStyle(tokens.textMuted.color)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxWidth: tokens.footnoteMaximumWidth)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, tokens.footerTop)
        .padding(.bottom, tokens.bottomPadding)
    }

    // MARK: - Cifra

    private func figure(_ week: HealthWeekActivity) -> some View {
        VStack(alignment: .leading, spacing: tokens.figureCaptionSpacing) {
            Text(strings.healthHistorySteps(week.totalSteps))
                .font(.system(size: tokens.figureSize, weight: .medium).monospacedDigit())
                .tracking(tokens.figureSize * tokens.figureTracking)
                .lineLimit(1)
                .minimumScaleFactor(tokens.figureMinimumScale)
                .foregroundStyle(tokens.textPrimary.color)
            HStack(spacing: 0) {
                Text(strings.healthHistoryStepsUnit)
                    .foregroundStyle(tokens.textEmphasis.color)
                Text(verbatim: " \(tokens.separator) \(strings.healthHistoryAveragePerDay(week.averageDailySteps))")
                    .foregroundStyle(tokens.textSecondary.color)
            }
            .font(.system(size: tokens.captionSize))
        }
        .padding(.top, tokens.figureTop)
        .accessibilityElement(children: .combine)
    }

    // MARK: - Gráfica

    private func chart(_ week: HealthWeekActivity) -> some View {
        let barArea = tokens.chartHeight - tokens.chartLabelHeight
        let maximumBar = barArea - tokens.chartValueLabelHeight
        let today = week.days.last
        return VStack(spacing: 0) {
            ZStack(alignment: .bottom) {
                averageLine(ratio: week.averageRatio, maximumBar: maximumBar)
                HStack(alignment: .bottom, spacing: 0) {
                    ForEach(week.days, id: \.day) { day in
                        let isToday = day.day == today?.day
                        VStack(spacing: tokens.chartValueLabelSpacing) {
                            if isToday {
                                Text(strings.healthHistorySteps(day.steps))
                                    .font(.system(size: tokens.axisLabelSize, weight: .medium).monospacedDigit())
                                    .foregroundStyle(tokens.mint.color)
                            }
                            Capsule()
                                .fill(tokens.mint.color(opacity: isToday ? 1 : tokens.pastBarOpacity))
                                .frame(
                                    width: tokens.barWidth,
                                    height: max(tokens.barMinimumHeight, week.stepsRatio(for: day) * maximumBar)
                                )
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .frame(height: barArea, alignment: .bottom)

            HStack(spacing: 0) {
                ForEach(week.days, id: \.day) { day in
                    let isToday = day.day == today?.day
                    Text(isToday ? strings.healthHistoryToday : strings.healthHistoryWeekday(day.day))
                        .font(.system(size: tokens.axisLabelSize, weight: isToday ? .medium : .regular))
                        .foregroundStyle(isToday ? tokens.textPrimary.color : tokens.textMuted.color)
                        .frame(maxWidth: .infinity)
                }
            }
            .frame(height: tokens.chartLabelHeight, alignment: .bottom)
        }
        .frame(height: tokens.chartHeight)
        .padding(.top, tokens.chartTop)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(strings.healthHistoryChartAccessibility(week))
    }

    private func averageLine(ratio: Double, maximumBar: CGFloat) -> some View {
        VStack(alignment: .leading, spacing: tokens.averageLabelSpacing) {
            Text(strings.healthHistoryAverageLabel)
                .font(.system(size: tokens.axisLabelSize))
                .foregroundStyle(tokens.textMuted.color)
                .padding(.leading, 2)
            Rectangle()
                .fill(Color.clear)
                .frame(height: tokens.averageLineWidth)
                .overlay {
                    Line()
                        .stroke(
                            Color.white.opacity(tokens.averageLineOpacity),
                            style: StrokeStyle(lineWidth: tokens.averageLineWidth, dash: tokens.averageLineDash)
                        )
                }
        }
        .padding(.bottom, max(0, ratio * maximumBar - tokens.averageLineWidth))
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Métricas

    private func metrics(_ week: HealthWeekActivity) -> some View {
        let distance = strings.healthHistoryDistanceParts(week.totalWalkingRunningMeters)
        let energy = strings.healthHistoryEnergyParts(week.totalActiveEnergyKilocalories)
        let flights = strings.healthHistoryFlightsParts(week.totalFlightsClimbed)
        let cycling = strings.healthHistoryDistanceParts(week.totalCyclingMeters)
        let divider = Color.white.opacity(tokens.metricsDividerOpacity)
        return VStack(spacing: 0) {
            HStack(spacing: 0) {
                metric(strings.healthHistoryDistanceLabel, distance, tokens.distanceDot, isZero: week.totalWalkingRunningMeters <= 0)
                divider.frame(width: tokens.metricsDividerWidth)
                metric(strings.healthHistoryEnergyLabel, energy, tokens.energyDot, isZero: week.totalActiveEnergyKilocalories <= 0)
            }
            divider.frame(height: tokens.metricsDividerWidth)
            HStack(spacing: 0) {
                metric(strings.healthHistoryClimbsLabel, flights, tokens.climbsDot, isZero: week.totalFlightsClimbed <= 0)
                divider.frame(width: tokens.metricsDividerWidth)
                metric(strings.healthHistoryCyclingLabel, cycling, tokens.cyclingDot, isZero: week.totalCyclingMeters <= 0)
            }
        }
        .background(tokens.metricsFill.color)
        .clipShape(RoundedRectangle(cornerRadius: tokens.metricsCornerRadius, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: tokens.metricsCornerRadius, style: .continuous)
                .strokeBorder(Color.white.opacity(tokens.metricsBorderOpacity), lineWidth: 1)
        }
        .padding(.top, tokens.metricsTop)
    }

    private func metric(
        _ label: String,
        _ parts: (value: String, unit: String),
        _ dot: DesignTokensV2.RGB,
        isZero: Bool
    ) -> some View {
        VStack(alignment: .leading, spacing: tokens.metricValueSpacing) {
            HStack(spacing: tokens.metricDotSpacing) {
                Circle()
                    .fill(dot.color(opacity: isZero ? tokens.zeroDotOpacity : 1))
                    .frame(width: tokens.metricDotDiameter, height: tokens.metricDotDiameter)
                Text(label)
                    .font(.system(size: tokens.axisLabelSize))
                    .foregroundStyle(tokens.textSecondary.color)
                    .lineLimit(1)
            }
            HStack(alignment: .firstTextBaseline, spacing: tokens.metricUnitSpacing) {
                Text(parts.value)
                    .font(.system(size: tokens.metricValueSize, weight: .medium).monospacedDigit())
                    .tracking(tokens.metricValueSize * tokens.titleTracking)
                    .foregroundStyle(isZero ? tokens.textMuted.color : tokens.textPrimary.color)
                Text(parts.unit)
                    .font(.system(size: tokens.captionSize))
                    .foregroundStyle(isZero ? tokens.textMuted.color : tokens.textSecondary.color)
            }
            .lineLimit(1)
            .minimumScaleFactor(tokens.figureMinimumScale)
        }
        .padding(.vertical, tokens.metricVerticalPadding)
        .padding(.horizontal, tokens.metricHorizontalPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(verbatim: "\(label), \(parts.value) \(parts.unit)"))
    }
}

/// Segmento horizontal para la línea de media discontinua.
private struct Line: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.midY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        return path
    }
}
```

---

## 3. Tokens de diseño

La vista no lleva ni un número ni un color a pelo: todo sale de
`DesignTokensV2.WeekHistory`. Es lo que permite reajustar la pantalla entera sin tocar la lógica.

`RGB(hex:)` es un helper local que convierte `0xRRGGBB` en un `Color` sRGB.

```swift
enum WeekHistory {
    static let background = RGB(hex: 0x0A0A0F)
    static let textPrimary = RGB(hex: 0xF5F5F7)
    static let textEmphasis = RGB(hex: 0xE6E6EA)
    static let textSecondary = RGB(hex: 0x8E8E98)
    static let textMuted = RGB(hex: 0x5C5C66)
    static let closeGlyph = RGB(hex: 0xD8D8DE)
    static let mint = RGB(hex: 0x7CE3A1)
    static let distanceDot = RGB(hex: 0x7CE3A1)
    static let energyDot = RGB(hex: 0xFF9F6B)
    static let climbsDot = RGB(hex: 0x8AB4FF)
    static let cyclingDot = RGB(hex: 0xF5C86B)
    static let metricsFill = RGB(hex: 0x141419)

    static let separator = "·"
    static let maximumContentWidth: CGFloat = 560
    static let horizontalPadding: CGFloat = 20
    static let topPadding: CGFloat = 6
    static let bottomPadding: CGFloat = 8
    static let titleSize: CGFloat = 27
    static let titleTracking: CGFloat = -0.02
    static let titleTop: CGFloat = 10
    static let captionSize: CGFloat = 13
    static let closeDiameter: CGFloat = 30
    static let closeGlyphSize: CGFloat = 15
    static let closeFillOpacity = 0.08
    static let loadingHeight: CGFloat = 200
    static let figureSize: CGFloat = 52
    static let figureTracking: CGFloat = -0.04
    static let figureMinimumScale: CGFloat = 0.6
    static let figureTop: CGFloat = 22
    static let figureCaptionSpacing: CGFloat = 6
    static let chartHeight: CGFloat = 170
    static let chartLabelHeight: CGFloat = 22
    static let chartValueLabelHeight: CGFloat = 17
    static let chartValueLabelSpacing: CGFloat = 4
    static let chartTop: CGFloat = 26
    static let barWidth: CGFloat = 22
    static let barMinimumHeight: CGFloat = 4
    static let pastBarOpacity = 0.22
    static let axisLabelSize: CGFloat = 11
    static let averageLineWidth: CGFloat = 1
    static let averageLineOpacity = 0.16
    static let averageLineDash: [CGFloat] = [4, 4]
    static let averageLabelSpacing: CGFloat = 4
    static let metricsTop: CGFloat = 26
    static let metricsCornerRadius: CGFloat = 20
    static let metricsBorderOpacity = 0.05
    static let metricsDividerOpacity = 0.06
    static let metricsDividerWidth: CGFloat = 1
    static let metricVerticalPadding: CGFloat = 14
    static let metricHorizontalPadding: CGFloat = 16
    static let metricDotDiameter: CGFloat = 6
    static let metricDotSpacing: CGFloat = 6
    static let metricValueSpacing: CGFloat = 7
    static let metricValueSize: CGFloat = 22
    static let metricUnitSpacing: CGFloat = 4
    static let zeroDotOpacity = 0.5
    static let footerTop: CGFloat = 28
    static let footerSpacing: CGFloat = 6
    static let footerGlyphSize: CGFloat = 14
    static let footnoteSize: CGFloat = 11
    static let footnoteLineHeight: CGFloat = 1.45
    static let footnoteMaximumWidth: CGFloat = 240
}
```

`maximumContentWidth: 560` con `GeometryReader` y sin anchos fijos es lo que hace que la hoja
funcione igual en iPhone y en iPad.

---

## 4. Copy y formato de números

`pick(es, en)` elige idioma; `capsuleLocale` es el `Locale` de la app. Dos detalles que costaron
tiempo y conviene no volver a descubrir:

- **Agrupación de miles en español.** `formatted` respeta el mínimo de agrupación CLDR, que en
  español es de dos dígitos: `7586` sale **sin** separador. El diseño lo pedía siempre agrupado, así
  que se formatea en `en_US` y luego se sustituye la coma por el separador del idioma.
- **Valor y unidad separados** (`healthHistoryDistanceParts`) para poder darles tipografías y
  colores distintos en la rejilla, y para atenuar sólo el valor cuando es cero.

```swift
var healthHistoryTitle: String { pick("Tu semana", "Your week") }

var healthHistoryEmpty: String {
    pick(
        "No hay datos de Salud para esta semana. Si no los ves, revisa el acceso en Ajustes › Salud › Acceso a datos.",
        "There is no Health data for this week. If you expected some, review access in Settings › Health › Data Access."
    )
}

var healthHistoryPrivacyNote: String {
    pick(
        "Leído de Salud solo mientras esta pantalla está abierta. UpNews no guarda ni envía estos datos.",
        "Read from Health only while this screen is open. UpNews doesn't store or send this data."
    )
}

var healthHistoryStepsUnit: String { pick("pasos", "steps") }
var healthHistoryAverageLabel: String { pick("media", "average") }
var healthHistoryToday: String { pick("Hoy", "Today") }
var healthHistoryDistanceLabel: String { pick("Distancia", "Distance") }
var healthHistoryClimbsLabel: String { pick("Subidas", "Climbs") }
var healthHistoryEnergyLabel: String { pick("Energía activa", "Active energy") }
var healthHistoryCyclingLabel: String { pick("En bici", "Cycling") }

/// Miles siempre agrupados («7.586», no «7586»).
func healthHistorySteps(_ value: Double) -> String {
    let grouped = value.rounded().formatted(
        .number.precision(.fractionLength(0)).grouping(.automatic)
            .locale(Locale(identifier: "en_US"))
    )
    let separator = capsuleLocale.groupingSeparator ?? "."
    return grouped.replacingOccurrences(of: ",", with: separator)
}

func healthHistoryFlights(_ value: Double) -> String {
    String(format: "%.0f", locale: capsuleLocale, value)
}

func healthHistoryWeekday(_ date: Date) -> String {
    date.formatted(.dateTime.weekday(.narrow).locale(capsuleLocale))
}

func healthHistoryAveragePerDay(_ steps: Double) -> String {
    pick(
        "\(healthHistorySteps(steps)) de media al día",
        "\(healthHistorySteps(steps)) average a day"
    )
}

/// «9 – 15 sept.» / «Sep 9 – 15», según el idioma de la app.
func healthHistoryDateRange(start: Date, end: Date) -> String {
    (start..<end).formatted(
        .interval.day().month(.abbreviated).locale(capsuleLocale)
    )
}

/// Valor y unidad separados para la rejilla de métricas.
func healthHistoryDistanceParts(_ meters: Double) -> (value: String, unit: String) {
    if meters >= 1_000 {
        return (String(format: "%.1f", locale: capsuleLocale, meters / 1_000), "km")
    }
    return (String(format: "%.0f", locale: capsuleLocale, meters), "m")
}

func healthHistoryEnergyParts(_ kilocalories: Double) -> (value: String, unit: String) {
    (healthHistorySteps(kilocalories), "kcal")
}

func healthHistoryFlightsParts(_ value: Double) -> (value: String, unit: String) {
    (healthHistoryFlights(value), pick("plantas", "floors"))
}

/// La gráfica se ignora para VoiceOver y se sustituye por una frase completa.
func healthHistoryChartAccessibility(_ week: HealthWeekActivity) -> String {
    let today = week.days.last.map { healthHistorySteps($0.steps) } ?? "0"
    return pick(
        "Pasos de la semana: \(healthHistorySteps(week.totalSteps)). Hoy: \(today). Media diaria: \(healthHistorySteps(week.averageDailySteps))",
        "Steps this week: \(healthHistorySteps(week.totalSteps)). Today: \(today). Daily average: \(healthHistorySteps(week.averageDailySteps))"
    )
}
```

---

## 5. Doble de pruebas para XCUITest

La hoja de autorización de HealthKit es del sistema y **XCUITest no puede aceptarla de forma
fiable**. Sin este doble no hay manera de verificar la gráfica en CI: el simulador arranca sin
muestras de Salud y sólo verías el estado vacío.

Vive bajo `#if DEBUG`, así que **no existe en Release** y no puede activarse en un binario
distribuido. Se selecciona por argumento de lanzamiento, no por build setting.

```swift
//
//  DebugHealthReader.swift
//  upnews
//
//  `[67-0]` Fase 3: lector de Salud sintético exclusivo de Debug. La hoja de
//  autorización de HealthKit es del sistema y XCUITest no puede aceptarla, así
//  que estas variantes verifican el estado vacío y la gráfica semanal sin
//  tocar HealthKit. No existe en Release.
//

#if DEBUG
import Foundation

@MainActor
final class DebugHealthReader: HealthActivityReading {

    private let week: HealthWeekActivity

    init(week: HealthWeekActivity) {
        self.week = week
    }

    var isAvailable: Bool { true }

    func requestReadAuthorization() async -> Bool { true }

    func weeklyActivity(endingAt now: Date, calendar: Calendar) async -> HealthWeekActivity? {
        week
    }

    static var requested: DebugHealthReader? {
        let arguments = ProcessInfo.processInfo.arguments
        let calendar = Calendar.current
        if arguments.contains("--health-demo-empty") {
            return DebugHealthReader(
                week: HealthWeekActivity.week(endingAt: Date(), calendar: calendar, values: [:])
            )
        }
        guard arguments.contains("--health-demo-week") else { return nil }
        let today = calendar.startOfDay(for: Date())
        let steps: [Double] = [6_200, 8_900, 4_300, 11_200, 7_600, 9_800, 5_100]
        var values: [Date: HealthDayActivity] = [:]
        for (offset, count) in steps.enumerated() {
            guard let day = calendar.date(byAdding: .day, value: offset - 6, to: today) else { continue }
            values[day] = HealthDayActivity(
                day: day,
                steps: count,
                walkingRunningMeters: count * 0.72,
                cyclingMeters: offset % 3 == 0 ? 4_200 : 0,
                activeEnergyKilocalories: count * 0.04,
                flightsClimbed: Double(offset + 2)
            )
        }
        return DebugHealthReader(
            week: HealthWeekActivity.week(endingAt: Date(), calendar: calendar, values: values)
        )
    }
}
#endif
```

Selección en el compositor de dependencias, también bajo `#if DEBUG`:

```swift
private static var defaultHealthReader: any HealthActivityReading {
    #if DEBUG
    if let debug = DebugHealthReader.requested { return debug }
    #endif
    return HealthJourneyReader()
}
```

Y en el XCUITest:

```swift
app.launchArguments = ["--health-demo-week"]   // o "--health-demo-empty"
```

---

## 6. Permiso just-in-time

El permiso **no** se pide al arrancar ni al abrir la pantalla de ajustes. Se pide en el momento en
que el usuario enciende el interruptor, que es el único instante en que el diálogo del sistema tiene
un porqué visible:

```swift
/// Activar el historial pide lectura en ese momento (just-in-time). Nunca
/// al arrancar ni desde otra pantalla.
func healthHistorySettingDidChange(_ isEnabled: Bool) {
    guard isEnabled, healthReader.isAvailable else { return }
    Task { [healthReader] in
        _ = await healthReader.requestReadAuthorization()
    }
}
```

Lo único que se persiste es el booleano del interruptor. Hay un test que enumera las claves de
`UserDefaults` y falla si aparece cualquier otra con «health».

---

## 7. Configuración del proyecto

Sin esto no compila, o compila y crashea al primer acceso.

**Entitlement** (`upnews.entitlements`):

```xml
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.access</key>
<array/>
```

`healthkit.access` vacío = sin datos clínicos. **No** añadir
`com.apple.developer.healthkit.background-delivery` si no se usa: amplía la superficie que Apple
revisa sin darte nada.

**Purpose strings.** `NSHealthShareUsageDescription` es obligatoria para leer. Y una trampa
documentada en `[68-0]`: **App Store Connect exige también `NSHealthUpdateUsageDescription` en
cuanto el App ID declara la capacidad, aunque no escribas nada**. Sin ella, el upload se rechaza.

```
INFOPLIST_KEY_NSHealthShareUsageDescription = "…"
INFOPLIST_KEY_NSHealthUpdateUsageDescription = "…"
```

Traducirlas en `<lang>.lproj/InfoPlist.strings` con las mismas claves.

**Capacidad en el App ID.** Xcode la activa sola al añadir la capability, pero **nunca la
desactiva**: la firma automática sólo añade. Si algún día quitas HealthKit, hay que desmarcarlo a
mano en el portal de Apple Developer y borrar los perfiles cacheados de
`~/Library/Developer/Xcode/UserData/Provisioning Profiles/`, o el `embedded.mobileprovision` seguirá
declarando la capacidad dentro del `.ipa` aunque el binario esté limpio. A UpNews le costó un gate
bloqueante entero.

**App Privacy** en App Store Connect: declarar Health & Fitness. Aunque no salgan del dispositivo,
se están accediendo.

---

## 8. Qué probar sin HealthKit

Estos tests de `HealthJourneyTests.swift` corrían sin permisos ni muestras, porque todo el cálculo
vive en el modelo puro:

```swift
@Test func weekAlwaysHasSevenLocalDaysEndingToday()
@Test func aWeekWithoutSamplesIsTreatedAsNoData()
@Test func healthValuesAreNeverCodable()          // la salvaguarda de privacidad
@Test func onlyTheFiveReadTypesAreRequested()      // impide que crezcan los tipos por descuido
@Test func healthHistoryIsOptInAndPersistsOnlyTheSwitch()
@Test func weekBarsAreRelativeToTheMaximumAndTheAverageLineFollowsThem()
@Test func anEmptyWeekHasNoBarsAndNoAverageLine()
@Test func weekCopyIsLocalizedAndSplitsValueFromUnit()
```

Dos que merecen copiarse tal cual a cualquier proyecto que toque Salud:

```swift
/// Si nadie puede serializarlos, nadie puede filtrarlos por descuido.
@Test func healthValuesAreNeverCodable() {
    let day = HealthDayActivity(day: .now, steps: 1, walkingRunningMeters: 1,
                                cyclingMeters: 1, activeEnergyKilocalories: 1, flightsClimbed: 1)
    #expect(!(day is any Encodable))
    #expect(!(HealthWeekActivity(days: [day]) is any Encodable))
}

/// La lista de tipos de lectura es un contrato con Apple: que no crezca sola.
@Test func onlyTheFiveReadTypesAreRequested() {
    #expect(HealthJourneyReader.readTypeIdentifiers.map(\.rawValue).sorted() == [...])
}
```

Había además un test que verifica que la copy **describe en vez de exhortar**: falla si el texto
usa imperativos de coaching («muévete», «supera tu récord»). Una app que no es de fitness no debe
sonar como si lo fuera.

---

## 9. Origen

| Dato | Valor |
|---|---|
| Proyecto | `upnews` (`com.southdesertstudio.upnewsapp`) |
| Escrito en | `[67-0]` Fases 3 y 7 |
| Eliminado en | `[69-0]`, `132735c`, 2026-09-16 |
| Recuperado de | `git show 132735c^:upnews/Health/…` |
| Ficheros | `HealthJourneyReader.swift` (184), `HealthWeeklyHistorySheet.swift` (288), `DebugHealthReader.swift` (59), `HealthJourneyTests.swift` (174) |
| iOS | Escrito contra el SDK de iOS 26; usa `HKStatisticsCollectionQueryDescriptor` (iOS 16+) y `async/await` |

Este documento transcribe el código tal como estaba en `132735c^`. **No se ha vuelto a compilar
fuera de aquel proyecto**: depende de `DesignTokensV2`, de la capa `strings`, de `NewsIdentifier` y
de `AppDesign.Size`, que no se incluyen enteros. Al portarlo hay que sustituir esas referencias.
