# London Drugs UAT -- EPIC-03: PDP (Product Detail Page) Functional Tests
Priority: P0 | MVP: Yes | Stories: 7
Source: UAT Regression Testing Master Plan (TC IDs 83235–83240, 83247)
---

## Story TC-83235: PDP — Second-level breadcrumb navigates back to category listing

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to vitamins search results and clicking first product opens PDP
- AC-02: Breadcrumb component renders on PDP
- AC-03: Clicking the second-level breadcrumb navigates to the category listing page (PLP)

---

### FTC_03_01_01 — Second breadcrumb click navigates to category PLP [Positive]

```gherkin
@FE @pdp @breadcrumb @navigation @P0
Scenario: TC-83235 - Second-level breadcrumb navigates back to category listing
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the Product Detail Page
  And the breadcrumb component has rendered on the PDP
  And the user clicks the second breadcrumb link (category level)
  Then the browser navigates to a category listing page (PLP)
  And the breadcrumb trail was visible on the PDP
```
**Traceability:** TC-83235 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_03_01_02 — Breadcrumb renders correctly before user interaction [Boundary]

```gherkin
@FE @pdp @breadcrumb @render @P1
Scenario: TC-83235-B - Breadcrumb component is visible after PDP loads
  Given the user has opened a product detail page from the vitamins search results
  When the PDP has fully loaded
  Then the breadcrumb component is visible
  And at least two breadcrumb levels are present (home + category)
```
**Traceability:** TC-83235 | AC-02 | Type: boundary

---

### FTC_03_01_03 — Home breadcrumb (first level) navigates to homepage [Negative]

```gherkin
@FE @pdp @breadcrumb @navigation @P2
Scenario: TC-83235-N - Clicking first breadcrumb (home) navigates to homepage not PLP
  Given the user is on a product detail page with breadcrumbs visible
  When the user clicks the first breadcrumb link (home level)
  Then the browser navigates to the homepage root "/"
  And the user does not land on a category PLP
```
**Traceability:** TC-83235 | AC-03 | Type: negative

---

## Story TC-83236: PDP — Price element is visible and formatted correctly

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to vitamins search and opening first product PDP loads the page
- AC-02: The price element renders on the PDP
- AC-03: Price is formatted correctly (dollar amount, e.g. $X.XX)

---

### FTC_03_02_01 — Price element is visible on vitamins product PDP [Positive]

```gherkin
@FE @pdp @price @P0
Scenario: TC-83236 - Price element is visible and formatted correctly on vitamins PDP
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the PDP
  And the PDP URL matches the product detail pattern (e.g. *-p/*)
  And the price element has rendered
  Then the price element is visible on the page
  And the price displays a valid dollar amount format
```
**Traceability:** TC-83236 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_03_02_02 — Price element is absent for out-of-stock or unavailable products [Negative]

```gherkin
@FE @pdp @price @availability @P2
Scenario: TC-83236-N - Price element may not render for products without pricing data
  Given the user opens a product detail page for a product with no listed price
  When the PDP has loaded
  Then the price element is not visible or displays a placeholder
  And no dollar amount is shown
```
**Traceability:** TC-83236 | AC-02 | Type: negative

---

### FTC_03_02_03 — Price element renders after full PDP load [Boundary]

```gherkin
@FE @pdp @price @load-order @P1
Scenario: TC-83236-B - Price element renders after PDP URL pattern is matched
  Given the user navigates to a product detail page URL matching the *-p/* pattern
  When the PDP URL has been matched and the page has loaded
  Then the price element becomes visible
  And the price is a non-zero positive dollar amount
```
**Traceability:** TC-83236 | AC-02, AC-03 | Type: boundary

---

## Story TC-83237: PDP — Availability indicator is visible for in-stock products

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to vitamins search and opening first product PDP loads the page
- AC-02: The availability indicator renders and is visible on the PDP

---

### FTC_03_03_01 — Availability indicator is visible on in-stock vitamins PDP [Positive]

```gherkin
@FE @pdp @availability @P0
Scenario: TC-83237 - Availability indicator is visible on product detail page
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the PDP
  And the availability indicator has loaded
  Then the availability indicator is visible on the page
```
**Traceability:** TC-83237 | AC-01, AC-02 | Type: positive

---

### FTC_03_03_02 — Availability indicator shows different state for out-of-stock products [Negative]

```gherkin
@FE @pdp @availability @out-of-stock @P2
Scenario: TC-83237-N - Availability indicator shows out-of-stock or unavailable state
  Given the user opens a product detail page for a product that is out of stock
  When the PDP has loaded
  Then the availability indicator shows an out-of-stock or unavailable message
  And the "Add to Cart" button may be disabled or hidden
```
**Traceability:** TC-83237 | AC-02 | Type: negative

