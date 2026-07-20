---
skill: playwright-automation-plan
session_id: Fix_execution_tc
version: 1.0.0
mode: BUILD
date: 2026-07-20
requirement_source: ./artifacts/outputs/quality-engineering-design/test-cases (FTC-LONDONDRUGS-20260702)
target_repo: /Users/virginia.zambudio/PlaywrightAutomation
environment: UAT — https://london-drugs-uat-origin.kibology.us/
---

# PLAN-SPEC — London Drugs UAT: 65-TC Playwright Automation Plan

## Section 1: Clear Step Plan

source: requirement (FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md), automation-standards.md, repo exploration

### 1.1 Overview

Translate all 65 validated functional test cases from the FTC-LONDONDRUGS-20260702 manifest
into Playwright/TypeScript automation targeting the London Drugs UAT environment
(`https://london-drugs-uat-origin.kibology.us/`). Coverage spans 8 epics.
Three existing spec files are extended; five new spec files are created.

No test code is written by this plan — downstream `playwright-automation-implement`
consumes this PLAN-SPEC verbatim.

Note: the prior session (Fix_execution_GitHub) counted 63 TCs. Recount of all 8 epic suite files
yields 65 TCs — EPIC-01 has 14 (not 13) and EPIC-03 has 14 (not 13). This plan corrects the count.
source: artifacts/outputs/quality-engineering-design/test-cases/suites/ (all 8 files, grep TC_ID: = 65 results).

### 1.2 Spec File Strategy

| Spec File | Verdict | Epic | TC Count | Source TCs |
|-----------|---------|------|----------|------------|
| `tests/home-page.spec.ts` | EXTEND | EPIC-01 Home Page | 14 | FTC_01_01_01 - FTC_01_06_03 |
| `tests/plp.spec.ts` | EXTEND | EPIC-02 PLP | 7 | FTC_02_01_01 - FTC_02_02_03 |
| `tests/pdp.spec.ts` | EXTEND | EPIC-03 PDP | 14 | FTC_03_01_01 - FTC_03_06_02 |
| `tests/cart.spec.ts` | NEW | EPIC-04 Cart | 6 | FTC_04_01_01 - FTC_04_02_03 |
| `tests/my-account.spec.ts` | NEW | EPIC-05 My Account | 7 | FTC_05_01_01 - FTC_05_02_03 |
| `tests/store-locator.spec.ts` | NEW | EPIC-06 Store Locator | 5 | FTC_06_01_01 - FTC_06_02_03 |
| `tests/deals-events.spec.ts` | NEW | EPIC-07 Deals/MyRegistry | 5 | FTC_07_01_01 - FTC_07_02_03 |
| `tests/checkout.spec.ts` | NEW | EPIC-08 Checkout | 7 | FTC_08_01_01 - FTC_08_02_05 |

Rationale for EXTEND verdict:
- `home-page.spec.ts` currently covers TC-83225 through TC-83232 (logo, search, store, mini-cart, mega-menu, nav, newsletter). FTC_01_xx replaces/supplements with 14 FTC-IDs, including the 3 hamburger-menu toggle cases (FTC_01_06_01-03) and empty-cart/dismiss mini-cart variants not yet automated.
  source: repo:tests/home-page.spec.ts:14-450 — existing file confirmed.
- `plp.spec.ts` covers TC-83233 through TC-83234 (filter + sort). FTC_02_xx adds 5 additional cases (multiple filters, filter removal, sort absent, sort switching).
  source: repo:tests/plp.spec.ts:53-200 — existing file confirmed.
- `pdp.spec.ts` covers TC-83235 through TC-83240 (breadcrumb, price, availability, ISP/STH, wishlist). FTC_03_xx adds 14 cases (the corresponding negative and boundary variants not yet present plus existing positive coverage).
  source: repo:tests/pdp.spec.ts:1 — existing file confirmed.

### 1.3 Page Object Strategy

| POM File | Verdict | Coverage | Locator Gaps |
|----------|---------|----------|--------------|
| `pages/HomePage.ts` | EXTEND | FTC_01_xx | megaMenu locator exists (class bg-txtmegamenu-secondary); megaMenuButton exists (aria-label Opens Mega Menu). Both locators confirmed in existing POM. No blocking gaps. |
| `pages/SearchResultsPage.ts` | EXTEND | FTC_02_xx | filterCheckboxes, clearFiltersButton, sortButton, sortOptions all confirmed in existing POM. No blocking gaps. |
| `pages/ProductDetailPage.ts` | EXTEND | FTC_03_xx | ISP no-store-found message locator (gap), STH unavailability message locator (gap), wishlist heart active state (gap). Locators for positive flows already in POM. |
| `pages/StoreLocatorPage.ts` | REUSE | FTC_06_xx | heading and allStoresLink confirmed. storeList confirmed as h2 with province names. No gaps. |
| `pages/LoginPage.ts` | REUSE | FTC_05_01_xx | emailInput, passwordInput, loginButton confirmed. login() method confirmed. |
| `pages/CartPage.ts` | NEW | FTC_04_xx | Needs: delivery selector (Shipping/ISP toggle), subtotal element, quantity control, cart update API route interceptor. Locators require MCP discovery. |
| `pages/MyAccountPage.ts` | NEW | FTC_05_02_xx | Needs: add-new-address button, address form fields (first name, last name, street, city, postal code), save button, address list item. Locators require MCP discovery. |
| `pages/CheckoutPage.ts` | NEW | FTC_08_xx | Needs: guest email field, shipping address fields, credit card payment method selector, PayPal button, payment iframe frame-locator, card-number input inside iframe, place-order button, order-confirmation URL/order-number locator. Locators require MCP discovery. |
| `pages/DealsEventsPage.ts` | NEW | FTC_07_xx | Needs: city filter selector, deals grid/list container, MyRegistry button on PDP. Locators require MCP discovery. |

source: repo:pages/ — all existing POM files inspected.

### 1.4 Test Data Files Strategy

