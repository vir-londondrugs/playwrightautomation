# London Drugs UAT -- EPIC-07: Checkout Functional Tests
Priority: P0 | MVP: Yes | Stories: 2
Source: UAT Regression Testing Master Plan (TC IDs 83249–83250)
---

## Story TC-83249: Checkout — Guest checkout PayPal button is visible and clickable (BLOCKED)

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Checkout page loads with a product in cart
- AC-02: The PayPal button is visible and clickable on the checkout page
- AC-03: Full OAuth flow is BLOCKED (third-party iframe) — validate button visibility/click only

---

### FTC_07_01_01 — PayPal button is visible and clickable on checkout page [Positive]

```gherkin
@FE @checkout @paypal @third-party @BLOCKED @P1
Scenario: TC-83249 - PayPal button is visible and clickable on guest checkout page
  Given the user has a product in the cart (precondition)
  And the user navigates to the checkout page
  When the checkout page has loaded
  And the user locates the PayPal payment option
  Then the PayPal button is visible on the checkout page
  And the PayPal button is clickable
```
**Traceability:** TC-83249 | AC-01, AC-02 | Type: positive
**Note:** BLOCKED — do not automate the PayPal OAuth flow or interact inside the PayPal iframe/redirect. Validate button visibility and click-through only.

---

### FTC_07_01_02 — PayPal button does not appear when cart is empty [Negative]

```gherkin
@FE @checkout @paypal @empty-cart @P2
Scenario: TC-83249-N - PayPal button is not accessible when no products are in cart
  Given the user navigates to the checkout page without any products in cart
  When the checkout page or cart page loads
  Then the PayPal button is not visible or the user is redirected to the cart
  And the checkout payment section is not accessible
```
**Traceability:** TC-83249 | AC-01 | Type: negative

---

## Story TC-83250: Checkout — Guest completes full checkout with credit card and receives confirmation

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Cart page loads with a product in cart
- AC-02: User proceeds to checkout and continues as guest
- AC-03: Guest fills email, first name, address, and postal code
- AC-04: User selects Credit Card payment and fills card details inside payment iframe
- AC-05: User clicks 'Place Order' and waits for the order confirmation page
- AC-06: Order confirmation page is loaded at /order-confirmation

---

### FTC_07_02_01 — Guest completes full checkout with credit card and receives confirmation [Positive]

```gherkin
@FE @checkout @guest-checkout @credit-card @P0
Scenario: TC-83250 - Guest completes full checkout with credit card and receives order confirmation
  Given the user has a product in the cart (precondition)
  And the user navigates to "https://www.londondrugs.com/cart"
  And the cart page loads with the product visible
  When the user clicks the "Proceed to Checkout" button
  And the checkout page URL is reached
  And the user clicks "Continue as Guest"
  And the user enters the guest email from GUEST_EMAIL environment variable
  And the user fills in the first name from TEST_FIRSTNAME environment variable
  And the user fills in the address from TEST_ADDRESS environment variable
  And the user fills in the postal code from TEST_POSTAL environment variable
  And the user selects the "Credit Card" payment method
  And the user fills the card number inside the payment iframe using the sandbox card from TEST_CC_NUMBER
  And the user clicks "Place Order" to submit
  And the order confirmation page loads
  Then the URL matches "/order-confirmation"
  And the order confirmation content is visible to the user
```
**Traceability:** TC-83250 | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06 | Type: positive

---

### FTC_07_02_02 — Checkout with expired or declined sandbox card shows payment error [Negative]

```gherkin
@FE @checkout @guest-checkout @credit-card @payment-failure @P1
Scenario: TC-83250-N1 - Checkout with declined sandbox card shows payment error
  Given the user has reached the credit card payment step in guest checkout
  When the user enters a declined or invalid sandbox card number in the payment iframe
  And the user clicks "Place Order"
  Then a payment error or declined message is displayed
  And the user is NOT redirected to the order confirmation page
  And the URL does NOT match "/order-confirmation"
```
**Traceability:** TC-83250 | AC-04, AC-05 | Type: negative

---

### FTC_07_02_03 — Checkout without filling required guest fields shows validation error [Negative]

```gherkin
@FE @checkout @guest-checkout @validation @P1
Scenario: TC-83250-N2 - Guest checkout with missing required fields shows validation error
  Given the user has clicked "Continue as Guest" on the checkout page
  When the user skips filling in a required field (e.g. guest email or address)
  And the user proceeds to the payment step or clicks "Place Order"
  Then a required-field validation error is shown
  And the order is NOT submitted
```
**Traceability:** TC-83250 | AC-03 | Type: negative

---

### FTC_07_02_04 — Guest email field accepts only valid email format [Boundary]

```gherkin
@FE @checkout @guest-checkout @validation @boundary @P1
Scenario: TC-83250-B - Guest checkout email field validates email format
  Given the user has clicked "Continue as Guest" on the checkout page
  When the user enters a malformed email address (e.g. "guestexample.com")
  And the user proceeds
  Then an email format validation error is shown
  And the checkout flow does not advance past the email step
```
**Traceability:** TC-83250 | AC-03 | Type: boundary

---

### FTC_07_02_05 — Payment iframe loads and accepts card input before Place Order [Boundary]

```gherkin
@FE @checkout @guest-checkout @credit-card @iframe @P0
Scenario: TC-83250-B2 - Payment iframe loads correctly and accepts sandbox card input
  Given the user has reached the payment step in guest checkout
  And the "Credit Card" payment method has been selected
  When the payment iframe has loaded
  Then the card number input inside the payment iframe is visible and enabled
  And the user can enter card details using the sandbox card number
  And the "Place Order" button becomes available after card details are entered
```
**Traceability:** TC-83250 | AC-04, AC-05 | Type: boundary