---

## Story TC-83238: PDP — Add to cart with In-Store Pickup increments mini cart counter

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Fulfillment/delivery options render on PDP
- AC-02: Selecting In-Store Pickup option shows store search input if no store is selected
- AC-03: Entering postal code V6B 1A1 and pressing Enter returns store results
- AC-04: Selecting first available store and clicking Add to Cart succeeds
- AC-05: Mini cart button is visible after add-to-cart confirmation

---

### FTC_03_04_01 — Add to cart with In-Store Pickup using postal code V6B 1A1 [Positive]

```gherkin
@FE @pdp @add-to-cart @in-store-pickup @P0
Scenario: TC-83238 - Add to cart with In-Store Pickup at postal V6B 1A1 increments mini cart
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the PDP
  And the fulfillment and delivery options have rendered
  And the user selects the "In-Store Pickup" delivery option
  And the store search input appears (no store previously selected)
  And the user enters postal code "V6B 1A1" to find nearby stores
  And the user presses Enter to search for stores
  And the user selects the first available store from the list
  And the user clicks the "Add to Cart" button
  And the cart confirmation is received
  Then the mini cart button is visible in the header
  And the mini cart shows an incremented item count
```
**Traceability:** TC-83238 | AC-01, AC-02, AC-03, AC-04, AC-05 | Type: positive

---

### FTC_03_04_02 — No stores found for invalid postal code [Negative]

```gherkin
@FE @pdp @add-to-cart @in-store-pickup @validation @P1
Scenario: TC-83238-N1 - Entering invalid postal code returns no store results
  Given the user is on a PDP with In-Store Pickup selected
  And the store search input is visible
  When the user enters an invalid postal code (e.g. "ZZZZZ")
  And the user presses Enter to search
  Then no stores are returned in the store list
  And an appropriate "no stores found" message or empty list is displayed
```
**Traceability:** TC-83238 | AC-03 | Type: negative

---

### FTC_03_04_03 — Store search input appears only when no store is pre-selected [Boundary]

```gherkin
@FE @pdp @add-to-cart @in-store-pickup @state @P1
Scenario: TC-83238-B - Store search input conditionally appears based on prior store selection
  Given the user is on a PDP with In-Store Pickup available
  When the user selects In-Store Pickup and a store is already saved in the session
  Then the store search input may not appear
  And the previously selected store is shown
  When the user is on a PDP with In-Store Pickup and no store is saved
  Then the store search input is displayed
```
**Traceability:** TC-83238 | AC-02 | Type: boundary

---

### FTC_03_04_04 — Add to Cart without selecting a store for In-Store Pickup is blocked [Negative]

```gherkin
@FE @pdp @add-to-cart @in-store-pickup @validation @P1
Scenario: TC-83238-N2 - Add to Cart requires store selection for In-Store Pickup
  Given the user has selected In-Store Pickup on the PDP
  And no store has been selected yet
  When the user attempts to click the "Add to Cart" button without selecting a store
  Then the Add to Cart action is blocked or the store selection is required
  And no item is added to the cart
```
**Traceability:** TC-83238 | AC-04 | Type: negative

---

### FTC_03_04_05 — Postal code V6B 1A1 returns at least one store [Boundary]

```gherkin
@FE @pdp @add-to-cart @in-store-pickup @boundary @P1
Scenario: TC-83238-B2 - Postal code V6B 1A1 returns at least one available store
  Given the user has entered postal code "V6B 1A1" in the store search
  When the store search results have loaded
  Then at least one store is listed in the results
  And the first store in the list is selectable
```
**Traceability:** TC-83238 | AC-03, AC-04 | Type: boundary

---

## Story TC-83239: PDP — Add to cart with Ship to Home increments cart counter

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Ship to Home option is available and renders on PDP
- AC-02: Selecting Ship to Home and entering postal code V6B 1A1 configures shipping
- AC-03: Clicking Add to Cart and waiting for confirmation increments the cart counter

---

### FTC_03_05_01 — Add to cart with Ship to Home and postal V6B 1A1 increments cart [Positive]

```gherkin
@FE @pdp @add-to-cart @ship-to-home @P0
Scenario: TC-83239 - Add to cart with Ship to Home using postal V6B 1A1 increments cart
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the PDP
  And the "Ship to Home" delivery option has rendered
  And the user selects the "Ship to Home" delivery option
  And the user enters postal code "V6B 1A1" for shipping availability
  And the user clicks the "Add to Cart" button
  And the add-to-cart confirmation is received
  Then the cart counter in the header is incremented
```
**Traceability:** TC-83239 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_03_05_02 — Ship to Home option unavailable for in-store-only products [Negative]