| Data File | Verdict | Key Constants Needed |
|-----------|---------|---------------------|
| `test-data/home-page.data.ts` | EXTEND | hamburgerMenuUrl (homepage), megaMenuVisibleSelector, emptyCartIndicator string |
| `test-data/plp.data.ts` | EXTEND | multipleFilterExpectedUrlPattern, sortHighToLowLabel |
| `test-data/pdp.data.ts` | EXTEND | ispNoStoreMessage, sthUnavailableMessage, wishlistActiveState |
| `test-data/cart.data.ts` | NEW | shippingOptionLabel, inStorePickupLabel, subtotalRegex, quantityTwo |
| `test-data/my-account.data.ts` | NEW | loginEmail (env-var ref), loginPassword (env-var ref), addressFirstName, addressStreet, addressCity, addressPostalCode, invalidPostalCode |
| `test-data/store-locator.data.ts` | NEW | storeLocatorPath, allStoresPath, expectedHeadingPattern, provinceRegex |
| `test-data/checkout.data.ts` | NEW | sandboxCardNumber (env-var ref), sandboxDeclinedCard (env-var ref), guestEmail, checkoutAddressFields, orderConfirmationUrlPattern |
| `test-data/deals-events.data.ts` | NEW | dealsEventsPath, cityFilterLabel (Vancouver), emptyStateSelectorHint |

Rule: all credentials and card numbers MUST be read from environment variables (process.env['VAR']).
No secrets committed. source: automation-standards.md §7 (Environment Management).

### 1.5 Execution Steps (Sequential for Implementation)

1. **Repo environment validation** — confirm UAT origin reachable; confirm env vars TEST_USER_EMAIL and TEST_USER_PASSWORD set; confirm SANDBOX_CARD_NUMBER and SANDBOX_DECLINED_CARD available for CI.
2. **EPIC-04 Cart (P0)** — MCP discovery on `/cart` page; create `pages/CartPage.ts` + `test-data/cart.data.ts`; extend `tests/cart.spec.ts` (6 TCs). source: automation-standards.md §5 priority order (Checkout flow = highest priority).
3. **EPIC-08 Checkout (P0)** — MCP discovery on checkout pages; create `pages/CheckoutPage.ts` + `test-data/checkout.data.ts` + `tests/checkout.spec.ts` (7 TCs). Iframe handling required (FTC_08_02_01, FTC_08_02_05).
4. **EPIC-05 My Account (P0)** — MCP discovery on `/auth/login` and `/myaccount/address-book`; create `pages/MyAccountPage.ts` + `test-data/my-account.data.ts` + `tests/my-account.spec.ts` (7 TCs). Reuse existing LoginPage for FTC_05_01_xx.
5. **EPIC-01 Home Page (P0/P1)** — extend `pages/HomePage.ts` (3 locator gap checks); extend `test-data/home-page.data.ts`; extend `tests/home-page.spec.ts` (14 TCs).
6. **EPIC-03 PDP (P0)** — extend `pages/ProductDetailPage.ts` (3 locator gaps); extend `test-data/pdp.data.ts`; extend `tests/pdp.spec.ts` (14 TCs).
7. **EPIC-02 PLP (P1/P2)** — extend `test-data/plp.data.ts`; extend `tests/plp.spec.ts` (7 TCs). No new POM locators needed.
8. **EPIC-06 Store Locator (P1/P2)** — create `test-data/store-locator.data.ts` + `tests/store-locator.spec.ts` (5 TCs). Reuse StoreLocatorPage POM as-is.
9. **EPIC-07 Deals/MyRegistry (P2)** — MCP discovery on deals/events page; create `pages/DealsEventsPage.ts` + `test-data/deals-events.data.ts` + `tests/deals-events.spec.ts` (5 TCs).
10. **Fixture pattern (ALL specs)** — import `test` and `expect` from `../helpers/fixtures` (anti-bot measures auto-applied). source: repo:helpers/fixtures.ts:37.
11. **Evidence (ALL specs)** — include `test.afterEach` calling `takeEvidenceScreenshot(page, testInfo)` on failure. source: repo:tests/home-page.spec.ts:9.

## Section 2: Listed Test Cases

source: FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md + all 8 epic suite files (65 TCs total)

### 2.1 EPIC-01: Home Page — `tests/home-page.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_01_01_01 | Logo click navigates to homepage | Positive | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_01_02 | Logo element absent — graceful skip | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_02_01 | Search with invalid term shows no-results | Negative | P1 | home-page.spec.ts | HomePage, SearchResultsPage | LIKELY COVERED — verify TC-83226 |
| FTC_01_02_02 | Search with empty term | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_02_03 | Search with 200-character term | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_03_01 | Valid search returns relevant results | Positive | P0 | home-page.spec.ts | HomePage, SearchResultsPage | LIKELY COVERED — verify TC-83227 |
| FTC_01_04_01 | Store Locator opens and Find All Stores works | Positive | P1 | home-page.spec.ts | HomePage, StoreLocatorPage | LIKELY COVERED — verify TC-83228 |
| FTC_01_04_02 | Store Locator link absent | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_05_01 | Mini Cart opens and View Cart navigates | Positive | P1 | home-page.spec.ts | HomePage | LIKELY COVERED — verify TC-83229 |
| FTC_01_05_02 | Mini cart accessible when cart is empty | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_05_03 | Mini cart panel closes on overlay dismissal | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_01 | Hamburger menu opens mega menu navigation | Positive | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_02 | Hamburger button visible on mobile viewport | Boundary | P1 | home-page.spec.ts | HomePage | NEW in file |
| FTC_01_06_03 | Hamburger menu closes on second click | Negative | P1 | home-page.spec.ts | HomePage | NEW in file |

