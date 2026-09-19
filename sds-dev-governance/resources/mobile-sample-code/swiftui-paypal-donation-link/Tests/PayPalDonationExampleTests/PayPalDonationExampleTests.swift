import Foundation
import SwiftUI
import XCTest
@testable import PayPalDonationExample

final class PayPalDonationExampleTests: XCTestCase {
    func testUpNewsURLIsBuiltAndValidated() throws {
        let url = try XCTUnwrap(PayPalDonationDestination.upNews.url)

        XCTAssertEqual(
            url.absoluteString,
            "https://www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J"
        )
    }

    func testTamperedDestinationsAreRejected() {
        let destination = PayPalDonationDestination.upNews
        let candidates = [
            "http://www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J",
            "https://paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J",
            "https://www.paypal.com.evil.example/donate/?hosted_button_id=DZN43P2ZRPY9J",
            "https://www.paypal.com/send/?hosted_button_id=DZN43P2ZRPY9J",
            "https://www.paypal.com/donate/?hosted_button_id=OTHER",
            "https://www.paypal.com/donate/",
            "https://www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J&extra=1",
            "https://user:password@www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J",
            "https://www.paypal.com:443/donate/?hosted_button_id=DZN43P2ZRPY9J",
            "https://www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J#fragment"
        ]

        for raw in candidates {
            XCTAssertNil(destination.validated(URL(string: raw)), raw)
        }
        XCTAssertNil(destination.validated(nil))
    }

    @MainActor
    func testOneInvocationHandsTheExactURLToTheSystemOnce() {
        var opened: [URL] = []
        let action = OpenURLAction { url in
            opened.append(url)
            return .handled // Test intercepts the URL; never open a browser.
        }

        XCTAssertTrue(
            ExternalPayPalDonation.open(
                destination: .upNews,
                using: action
            )
        )
        XCTAssertEqual(opened, [PayPalDonationDestination.upNews.url].compactMap { $0 })
    }
}
