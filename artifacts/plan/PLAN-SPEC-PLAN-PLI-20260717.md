---
id: PLAN-SPEC-PLAN-PLI-20260717
session: Fix_execution_GitHub
skill: playwright-automation-plan
mode: BUILD
date: 2026-07-17
source_test_cases: ./artifacts/outputs/quality-engineering-design/test-cases
context_pack: ./context-pack
target_repo: /Users/virginia.zambudio/PlaywrightAutomation
target_env: https://london-drugs-uat-origin.kibology.us/
total_tcs: 63
epics: 8
new_spec_files: 5
extended_spec_files: 2
new_poms: 5
extended_poms: 0
new_test_data_files: 3
---

# PLAN-SPEC — LondonDrugs Playwright Automation
## Session: PLAN-PLI-20260717

---

## Section 1 — Inputs Summary

| Input | Value |
|-------|-------|
| FTC Manifest | `FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md` |
| FTC session | `FTC-LONDONDRUGS-20260702` |
| Total source TCs | 63 across 8 epics |
| Automation-standards §§ in force | §Framework Selection, §File Naming, §Priority Order, §Environment Management, §Test Data |
| Target base URL | `https://london-drugs-uat-origin.kibology.us/` |
| Test data dir | `/Users/virginia.zambudio/PlaywrightAutomation/artifacts/inputs` |
| Browser | Desktop Chrome (playwright.config.ts default) |
| Timeout global | 60 000 ms (config default); per-test overrides noted |

---

## Section 2 — Existing Asset Inventory

### 2.1 Existing Spec Files

| File | Covered TCs (ADO) | FTC IDs covered |
|------|-------------------|-----------------|
| `tests/home-page.spec.ts` | 83225–83232 | FTC_01_01_01, FTC_01_02_01, FTC_01_03_01, FTC_01_04_01, FTC_01_05_01, FTC_01_06_01 (partial EPIC-01) |
| `tests/plp.spec.ts` | 83233, 83234, 83251–83255 | FTC_02_01_01..04, FTC_02_02_01..03 (full EPIC-02) |
| `tests/pdp.spec.ts` | 83235–83240 | FTC_03_01_01, FTC_03_02_01, FTC_03_03_01, FTC_03_04_01, FTC_03_05_01, FTC_03_06_01 (partial EPIC-03) |

### 2.2 Existing Page Object Models (POMs)

| POM Class | File | Key Locators / Methods |
|-----------|------|------------------------|
| `BasePage` | `pages/BasePage.ts` | `navigate()`, `dismissLoadingIfStuck()`, `waitForSearchInput()` |
| `HomePage` | `pages/HomePage.ts` | `logo`, `searchInput`, `storesLink`, `miniCartButton`, `miniCartPanel`, `proceedToCheckoutButton`, `megaMenuButton`, `megaMenu`, `dealsLink`, `servicesLink`, `flyersLink`, `giftRegistryLink`, `newsletterEmailInput`, `newsletterSubmitButton`, `search()` |
| `LoginPage` | `pages/LoginPage.ts` | `emailInput`, `passwordInput`, `loginButton`, `login()` |
| `ProductDetailPage` | `pages/ProductDetailPage.ts` | `secondLevelBreadcrumb`, `priceLabel`, `priceValue`, `availabilitySection`, `availabilityLabel`, `inStorePickupRadio`, `shipToHomeRadio`, `wishlistButton`, `addToCart()`, `getMiniCartCount()`, `openStoreSelectorDialog()`, `searchStores()`, `selectFirstStore()`, `openDeliveryLocationModal()`, `setDeliveryPostalCode()` |
| `SearchResultsPage` | `pages/SearchResultsPage.ts` | `noResultsHeading`, `firstProductLink`, `headingsMatching()`, `filterTrigger`, `filterCheckboxes`, `openFilterDrawer()`, `clickFilterCheckbox()`, `applyFilters()`, `clearFilters()`, `clearFiltersButton`, `sortButton`, `sortOptions`, `openSortOverlay()`, `selectSortOption()`, `waitForResultsHeading()` |
| `StoreLocatorPage` | `pages/StoreLocatorPage.ts` | `heading`, `allStoresLink`, `storeList` |

### 2.3 Existing Helpers

| File | Purpose |
|------|---------|
| `helpers/fixtures.ts` | Extends `test` with DataDome anti-bot via `applyAntiBotMeasures()` |
| `helpers/anti-bot.ts` | Aborts captcha-delivery.com and datadome.co; spoofs `navigator.webdriver` |
| `helpers/apiInterceptor.ts` | `interceptSearchApi()`, `interceptAndAbortSortRedirect()`, `interceptAndAbortFilterRedirect()` |
| `helpers/evidence.ts` | `takeEvidenceScreenshot()` — on-failure full-page screenshot |
| `helpers/page-load.ts` | `simulateBodyClickToUnblock()` — body click pattern to dismiss UAT loading overlays |
| `auth/auth.setup.ts` | Playwright auth setup for authenticated sessions |

### 2.4 Existing Test Data Files

| File | Constants |
|------|-----------|
| `test-data/home-page.data.ts` | URLs, logo, search terms, miniCart, headerNav, newsletter |
| `test-data/plp.data.ts` | URLs, searchTerms (lipstick, vitamins), filter, sort indices/params |
| `test-data/pdp.data.ts` | URLs, vitaminsSearchTerm, postalCode, price regex, auth credentials |

---

## Section 3 — Coverage Gap Analysis

### 3.1 EPIC-01: Home Page (13 TCs)

| FTC_ID | Status | ADO TC | Gap |
|--------|--------|--------|-----|
| FTC_01_01_01 | ✅ IMPLEMENTED | 83225 | — |
| FTC_01_01_02 | ❌ MISSING | — | Logo absent negative — add to `home-page.spec.ts` |
| FTC_01_02_01 | ✅ IMPLEMENTED | 83226 | — |
| FTC_01_02_02 | ❌ MISSING | — | Empty search boundary — add to `home-page.spec.ts` |
| FTC_01_02_03 | ❌ MISSING | — | 200-char search boundary — add to `home-page.spec.ts` |
| FTC_01_03_01 | ✅ IMPLEMENTED | 83227 | — |
| FTC_01_04_01 | ✅ IMPLEMENTED | 83228 | — |
| FTC_01_04_02 | ❌ MISSING | — | Store link absent negative — add to `home-page.spec.ts` |
| FTC_01_05_01 | ✅ IMPLEMENTED | 83229 | — |
| FTC_01_05_02 | ❌ MISSING | — | Empty mini cart negative — add to `home-page.spec.ts` |
| FTC_01_05_03 | ❌ MISSING | — | Mini cart dismiss boundary — add to `home-page.spec.ts` |
| FTC_01_06_01 | ✅ IMPLEMENTED | 83230 | — |
| FTC_01_06_02 | ❌ MISSING | — | Mobile hamburger boundary — add to `home-page.spec.ts` |
| FTC_01_06_03 | ❌ MISSING | — | Hamburger toggle close negative — add to `home-page.spec.ts` |

