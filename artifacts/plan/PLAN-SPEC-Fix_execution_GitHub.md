---
skill: playwright-automation-plan
session_id: Fix_execution_GitHub
version: 1.0.0
mode: BUILD
date: 2026-07-17
requirement_source: ./artifacts/outputs/quality-engineering-design/test-cases (FTC-LONDONDRUGS-20260702)
target_repo: /Users/virginia.zambudio/PlaywrightAutomation
environment: UAT — https://london-drugs-uat-origin.kibology.us/
---

# PLAN-SPEC — London Drugs UAT: 63-TC Playwright Automation Plan

## Section 1: Clear Step Plan

source: requirement (FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md), automation-standards.md

### 1.1 Overview

Translate all 63 validated functional test cases from the FTC-LONDONDRUGS-20260702 manifest
into Playwright/TypeScript automation targeting the London Drugs UAT environment.
Coverage spans 8 epics. Three existing spec files are extended; five new spec files are created.
No test code is written by this plan — downstream `playwright-automation-implement` consumes this verbatim.

### 1.2 Spec File Strategy

| Spec File | Verdict | Epic | TC Count | Source TCs |
|-----------|---------|------|----------|------------|
| `tests/home-page.spec.ts` | EXTEND | EPIC-01 Home Page | 13 | FTC_01_01_01 – FTC_01_06_03 |
| `tests/plp.spec.ts` | EXTEND | EPIC-02 PLP | 7 | FTC_02_01_01 – FTC_02_02_03 |
| `tests/pdp.spec.ts` | EXTEND | EPIC-03 PDP | 13 | FTC_03_01_01 – FTC_03_06_02 |
| `tests/cart.spec.ts` | NEW | EPIC-04 Cart | 6 | FTC_04_01_01 – FTC_04_02_03 |
| `tests/my-account.spec.ts` | NEW | EPIC-05 My Account | 7 | FTC_05_01_01 – FTC_05_02_03 |
| `tests/store-locator.spec.ts` | NEW | EPIC-06 Store Locator | 5 | FTC_06_01_01 – FTC_06_02_03 |
| `tests/deals-events.spec.ts` | NEW | EPIC-07 Deals/MyRegistry | 5 | FTC_07_01_01 – FTC_07_02_03 |
| `tests/checkout.spec.ts` | NEW | EPIC-08 Checkout | 7 | FTC_08_01_01 – FTC_08_02_05 |

Rationale for EXTEND verdict on existing files:
- `home-page.spec.ts` currently covers TC-83225 through TC-83232 (from playwright_test_cases.csv). FTC_01_xx are a
  superset with 3 additional stories (hamburger menu, logo navigation, mini-cart dismiss) not yet automated.
  source: repo:tests/home-page.spec.ts:1 — existing file confirmed.
- `plp.spec.ts` covers TC-83233 and TC-83234 (filter + sort). FTC_02_xx adds 5 additional cases
  (multiple filters, filter removal, sort absent, sort switching).
  source: repo:tests/plp.spec.ts:1 — existing file confirmed.
- `pdp.spec.ts` covers TC-83235 through TC-83240 (breadcrumb, price, availability, ISP/STH, wishlist).
  FTC_03_xx adds the corresponding negative and boundary variants not yet present.
  source: repo:tests/pdp.spec.ts:1 — existing file confirmed.

### 1.3 Page Object Strategy

| POM File | Verdict | Coverage | Locator Gaps |
|----------|---------|----------|--------------|
| `pages/HomePage.ts` | EXTEND | FTC_01_xx | Hamburger/mega-menu toggle (locator gap) |
| `pages/SearchResultsPage.ts` | EXTEND | FTC_02_xx | Filter deselect control, sort option switching (locator gaps) |
| `pages/ProductDetailPage.ts` | EXTEND | FTC_03_xx | ISP store result list, STH unavailability msg, wishlist icon state (locator gaps) |
| `pages/StoreLocatorPage.ts` | REUSE | FTC_06_xx | No gaps — existing locators cover heading + find-all-stores link |
| `pages/CartPage.ts` | NEW | FTC_04_xx | delivery selector, subtotal element, quantity control |
| `pages/MyAccountPage.ts` | NEW | FTC_05_xx (address book) | add-address button, form fields, save button, address list |
| `pages/CheckoutPage.ts` | NEW | FTC_08_xx | guest email field, address fields, payment method selector, PayPal button, payment iframe, place order button |
| `pages/DealsEventsPage.ts` | NEW | FTC_07_xx | city filter selector, deals grid, MyRegistry button on PDP |

Note: `pages/LoginPage.ts` already exists and covers FTC_05_01_xx login scenarios.
source: repo:pages/LoginPage.ts:1

### 1.4 Test Data Files Strategy