### 2.2 EPIC-02: Product Listing Page — `tests/plp.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_02_01_01 | Applying a filter updates results and URL | Positive | P1 | plp.spec.ts | SearchResultsPage | LIKELY COVERED — verify TC-83233 |
| FTC_02_01_02 | Applying multiple filters narrows results | Positive | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_01_03 | Filter panel absent — graceful degradation | Negative | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_01_04 | Removing a filter restores full result set | Negative | P1 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_02_01 | Sort by Price Low to High updates results and URL | Positive | P2 | plp.spec.ts | SearchResultsPage | LIKELY COVERED — verify TC-83234 |
| FTC_02_02_02 | Sort control absent — graceful degradation | Negative | P2 | plp.spec.ts | SearchResultsPage | NEW in file |
| FTC_02_02_03 | Switching sort from Low to High to High to Low | Boundary | P2 | plp.spec.ts | SearchResultsPage | NEW in file |

### 2.3 EPIC-03: Product Detail Page — `tests/pdp.spec.ts` (EXTEND)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_03_01_01 | Second breadcrumb navigates to category PLP | Positive | P2 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83235 |
| FTC_03_01_02 | Breadcrumb absent on PDP | Negative | P2 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_01_03 | First breadcrumb (Home) navigates to homepage | Boundary | P2 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_02_01 | Price element visible and correctly formatted | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83236 |
| FTC_03_02_02 | Price element absent — P0 regression flag | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_03_01 | Availability indicator visible on in-stock PDP | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83237 |
| FTC_03_03_02 | Availability indicator absent — P0 regression | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_04_01 | Add to Cart ISP increments mini cart counter | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83238 |
| FTC_03_04_02 | ISP: no store found for postal code | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_04_03 | ISP: malformed postal code shows validation | Boundary | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_05_01 | Add to Cart Ship to Home increments cart counter | Positive | P0 | pdp.spec.ts | ProductDetailPage | LIKELY COVERED — verify TC-83239 |
| FTC_03_05_02 | STH: postal code not deliverable shows message | Negative | P0 | pdp.spec.ts | ProductDetailPage | NEW in file |
| FTC_03_06_01 | Authenticated user adds product to wishlist | Positive | P1 | pdp.spec.ts | ProductDetailPage, LoginPage | LIKELY COVERED — verify TC-83240 |
| FTC_03_06_02 | Unauthenticated user clicking wishlist redirects to login | Negative | P1 | pdp.spec.ts | ProductDetailPage, LoginPage | NEW in file |

### 2.4 EPIC-04: Cart — `tests/cart.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_04_01_01 | Switching to Shipping triggers cart update API | Positive | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_01_02 | Delivery selector absent — P0 regression flag | Negative | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_01_03 | Switching from Shipping back to In-Store Pickup | Boundary | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_01 | Cart subtotal visible with dollar amount | Positive | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_02 | Cart subtotal absent — P0 regression flag | Negative | P0 | cart.spec.ts | CartPage | NEW file |
| FTC_04_02_03 | Cart subtotal updates after quantity change | Boundary | P0 | cart.spec.ts | CartPage | NEW file |

### 2.5 EPIC-05: My Account — `tests/my-account.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_05_01_01 | Valid credentials redirect to My Account dashboard | Positive | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_02 | Invalid credentials show login error | Negative | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_03 | Empty email field shows required validation | Boundary | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_01_04 | SQL injection in login fields does not authenticate | Negative | P0 | my-account.spec.ts | LoginPage | NEW file |
| FTC_05_02_01 | Authenticated user saves new address | Positive | P1 | my-account.spec.ts | LoginPage, MyAccountPage | NEW file |
| FTC_05_02_02 | Missing required address field shows validation | Negative | P1 | my-account.spec.ts | MyAccountPage | NEW file |
| FTC_05_02_03 | Invalid postal code format rejected | Boundary | P1 | my-account.spec.ts | MyAccountPage | NEW file |

### 2.6 EPIC-06: Store Locator — `tests/store-locator.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_06_01_01 | Store Locator loads with heading and Find All Stores link | Positive | P1 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_01_02 | Store Locator heading absent — regression flag | Negative | P1 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_01 | Find All Stores link navigates to all-stores page | Positive | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_02 | Find All Stores link absent — regression flag | Negative | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |
| FTC_06_02_03 | All-stores page renders store list (boundary guard) | Boundary | P2 | store-locator.spec.ts | StoreLocatorPage | NEW file |

### 2.7 EPIC-07: Deals and Events / MyRegistry — `tests/deals-events.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_07_01_01 | MyRegistry button present on PDP | Positive | P2 | deals-events.spec.ts | ProductDetailPage, DealsEventsPage | NEW file |
| FTC_07_01_02 | MyRegistry button absent on PDP — regression | Negative | P2 | deals-events.spec.ts | ProductDetailPage, DealsEventsPage | NEW file |
| FTC_07_02_01 | City filter Vancouver loads filtered events via API | Positive | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |
| FTC_07_02_02 | City filter selector absent — regression flag | Negative | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |
| FTC_07_02_03 | City filter empty results show appropriate state | Boundary | P2 | deals-events.spec.ts | DealsEventsPage | NEW file |

### 2.8 EPIC-08: Checkout — `tests/checkout.spec.ts` (NEW)

| TC_ID | Title | Type | Priority | Spec File | POM(s) | Verdict |
|-------|-------|------|----------|-----------|--------|---------||
| FTC_08_01_01 | PayPal button visible and clickable on checkout | Positive | P0 | checkout.spec.ts | CheckoutPage | NEW file |
| FTC_08_01_02 | PayPal button absent — P0 regression flag | Negative | P0 | checkout.spec.ts | CheckoutPage | NEW file |
| FTC_08_02_01 | Guest completes checkout with sandbox credit card | Positive | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_02 | Declined card shows payment error | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_03 | Missing address field prevents order submission | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_04 | SQL injection in address field rejected | Negative | P0 | checkout.spec.ts | CartPage, CheckoutPage | NEW file |
| FTC_08_02_05 | Payment iframe card number field accessible | Boundary | P0 | checkout.spec.ts | CheckoutPage | NEW file |