**Action:** Extend `tests/home-page.spec.ts` with 7 new tests.

### 3.2 EPIC-02: Product Listing Page (7 TCs)

| FTC_ID | Status | ADO TC |
|--------|--------|--------|
| FTC_02_01_01 | ✅ IMPLEMENTED | 83233 |
| FTC_02_01_02 | ✅ IMPLEMENTED | 83251 |
| FTC_02_01_03 | ✅ IMPLEMENTED | 83252 |
| FTC_02_01_04 | ✅ IMPLEMENTED | 83253 |
| FTC_02_02_01 | ✅ IMPLEMENTED | 83234 |
| FTC_02_02_02 | ✅ IMPLEMENTED | 83254 |
| FTC_02_02_03 | ✅ IMPLEMENTED | 83255 |

**Action:** None — EPIC-02 fully covered.

### 3.3 EPIC-03: Product Detail Page (13 TCs)

| FTC_ID | Status | ADO TC | Gap |
|--------|--------|--------|-----|
| FTC_03_01_01 | ✅ IMPLEMENTED | 83235 | — |
| FTC_03_01_02 | ❌ MISSING | — | Breadcrumb absent negative — add to `pdp.spec.ts` |
| FTC_03_01_03 | ❌ MISSING | — | Home breadcrumb boundary — add to `pdp.spec.ts` |
| FTC_03_02_01 | ✅ IMPLEMENTED | 83236 | — |
| FTC_03_02_02 | ❌ MISSING | — | Price absent negative — add to `pdp.spec.ts` |
| FTC_03_03_01 | ✅ IMPLEMENTED | 83237 | — |
| FTC_03_03_02 | ❌ MISSING | — | Availability absent negative — add to `pdp.spec.ts` |
| FTC_03_04_01 | ✅ IMPLEMENTED | 83238 | — |
| FTC_03_04_02 | ❌ MISSING | — | ISP no store for postal — add to `pdp.spec.ts` |
| FTC_03_04_03 | ❌ MISSING | — | ISP malformed postal — add to `pdp.spec.ts` |
| FTC_03_05_01 | ✅ IMPLEMENTED | 83239 | — |
| FTC_03_05_02 | ❌ MISSING | — | STH non-deliverable postal — add to `pdp.spec.ts` |
| FTC_03_06_01 | ✅ IMPLEMENTED | 83240 | — |
| FTC_03_06_02 | ❌ MISSING | — | Unauthenticated wishlist redirect — add to `pdp.spec.ts` |

**Action:** Extend `tests/pdp.spec.ts` with 7 new tests.

### 3.4 EPIC-04: Cart (6 TCs)

All 6 TCs missing. **Action:** Create `tests/cart.spec.ts` + `pages/CartPage.ts` + `test-data/cart.data.ts`.

| FTC_ID | Type | Priority |
|--------|------|----------|
| FTC_04_01_01 | Positive | P0 |
| FTC_04_01_02 | Negative | P0 |
| FTC_04_01_03 | Boundary | P0 |
| FTC_04_02_01 | Positive | P0 |
| FTC_04_02_02 | Negative | P0 |
| FTC_04_02_03 | Boundary | P0 |

### 3.5 EPIC-05: My Account (7 TCs)

All 7 TCs missing. **Action:** Create `tests/my-account.spec.ts` + `pages/MyAccountPage.ts` + `test-data/my-account.data.ts`.

| FTC_ID | Type | Priority |
|--------|------|----------|
| FTC_05_01_01 | Positive | P0 |
| FTC_05_01_02 | Negative | P0 |
| FTC_05_01_03 | Boundary | P0 |
| FTC_05_01_04 | Negative (security) | P0 |
| FTC_05_02_01 | Positive | P1 |
| FTC_05_02_02 | Negative | P1 |
| FTC_05_02_03 | Boundary | P1 |

### 3.6 EPIC-06: Store Locator (5 TCs)

All 5 TCs missing. **Action:** Create `tests/store-locator.spec.ts`. `StoreLocatorPage` POM already exists and covers heading + allStoresLink + storeList. Minor locator gaps noted in Section 4.

| FTC_ID | Type | Priority |
|--------|------|----------|
| FTC_06_01_01 | Positive | P1 |
| FTC_06_01_02 | Negative | P1 |
| FTC_06_02_01 | Positive | P2 |
| FTC_06_02_02 | Negative | P2 |
| FTC_06_02_03 | Boundary | P2 |

### 3.7 EPIC-07: Deals and Events / MyRegistry (5 TCs)

All 5 TCs missing. **Action:** Create `tests/deals-and-events.spec.ts` + `pages/DealsAndEventsPage.ts`.

| FTC_ID | Type | Priority |
|--------|------|----------|
| FTC_07_01_01 | Positive (button existence) | P2 |
| FTC_07_01_02 | Negative (button absent) | P2 |
| FTC_07_02_01 | Positive | P2 |
| FTC_07_02_02 | Negative | P2 |
| FTC_07_02_03 | Boundary | P2 |

### 3.8 EPIC-08: Checkout (7 TCs)

All 7 TCs missing. **Action:** Create `tests/checkout.spec.ts` + `pages/CheckoutPage.ts` + `test-data/checkout.data.ts`.

| FTC_ID | Type | Priority | Risk |
|--------|------|----------|------|
| FTC_08_01_01 | Positive | P0 | PayPal third-party — button visibility only (OQ-02) |
| FTC_08_01_02 | Negative | P0 | PayPal absent regression |
| FTC_08_02_01 | Positive | P0 | Sandbox CC + iframe (OQ-04) |
| FTC_08_02_02 | Negative | P0 | Declined card |
| FTC_08_02_03 | Negative | P0 | Missing address field validation |
| FTC_08_02_04 | Negative (security) | P0 | SQL injection in address |
| FTC_08_02_05 | Boundary | P0 | iframe accessibility |

---

## Section 4 — Page Object Model Plan

### 4.1 POMs to Create

#### `pages/CartPage.ts`
- **Extends:** `BasePage`
- **Purpose:** EPIC-04 cart delivery selector and subtotal assertions
- **Locators to define:**

| Locator Name | Strategy | Selector / Notes |
|---|---|---|
| `deliverySelector` | role/attribute | Delivery method radio group or tab selector — confirm on UAT |
| `shippingOption` | role | Radio or button labelled "Shipping" |
| `inStorePickupOption` | role | Radio or button labelled "In-Store Pickup" |
| `subtotalElement` | text/label | Cart summary element showing dollar amount |
| `quantityInput` | locator | Quantity input field for cart item |
| `quantityIncreaseButton` | locator | Quantity increment `+` button |
- **Methods to define:**