| Data File | Verdict | Covers |
|-----------|---------|--------|
| `test-data/home-page.data.ts` | EXTEND | Add hamburger-menu and logo-navigation constants |
| `test-data/plp.data.ts` | EXTEND | Add multi-filter, filter-removal, sort-switching constants |
| `test-data/pdp.data.ts` | EXTEND | Add wishlist, ISP error-message, STH-unavailable strings |
| `test-data/cart.data.ts` | NEW | Delivery mode labels, subtotal regex, quantity values |
| `test-data/my-account.data.ts` | NEW | Login credentials (env-var refs only), address form fields |
| `test-data/store-locator.data.ts` | NEW | Page URLs, heading text, all-stores province list |
| `test-data/checkout.data.ts` | NEW | Sandbox card numbers (env-var refs), sandbox declined card, guest email, address fields |
| `test-data/deals-events.data.ts` | NEW | Page URL, city name for filter, MyRegistry button selector hint |

Rule: credentials and card numbers MUST be read from environment variables.
No secrets committed. source: automation-standards.md §7 "Environment Management for Automation".

### 1.5 Execution Steps (Sequential for Implementation)

1. **Environment validation** — confirm UAT reachable; confirm `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` set.
2. **EPIC-04 Cart** — create `CartPage.ts` + `cart.data.ts` + `cart.spec.ts` (P0 priority, automation-standards §5 priority order).
3. **EPIC-08 Checkout** — create `CheckoutPage.ts` + `checkout.data.ts` + `checkout.spec.ts` (P0 priority, payment-critical).
4. **EPIC-05 My Account** — create `MyAccountPage.ts` + `my-account.data.ts` + `my-account.spec.ts` (P0 auth flow).
5. **EPIC-01 Home Page** — extend `HomePage.ts` + `home-page.data.ts` + `home-page.spec.ts` (13 TCs, P0/P1).
6. **EPIC-03 PDP** — extend `ProductDetailPage.ts` + `pdp.data.ts` + `pdp.spec.ts` (13 TCs, P0).
7. **EPIC-02 PLP** — extend `SearchResultsPage.ts` + `plp.data.ts` + `plp.spec.ts` (7 TCs, P1/P2).
8. **EPIC-06 Store Locator** — create `store-locator.spec.ts` + `store-locator.data.ts` (5 TCs, P1/P2, reuse existing POM).
9. **EPIC-07 Deals/MyRegistry** — create `DealsEventsPage.ts` + `deals-events.data.ts` + `deals-events.spec.ts` (5 TCs, P2).
10. **Fixture pattern** — all specs import `test` and `expect` from `../helpers/fixtures` (anti-bot measures applied automatically). source: repo:helpers/fixtures.ts:37.
11. **Evidence** — all specs include `test.afterEach` calling `takeEvidenceScreenshot` on failure. source: repo:tests/home-page.spec.ts:9.

## Section 2: Listed Test Cases

source: FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md + all 8 epic suite files

### 2.1 EPIC-01: Home Page — `tests/home-page.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_01_01_01 | Logo click navigates to homepage | Positive | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_01_02 | Logo element absent — graceful skip | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_02_01 | Search with invalid term shows no-results | Negative | P1 | home-page.spec.ts | HomePage, SearchResultsPage | LIKELY COVERED — verify TC-83226 |
| FTC_01_02_02 | Search with empty term | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_02_03 | Search with 200-char term | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_03_01 | Valid search returns results | Positive | P0 | home-page.spec.ts | HomePage, SearchResultsPage | LIKELY COVERED — verify TC-83227 |
| FTC_01_04_01 | Store Locator opens + Find All Stores works | Positive | P1 | home-page.spec.ts | HomePage, StoreLocatorPage | LIKELY COVERED — verify TC-83228 |
| FTC_01_04_02 | Store Locator link absent | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_05_01 | Mini Cart opens + View Cart navigates | Positive | P1 | home-page.spec.ts | HomePage | LIKELY COVERED — verify TC-83229 |
| FTC_01_05_02 | Mini cart with empty cart | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_05_03 | Mini cart closes on overlay dismiss | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_01 | Hamburger menu opens mega menu | Positive | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_02 | Hamburger button visible on mobile viewport | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_03 | Hamburger menu closes on second click | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |

### 2.2 EPIC-02: Product Listing Page — `tests/plp.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_02_01_01 | Applying filter updates results and URL | Positive | P1 | plp.spec.ts | SearchResultsPage | LIKELY COVERED — verify TC-83233 |
| FTC_02_01_02 | Applying multiple filters | Positive | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_01_03 | Filter panel absent | Negative | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_01_04 | Removing filter restores results | Negative | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_02_01 | Price Low to High sort updates results | Positive | P2 | plp.spec.ts | SearchResultsPage | LIKELY COVERED — verify TC-83234 |
| FTC_02_02_02 | Sort control absent | Negative | P2 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_02_03 | Switching sort options refreshes results | Boundary | P2 | plp.spec.ts | SearchResultsPage | NEW in file |