### 2.9 Summary

| Metric | Value |
|--------|-------|
| Total test cases planned | 65 |
| EPIC-01 Home Page | 14 |
| EPIC-02 PLP | 7 |
| EPIC-03 PDP | 14 |
| EPIC-04 Cart | 6 |
| EPIC-05 My Account | 7 |
| EPIC-06 Store Locator | 5 |
| EPIC-07 Deals/MyRegistry | 5 |
| EPIC-08 Checkout | 7 |
| Positive | 22 (34%) |
| Negative | 28 (43%) |
| Boundary | 15 (23%) |
| Spec files — EXTEND | 3 |
| Spec files — NEW | 5 |
| POMs — EXTEND | 3 (HomePage, SearchResultsPage, ProductDetailPage) |
| POMs — NEW | 4 (CartPage, MyAccountPage, CheckoutPage, DealsEventsPage) |
| POMs — REUSE as-is | 2 (StoreLocatorPage, LoginPage) |
| TCs blocked by third-party iframe (button-only scope) | 4 (FTC_07_01_xx PayPal full-flow; FTC_08_01_01 PayPal OAuth) |

## Section 3: Risks and Mitigations

source: automation-standards.md + FTC-MANIFEST open questions OQ-01 to OQ-04 + repo exploration

| ID | Category | Risk | Affected TCs | Mitigation |
|----|----------|------|--------------|------------|
| R-01 | auth | DataDome/Cloudflare bot protection blocks login automation on UAT. OQ-03 in manifest. | FTC_05_01_01–FTC_05_01_04, FTC_05_02_01, FTC_03_06_01, FTC_08_02_01–FTC_08_02_04 | `helpers/anti-bot.ts` already applied via `fixtures.ts` page extension (auto-applied to all specs). For CI: pre-create `auth/storageState.json` via `auth/auth.setup.ts` so authenticated tests skip live login interaction. source: repo:auth/auth.setup.ts + repo:helpers/fixtures.ts:37. |
| R-02 | environment | Third-party iframes (PayPal OAuth, MyRegistry full flow) cannot be automated across origins. OQ-02 in manifest. | FTC_07_01_01, FTC_07_01_02, FTC_08_01_01, FTC_08_01_02 | Scope validation to button/element presence and clickability only. Do NOT attempt OAuth or MyRegistry iframe flows. Explicitly document in spec comments that full third-party flow is out of scope. source: requirement (epic-07-func-tests.md:12, epic-08-func-tests.md:12). |
| R-03 | environment | Payment iframe for credit card (FTC_08_02_xx) may be same-domain or cross-domain. Frame scope required. OQ-04 in manifest. | FTC_08_02_01, FTC_08_02_05 | Use Playwright `page.frameLocator()` to scope all card-field interactions inside the payment iframe. Sandbox card numbers read from `process.env['SANDBOX_CARD_NUMBER']`. source: automation-standards.md §7. Implementation skill MUST run MCP discovery to confirm iframe origin. |
| R-04 | data | Sandbox card numbers and test credentials must never be hardcoded. | FTC_05_01_01–FTC_05_02_03, FTC_08_02_01–FTC_08_02_04 | All auth credentials from env vars (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`). Sandbox cards from `SANDBOX_CARD_NUMBER` and `SANDBOX_DECLINED_CARD`. checkout.data.ts and my-account.data.ts use `process.env` with no fallback values. source: automation-standards.md §7. |
| R-05 | timing | UAT has elevated latency (up to 20 s hydration delay observed in BasePage). New POMs and specs interacting immediately after navigation may flake. | ALL new spec files | Mirror existing pattern: use `BasePage.dismissLoadingIfStuck()` and `waitForAppShell()` (via `navigate()`). Playwright global timeout is 60 s. source: repo:pages/BasePage.ts:34-62. |
| R-06 | locator | CartPage, CheckoutPage, MyAccountPage, and DealsEventsPage locators are NOT MCP-validated — no browser session has been run for these pages. | FTC_04_xx, FTC_05_02_xx, FTC_07_02_xx, FTC_08_xx | Implementation skill MUST run MCP browser discovery against UAT for each new POM before committing locators. Flag all new POM locators as status: assumption until MCP-validated. |
| R-07 | test logic | Negative tests that assert element absence (FTC_01_01_02, FTC_01_04_02, FTC_03_02_02, FTC_03_03_02, FTC_04_01_02, FTC_04_02_02, FTC_06_01_02, FTC_06_02_02, FTC_08_01_02) cannot reach the absent-element state on live UAT by design — the element is normally present. 9 affected TCs. | 9 negative/regression-guard TCs | Implement as soft regression guards: `await expect(locator).toBeVisible()` with the element present confirms the locator is working. Document in spec comment that the element-absent state is untestable on live UAT; CI always passes when element is present. |
| R-08 | environment | FTC_06_02_03 asserts an empty store list — UAT always has stores. | FTC_06_02_03 | Invert: assert at least one store IS present (regression guard). Document that zero-store state is untestable on live UAT. CI passes as long as store data is populated. |
| R-09 | environment | Cart/Checkout tests require a product already in cart as precondition. UI setup takes 2-3 navigations and is fragile. | FTC_04_xx, FTC_08_xx | Add product to cart via UI `test.beforeAll` using existing `ProductDetailPage.addToCart()` + Ship to Home flow (V6B 1A1 postal code). Register as OQ-CART-01 for possible API-level setup. source: repo:pages/ProductDetailPage.ts:380. |
| R-10 | locator | FTC_01_06_02 requires a mobile viewport. The playwright.config.ts has no MOBILE project. | FTC_01_06_02 | Set viewport to iPhone size within the test using `test.use({ viewport: { width: 375, height: 812 } })` scoped to that describe block. No new project needed. Confirm hamburger button selector remains `button[aria-label="Opens Mega Menu"]` at mobile size. source: repo:playwright.config.ts:56, repo:pages/HomePage.ts:68. |
| R-11 | timing | FTC_07_02_01 requires a city API call — Deals and Events page URL and API endpoint are not MCP-validated. | FTC_07_02_01 | MCP discovery required before implementing DealsEventsPage. Use `page.waitForResponse()` to intercept the city-filter API call. Register as OQ-DEALS-01. |

## Section 4: Code Sketch

source: repo:tests/home-page.spec.ts, repo:helpers/fixtures.ts:37, repo:helpers/evidence.ts, automation-standards.md

Structural guides ONLY. No implementation code. No locator strings hardcoded.
All specs import from `../helpers/fixtures`. All specs include `test.afterEach` evidence screenshot.

---

### 4.1 Sketch — `tests/cart.spec.ts` (NEW — P0, EPIC-04)

```typescript
// tests/cart.spec.ts
// Coverage: FTC_04_01_01 - FTC_04_02_03 (EPIC-04 Cart, P0)
// POMs: CartPage (NEW — locators require MCP discovery before implementation)
// Data: test-data/cart.data.ts (NEW)
// Risk: R-09 (cart precondition), R-05 (UAT latency), R-06 (locators unvalidated)

import { test, expect } from '../helpers/fixtures';
import { CartPage } from '../pages/CartPage';
import { cartData } from '../test-data/cart.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

// Precondition: product must be in cart. Use test.beforeAll to add product via STH flow.
// See Risk R-09 — prefer API-level cart setup if available after MCP discovery.

test.describe('EPIC-04 Cart — Delivery Options @cart @epic-04', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to homepage, search vitamins, navigate to first PDP,
        // add to cart via Ship to Home (V6B 1A1), navigate to /cart.
        // All via existing ProductDetailPage POM.
    });

    // FTC_04_01_01 | Positive | P0
    test('FTC_04_01_01 — Switching to Shipping triggers cart update API', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Verify delivery selector is visible', async () => {
            // await cartPage.deliverySelector.waitFor({ state: 'visible' });
        });
        await test.step('Click Shipping option and intercept cart update API', async () => {
            // page.waitForResponse(url => url.includes(cartData.cartUpdateEndpointPattern))
            // cartPage.shippingOption.click()
        });
        await test.step('Assert cart reflects Shipping method', async () => {
            // await expect(cartPage.activeDeliveryLabel).toContainText(cartData.shippingOptionLabel);
        });
    });

    // FTC_04_01_02 | Negative | P0 — regression guard (Risk R-07)
    test('FTC_04_01_02 — Delivery selector present (regression guard)', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Assert delivery selector is visible', async () => {
            // await expect(cartPage.deliverySelector).toBeVisible();
        });
    });

    // FTC_04_01_03 | Boundary | P0
    test('FTC_04_01_03 — Switching from Shipping back to In-Store Pickup updates cart', async ({ page }) => {
        // After switching to Shipping, switch to In-Store Pickup and verify API call
    });
});