| Method | Signature | Behaviour |
|---|---|---|
| `navigate()` | `async navigate(): Promise<void>` | Navigates to `/cart` |
| `selectDeliveryOption()` | `async selectDeliveryOption(mode: 'Shipping' \| 'InStorePickup'): Promise<void>` | Clicks the appropriate delivery radio/tab |
| `getSubtotalText()` | `async getSubtotalText(): Promise<string>` | Returns trimmed text of `subtotalElement` |
| `increaseQuantity()` | `async increaseQuantity(): Promise<void>` | Clicks `+` once; awaits subtotal update |

#### `pages/MyAccountPage.ts`
- **Extends:** `BasePage`
- **Purpose:** EPIC-05 login assertions and address book management
- **Locators to define:**

| Locator Name | Strategy | Selector / Notes |
|---|---|---|
| `dashboardHeading` | role/text | My Account dashboard h1 or heading |
| `addNewAddressButton` | role/text | "Add New Address" CTA |
| `firstNameInput` | label/name | First name field in address form |
| `lastNameInput` | label/name | Last name field |
| `streetAddressInput` | label/name | Street address field |
| `cityInput` | label/name | City field |
| `postalCodeInput` | label/name | Postal code field |
| `saveAddressButton` | role/text | "Save" button in address form |
| `addressBookList` | locator | Container listing saved addresses |
| `validationError` | locator | Inline validation message element |
- **Methods to define:**

| Method | Signature | Behaviour |
|---|---|---|
| `navigate()` | `async navigate(): Promise<void>` | Navigates to `/myaccount` |
| `navigateToAddressBook()` | `async navigateToAddressBook(): Promise<void>` | Navigates to address book page |
| `clickAddNewAddress()` | `async clickAddNewAddress(): Promise<void>` | Clicks "Add New Address" |
| `fillAddressForm()` | `async fillAddressForm(data: AddressData): Promise<void>` | Fills all address form fields |
| `saveAddress()` | `async saveAddress(): Promise<void>` | Clicks Save and waits for response |

#### `pages/DealsAndEventsPage.ts`
- **Extends:** `BasePage`
- **Purpose:** EPIC-07 city filter and MyRegistry button assertions
- **Locators to define:**

| Locator Name | Strategy | Selector / Notes |
|---|---|---|
| `citySelector` | role/attribute | City filter dropdown or select element |
| `myRegistryButton` | role/text | MyRegistry integration button on PDP — shared with PDP context |
| `dealsContent` | locator | Container for deals/events results |
| `emptyStateMessage` | locator | "No deals available" or empty state indicator |
- **Methods to define:**

| Method | Signature | Behaviour |
|---|---|---|
| `navigate()` | `async navigate(): Promise<void>` | Navigates to Deals and Events URL |
| `selectCity()` | `async selectCity(city: string): Promise<void>` | Selects city from dropdown |
| `waitForDealsLoad()` | `async waitForDealsLoad(): Promise<void>` | Waits for API response after city filter |

#### `pages/CheckoutPage.ts`
- **Extends:** `BasePage`
- **Purpose:** EPIC-08 guest checkout, payment, validation
- **Locators to define:**

| Locator Name | Strategy | Selector / Notes |
|---|---|---|
| `guestEmailInput` | label/name | Guest email field |
| `continueAsGuestButton` | role/text | "Continue as Guest" or equivalent CTA |
| `firstNameInput` | label/name | First name in checkout address |
| `streetAddressInput` | label/name | Delivery street address |
| `postalCodeInput` | label/name | Postal code |
| `creditCardOption` | role/label | "Credit Card" payment selector |
| `paypalButton` | role/text/iframe | PayPal button — outer DOM element (not inside iframe) |
| `placeOrderButton` | role/text | "Place Order" or "Submit Order" CTA |
| `paymentIframe` | frameLocator | Payment form iframe locator |
| `cardNumberInput` | locator (within iframe) | Card number field inside payment iframe |
| `paymentErrorMessage` | locator | Payment declined / error message element |
| `validationError` | locator | Required-field validation message |
| `orderConfirmationHeading` | locator | Order confirmation page heading or order number |
- **Methods to define:**

| Method | Signature | Behaviour |
|---|---|---|
| `navigate()` | `async navigate(): Promise<void>` | Navigates to checkout URL |
| `continueAsGuest()` | `async continueAsGuest(email: string): Promise<void>` | Fills guest email + continues |
| `fillShippingAddress()` | `async fillShippingAddress(data: ShippingData): Promise<void>` | Fills name, street, postal |
| `selectPaymentMethod()` | `async selectPaymentMethod(method: 'CreditCard' \| 'PayPal'): Promise<void>` | Selects payment option |
| `fillSandboxCardNumber()` | `async fillSandboxCardNumber(cardNum: string): Promise<void>` | Fills card number inside payment iframe using `frameLocator` |
| `placeOrder()` | `async placeOrder(): Promise<void>` | Clicks Place Order |

### 4.2 POMs to Extend

No existing POMs require modification for the new test cases. All necessary locators for EPIC-03 gaps, EPIC-05 login scenarios, and EPIC-06 exist in `ProductDetailPage`, `LoginPage`, and `StoreLocatorPage` respectively.

---

## Section 5 — Test Data Plan

### 5.1 New Test Data Files

#### `test-data/cart.data.ts`

```typescript
// cart.data.ts (structure — not implementation code)
export const cartData = {
  urls: {
    home: 'https://london-drugs-uat-origin.kibology.us/',
    cart: 'https://london-drugs-uat-origin.kibology.us/cart',
  },
  searchTerm: 'vitamins',          // Generic product discovery term
  subtotal: {
    dollarFormatRegex: /^\$\d+\.\d{2}/,
  },
  delivery: {
    shippingLabel: 'Shipping',
    inStorePickupLabel: 'In-Store Pickup',
  },
};
```

#### `test-data/my-account.data.ts`

```typescript
// my-account.data.ts (structure — not implementation code)
export const myAccountData = {
  urls: {
    login: 'https://london-drugs-uat-origin.kibology.us/myaccount',
    addressBook: 'https://london-drugs-uat-origin.kibology.us/myaccount/address-book',
  },
  auth: {
    email: process.env['TEST_USER_EMAIL'] ?? 'ldtestfour@yopmail.com',
    password: process.env['TEST_USER_PASSWORD'] ?? 'LDTestfour4*',
  },
  invalidAuth: {
    email: 'valid@example.com',
    password: 'WrongPassword999',
  },
  sqlInjection: {
    email: "' OR '1'='1",
    password: 'anything',
  },
  newAddress: {
    firstName: 'QA',
    lastName: 'Tester',
    street: '123 Test Street',
    city: 'Vancouver',
    postalCode: 'V6B 1A1',
    validCanadianPostal: 'V6B 1A1',
    invalidUsZip: '12345',
  },
};
```

#### `test-data/checkout.data.ts`