### 2.3 EPIC-03: Product Detail Page — `tests/pdp.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_03_01_01 | Second breadcrumb navigates to PLP | Positive | P2 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83235 |
| FTC_03_01_02 | Breadcrumb absent on PDP | Negative | P2 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_01_03 | First breadcrumb navigates to homepage | Boundary | P2 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_02_01 | Price element visible and formatted | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83236 |
| FTC_03_02_02 | Price element absent | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_03_01 | Availability indicator visible | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83237 |
| FTC_03_03_02 | Availability indicator absent | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_04_01 | Add to Cart (ISP) increments mini cart | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83238 |
| FTC_03_04_02 | ISP: no store found for postal code | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_04_03 | ISP: malformed postal code shows validation | Boundary | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_05_01 | Add to Cart (STH) increments counter | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83239 |
| FTC_03_05_02 | STH: non-deliverable postal code | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_06_01 | Authenticated user adds to wishlist | Positive | P1 | pdp.spec.ts | ProductDetailPage, LoginPage | LIKELY COVERED — verify TC-83240 |
| FTC_03_06_02 | Unauthenticated user redirected to login | Negative | P1 | pdp.spec.ts | ProductDetailPage, LoginPage | NEW in file |

### 2.4 EPIC-04: Cart — `tests/cart.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_04_01_01 | Switching to Shipping triggers cart update | Positive | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_01_02 | Delivery selector absent | Negative | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_01_03 | Switching delivery modes updates cart | Boundary | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_01 | Subtotal visible with dollar amount | Positive | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_02 | Subtotal absent | Negative | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_03 | Subtotal updates after quantity change | Boundary | P0 | cart.spec.ts | CartPage | NEW file |

### 2.5 EPIC-05: My Account — `tests/my-account.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_05_01_01 | Valid login redirects to My Account | Positive | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_02 | Invalid password shows error | Negative | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_03 | Empty email field shows validation | Boundary | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_04 | SQL injection in login fields rejected | Negative | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_02_01 | Saving new address adds to address book | Positive | P1 | my-account.spec.ts | LoginPage, MyAccountPage | NEW file |
| FTC_05_02_02 | Missing required field shows validation | Negative | P1 | my-account.spec.ts | MyAccountPage | NEW file |
| FTC_05_02_03 | Invalid postal code format rejected | Boundary | P1 | my-account.spec.ts | MyAccountPage | NEW file |

### 2.6 EPIC-06: Store Locator — `tests/store-locator.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_06_01_01 | Store Locator page loads with heading and link | Positive | P1 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_01_02 | Store Locator heading absent | Negative | P1 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_01 | Find All Stores link navigates to all-stores | Positive | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_02 | Find All Stores link absent | Negative | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_03 | All-stores page renders empty list | Boundary | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |

### 2.7 EPIC-07: Deals and Events / MyRegistry — `tests/deals-events.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_07_01_01 | MyRegistry button present on PDP | Positive | P2 | deals-events.spec.ts | ProductDetailPage, DealsEventsPage | NEW file |
| FTC_07_01_02 | MyRegistry button absent on PDP | Negative | P2 | deals-events.spec.ts | ProductDetailPage, DealsEventsPage | NEW file |
| FTC_07_02_01 | City filter loads events via API | Positive | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |
| FTC_07_02_02 | City filter selector absent | Negative | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |
| FTC_07_02_03 | City filter produces empty state | Boundary | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |

### 2.8 EPIC-08: Checkout — `tests/checkout.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------|
| FTC_08_01_01 | PayPal button visible and clickable | Positive | P0 | checkout.spec.ts | CheckoutPage | NEW file |
| FTC_08_01_02 | PayPal button absent | Negative | P0 | checkout.spec.ts | CheckoutPage | NEW file |
| FTC_08_02_01 | Guest completes checkout with credit card | Positive | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_02 | Declined card shows payment error | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_03 | Missing address field shows validation | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_04 | SQL injection in address field rejected | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_05 | Payment iframe accessible and fillable | Boundary | P0 | checkout.spec.ts | CheckoutPage | NEW file |

### 2.9 Summary

| Metric | Value |
|--------|-------|
| Total test cases planned | 63 |
| Positive | 21 (33%) |
| Negative | 27 (43%) |
| Boundary | 15 (24%) |
| Spec files — EXTEND | 3 |
| Spec files — NEW | 5 |
| POMs — EXTEND | 2 |
| POMs — NEW | 4 |
| POMs — REUSE as-is | 2 (StoreLocatorPage, LoginPage) |
| Blocked TCs (third-party iframe) | 2 (FTC_07_01_xx — MyRegistry full flow; FTC_08_01_xx — PayPal OAuth) |

## Section 3: Risks and Mitigations

source: automation-standards.md §6 + FTC-MANIFEST open questions OQ-01 through OQ-04