test.describe('EPIC-04 Cart — Subtotal @cart @epic-04', () => {

    // FTC_04_02_01 | Positive | P0
    test('FTC_04_02_01 — Cart subtotal visible with dollar amount', async ({ page }) => {
        const cartPage = new CartPage(page);
        await test.step('Assert subtotal element is visible', async () => {
            // await expect(cartPage.subtotalElement).toBeVisible();
        });
        await test.step('Assert subtotal matches dollar format', async () => {
            // const text = await cartPage.subtotalElement.textContent();
            // expect(text).toMatch(cartData.subtotalRegex);
        });
    });

    // FTC_04_02_02 | Negative | P0 — regression guard (Risk R-07)
    test('FTC_04_02_02 — Cart subtotal present (regression guard)', async ({ page }) => {
        // await expect(cartPage.subtotalElement).toBeVisible();
    });

    // FTC_04_02_03 | Boundary | P0
    test('FTC_04_02_03 — Cart subtotal updates after quantity change', async ({ page }) => {
        // Increase product quantity to 2; verify subtotal doubles
    });
});
```

---

### 4.2 Sketch — `tests/checkout.spec.ts` (NEW — P0, EPIC-08)

```typescript
// tests/checkout.spec.ts
// Coverage: FTC_08_01_01 - FTC_08_02_05 (EPIC-08 Checkout, P0)
// POMs: CartPage (NEW), CheckoutPage (NEW — locators require MCP discovery)
// Data: test-data/checkout.data.ts (NEW)
// Risk: R-01 (bot protection), R-03 (payment iframe), R-04 (sandbox card env vars), R-09 (cart precondition)

import { test, expect } from '../helpers/fixtures';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';
import { checkoutData } from '../test-data/checkout.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('EPIC-08 Checkout — Payment Method @checkout @epic-08', () => {

    test.beforeEach(async ({ page }) => {
        // Add product to cart via STH + navigate to cart + click Proceed to Checkout
    });

    // FTC_08_01_01 | Positive | P0
    test('FTC_08_01_01 — PayPal button visible and clickable on checkout', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        await test.step('Assert PayPal button is visible', async () => {
            // await expect(checkoutPage.paypalButton).toBeVisible();
        });
        await test.step('Assert PayPal button is enabled (clickable)', async () => {
            // await expect(checkoutPage.paypalButton).toBeEnabled();
        });
        // Full PayPal OAuth flow NOT attempted — Risk R-02 (third-party iframe)
    });

    // FTC_08_01_02 | Negative | P0 — regression guard
    test('FTC_08_01_02 — PayPal button present (P0 regression guard)', async ({ page }) => {
        // await expect(checkoutPage.paypalButton).toBeVisible();
    });
});