```typescript
// checkout.data.ts (structure — not implementation code)
export const checkoutData = {
  urls: {
    home: 'https://london-drugs-uat-origin.kibology.us/',
    cart: 'https://london-drugs-uat-origin.kibology.us/cart',
    orderConfirmation: '/order-confirmation',
  },
  searchTerm: 'vitamins',
  guest: {
    email: 'qa_guest_checkout@example.com',
  },
  shipping: {
    firstName: 'QA',
    lastName: 'Tester',
    street: '789 Test Ave',
    city: 'Vancouver',
    postalCode: 'V6B 1A1',
  },
  payment: {
    // Sandbox card from Moneris/CyberSource test environment
    // automation-standards.md §Environment Management: use test card numbers only
    sandboxCardNumber: process.env['SANDBOX_CARD_NUMBER'] ?? '4111111111111111',
    declinedCardNumber: process.env['DECLINED_CARD_NUMBER'] ?? '4000000000000002',
    sandboxExpiry: '12/26',
    sandboxCvv: '123',
  },
  sqlInjection: {
    addressPayload: "'; DROP TABLE orders; --",
  },
  orderConfirmation: {
    urlPattern: /\/order-confirmation/,
    orderNumberRegex: /\d{5,}/,
  },
};
```

### 5.2 Deals and Events Test Data

Inline constants inside `tests/deals-and-events.spec.ts` (no separate data file needed given the small surface):

- Target city for filter: `'Vancouver'`
- City with no deals (boundary): runtime discovery of last option or known empty city
- Deals and Events URL: `https://london-drugs-uat-origin.kibology.us/category/deals-and-events/c/1027`

---

## Section 6 — New Spec File Plans

### 6.1 `tests/cart.spec.ts` (EPIC-04, 6 TCs)

**automation-standards.md §§:** Priority Order §2 (Cart add/remove — High priority), Environment Management.

**Imports:**
```typescript
import { test, expect } from '../helpers/fixtures';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { cartData } from '../test-data/cart.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
```

**Shared setup:** A `navigateToCartWithProduct()` helper function that:
1. Searches for `cartData.searchTerm` via the homepage
2. Clicks first search result (ProductDetailPage)
3. Adds to cart (Ship to Home, no postal entry needed for basic add)
4. Navigates to `/cart`

**Test Plan:**

| TC_ID | Test Name | Steps Summary | Assertions | Timeout Override |
|-------|-----------|---------------|------------|-----------------|
| FTC_04_01_01 | `FTC_04_01_01 — Switching delivery to Shipping triggers cart update` | 1. Navigate to cart with product. 2. Intercept cart update API (`page.waitForResponse` matching `/api/cart` or equivalent). 3. Click Shipping delivery option. | API response received with 2xx; `cartPage.deliverySelector` reflects Shipping | 120 000 ms |
| FTC_04_01_02 | `FTC_04_01_02 — Delivery selector absent on cart page is flagged` | 1. Navigate to `/cart` (may be empty — delivery selector still expected). 2. Assert `cartPage.deliverySelector` visible within timeout. | `expect(cartPage.deliverySelector).toBeVisible()` — test soft-fails with regression message if absent | 60 000 ms |
| FTC_04_01_03 | `FTC_04_01_03 — Switching delivery from Shipping back to In-Store Pickup triggers cart update` | 1. Navigate to cart with product. 2. Select Shipping. 3. Wait for API. 4. Select In-Store Pickup. | Second cart update API call received; selector reflects ISP | 120 000 ms |
| FTC_04_02_01 | `FTC_04_02_01 — Cart subtotal element is visible with dollar amount` | 1. Navigate to cart with product. 2. Wait for summary to load. | `cartPage.subtotalElement` visible; text matches `cartData.subtotal.dollarFormatRegex` | 60 000 ms |
| FTC_04_02_02 | `FTC_04_02_02 — Cart subtotal absent is flagged as P0 regression` | 1. Navigate to cart with product. 2. Assert subtotal visible. | If absent: test fails with clear message; no further interactions | 60 000 ms |
| FTC_04_02_03 | `FTC_04_02_03 — Subtotal updates after quantity change` | 1. Navigate to cart with product. 2. Read initial subtotal text. 3. Increase quantity to 2. 4. Wait for subtotal re-render. | New subtotal text differs from initial; still matches dollar format | 120 000 ms |

### 6.2 `tests/my-account.spec.ts` (EPIC-05, 7 TCs)

**automation-standards.md §§:** Priority Order §3 (Authentication — Medium), Environment Management (dedicated test accounts, never real customer data), OQ-03 (DataDome/bot protection on login — covered by `helpers/fixtures.ts` anti-bot).

**Imports:**
```typescript
import { test, expect } from '../helpers/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { myAccountData } from '../test-data/my-account.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
```

**Test Plan:**

| TC_ID | Test Name | Steps Summary | Assertions | Timeout Override |
|-------|-----------|---------------|------------|-----------------|
| FTC_05_01_01 | `FTC_05_01_01 — Valid login redirects to My Account dashboard` | 1. Navigate to login page. 2. Fill valid `myAccountData.auth.email` + password. 3. Click Sign In. | URL contains `/myaccount`; `myAccountPage.dashboardHeading` visible | 90 000 ms |
| FTC_05_01_02 | `FTC_05_01_02 — Invalid password shows login error` | 1. Navigate to login. 2. Fill valid email + `myAccountData.invalidAuth.password`. 3. Click Sign In. | Error message visible; URL still on login page; no redirect to /myaccount | 60 000 ms |
| FTC_05_01_03 | `FTC_05_01_03 — Empty email shows required-field validation` | 1. Navigate to login. 2. Leave email blank; fill any password. 3. Click Sign In. | Validation error on email field; form not submitted | 60 000 ms |
| FTC_05_01_04 | `FTC_05_01_04 — SQL injection in email field does not authenticate` | 1. Navigate to login. 2. Fill `myAccountData.sqlInjection.email` in email. 3. Fill any password. 4. Click Sign In. | Not authenticated; error or validation shown; remain on login | 60 000 ms |
| FTC_05_02_01 | `FTC_05_02_01 — Authenticated user saves new address in address book` | 1. Log in with `myAccountData.auth`. 2. Navigate to address book. 3. Click Add New Address. 4. Fill `myAccountData.newAddress`. 5. Click Save. | New address entry visible in `myAccountPage.addressBookList` | 120 000 ms |
| FTC_05_02_02 | `FTC_05_02_02 — Missing required field shows address validation` | 1. Log in. 2. Navigate to address book. 3. Click Add New Address. 4. Fill only first name and last name. 5. Click Save. | `myAccountPage.validationError` for street address visible; address not saved | 90 000 ms |
| FTC_05_02_03 | `FTC_05_02_03 — Invalid postal code format shows format validation` | 1. Log in. 2. Navigate to address book. 3. Click Add New Address. 4. Fill all fields correctly. 5. Enter `myAccountData.newAddress.invalidUsZip` in postal. 6. Click Save. | Postal code format error visible; address not added to list | 90 000 ms |