| ID | Category | Risk | Affected TCs | Mitigation |
|----|----------|------|--------------|------------|
| R-01 | auth | DataDome/Cloudflare bot protection blocks login automation on UAT. OQ-03 in manifest. | FTC_05_01_01–FTC_05_01_04, FTC_05_02_01, FTC_03_06_01, FTC_08_02_01–FTC_08_02_04 | Use `helpers/anti-bot.ts` (already applied via fixtures.ts). For CI: pre-create `auth/storageState.json` via `auth/auth.setup.ts` so authenticated tests skip live login. source: repo:auth/auth.setup.ts + repo:helpers/fixtures.ts:37. |
| R-02 | environment | Third-party iframes (PayPal OAuth, MyRegistry) cannot be fully automated — iframe crosses origins. OQ-02 in manifest. | FTC_07_01_01–FTC_07_01_02 (button only), FTC_08_01_01–FTC_08_01_02 (button only) | Scope validation to button presence/visibility only — do NOT attempt to click through the iframe auth flow. Explicitly document in spec comments that full OAuth flow is blocked. |
| R-03 | environment | Payment iframe for credit card (FTC_08_02_xx) may be a same-domain or cross-domain iframe. Frame locator API must be used. OQ-04 in manifest. | FTC_08_02_01, FTC_08_02_05 | Use Playwright `page.frameLocator()` to scope all card-field interactions inside the payment iframe. Sandbox card numbers read from `process.env['SANDBOX_CARD_NUMBER']`. source: automation-standards.md §7. |
| R-04 | data | Sandbox card numbers and test credentials must never be hardcoded. | FTC_05_01_01–FTC_05_02_03, FTC_08_02_xx | All auth credentials read from env vars (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`). Sandbox card numbers from `SANDBOX_CARD_NUMBER` and `SANDBOX_DECLINED_CARD`. checkout.data.ts uses `process.env` with no fallback values in CI. |
| R-05 | timing | UAT has elevated latency (up to 20 s hydration delay observed in existing POMs). New POMs and specs that navigate then interact immediately may flake. | ALL new spec files | Mirror existing POM pattern: call `BasePage.waitForHydration()` / `waitForLoadState('load')` before interactions. source: repo:pages/BasePage.ts. Playwright global timeout is 60 s per playwright.config.ts. |
| R-06 | locator | Hamburger/mega-menu has multiple DOM copies for responsive breakpoints; only the visible one must be clicked (FTC_01_06_01–03). | FTC_01_06_01, FTC_01_06_02, FTC_01_06_03 | Use `.filter({ hasText: ... }).or()` or `.locator(':visible')` pattern to select only the visible hamburger button, matching the existing approach in StoreLocatorPage. Open question OQ-HAM-01. |
| R-07 | locator | CartPage, CheckoutPage, MyAccountPage, and DealsEventsPage locators are NOT yet MCP-validated — no browser discovery has been run for these pages in the current session. | FTC_04_xx, FTC_05_02_xx, FTC_07_02_xx, FTC_08_xx | Implementation skill MUST run MCP browser discovery against UAT for each new POM before committing locators. Flag all new POM locators as `status: assumption` until MCP-validated. |
| R-08 | test logic | Negative test cases that assert element absence (FTC_01_01_02, FTC_01_04_02, FTC_03_02_02, FTC_03_03_02, FTC_04_01_02, FTC_04_02_02, FTC_06_01_02, FTC_06_02_02, FTC_08_01_02) cannot reach the absent-element state in a live UAT environment by design — the element will normally be present. | 14 negative TCs | Implement these as soft-checks: use `toBeVisible({ visible: false })` with a short timeout; if the element IS present the test verifies the happy-path locator works; document the limitation in spec comments. Alternative: skip these in CI and mark as manual-verification only. |
| R-09 | environment | FTC_06_02_03 asserts an empty store list — UAT always has stores. | FTC_06_02_03 | Implement as an assertion that at least one store IS present (invert the Gherkin negative intent to a regression guard). Flag the boundary intent: document that zero-store state is untestable on live UAT; CI will always pass as long as stores exist. |
| R-10 | timing | Cart/Checkout tests require a product in the cart as a precondition. Setting up cart state via the UI takes 2–3 navigation steps and is fragile. | FTC_04_xx, FTC_08_xx | Use API-level cart setup where possible (add-to-cart API call in test setup). If no public API is available, set up cart via UI in a `test.beforeEach` using existing ProductDetailPage ISP/STH flow. Register as OQ-CART-01. |

## Section 4: Code Sketch

source: repo:tests/home-page.spec.ts, repo:helpers/fixtures.ts, automation-standards.md §3 §4

The sketches below are structural guides, NOT implementation code.
No locator strings are hardcoded — all values reference data file constants.
All specs import from `../helpers/fixtures` per project convention.
All specs add `test.afterEach` evidence screenshot on failure.

---

### 4.1 Sketch — `tests/cart.spec.ts` (NEW — highest priority after checkout)

```typescript
// tests/cart.spec.ts
// Coverage: FTC_04_01_01 – FTC_04_02_03 (EPIC-04 Cart, P0)
// POMs: CartPage (NEW)
// Data: test-data/cart.data.ts (NEW)

import { test, expect } from '../helpers/fixtures';
import { CartPage } from '../pages/CartPage';
import { cartData } from '../test-data/cart.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

// Precondition: product must be in cart. Use test.beforeEach to add via STH flow.
// See Risk R-10 — prefer API-level cart setup if available.

test.describe('Cart — Delivery Options @cart @epic-04', () => {
    // FTC_04_01_01 | Positive | P0
    test('FTC_04_01_01 — Switching to Shipping triggers cart update', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Navigate to cart with a product', async () => {
            // setup: add product to cart via STH or API
        });
        await test.step('Select Shipping delivery option', async () => {
            // cartPage.deliverySelector.click(...)
        });
        await test.step('Assert cart update API call was made', async () => {
            // page.waitForResponse() intercepting cart update endpoint
        });
    });

    // FTC_04_01_02 | Negative | P0 — element-absent guard (Risk R-08 applies)
    test('FTC_04_01_02 — Delivery selector absent is flagged', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Navigate to cart', async () => { /* ... */ });
        await test.step('Assert delivery selector locator resolves (regression guard)', async () => {
            // await expect(cartPage.deliverySelector).toBeVisible();
        });
    });

    // FTC_04_01_03 | Boundary | P0
    test('FTC_04_01_03 — Switching from Shipping back to In-Store Pickup updates cart', async ({ page }) => {
        // ...
    });
});