test.describe('EPIC-08 Checkout — Guest Credit Card @checkout @epic-08', () => {

    // FTC_08_02_01 | Positive | P0
    test('FTC_08_02_01 — Guest checkout with sandbox card receives order confirmation', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);
        await test.step('Continue as guest and enter email', async () => {
            // checkoutPage.guestEmailInput.fill(checkoutData.guestEmail)
        });
        await test.step('Fill shipping address', async () => {
            // fill firstName, deliveryAddress, postalCode from checkoutData
        });
        await test.step('Select Credit Card payment method', async () => {
            // checkoutPage.creditCardOption.click()
        });
        await test.step('Enter sandbox card number in payment iframe', async () => {
            // const paymentFrame = page.frameLocator(checkoutData.paymentIframeSelector);
            // paymentFrame.locator(checkoutData.cardNumberInput).fill(process.env['SANDBOX_CARD_NUMBER']);
        });
        await test.step('Place order and verify confirmation page', async () => {
            // checkoutPage.placeOrderButton.click()
            // await page.waitForURL(/order-confirmation/)
            // await expect(checkoutPage.orderNumber).toBeVisible()
        });
    });

    // FTC_08_02_02 | Negative | P0
    test('FTC_08_02_02 — Declined card shows payment error', async ({ page }) => {
        // Enter SANDBOX_DECLINED_CARD; expect error message; remain on checkout
    });

    // FTC_08_02_03 | Negative | P0
    test('FTC_08_02_03 — Missing postal code field shows required validation', async ({ page }) => {
        // Leave postal code blank; attempt place order; assert validation error
    });

    // FTC_08_02_04 | Negative | P0
    test('FTC_08_02_04 — SQL injection in address field rejected', async ({ page }) => {
        // Enter "'; DROP TABLE orders; --" in street address; order must not be placed
    });

    // FTC_08_02_05 | Boundary | P0
    test('FTC_08_02_05 — Payment iframe card field accessible', async ({ page }) => {
        // const paymentFrame = page.frameLocator(checkoutData.paymentIframeSelector);
        // await expect(paymentFrame.locator(checkoutData.cardNumberInput)).toBeVisible();
        // Fill sandbox card number; assert accepted without error
    });
});
```

---

### 4.3 Sketch — `tests/my-account.spec.ts` (NEW — P0/P1, EPIC-05)

```typescript
// tests/my-account.spec.ts
// Coverage: FTC_05_01_01 - FTC_05_02_03 (EPIC-05 My Account)
// POMs: LoginPage (REUSE), MyAccountPage (NEW — locators require MCP discovery)
// Data: test-data/my-account.data.ts (NEW — credentials via env vars)
// Risk: R-01 (bot protection on login), R-04 (no hardcoded credentials)

import { test, expect } from '../helpers/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { myAccountData } from '../test-data/my-account.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('EPIC-05 My Account — Authentication @auth @epic-05', () => {

    // FTC_05_01_01 | Positive | P0
    test('FTC_05_01_01 — Valid credentials redirect to My Account dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        // loginPage.login(process.env['TEST_USER_EMAIL'], process.env['TEST_USER_PASSWORD'])
        // await expect(page).toHaveURL(/\/myaccount/);
    });

    // FTC_05_01_02 | Negative | P0
    test('FTC_05_01_02 — Invalid password shows login error', async ({ page }) => {
        // Enter valid email + wrong password; assert error shown; remain on /auth/login
    });

    // FTC_05_01_03 | Boundary | P0
    test('FTC_05_01_03 — Empty email field shows required validation', async ({ page }) => {
        // Leave email blank; submit; assert required-field validation message
    });

    // FTC_05_01_04 | Negative | P0
    test('FTC_05_01_04 — SQL injection in email field does not authenticate', async ({ page }) => {
        // Enter "' OR '1'='1" in email; assert not authenticated; stay on login
    });
});

test.describe('EPIC-05 My Account — Address Book @auth @epic-05', () => {

    // FTC_05_02_01 | Positive | P1
    test('FTC_05_02_01 — Authenticated user saves new address', async ({ page }) => {
        // Login via storageState (auth.setup.ts); navigate to address book;
        // click Add New Address; fill form; save; assert address appears in list
    });

    // FTC_05_02_02 | Negative | P1
    test('FTC_05_02_02 — Missing street address field shows validation', async ({ page }) => {
        // Fill name only; leave street blank; save; assert validation error
    });

    // FTC_05_02_03 | Boundary | P1
    test('FTC_05_02_03 — Invalid postal code format rejected', async ({ page }) => {
        // Enter "12345" (US ZIP) in postal code; save; assert format validation error
    });
});
```

---

### 4.4 Sketch — `tests/store-locator.spec.ts` (NEW — P1/P2, EPIC-06)

```typescript
// tests/store-locator.spec.ts
// Coverage: FTC_06_01_01 - FTC_06_02_03 (EPIC-06 Store Locator)
// POMs: StoreLocatorPage (REUSE — no gaps)
// Data: test-data/store-locator.data.ts (NEW)

import { test, expect } from '../helpers/fixtures';
import { StoreLocatorPage } from '../pages/StoreLocatorPage';
import { storeLocatorData } from '../test-data/store-locator.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('EPIC-06 Store Locator — Page Load @store-locator @epic-06', () => {

    // FTC_06_01_01 | Positive | P1
    test('FTC_06_01_01 — Store Locator page loads with heading and Find All Stores link', async ({ page }) => {
        const storePage = new StoreLocatorPage(page);
        await storePage.navigate(storeLocatorData.storeLocatorPath);
        // await expect(storePage.heading).toBeVisible();
        // await expect(storePage.allStoresLink).toBeVisible();
    });

    // FTC_06_01_02 | Negative | P1 — regression guard
    test('FTC_06_01_02 — Store Locator heading present (regression guard)', async ({ page }) => {
        // await expect(storePage.heading).toBeVisible();
    });
});