### 6.3 `tests/store-locator.spec.ts` (EPIC-06, 5 TCs)

**automation-standards.md §§:** Priority Order §4 (Store Locator — medium), Environment Management.

**Imports:**
```typescript
import { test, expect } from '../helpers/fixtures';
import { StoreLocatorPage } from '../pages/StoreLocatorPage';
import { takeEvidenceScreenshot } from '../helpers/evidence';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
```

**Test Plan:**

| TC_ID | Test Name | Steps Summary | Assertions | Timeout Override |
|-------|-----------|---------------|------------|-----------------|
| FTC_06_01_01 | `FTC_06_01_01 — Store Locator page loads with heading and link` | 1. Navigate to `/stores`. 2. Wait for domcontentloaded. | `storeLocatorPage.heading` ("Find a Store Near You") visible; `storeLocatorPage.allStoresLink` visible | 60 000 ms |
| FTC_06_01_02 | `FTC_06_01_02 — Store Locator heading absent is flagged as regression` | 1. Navigate to `/stores`. 2. Assert heading visible within timeout. | If absent: test fails with "Store Locator heading not found" message | 60 000 ms |
| FTC_06_02_01 | `FTC_06_02_01 — Find All Stores link navigates to all-stores page` | 1. Navigate to `/stores`. 2. Wait for heading. 3. Click allStoresLink. 4. Wait for `/stores/all-stores` URL. | URL contains `/stores/all-stores`; `storeLocatorPage.storeList` (province heading) visible | 90 000 ms |
| FTC_06_02_02 | `FTC_06_02_02 — Find All Stores link absent is flagged as regression` | 1. Navigate to `/stores`. 2. Assert `allStoresLink` visible. | If absent: fail with "Find All Stores link not found" | 60 000 ms |
| FTC_06_02_03 | `FTC_06_02_03 — All-stores page with empty store list is flagged` | 1. Navigate directly to `/stores/all-stores`. 2. Wait for SPA hydration. 3. Count store list items. | If `storeList` has zero entries: test fails with data regression message | 90 000 ms |

### 6.4 `tests/deals-and-events.spec.ts` (EPIC-07, 5 TCs)

**automation-standards.md §§:** Priority Order §6 (CMS content — lower priority). OQ-02: MyRegistry and PayPal are BLOCKED — button existence only.

**Imports:**
```typescript
import { test, expect } from '../helpers/fixtures';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { DealsAndEventsPage } from '../pages/DealsAndEventsPage';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { takeEvidenceScreenshot } from '../helpers/evidence';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
```

**Test Plan:**

| TC_ID | Test Name | Steps Summary | Assertions | Timeout Override |
|-------|-----------|---------------|------------|-----------------|
| FTC_07_01_01 | `FTC_07_01_01 — MyRegistry button is present on PDP` | 1. Navigate to vitamins PDP via search (reuse `navigateToVitaminsPdp` pattern). 2. Check for MyRegistry button element. | `dealsAndEventsPage.myRegistryButton` or `page.locator` for MyRegistry exists (`.toBeVisible()` or soft `.toHaveCount(1)`) | 90 000 ms |
| FTC_07_01_02 | `FTC_07_01_02 — MyRegistry button absent on PDP is flagged` | 1. Navigate to vitamins PDP. 2. Assert MyRegistry button present. | If count = 0: fail with "MyRegistry integration touchpoint missing" | 90 000 ms |
| FTC_07_02_01 | `FTC_07_02_01 — City filter on Deals and Events loads filtered results` | 1. Navigate to Deals and Events URL. 2. Intercept API call matching deals endpoint. 3. Select "Vancouver" from city filter. 4. Await API response. | API called for Vancouver; page updates with Vancouver content | 90 000 ms |
| FTC_07_02_02 | `FTC_07_02_02 — City filter selector absent on Deals page is flagged` | 1. Navigate to Deals and Events URL. 2. Assert `citySelector` visible. | If absent: regression flagged; page shows unfiltered content without error | 60 000 ms |
| FTC_07_02_03 | `FTC_07_02_03 — City filter with no results shows empty state` | 1. Navigate to Deals and Events URL. 2. Select a city with no active deals (boundary option). 3. Await API response. | Either empty state message or zero deal cards; no broken layout or JS error | 90 000 ms |

### 6.5 `tests/checkout.spec.ts` (EPIC-08, 7 TCs)

**automation-standards.md §§:** Priority Order §1 (Checkout — highest priority), Environment Management (Moneris/CyberSource sandbox, never real payment data), OQ-04 (sandbox iframe — use `page.frameLocator()`).

**Imports:**
```typescript
import { test, expect } from '../helpers/fixtures';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { checkoutData } from '../test-data/checkout.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
```

**Shared precondition:** `addProductToCartAndProceedToCheckout()` helper that:
1. Searches for `checkoutData.searchTerm`
2. Adds first result to cart (Ship to Home)
3. Navigates to cart
4. Clicks "Proceed to Checkout"

**Test Plan:**

| TC_ID | Test Name | Steps Summary | Assertions | Timeout Override |
|-------|-----------|---------------|------------|-----------------|
| FTC_08_01_01 | `FTC_08_01_01 — PayPal button visible and clickable on checkout` | 1. Add product + go to checkout. 2. Inspect payment section. | `checkoutPage.paypalButton` visible and enabled | 120 000 ms |
| FTC_08_01_02 | `FTC_08_01_02 — PayPal button absent on checkout is P0 regression` | 1. Add product + go to checkout. 2. Assert PayPal button present. | If absent: P0 failure with "PayPal button not found" | 120 000 ms |
| FTC_08_02_01 | `FTC_08_02_01 — Guest checkout with sandbox CC receives order confirmation` | 1. Add product. 2. Go to checkout. 3. Continue as guest (email). 4. Fill shipping address. 5. Select Credit Card. 6. Fill sandbox card via `frameLocator`. 7. Click Place Order. | URL contains `/order-confirmation`; order number visible | 180 000 ms |
| FTC_08_02_02 | `FTC_08_02_02 — Declined card shows payment error` | 1. Add product. 2. Go to checkout. 3. Fill all fields. 4. Enter `checkoutData.payment.declinedCardNumber` via frameLocator. 5. Click Place Order. | `checkoutPage.paymentErrorMessage` visible; URL does not contain `/order-confirmation` | 180 000 ms |
| FTC_08_02_03 | `FTC_08_02_03 — Missing postal code shows validation error` | 1. Add product. 2. Go to checkout as guest. 3. Leave postal code blank. 4. Attempt to place order. | Validation error for postal code field visible; order not placed | 120 000 ms |
| FTC_08_02_04 | `FTC_08_02_04 — SQL injection in address field is rejected` | 1. Add product. 2. Go to checkout as guest. 3. Enter `checkoutData.sqlInjection.addressPayload` in street address. 4. Attempt to place order. | Order not placed; either validation error or sanitization; no server error surfaced | 120 000 ms |
| FTC_08_02_05 | `FTC_08_02_05 — Payment iframe is accessible and card field fillable` | 1. Add product. 2. Go to checkout. 3. Select Credit Card. 4. Wait for payment iframe. 5. Use `frameLocator` to access card number field. | Card number input inside iframe visible; sandbox card number fillable; no iframe access error | 120 000 ms |