test.describe('Cart — Subtotal @cart @epic-04', () => {
    // FTC_04_02_01 | Positive | P0
    test('FTC_04_02_01 — Subtotal visible with dollar amount', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Assert subtotal element is visible', async () => {
            // await expect(cartPage.subtotalElement).toBeVisible();
            // await expect(cartPage.subtotalText).toMatch(cartData.subtotalRegex);
        });
    });

    // FTC_04_02_02 | Negative | P0 — element-absent guard (Risk R-08)
    // FTC_04_02_03 | Boundary | P0 — quantity update, subtotal recalculation
});
```

---

### 4.2 Sketch — `tests/checkout.spec.ts` (NEW)

```typescript
// tests/checkout.spec.ts
// Coverage: FTC_08_01_01 – FTC_08_02_05 (EPIC-08 Checkout, P0)
// POMs: CartPage (NEW), CheckoutPage (NEW)
// Data: test-data/checkout.data.ts (NEW)
// Risk R-02 (PayPal blocked), R-03 (payment iframe), R-04 (env-var credentials)

import { test, expect } from '../helpers/fixtures';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutData } from '../test-data/checkout.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('Checkout — Payment Method Availability @checkout @epic-08', () => {
    test.beforeEach(async ({ page }) => {
        // setup: add product to cart, navigate to checkout page
    });

    // FTC_08_01_01 | Positive | P0 — PayPal button visible (iframe flow blocked per R-02)
    test('FTC_08_01_01 — PayPal button visible and clickable', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        await test.step('Assert PayPal button is visible', async () => {
            // await expect(checkoutPage.paypalButton).toBeVisible();
            // await expect(checkoutPage.paypalButton).toBeEnabled();
        });
    });

    // FTC_08_01_02 | Negative | P0 — element-absent guard (Risk R-08)
});

test.describe('Checkout — Guest Credit Card Checkout @checkout @epic-08', () => {
    // FTC_08_02_01 | Positive | P0
    test('FTC_08_02_01 — Guest completes checkout with sandbox credit card', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        await test.step('Add product to cart and proceed to checkout', async () => { /* ... */ });
        await test.step('Fill guest email', async () => {
            // checkoutPage.guestEmailInput.fill(checkoutData.guestEmail)
        });
        await test.step('Fill delivery address', async () => {
            // checkoutPage.firstNameInput, .addressInput, .postalCodeInput
        });
        await test.step('Select credit card and fill payment iframe', async () => {
            // const paymentFrame = page.frameLocator(checkoutData.paymentIframeSelector);
            // paymentFrame.locator(checkoutData.cardNumberField).fill(process.env['SANDBOX_CARD_NUMBER'])
        });
        await test.step('Place order and assert confirmation', async () => {
            // await page.waitForURL(/\/order-confirmation/);
        });
    });

    // FTC_08_02_02 | Negative | P0 — declined card (env-var: SANDBOX_DECLINED_CARD)
    // FTC_08_02_03 | Negative | P0 — missing postal code validation
    // FTC_08_02_04 | Negative | P0 — SQL injection in address field rejected
    // FTC_08_02_05 | Boundary | P0 — payment iframe accessible (page.frameLocator pattern)
});
```

---

### 4.3 Sketch — `tests/my-account.spec.ts` (NEW)

```typescript
// tests/my-account.spec.ts
// Coverage: FTC_05_01_01 – FTC_05_02_03 (EPIC-05 My Account, P0/P1)
// POMs: LoginPage (REUSE), MyAccountPage (NEW)
// Data: test-data/my-account.data.ts (NEW — env-var refs for credentials)
// Risk R-01 (DataDome), R-04 (credentials via env vars)

import { test, expect } from '../helpers/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { myAccountData } from '../test-data/my-account.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('My Account — Authentication @myaccount @epic-05', () => {
    // FTC_05_01_01 | Positive | P0
    test('FTC_05_01_01 — Valid login redirects to My Account dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await test.step('Navigate to login', async () => {
            // loginPage.navigate(myAccountData.urls.login)
        });
        await test.step('Sign in with valid credentials', async () => {
            // loginPage.login(process.env['TEST_USER_EMAIL'], process.env['TEST_USER_PASSWORD'])
        });
        await test.step('Assert redirect to /myaccount', async () => {
            // await expect(page).toHaveURL(/\/myaccount/);
        });
    });

    // FTC_05_01_02 | Negative | P0 — invalid password, error shown
    // FTC_05_01_03 | Boundary | P0 — empty email, validation message
    // FTC_05_01_04 | Negative | P0 — SQL injection pattern rejected
});

