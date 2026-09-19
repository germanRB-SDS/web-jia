import Foundation
import SwiftUI

/// Public PayPal hosted-button destination with strict validation.
///
/// A hosted button identifier is routing information visible in the public URL. It is not an API
/// credential. Never extend this type with PayPal secrets or private account data.
public struct PayPalDonationDestination: Equatable, Sendable {
    public static let upNews = PayPalDonationDestination(
        hostedButtonID: "DZN43P2ZRPY9J"
    )

    public let hostedButtonID: String

    public init(hostedButtonID: String) {
        self.hostedButtonID = hostedButtonID
    }

    public var url: URL? {
        var components = URLComponents()
        components.scheme = Self.scheme
        components.host = Self.host
        components.path = Self.path
        components.queryItems = [
            URLQueryItem(
                name: Self.hostedButtonIDParameter,
                value: hostedButtonID
            )
        ]
        return validated(components.url)
    }

    public func validated(_ candidate: URL?) -> URL? {
        guard !hostedButtonID.isEmpty,
              let candidate,
              let components = URLComponents(
                  url: candidate,
                  resolvingAgainstBaseURL: false
              ),
              components.scheme?.lowercased() == Self.scheme,
              components.host?.lowercased() == Self.host,
              components.path == Self.path,
              components.user == nil,
              components.password == nil,
              components.port == nil,
              components.fragment == nil,
              let items = components.queryItems,
              items.count == 1,
              let identifier = items.first,
              identifier.name == Self.hostedButtonIDParameter,
              identifier.value == hostedButtonID
        else { return nil }

        return candidate
    }

    private static let scheme = "https"
    private static let host = "www.paypal.com"
    private static let path = "/donate/"
    private static let hostedButtonIDParameter = "hosted_button_id"
}

public enum ExternalPayPalDonation {
    /// Hands the validated destination to the system URL handler exactly once.
    @MainActor
    @discardableResult
    public static func open(
        destination: PayPalDonationDestination,
        using action: OpenURLAction
    ) -> Bool {
        guard let url = destination.url else { return false }
        action(url)
        return true
    }
}

/// Minimal reusable UI wrapper. The caller owns visible and accessibility copy.
public struct PayPalDonationButton<Label: View>: View {
    private let destination: PayPalDonationDestination
    private let accessibilityLabel: Text
    private let accessibilityHint: Text?
    private let label: Label

    @Environment(\.openURL) private var openURL

    public init(
        destination: PayPalDonationDestination,
        accessibilityLabel: Text,
        accessibilityHint: Text? = nil,
        @ViewBuilder label: () -> Label
    ) {
        self.destination = destination
        self.accessibilityLabel = accessibilityLabel
        self.accessibilityHint = accessibilityHint
        self.label = label()
    }

    public var body: some View {
        Button {
            ExternalPayPalDonation.open(
                destination: destination,
                using: openURL
            )
        } label: {
            label
        }
        .accessibilityLabel(accessibilityLabel)
        .accessibilityHint(accessibilityHint ?? Text(""))
    }
}