---

## Section 7 — Spec File Extension Plans

### 7.1 `tests/home-page.spec.ts` Extensions (7 new tests)

All new tests appended after existing TC-83232. Import unchanged.

| TC_ID | Test Name | Steps Summary | Assertions |
|-------|-----------|---------------|------------|
| FTC_01_01_02 | `FTC_01_01_02 — Logo absent renders no unhandled error` | 1. Navigate to homepage. 2. Assert logo visible (soft check). | If logo not present: `expect(homePage.logo).toHaveCount(0)` — no exception thrown; test passes with skip annotation |
| FTC_01_02_02 | `FTC_01_02_02 — Empty search term does not crash` | 1. Navigate to homepage. 2. Wait for search input. 3. Clear search input. 4. Press Enter. | Page title unchanged or shows search URL; no JS error heading visible |
| FTC_01_02_03 | `FTC_01_02_03 — 200-char search term handled gracefully` | 1. Navigate to homepage. 2. Wait for search input. 3. Fill 200 'a' chars. 4. Press Enter. | Either results or no-results page; no blank/crashed page; no unhandled error heading |
| FTC_01_04_02 | `FTC_01_04_02 — Store link absent is flagged as regression` | 1. Navigate to homepage. 2. Assert `homePage.storesLink` visible within 30 s. | If not visible: test fails with "Store locator header link not found" |
| FTC_01_05_02 | `FTC_01_05_02 — Mini cart opens when cart is empty` | 1. Navigate to homepage (fresh session, no cart items). 2. Click `homePage.miniCartButton`. | Mini cart panel opens (`miniCartPanel` visible); empty state message or zero-item badge; no error |
| FTC_01_05_03 | `FTC_01_05_03 — Mini cart panel closes on dismiss` | 1. Navigate to homepage. 2. Open mini cart. 3. Click outside the panel (body click) or close button. | `homePage.miniCartPanel` no longer visible; page remains interactable |
| FTC_01_06_02 | `FTC_01_06_02 — Hamburger button visible on mobile viewport` | 1. Set viewport to 390×844 (iPhone). 2. Navigate to homepage. 3. Locate visible hamburger button. | Exactly one visible hamburger button; clicking it opens mega menu |
| FTC_01_06_03 | `FTC_01_06_03 — Hamburger menu closes on second click` | 1. Navigate to homepage. 2. Click hamburger → mega menu opens. 3. Click hamburger again. | `homePage.megaMenu` not visible after second click |

### 7.2 `tests/pdp.spec.ts` Extensions (7 new tests)

All new tests appended after existing TC-83240. Imports add nothing new.

| TC_ID | Test Name | Steps Summary | Assertions |
|-------|-----------|---------------|------------|
| FTC_03_01_02 | `FTC_03_01_02 — Breadcrumb absent on PDP is flagged` | 1. Navigate to vitamins PDP. 2. Assert `pdpPage.secondLevelBreadcrumb` visible. | If not visible: test fails with "Breadcrumb navigation element not found" |
| FTC_03_01_03 | `FTC_03_01_03 — First breadcrumb navigates to homepage` | 1. Navigate to vitamins PDP. 2. Locate first breadcrumb (Home link). 3. Click it. | URL resolves to homepage root; `homePage.logo` visible |
| FTC_03_02_02 | `FTC_03_02_02 — Price element absent on PDP is P0 regression` | 1. Navigate to vitamins PDP. 2. Assert `pdpPage.priceValue` visible. | If not visible: immediate P0 failure with "Price element not rendered" |
| FTC_03_03_02 | `FTC_03_03_02 — Availability indicator absent is P0 regression` | 1. Navigate to vitamins PDP. 2. Assert `pdpPage.availabilitySection` visible. | If not visible: P0 failure with "Availability component not rendered" |
| FTC_03_04_02 | `FTC_03_04_02 — No stores found for invalid postal code` | 1. Navigate to vitamins PDP. 2. Open store selector dialog. 3. Enter remote/invalid postal (e.g. `'X0A 0A0'`). 4. Press Enter. | "No stores found" or "no results" message visible; Add to Cart button disabled in ISP context |
| FTC_03_04_03 | `FTC_03_04_03 — Malformed postal code shows validation error` | 1. Navigate to vitamins PDP. 2. Open store selector. 3. Enter `'12345'` (US ZIP). 4. Press Enter. | Format validation message visible; no store search API call with malformed input |
| FTC_03_05_02 | `FTC_03_05_02 — Non-deliverable postal code shows STH unavailable message` | 1. Navigate to vitamins PDP. 2. Open delivery location modal. 3. Enter non-deliverable postal. 4. Submit. | "Not available for shipping" or equivalent message; Add to Cart disabled for Ship to Home |
| FTC_03_06_02 | `FTC_03_06_02 — Unauthenticated wishlist click redirects to login` | 1. Navigate to vitamins PDP (no auth). 2. Click `pdpPage.wishlistButton`. | Redirected to login page; URL contains `/login` or `/myaccount`; product not silently added |

---

## Section 8 — Wait Strategy and Anti-Bot Protocol

### 8.1 Standard Wait Pattern (apply to all new tests)

All new tests **must** follow this order:
1. Import `test` from `../helpers/fixtures` (not from `@playwright/test`) — ensures DataDome anti-bot via `applyAntiBotMeasures()` runs automatically.
2. After every `navigate()` call: `await simulateBodyClickToUnblock(page)` — dismisses loading overlays.
3. Use `waitFor({ state: 'visible', timeout: 30_000 })` before interacting with elements — never rely on implicit visibility.
4. API interception: register `page.waitForResponse()` or `page.waitForRequest()` BEFORE triggering the action (not after).
5. Attach `test.afterEach(async ({ page }, testInfo) => { await takeEvidenceScreenshot(page, testInfo); })` at top of each new spec.

### 8.2 Timeout Strategy

| Scenario | Timeout |
|----------|---------|
| Simple element visibility assertion | 30 000 ms (`toBeVisible` default) |
| Multi-navigation (search → PDP → cart → checkout) | 180 000 ms (`test.setTimeout`) |
| Authentication flow (login + redirect) | 90 000 ms |
| Address book save (form submit + list reload) | 120 000 ms |
| Checkout full flow with iframe | 180 000 ms |
| Store locator SPA navigation | 90 000 ms |

### 8.3 Iframe Interaction (FTC_08_02_01, FTC_08_02_02, FTC_08_02_05)