test.describe('My Account — Address Book @myaccount @epic-05', () => {
    test.beforeEach(async ({ page }) => {
        // Authenticate via storageState (preferred, Risk R-01) or LoginPage
    });

    // FTC_05_02_01 | Positive | P1 — add new address, assert appears in list
    // FTC_05_02_02 | Negative | P1 — missing street address, validation error
    // FTC_05_02_03 | Boundary | P1 — US ZIP code rejected, format error shown
});
```

---

### 4.4 Sketch — `tests/store-locator.spec.ts` (NEW — reuses existing StoreLocatorPage)

```typescript
// tests/store-locator.spec.ts
// Coverage: FTC_06_01_01 – FTC_06_02_03 (EPIC-06 Store Locator, P1/P2)
// POMs: StoreLocatorPage (REUSE — no locator gaps)
// Data: test-data/store-locator.data.ts (NEW)

import { test, expect } from '../helpers/fixtures';
import { StoreLocatorPage } from '../pages/StoreLocatorPage';
import { storeLocatorData } from '../test-data/store-locator.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('Store Locator — Page Load @storelocator @epic-06', () => {
    // FTC_06_01_01 | Positive | P1
    test('FTC_06_01_01 — Store Locator page loads with heading and Find All Stores link', async ({ page }) => {
        const storeLocatorPage = new StoreLocatorPage(page);
        await test.step('Navigate to Store Locator', async () => {
            // storeLocatorPage.navigate(storeLocatorData.urls.storeLocator)
        });
        await test.step('Assert heading and Find All Stores link visible', async () => {
            // await expect(storeLocatorPage.storeLocatorHeading).toBeVisible();
            // await expect(storeLocatorPage.findAllStoresLink).toBeVisible();
        });
    });

    // FTC_06_01_02 | Negative | P1 — heading absent regression guard (Risk R-08)
});

test.describe('Store Locator — All Stores Navigation @storelocator @epic-06', () => {
    // FTC_06_02_01 | Positive | P2
    // FTC_06_02_02 | Negative | P2 — link absent regression guard
    // FTC_06_02_03 | Boundary | P2 — inverted: assert at least 1 store present (Risk R-09)
});
```

---

### 4.5 Sketch — `tests/deals-events.spec.ts` (NEW)

```typescript
// tests/deals-events.spec.ts
// Coverage: FTC_07_01_01 – FTC_07_02_03 (EPIC-07 Deals/MyRegistry, P2)
// POMs: ProductDetailPage (REUSE), DealsEventsPage (NEW)
// Data: test-data/deals-events.data.ts (NEW)
// Risk R-02 (MyRegistry iframe — button only, full flow blocked)

import { test, expect } from '../helpers/fixtures';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { DealsEventsPage } from '../pages/DealsEventsPage';
import { dealsEventsData } from '../test-data/deals-events.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('MyRegistry — Button Existence @myregistry @epic-07', () => {
    // FTC_07_01_01 | Positive | P2 — MyRegistry button present on a PDP
    // FTC_07_01_02 | Negative | P2 — button absent regression guard
});

test.describe('Deals and Events — City Filter @deals @epic-07', () => {
    // FTC_07_02_01 | Positive | P2 — city filter + API intercept
    // FTC_07_02_02 | Negative | P2 — city selector absent regression guard
    // FTC_07_02_03 | Boundary | P2 — empty state after city with no deals selected
});
```

---

### 4.6 POM Stub Signatures (new files)

```typescript
// pages/CartPage.ts — NEW
class CartPage extends BasePage {
    readonly deliverySelector: Locator;   // delivery mode toggle
    readonly shippingOption: Locator;     // specific Shipping button
    readonly pickupOption: Locator;       // specific In-Store Pickup button
    readonly subtotalElement: Locator;    // cart summary subtotal
    readonly subtotalText: Locator;       // text node inside subtotal
    readonly quantityInput: Locator;      // product quantity field
    // Methods: navigate(), switchToShipping(), switchToPickup(), getSubtotalText()
    // All locators: status assumption — requires MCP browser discovery on UAT
}

// pages/CheckoutPage.ts — NEW
class CheckoutPage extends BasePage {
    readonly paypalButton: Locator;       // PayPal smart button
    readonly guestEmailInput: Locator;
    readonly firstNameInput: Locator;
    readonly streetAddressInput: Locator;
    readonly postalCodeInput: Locator;
    readonly creditCardOption: Locator;
    readonly placeOrderButton: Locator;
    readonly paymentIframeSelector: string; // selector for frameLocator()
    readonly paymentErrorMessage: Locator;
    // All locators: status assumption — requires MCP browser discovery on UAT
}