test.describe('EPIC-06 Store Locator — All Stores Navigation @store-locator @epic-06', () => {

    // FTC_06_02_01 | Positive | P2
    test('FTC_06_02_01 — Find All Stores link navigates to all-stores page', async ({ page }) => {
        // storePage.allStoresLink.click(); await page.waitForURL(/all-stores/);
        // await expect(storePage.storeList).toBeVisible();
    });

    // FTC_06_02_02 | Negative | P2 — regression guard
    test('FTC_06_02_02 — Find All Stores link present (regression guard)', async ({ page }) => {
        // await expect(storePage.allStoresLink).toBeVisible();
    });

    // FTC_06_02_03 | Boundary | P2 — inverted guard (Risk R-08)
    test('FTC_06_02_03 — All-stores page renders at least one store entry', async ({ page }) => {
        // Navigate to all-stores (SPA nav from /stores); await expect(storePage.storeList).toBeVisible();
    });
});
```

---

### 4.5 Sketch — `tests/deals-events.spec.ts` (NEW — P2, EPIC-07)

```typescript
// tests/deals-events.spec.ts
// Coverage: FTC_07_01_01 - FTC_07_02_03 (EPIC-07 Deals/MyRegistry)
// POMs: ProductDetailPage (REUSE), DealsEventsPage (NEW — locators require MCP discovery)
// Data: test-data/deals-events.data.ts (NEW)
// Risk: R-02 (MyRegistry iframe — button-only), R-06 (locators unvalidated), R-11 (API endpoint unknown)

import { test, expect } from '../helpers/fixtures';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { DealsEventsPage } from '../pages/DealsEventsPage';
import { dealsEventsData } from '../test-data/deals-events.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

test.describe('EPIC-07 MyRegistry — Button Existence @deals-events @epic-07', () => {

    // FTC_07_01_01 | Positive | P2
    test('FTC_07_01_01 — MyRegistry button present on PDP (button existence only)', async ({ page }) => {
        // Navigate to vitamins PDP; assert MyRegistry button is visible
        // Full iframe flow is NOT attempted — Risk R-02
    });

    // FTC_07_01_02 | Negative | P2 — regression guard
    test('FTC_07_01_02 — MyRegistry button present (regression guard)', async ({ page }) => {
        // await expect(pdpPage.myRegistryButton).toBeVisible();
    });
});

test.describe('EPIC-07 Deals and Events — City Filter @deals-events @epic-07', () => {

    // FTC_07_02_01 | Positive | P2
    test('FTC_07_02_01 — City filter Vancouver loads filtered events via API', async ({ page }) => {
        const dealsPage = new DealsEventsPage(page);
        await dealsPage.navigate(dealsEventsData.dealsEventsPath);
        // Intercept API; select Vancouver from city filter; assert API called + page updated
    });

    // FTC_07_02_02 | Negative | P2 — regression guard
    test('FTC_07_02_02 — City filter selector present (regression guard)', async ({ page }) => {
        // await expect(dealsPage.cityFilter).toBeVisible();
    });

    // FTC_07_02_03 | Boundary | P2
    test('FTC_07_02_03 — City filter with no active deals shows empty state', async ({ page }) => {
        // Select city with no deals; assert empty-state indicator shown; no broken layout
    });
});
```

---

### 4.6 EXTEND sketches for existing spec files

All existing spec file extensions follow the same pattern already established:

```typescript
// home-page.spec.ts ADDITIONS (FTC_01_01_01 – FTC_01_06_03):
// - Use existing HomePage POM (logo, megaMenuButton, megaMenu, miniCartButton, miniCartPanel locators)
// - FTC_01_06_02: wrap in test.describe with test.use({ viewport: { width: 375, height: 812 } })
// - FTC_01_06_01/03: megaMenuButton.click() then assert megaMenu visibility state

// plp.spec.ts ADDITIONS (FTC_02_01_02–04, FTC_02_02_02–03):
// - Use existing SearchResultsPage POM (filterCheckboxes, clearFiltersButton, sortButton, sortOptions)
// - FTC_02_01_04: call clearFilters() and assert URL reverts to unfilt state

// pdp.spec.ts ADDITIONS (negative/boundary variants for FTC_03_xx):
// - Use existing ProductDetailPage POM
// - FTC_03_04_02: fill invalid remote postal code; assert no store found message (locator gap — OQ-PDP-01)
// - FTC_03_05_02: fill non-deliverable postal code; assert STH unavailability (locator gap — OQ-PDP-02)
// - FTC_03_06_02: ensure unauthenticated; click wishlistButton; assert redirected to /auth/login
```

## Section 5: Assumptions and Prerequisites

source: automation-standards.md, repo exploration, FTC-MANIFEST

### 5.1 Environment Prerequisites

| Prerequisite | Required By | Status |
|-------------|-------------|--------|
| UAT origin reachable: `https://london-drugs-uat-origin.kibology.us/` | ALL specs | ASSUMED (not verified in this session) |
| `playwright.config.ts` baseURL points to UAT origin | ALL specs | CONFIRMED (repo:playwright.config.ts:28) |
| `TEST_USER_EMAIL` env var set to valid registered account | FTC_05_01_01, FTC_05_02_01, FTC_03_06_01 | ASSUMED — must be set before running auth tests |
| `TEST_USER_PASSWORD` env var set | FTC_05_01_01, FTC_05_02_01, FTC_03_06_01 | ASSUMED — must be set before running auth tests |
| `SANDBOX_CARD_NUMBER` env var set to valid Moneris/CyberSource test card | FTC_08_02_01, FTC_08_02_05 | ASSUMED — OQ-04 in manifest |
| `SANDBOX_DECLINED_CARD` env var set to declining test card | FTC_08_02_02 | ASSUMED — OQ-04 in manifest |
| `auth/storageState.json` generated via `auth/auth.setup.ts` for authenticated tests | FTC_05_02_01, FTC_03_06_01, FTC_08_02_xx | ASSUMED — must be generated with valid test credentials |
| Playwright installed (v1.61.0 per package.json) | ALL specs | CONFIRMED (repo:package.json) |
| Node.js and npm/npx available | ALL specs | ASSUMED |

### 5.2 Architectural Assumptions