- Use `page.frameLocator('iframe[src*="payment"], iframe[name*="payment"]')` or `page.frameLocator('iframe').first()` — confirm exact selector during implementation via MCP discovery.
- Playwright `frameLocator` is the correct mechanism (confirmed by `automation-standards.md §Framework Selection`).
- **Never** use `page.frames()` array indexing — fragile against frame order changes.

### 8.4 OQ Handling

| OQ | Affected TCs | Planned Mitigation |
|----|-------------|-------------------|
| OQ-02 | FTC_07_01_01, FTC_07_01_02, FTC_08_01_01, FTC_08_01_02 | Button existence check only — no full OAuth/third-party flow |
| OQ-03 | FTC_05_01_01..04 | `helpers/fixtures.ts` anti-bot applied automatically; test credentials from env vars |
| OQ-04 | FTC_08_02_01, FTC_08_02_02, FTC_08_02_05 | `frameLocator` for payment iframe; sandbox card numbers from env vars |

---

## Section 9 — File Delivery Plan

### 9.1 Files to Create

| File | Lines (est.) | Priority |
|------|-------------|---------|
| `pages/CartPage.ts` | ~100 | P0 |
| `pages/MyAccountPage.ts` | ~140 | P0 |
| `pages/CheckoutPage.ts` | ~160 | P0 |
| `pages/DealsAndEventsPage.ts` | ~80 | P2 |
| `test-data/cart.data.ts` | ~30 | P0 |
| `test-data/my-account.data.ts` | ~40 | P0 |
| `test-data/checkout.data.ts` | ~40 | P0 |
| `tests/cart.spec.ts` | ~200 | P0 |
| `tests/my-account.spec.ts` | ~280 | P0 |
| `tests/store-locator.spec.ts` | ~180 | P1 |
| `tests/deals-and-events.spec.ts` | ~200 | P2 |
| `tests/checkout.spec.ts` | ~340 | P0 |

### 9.2 Files to Extend

| File | New Tests Added | Extension Priority |
|------|-----------------|--------------------|
| `tests/home-page.spec.ts` | 7 | P1 |
| `tests/pdp.spec.ts` | 7 | P0/P1 |

### 9.3 Suggested Implementation Sequence

1. `test-data/cart.data.ts` + `test-data/my-account.data.ts` + `test-data/checkout.data.ts`
2. `pages/CartPage.ts` → `tests/cart.spec.ts`
3. `pages/MyAccountPage.ts` → `tests/my-account.spec.ts`
4. `pages/CheckoutPage.ts` → `tests/checkout.spec.ts`
5. `tests/store-locator.spec.ts` (POM exists)
6. `pages/DealsAndEventsPage.ts` → `tests/deals-and-events.spec.ts`
7. Extend `tests/pdp.spec.ts` (7 tests)
8. Extend `tests/home-page.spec.ts` (7 tests)

---

## Section 10 — Coverage Traceability Matrix

