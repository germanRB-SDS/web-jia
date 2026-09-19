# SwiftUI PayPal Donation Link — Index and How to Use It

Runnable Swift package preserving the external PayPal contribution flow that UpNews used before
its App Store `1.0 (6)` compliance build. It is deliberately outside every UpNews Xcode target.

## What is preserved

- The known UpNews PayPal destination:
  `https://www.paypal.com/donate/?hosted_button_id=DZN43P2ZRPY9J`.
- URL construction with `URLComponents`, without force unwrap.
- Exact allowlisting of scheme, host, path, single query key and hosted button identifier.
- Rejection of credentials, ports, fragments, extra query parameters and altered destinations.
- An injectable `OpenURLAction` boundary and a reusable SwiftUI button whose visible/accessibility
  copy remains owned by the consuming app.

The hosted button identifier is public routing information, not a credential. Do not place PayPal
account secrets, API credentials, tokens or private merchant data in this resource.

## Files

| File | Role |
|---|---|
| `Package.swift` | Standalone Swift package manifest; no third-party dependency |
| `Sources/PayPalDonationExample/PayPalDonationExample.swift` | Destination, validation, external opener and SwiftUI button |
| `Tests/PayPalDonationExampleTests/PayPalDonationExampleTests.swift` | Exact URL, tamper rejection and single-open tests |

## Run the example tests

From this leaf directory:

```bash
swift test
```

The package supports iOS 16+ and macOS 13+ so its URL and action boundary can be tested locally.

## Reintroduction gate

This is **reference code, not a dormant UpNews feature**. Do not restore it by uncommenting a block,
by switching a review flag or by changing behavior after approval.

For a future UpNews contribution feature:

1. Open a new, owner-authorized product-contract change; do not reverse `REQ-023` implicitly.
2. Re-check the current App Store Review Guidelines for every distributed storefront. Apple
   currently documents in-app tipping under 3.1.1 and requires hidden/dormant behavior to be absent
   under 2.3.1; regional link permissions and entitlements can change.
3. Prefer StoreKit for an in-app tip intended for broad storefront distribution. Use this PayPal
   example only where the then-current contract and storefront rules explicitly admit it.
4. Copy the source into a product-owned module, keep UI copy in i18n and business identifiers in the
   app's business configuration owner.
5. Add the feature to navigation and review notes openly, then run unit, UI, archive and final-binary
   scans on the exact release candidate.

Official policy entrypoint:
https://developer.apple.com/app-store/review/guidelines/

## Minimal integration sketch

```swift
PayPalDonationButton(
    destination: .upNews,
    accessibilityLabel: Text(strings.accessibilityDonationButton),
    accessibilityHint: Text(strings.accessibilityDonationHint)
) {
    Image(systemName: "dollarsign")
}
```

The snippet intentionally receives localized copy from the consuming app. Adapt the visual wrapper
to that app's design system and minimum tap target.

## Provenance

SDS-owned, owner-requested extraction of the working UpNews implementation observed at commit
`ec4d68aedabdfe4c1158ffe30b7c86f8351b54be` on 2026-09-04. No PayPal SDK, third-party source code,
PayPal artwork or credential is vendored.