// pages/MyAccountPage.ts — NEW
class MyAccountPage extends BasePage {
    readonly addNewAddressButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly streetAddressInput: Locator;
    readonly cityInput: Locator;
    readonly postalCodeInput: Locator;
    readonly saveButton: Locator;
    readonly addressList: Locator;
    readonly validationError: Locator;
    // All locators: status assumption — requires MCP browser discovery on UAT
}

// pages/DealsEventsPage.ts — NEW
class DealsEventsPage extends BasePage {
    readonly cityFilterSelector: Locator;
    readonly dealsGrid: Locator;
    readonly emptyStateMessage: Locator;
    // All locators: status assumption — requires MCP browser discovery on UAT
}
```

## Section 5: Assumptions and Prerequisites

source: automation-standards.md + repo exploration + FTC-MANIFEST open questions

### 5.1 Environment Prerequisites (must be true before implementation begins)

| # | Prerequisite | Status | Source |
|---|-------------|--------|--------|
| P-01 | UAT environment reachable: `https://london-drugs-uat-origin.kibology.us/` | status: assumption — verify at implementation start | automation-standards.md §6 |
| P-02 | `TEST_USER_EMAIL` env var set with a valid registered UAT account email | status: assumption — required for FTC_05_xx, FTC_03_06_01, FTC_08_02_01 | pdpData.auth: repo:test-data/pdp.data.ts:42 |
| P-03 | `TEST_USER_PASSWORD` env var set with the corresponding password | status: assumption | repo:test-data/pdp.data.ts:43 |
| P-04 | `SANDBOX_CARD_NUMBER` env var set with a valid Moneris/CyberSource sandbox card number | status: assumption — required for FTC_08_02_01 | automation-standards.md §7 "Moneris test" |
| P-05 | `SANDBOX_DECLINED_CARD` env var set with a sandbox card configured to decline | status: assumption — required for FTC_08_02_02 | automation-standards.md §7 |
| P-06 | `auth/auth.setup.ts` must be run before authenticated tests to create `auth/storageState.json` | status: assumption — required for FTC_03_06_01, FTC_05_02_xx | repo:auth/auth.setup.ts (file confirmed) |
| P-07 | Node.js and npm/npx available; `npx playwright test` command works per AGENTS.md | status: complete — AGENTS.md Commands section confirms | repo:AGENTS.md |
| P-08 | `test-data/checkout.data.ts` must contain no fallback values for card numbers in CI (only `process.env`) | status: assumption — implementation must enforce | automation-standards.md §7 |

### 5.2 POM Locator Assumptions (all require MCP browser discovery before implementation)

| POM | Locator | Assumption |
|-----|---------|------------|
| `CartPage` | `deliverySelector` | Delivery mode toggle exists on `/cart` for items already in cart — structure unknown, requires UAT DOM inspection |
| `CartPage` | `subtotalElement` | Cart summary subtotal element — selector unknown |
| `CartPage` | `quantityInput` | Quantity stepper/input field — selector unknown |
| `CheckoutPage` | `paypalButton` | PayPal smart button may be rendered inside a PayPal-hosted iframe — button locator unknown |
| `CheckoutPage` | `guestEmailInput` | Guest checkout email field — selector unknown |
| `CheckoutPage` | `paymentIframeSelector` | Payment iframe src/title — cross-domain or same-domain status unknown (affects `frameLocator` strategy) |
| `MyAccountPage` | `addNewAddressButton` | Address book "Add New Address" button — selector unknown |
| `MyAccountPage` | `addressList` | Address list container — selector unknown |
| `DealsEventsPage` | `cityFilterSelector` | City filter dropdown — selector unknown |
| `DealsEventsPage` | `emptyStateMessage` | Empty-state message when no deals match — selector and text unknown |

### 5.3 Coverage Overlap Assumptions (verify before adding tests to existing specs)

| TC_ID | Assumption |
|-------|------------|
| FTC_01_02_01 | Assumed covered by TC-83226 in home-page.spec.ts — verify by reading test title/tag. If covered: skip adding, mark as EXTEND-VERIFIED. If not: add as new test. |
| FTC_01_03_01 | Assumed covered by TC-83227 — same verification required |
| FTC_01_04_01 | Assumed covered by TC-83228 |
| FTC_01_05_01 | Assumed covered by TC-83229 |
| FTC_02_01_01 | Assumed covered by TC-83233 in plp.spec.ts |
| FTC_02_02_01 | Assumed covered by TC-83234 in plp.spec.ts |
| FTC_03_01_01 | Assumed covered by TC-83235 in pdp.spec.ts |
| FTC_03_02_01 | Assumed covered by TC-83236 |
| FTC_03_03_01 | Assumed covered by TC-83237 |
| FTC_03_04_01 | Assumed covered by TC-83238 |
| FTC_03_05_01 | Assumed covered by TC-83239 |
| FTC_03_06_01 | Assumed covered by TC-83240 |

**Resolution required at implementation time:** read each existing spec file and grep for the source TC ID.
If the test exists and its steps match the FTC scenario, mark as COVERED and do not duplicate.

### 5.4 Framework Assumptions

