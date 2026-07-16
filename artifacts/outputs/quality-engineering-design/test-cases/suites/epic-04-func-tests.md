# London Drugs UAT -- EPIC-04: Cart Functional Tests
Priority: P0 | MVP: Yes | Stories: 2
Source: UAT Regression Testing Master Plan (TC IDs 83241–83242)
---

## Story TC-83241: Cart — Switching delivery selector to Shipping triggers cart update API

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Cart page loads with a product in cart and the delivery selector is visible
- AC-02: Selecting the Shipping option triggers a cart update API call
- AC-03: The delivery selector is present in the cart after selection

---

### FTC_04_01_01 — Switching to Shipping triggers cart update API [Positive]

```gherkin
@FE @cart @delivery @shipping @P0
Scenario: TC-83241 - Switching delivery selector to Shipping triggers cart update API
  Given the user has a product in the cart (precondition)
  And the user navigates to "https://www.londondrugs.com/cart"
  And the cart page loads with the product visible
  When the delivery selector has loaded
  And the user selects the Shipping delivery option
  And the cart update API call completes
  Then the delivery selector reflects the Shipping option as selected
  And the cart summary reflects any shipping-related updates
```
**Traceability:** TC-83241 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_04_01_02 — Switching back from Shipping to In-Store Pickup updates cart [Positive]

```gherkin
@FE @cart @delivery @in-store-pickup @P1
Scenario: TC-83241-A2 - Switching from Shipping back to In-Store Pickup triggers cart update
  Given the user is on the cart page with Shipping selected as the delivery method
  When the user switches the delivery selector back to In-Store Pickup
  And the cart update API call completes
  Then the delivery selector reflects In-Store Pickup as selected
  And the cart summary is updated to reflect the pickup option
```
**Traceability:** TC-83241 | AC-02 | Type: positive

---

### FTC_04_01_03 — Cart delivery selector is not present when cart is empty [Negative]

```gherkin
@FE @cart @delivery @empty-cart @P1
Scenario: TC-83241-N - Delivery selector is absent when the cart is empty
  Given the user navigates to the cart page with no products in cart
  When the cart page loads
  Then the delivery selector is not visible or not interactable
  And the cart shows an empty-cart message or state
```
**Traceability:** TC-83241 | AC-01 | Type: negative

---

### FTC_04_01_04 — Cart update API failure shows error state [Negative]

```gherkin
@FE @cart @delivery @api-failure @P2
Scenario: TC-83241-N2 - Cart update API failure after delivery selector change shows error
  Given the user is on the cart page with a product in cart
  When the user switches the delivery selector
  And the cart update API returns an error response
  Then an error message or delivery change failure indication is shown
  And the cart does not silently accept the failed change
```
**Traceability:** TC-83241 | AC-02 | Type: negative

---

## Story TC-83242: Cart — Cart summary subtotal element is visible and displays a dollar amount

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to /cart loads the cart page
- AC-02: The cart summary/subtotal element is visible
- AC-03: The subtotal displays a dollar amount

---

### FTC_04_02_01 — Cart summary subtotal is visible and shows dollar amount [Positive]

```gherkin
@FE @cart @subtotal @P0
Scenario: TC-83242 - Cart summary subtotal element is visible and displays a dollar amount
  Given the user has a product in the cart
  And the user navigates to "https://www.londondrugs.com/cart"
  When the cart page loads
  And the cart summary/subtotal element has loaded
  Then the subtotal element is visible on the page
  And the subtotal displays a valid dollar amount (e.g. $X.XX format)
```
**Traceability:** TC-83242 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_04_02_02 — Cart subtotal is absent or zero when cart is empty [Negative]

```gherkin
@FE @cart @subtotal @empty-cart @P1
Scenario: TC-83242-N - Cart subtotal is not displayed or shows zero when cart is empty
  Given the user navigates to "https://www.londondrugs.com/cart" with no items in cart
  When the cart page loads
  Then the cart subtotal element is not visible
  Or the subtotal shows "$0.00" or an empty cart message
```
**Traceability:** TC-83242 | AC-02 | Type: negative

---

### FTC_04_02_03 — Cart subtotal updates when item quantity is changed [Boundary]

```gherkin
@FE @cart @subtotal @quantity @P1
Scenario: TC-83242-B - Cart subtotal recalculates when product quantity is updated
  Given the user has one product in the cart with a visible subtotal
  When the user changes the quantity of the product in the cart
  And the cart update completes
  Then the subtotal is recalculated and updated to reflect the new quantity
  And the dollar amount in the subtotal changes accordingly
```
**Traceability:** TC-83242 | AC-03 | Type: boundary