```gherkin
@FE @pdp @add-to-cart @ship-to-home @availability @P2
Scenario: TC-83239-N - Ship to Home option is not available for in-store-only products
  Given the user opens a product detail page for a product only available in-store
  When the PDP has loaded
  Then the "Ship to Home" delivery option is not present or is disabled
```
**Traceability:** TC-83239 | AC-01 | Type: negative

---

### FTC_03_05_03 — Cart counter reflects cumulative items added [Boundary]

```gherkin
@FE @pdp @add-to-cart @ship-to-home @cart-count @P1
Scenario: TC-83239-B - Cart counter reflects total items after adding multiple products
  Given the user has already added one product to the cart
  And the cart counter shows "1"
  When the user adds another product via Ship to Home
  And the add-to-cart confirmation is received
  Then the cart counter increments to reflect the new total
```
**Traceability:** TC-83239 | AC-03 | Type: boundary

---

## Story TC-83240: PDP — Authenticated user adds product to wishlist via heart icon

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Authenticated user can open a vitamins PDP
- AC-02: Wishlist/heart button is visible on the PDP
- AC-03: Clicking the heart/wishlist icon triggers a wishlist API call
- AC-04: The wishlist button shows active/filled state after the API responds

---

### FTC_03_06_01 — Authenticated user adds product to wishlist via heart icon [Positive]

```gherkin
@FE @pdp @wishlist @authenticated @P0
Scenario: TC-83240 - Authenticated user clicks heart icon to add product to wishlist
  Given the user is authenticated with a valid session
  And the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results have loaded
  When the user clicks the first product card to open the PDP
  And the wishlist heart button is visible on the PDP
  And the user clicks the heart/wishlist icon
  And the wishlist API response is received
  Then the wishlist button shows an active or filled state
```
**Traceability:** TC-83240 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_03_06_02 — Unauthenticated user cannot add to wishlist without login [Negative]

```gherkin
@FE @pdp @wishlist @unauthenticated @P1
Scenario: TC-83240-N1 - Unauthenticated user is redirected to login when clicking wishlist
  Given the user is NOT authenticated
  And the user opens a product detail page
  When the user clicks the heart/wishlist icon
  Then the user is redirected to the login page
  Or a login prompt or modal is displayed
  And the product is not added to the wishlist
```
**Traceability:** TC-83240 | AC-01 | Type: negative

---

### FTC_03_06_03 — Wishlist icon becomes active immediately after successful API response [Boundary]

```gherkin
@FE @pdp @wishlist @api-response @P1
Scenario: TC-83240-B - Wishlist button state updates immediately after API success
  Given the authenticated user has clicked the heart icon on a PDP
  When the wishlist API returns a success response
  Then the heart icon changes to an active/filled state without a page reload
```
**Traceability:** TC-83240 | AC-04 | Type: boundary

---

### FTC_03_06_04 — Wishlist API error does not leave button in active state [Negative]

```gherkin
@FE @pdp @wishlist @api-failure @P2
Scenario: TC-83240-N2 - Wishlist API error does not show active state
  Given the authenticated user has clicked the heart icon on a PDP
  When the wishlist API returns an error response
  Then the heart icon does not change to an active/filled state
  And an error or failure message may be displayed
```
**Traceability:** TC-83240 | AC-04 | Type: negative

---

## Story TC-83247: MyRegistry — MyRegistry button exists on PDP (BLOCKED automation)

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: The MyRegistry button is visible on the PDP
- AC-02: Full automation is BLOCKED (third-party iframe) — validate button existence only

---

### FTC_03_07_01 — MyRegistry button exists on PDP [Positive]

```gherkin
@FE @pdp @myregistry @third-party @BLOCKED @P2
Scenario: TC-83247 - MyRegistry button is present on product detail page
  Given the user navigates to any product detail page (PDP)
  And the PDP has loaded
  When the user locates the MyRegistry section on the PDP
  Then the MyRegistry button is visible and present on the page
```
**Traceability:** TC-83247 | AC-01 | Type: positive
**Note:** Full automation BLOCKED — MyRegistry is a third-party integration in an iframe. Validate button existence only; do NOT automate inside the iframe.

---

### FTC_03_07_02 — Clicking MyRegistry button triggers iframe or modal [Boundary]

```gherkin
@FE @pdp @myregistry @third-party @BLOCKED @P2
Scenario: TC-83247-B - Clicking MyRegistry button opens a third-party iframe or modal
  Given the user is on a PDP with the MyRegistry button visible
  When the user clicks the MyRegistry button
  Then a third-party iframe or modal is triggered
  And the test validates only that the trigger occurred (does NOT automate inside the iframe)
```
**Traceability:** TC-83247 | AC-01 | Type: boundary
**Note:** BLOCKED — do not automate inside the third-party MyRegistry iframe.