| # | Assumption | Source |
|---|-----------|--------|
| A-01 | All new POMs extend `BasePage` and accept `Page` in the constructor — matching existing POM pattern | repo:pages/BasePage.ts confirmed |
| A-02 | All new spec files use `test` and `expect` from `../helpers/fixtures` — not from `@playwright/test` directly | repo:tests/home-page.spec.ts:1 confirmed |
| A-03 | Evidence screenshots are captured via `takeEvidenceScreenshot(page, testInfo)` in `test.afterEach` on failure | repo:tests/home-page.spec.ts:9 confirmed |
| A-04 | `playwright.config.ts` `timeout: 60000` applies to all new tests; no test-level overrides needed unless cart/checkout flows require longer | repo:playwright.config.ts confirmed |
| A-05 | `apiInterceptor.ts` helper is available for intercepting cart/filter API responses — must be verified before use | repo:helpers/apiInterceptor.ts confirmed (file exists) |
| A-06 | Hamburger button locator requires a `:visible` filter because multiple DOM copies exist for breakpoints | source: epic-01-func-tests.md FTC_01_06_02 AC note |

## Section 6: Open Questions

source: Section 3 risks + Section 5 assumptions + FTC-MANIFEST OQ-01 through OQ-04

| ID | Section | Question | Impact | Blocking? |
|----|---------|----------|--------|-----------|
| OQ-01 | §5.3 | Which FTC_01–03 scenarios are already covered by existing TC-83225–83240 tests? The LIKELY COVERED verdict in Section 2 is an assumption. At implementation time: grep each spec for the ADO TC number and verify step alignment before adding duplicates. | Medium — avoids duplicate tests | No |
| OQ-02 | §3 R-02 | MyRegistry button: is the MyRegistry integration present on ALL PDP pages, or only on specific product categories? Test must navigate to a PDP where the button is confirmed present. | Medium — test discovery may fail if the wrong PDP is used | No |
| OQ-03 | §3 R-03 | Payment iframe: is the checkout payment form served from a Moneris/CyberSource same-domain iframe (frameLocator allowed) or a cross-domain iframe? Cross-domain restricts field filling to keyboard injection only. Requires UAT checkout page DOM inspection. | High — affects checkout test implementability | Yes (for FTC_08_02_01, FTC_08_02_05) |
| OQ-04 | §3 R-01 | Do authenticated tests for address book (FTC_05_02_xx) succeed via `auth/storageState.json` stored session, or does UAT session expiry require a fresh login per test? If storageState expires quickly, login in beforeEach must be used instead. | High — affects test stability for EPIC-05 address book | No |
| OQ-05 | §3 R-10 | Is there a cart REST API available on UAT (`POST /api/cart/add` or similar) to add products programmatically in test setup? If so, API-level setup avoids multi-step UI navigation in beforeEach. Requires checking UAT network traffic (apiInterceptor.ts helper may reveal the endpoint). | Medium — affects EPIC-04 and EPIC-08 test setup reliability | No |
| OQ-HAM-01 | §3 R-06 | What is the selector for the visible hamburger/mega-menu button? The existing HomePage.ts POM does not define this locator. Requires MCP browser discovery on the UAT homepage. | High — blocks FTC_01_06_01–03 implementation | Yes (for EPIC-01 hamburger tests) |
| OQ-CART-01 | §3 R-10 | After adding a product to the cart, does the cart page URL change to `/cart` immediately, or is a redirect needed? What is the exact URL pattern for the cart page on UAT? Requires discovery. | Medium | No |
| OQ-DEALS-01 | §2.7 | What is the URL of the Deals and Events page on UAT? The FTC test cases reference the page but no URL is given. Needs discovery. | Medium — required for `deals-events.data.ts` | No |
| OQ-MYREGISTRY-01 | §2.7 | What product detail page consistently has the MyRegistry button rendered? FTC_07_01_01–02 need a reliable PDP URL for the test. | Medium — required for test navigation setup | No |
| OQ-OQ-MANIFEST-01 | Carried | OQ-01 from FTC-MANIFEST: playwright_test_cases.csv was the actual source, not /artifacts/outputs/product-delivery/user-stories — no upstream user stories available. | Low — resolved by using manifest directly | No |
| OQ-OQ-MANIFEST-02 | Carried | OQ-02 from FTC-MANIFEST: MyRegistry (TC-79601-01) and PayPal (TC-79602-01A) are BLOCKED for full flow. Coverage permanently limited to button/element existence checks. | Medium — documented in Section 3 R-02 | No |
| OQ-OQ-MANIFEST-03 | Carried | OQ-03 from FTC-MANIFEST: DATADOME_POSSIBLE and CLOUDFLARE_POSSIBLE on login — may require storageState or API auth strategy in CI. Addressed in R-01 and P-06. | High — tracked in Section 3 | No |
| OQ-OQ-MANIFEST-04 | Carried | OQ-04 from FTC-MANIFEST: Sandbox payment environment and iframe interaction required. Addressed in R-03 and P-04/P-05. | High — tracked in Section 3 | No |