| FTC_ID | Epic | Source TC | Priority | Type | Spec File (Target) | Status |
|--------|------|-----------|----------|------|--------------------|--------|
| FTC_01_01_01 | EPIC-01 | TC-79593-01 | P1 | Positive | home-page.spec.ts | ✅ EXISTS |
| FTC_01_01_02 | EPIC-01 | TC-79593-01 | P1 | Negative | home-page.spec.ts | 🆕 ADD |
| FTC_01_02_01 | EPIC-01 | TC-79593-02-negative | P1 | Negative | home-page.spec.ts | ✅ EXISTS |
| FTC_01_02_02 | EPIC-01 | TC-79593-02-negative | P1 | Boundary | home-page.spec.ts | 🆕 ADD |
| FTC_01_02_03 | EPIC-01 | TC-79593-02-negative | P1 | Boundary | home-page.spec.ts | 🆕 ADD |
| FTC_01_03_01 | EPIC-01 | TC-79593-02-positive | P0 | Positive | home-page.spec.ts | ✅ EXISTS |
| FTC_01_04_01 | EPIC-01 | TC-79593-03 | P1 | Positive | home-page.spec.ts | ✅ EXISTS |
| FTC_01_04_02 | EPIC-01 | TC-79593-03 | P1 | Negative | home-page.spec.ts | 🆕 ADD |
| FTC_01_05_01 | EPIC-01 | TC-79593-05 | P1 | Positive | home-page.spec.ts | ✅ EXISTS |
| FTC_01_05_02 | EPIC-01 | TC-79593-05 | P1 | Negative | home-page.spec.ts | 🆕 ADD |
| FTC_01_05_03 | EPIC-01 | TC-79593-05 | P1 | Boundary | home-page.spec.ts | 🆕 ADD |
| FTC_01_06_01 | EPIC-01 | TC-79593-06 | P1 | Positive | home-page.spec.ts | ✅ EXISTS |
| FTC_01_06_02 | EPIC-01 | TC-79593-06 | P1 | Boundary | home-page.spec.ts | 🆕 ADD |
| FTC_01_06_03 | EPIC-01 | TC-79593-06 | P1 | Negative | home-page.spec.ts | 🆕 ADD |
| FTC_02_01_01 | EPIC-02 | TC-79594-04 | P1 | Positive | plp.spec.ts | ✅ EXISTS |
| FTC_02_01_02 | EPIC-02 | TC-79594-04 | P1 | Positive | plp.spec.ts | ✅ EXISTS |
| FTC_02_01_03 | EPIC-02 | TC-79594-04 | P1 | Negative | plp.spec.ts | ✅ EXISTS |
| FTC_02_01_04 | EPIC-02 | TC-79594-04 | P1 | Negative | plp.spec.ts | ✅ EXISTS |
| FTC_02_02_01 | EPIC-02 | TC-79594-09 | P2 | Positive | plp.spec.ts | ✅ EXISTS |
| FTC_02_02_02 | EPIC-02 | TC-79594-09 | P2 | Negative | plp.spec.ts | ✅ EXISTS |
| FTC_02_02_03 | EPIC-02 | TC-79594-09 | P2 | Boundary | plp.spec.ts | ✅ EXISTS |
| FTC_03_01_01 | EPIC-03 | TC-79595-02 | P2 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_01_02 | EPIC-03 | TC-79595-02 | P2 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_03_01_03 | EPIC-03 | TC-79595-02 | P2 | Boundary | pdp.spec.ts | 🆕 ADD |
| FTC_03_02_01 | EPIC-03 | TC-79595-07 | P0 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_02_02 | EPIC-03 | TC-79595-07 | P0 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_03_03_01 | EPIC-03 | TC-79595-12-instock | P0 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_03_02 | EPIC-03 | TC-79595-12-instock | P0 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_03_04_01 | EPIC-03 | TC-79595-17 | P0 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_04_02 | EPIC-03 | TC-79595-17 | P0 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_03_04_03 | EPIC-03 | TC-79595-17 | P0 | Boundary | pdp.spec.ts | 🆕 ADD |
| FTC_03_05_01 | EPIC-03 | TC-79595-18 | P0 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_05_02 | EPIC-03 | TC-79595-18 | P0 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_03_06_01 | EPIC-03 | TC-79595-19-loggedin | P1 | Positive | pdp.spec.ts | ✅ EXISTS |
| FTC_03_06_02 | EPIC-03 | TC-79595-19-loggedin | P1 | Negative | pdp.spec.ts | 🆕 ADD |
| FTC_04_01_01 | EPIC-04 | TC-79596-02 | P0 | Positive | cart.spec.ts | 🆕 CREATE |
| FTC_04_01_02 | EPIC-04 | TC-79596-02 | P0 | Negative | cart.spec.ts | 🆕 CREATE |
| FTC_04_01_03 | EPIC-04 | TC-79596-02 | P0 | Boundary | cart.spec.ts | 🆕 CREATE |
| FTC_04_02_01 | EPIC-04 | TC-79596-05 | P0 | Positive | cart.spec.ts | 🆕 CREATE |
| FTC_04_02_02 | EPIC-04 | TC-79596-05 | P0 | Negative | cart.spec.ts | 🆕 CREATE |
| FTC_04_02_03 | EPIC-04 | TC-79596-05 | P0 | Boundary | cart.spec.ts | 🆕 CREATE |
| FTC_05_01_01 | EPIC-05 | TC-79597-01 | P0 | Positive | my-account.spec.ts | 🆕 CREATE |
| FTC_05_01_02 | EPIC-05 | TC-79597-01 | P0 | Negative | my-account.spec.ts | 🆕 CREATE |
| FTC_05_01_03 | EPIC-05 | TC-79597-01 | P0 | Boundary | my-account.spec.ts | 🆕 CREATE |
| FTC_05_01_04 | EPIC-05 | TC-79597-01 | P0 | Negative | my-account.spec.ts | 🆕 CREATE |
| FTC_05_02_01 | EPIC-05 | TC-79597-07 | P1 | Positive | my-account.spec.ts | 🆕 CREATE |
| FTC_05_02_02 | EPIC-05 | TC-79597-07 | P1 | Negative | my-account.spec.ts | 🆕 CREATE |
| FTC_05_02_03 | EPIC-05 | TC-79597-07 | P1 | Boundary | my-account.spec.ts | 🆕 CREATE |
| FTC_06_01_01 | EPIC-06 | TC-79600-01 | P1 | Positive | store-locator.spec.ts | 🆕 CREATE |
| FTC_06_01_02 | EPIC-06 | TC-79600-01 | P1 | Negative | store-locator.spec.ts | 🆕 CREATE |
| FTC_06_02_01 | EPIC-06 | TC-79600-02 | P2 | Positive | store-locator.spec.ts | 🆕 CREATE |
| FTC_06_02_02 | EPIC-06 | TC-79600-02 | P2 | Negative | store-locator.spec.ts | 🆕 CREATE |
| FTC_06_02_03 | EPIC-06 | TC-79600-02 | P2 | Boundary | store-locator.spec.ts | 🆕 CREATE |
| FTC_07_01_01 | EPIC-07 | TC-79601-01 | P2 | Positive | deals-and-events.spec.ts | 🆕 CREATE |
| FTC_07_01_02 | EPIC-07 | TC-79601-01 | P2 | Negative | deals-and-events.spec.ts | 🆕 CREATE |
| FTC_07_02_01 | EPIC-07 | TC-79601-05 | P2 | Positive | deals-and-events.spec.ts | 🆕 CREATE |
| FTC_07_02_02 | EPIC-07 | TC-79601-05 | P2 | Negative | deals-and-events.spec.ts | 🆕 CREATE |
| FTC_07_02_03 | EPIC-07 | TC-79601-05 | P2 | Boundary | deals-and-events.spec.ts | 🆕 CREATE |
| FTC_08_01_01 | EPIC-08 | TC-79602-01A | P0 | Positive | checkout.spec.ts | 🆕 CREATE |
| FTC_08_01_02 | EPIC-08 | TC-79602-01A | P0 | Negative | checkout.spec.ts | 🆕 CREATE |
| FTC_08_02_01 | EPIC-08 | TC-79602-01B | P0 | Positive | checkout.spec.ts | 🆕 CREATE |
| FTC_08_02_02 | EPIC-08 | TC-79602-01B | P0 | Negative | checkout.spec.ts | 🆕 CREATE |
| FTC_08_02_03 | EPIC-08 | TC-79602-01B | P0 | Negative | checkout.spec.ts | 🆕 CREATE |
| FTC_08_02_04 | EPIC-08 | TC-79602-01B | P0 | Negative | checkout.spec.ts | 🆕 CREATE |
| FTC_08_02_05 | EPIC-08 | TC-79602-01B | P0 | Boundary | checkout.spec.ts | 🆕 CREATE |

**Total: 63 / 63 FTC IDs accounted for. No silent drops.**

---

## Section 11 — Open Questions

| ID | Scope | Question | Impact | Recommended Action |
|----|-------|----------|--------|-------------------|
| PQ-01 | EPIC-04 | Cart delivery selector locator not confirmed on live UAT — exact aria-label, role, or class for Shipping/ISP radio buttons unknown. | High — blocks `CartPage.ts` locator definition. | MCP browser discovery on `/cart` with a product before implementation. |
| PQ-02 | EPIC-05 | Address book URL path (`/myaccount/address-book` assumed) not confirmed. | Medium — navigation step may fail. | MCP discovery on authenticated `/myaccount` session. |
| PQ-03 | EPIC-07 | Deals and Events page URL confirmed as `/category/deals-and-events/c/1027` from `homePageData.headerNav.deals.href` — city filter selector (dropdown/select type) not confirmed. | Medium — `DealsAndEventsPage.citySelector` locator TBD. | MCP discovery on Deals page. |
| PQ-04 | EPIC-07 | MyRegistry button selector on PDP not known — blocked (OQ-02 from FTC manifest). | Low — existence-only check; best-effort locator. | Use text-based locator `page.locator('button, a').filter({ hasText: /myregistry/i })` as fallback. |
| PQ-05 | EPIC-08 | Sandbox payment iframe selector not confirmed — `iframe[src*="payment"]` assumed. | High — blocks `CheckoutPage.fillSandboxCardNumber()`. | MCP discovery on checkout page with Credit Card selected. |
| PQ-06 | EPIC-08 | "Proceed to Checkout" button label on cart page confirmed as part of existing tests but checkout page entry flow (guest vs. account prompt) not fully mapped. | Medium — `continueAsGuest()` step may require extra interactions. | MCP discovery on checkout page. |
| PQ-07 | ALL | `automation-standards.md` notes test data in `/Users/virginia.zambudio/PlaywrightAutomation/artifacts/inputs` — no existing credential fixtures for address book or checkout found. Sandbox card numbers require env vars (`SANDBOX_CARD_NUMBER`, `DECLINED_CARD_NUMBER`). | Medium — CI pipeline must set env vars. | Document in README; use env var defaults with inline fallback only for dev. |