| Assumption | Source | Risk If Wrong |
|-----------|--------|--------------|
| `helpers/fixtures.ts` extends `test` with anti-bot measures — all specs must import from here | CONFIRMED — repo:helpers/fixtures.ts:37 | Tests will not have DataDome bypass applied |
| `BasePage.navigate()` handles hydration waits — new POMs must call it before interactions | CONFIRMED — repo:pages/BasePage.ts:19-27 | Interactions on newly navigated pages will be flaky |
| Payment iframe for checkout is accessible via `page.frameLocator()` | ASSUMED — OQ-04 (origin not confirmed) | FTC_08_02_01 and FTC_08_02_05 will fail if cross-domain CORS blocks access |
| City filter on Deals/Events page makes an identifiable API call interceptable via `page.waitForResponse()` | ASSUMED — requires MCP discovery | FTC_07_02_01 API intercept will not match |
| `ProductDetailPage.addToCart()` + STH flow (V6B 1A1) is usable as cart setup precondition for Cart/Checkout tests | CONFIRMED — repo:pages/ProductDetailPage.ts:380 | Cart precondition tests will be blocked |
| All negative/regression-guard tests assert element IS present (not absent) on live UAT | CONFIRMED — Risk R-07 decision | Tests will always pass if element is present; element-absent state untestable on live UAT |
| Mobile viewport test (FTC_01_06_02) does NOT require a new Playwright project — `test.use({ viewport })` is sufficient | CONFIRMED — Playwright docs + repo:playwright.config.ts:56 | FTC_01_06_02 mobile test will only run in chromium project by default |

### 5.3 Test Data Assumptions

| Data Item | Assumption |
|-----------|-----------|
| Vitamins products are available in UAT search | CONFIRMED — used in existing pdp.spec.ts TC-83238 |
| Postal code V6B 1A1 returns ≥1 store in ISP flow | CONFIRMED — used in existing pdp.spec.ts TC-83238 |
| Province-level stores page `h2` headings include "British Columbia" | CONFIRMED — repo:pages/StoreLocatorPage.ts:42 |
| Deals and Events page path is `/category/deals-and-events/c/1027` (from dealsLink in HomePage.ts) | CONFIRMED — repo:pages/HomePage.ts:76 |
| MyRegistry button selector on PDP — label or button text contains "myregistry" | ASSUMED — requires MCP discovery |

## Section 6: Open Questions

source: FTC-MANIFEST OQ-01 to OQ-04, Risk register R-01 to R-11, assumptions flagged ASSUMED

| OQ_ID | Epic | Question | Impact | Resolution Path |
|-------|------|----------|--------|----------------|
| OQ-01 | EPIC-04 | CartPage locators: What are the confirmed CSS/ARIA selectors for the delivery selector (Shipping/ISP toggle), subtotal element, and quantity control on the `/cart` page? | HIGH — blocks implementation of FTC_04_xx | MCP browser discovery against UAT `/cart` page. Required before implementing CartPage.ts. |
| OQ-02 | EPIC-08 | CheckoutPage locators: What are the confirmed selectors for guest email input, shipping address fields, credit card option, PayPal button, place order button, and order confirmation elements? | HIGH — blocks FTC_08_xx | MCP browser discovery against UAT checkout flow. Required before implementing CheckoutPage.ts. |
| OQ-03 | EPIC-08 | Payment iframe: Is the payment form iframe same-domain or cross-domain? Cross-domain iframes in Playwright require `page.frameLocator()` — if CORS blocks field access the TC scope must be reduced to iframe element existence only. | HIGH — blocks FTC_08_02_01 and FTC_08_02_05 | MCP browser discovery: navigate to checkout, inspect `document.querySelectorAll('iframe')` src attribute. |
| OQ-04 | EPIC-05 | MyAccountPage locators: What are the confirmed selectors for the address book page, Add New Address button, address form fields (first name, last name, street, city, postal code), save button, and address list? | HIGH — blocks FTC_05_02_xx | MCP browser discovery against UAT `/myaccount/address-book`. Requires authenticated session (storageState.json). |
| OQ-05 | EPIC-07 | DealsEventsPage locators: What are the confirmed selectors for the city filter dropdown/selector and the deals/events grid container on the Deals and Events page? What is the API request URL pattern for city filter? | HIGH — blocks FTC_07_02_xx | MCP browser discovery against UAT `/category/deals-and-events/c/1027`. Intercept network requests to identify API endpoint. |
| OQ-06 | EPIC-07 | MyRegistry button: What is the confirmed selector for the MyRegistry integration button on the PDP? Is it a `button`, `a`, or `div`? What attribute identifies it? | MEDIUM — blocks FTC_07_01_xx | MCP browser discovery against a vitamins PDP. |
| OQ-07 | EPIC-03 | ISP no-store-found message: What is the confirmed text/selector for the "no stores found" message shown when a remote postal code returns no ISP results? | MEDIUM — blocks FTC_03_04_02 | MCP browser discovery: enter a remote Canadian postal code (e.g. Y1A 1A1 — Yukon) in the ISP store selector dialog. |
| OQ-08 | EPIC-03 | STH unavailability message: What is the confirmed text/selector for the "not available for shipping" message when STH is unavailable for a postal code? | MEDIUM — blocks FTC_03_05_02 | MCP browser discovery: try a non-BC postal code with STH selected on a vitamins PDP. |
| OQ-CART-01 | EPIC-04 | Can products be added to the cart via the Kibo API (not the UI) to make cart/checkout test setup faster and more reliable? | LOW — optimization, not a blocker; UI setup via ProductDetailPage.addToCart() is confirmed functional | Review Kibo Platform API docs in `artifacts/inputs/documentation`. |
| OQ-DEALS-01 | EPIC-07 | Is "Vancouver" always an available option in the city filter on Deals and Events? What city option exists that has NO active deals (for FTC_07_02_03)? | MEDIUM — FTC_07_02_03 requires a city with no active deals | MCP browser discovery: list all city filter options; test a low-traffic city like "Dawson Creek". |
