# London Drugs UAT -- EPIC-01: Home Page Functional Tests
Priority: P0 | MVP: Yes | Stories: 8
Source: UAT Regression Testing Master Plan (TC IDs 83225–83232)
---

## Story TC-83225: Home Page — Logo click from internal page redirects to homepage

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to the site loads the page successfully
- AC-02: Clicking the London Drugs logo in the header returns the user to the homepage
- AC-03: After logo click, URL matches `/`, title matches `London Drugs | 100% Canadian Owned Retail Store`, and logo is visible

---

### FTC_01_01_01 — Logo click from internal page redirects to homepage [Positive]

```gherkin
@FE @home-page @logo @navigation @P0
Scenario: TC-83225 - Logo click from internal page redirects to homepage
  Given the user has navigated to the London Drugs UAT homepage
  And the page loading overlay has been dismissed
  When the user clicks the London Drugs logo in the header
  And any loading overlay is dismissed after the click
  Then the current URL matches the homepage root "/"
  And the page title is "London Drugs | 100% Canadian Owned Retail Store"
  And the London Drugs logo is visible on the page
```
**Traceability:** TC-83225 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_01_01_02 — Logo click works after loading overlay is present [Boundary]

```gherkin
@FE @home-page @logo @navigation @P1
Scenario: TC-83225-B - Logo click redirects even when loading overlay appears after click
  Given the user has navigated to the London Drugs UAT homepage
  And the page loading overlay has been dismissed
  When the user clicks the London Drugs logo in the header
  And the loading overlay re-appears after the click
  And the loading overlay is dismissed
  Then the current URL matches the homepage root "/"
  And the page title is "London Drugs | 100% Canadian Owned Retail Store"
```
**Traceability:** TC-83225 | AC-02, AC-03 | Type: boundary

---

### FTC_01_01_03 — Logo is not clickable during loading overlay [Negative]

```gherkin
@FE @home-page @logo @navigation @P1
Scenario: TC-83225-N - Logo element is present and identifiable in header
  Given the user is on the London Drugs UAT homepage
  When the page has finished loading
  Then the logo element "a[href='/'] img[alt='London Drugs']" is present in the header
  And the logo link navigates to the homepage root "/"
```
**Traceability:** TC-83225 | AC-01 | Type: negative

---

## Story TC-83226: Home Page — Search with invalid term displays no-results message

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Typing an invalid search term and pressing Enter submits the search
- AC-02: The no-results heading `We are sorry, no results were found for {term}` is visible

---

### FTC_01_02_01 — Invalid search term shows no-results message [Positive]

```gherkin
@FE @home-page @search @no-results @P0
Scenario: TC-83226 - Search for invalid term displays no results message
  Given the user has navigated to the London Drugs UAT homepage
  And the search input "input[placeholder='Find your product']" is visible and enabled
  When the user types "xyznotaproduct999" in the search input field
  And the user presses Enter to submit the search
  And the page loading is unblocked after search
  Then an h1 heading containing "We are sorry, no results were found for" is visible
  And the heading includes the search term "xyznotaproduct999"
```
**Traceability:** TC-83226 | AC-01, AC-02 | Type: positive

---

### FTC_01_02_02 — Search input waits for React hydration before accepting input [Boundary]

```gherkin
@FE @home-page @search @hydration @P1
Scenario: TC-83226-B - Search input is only accessible after React hydration completes
  Given the user has navigated to the London Drugs UAT homepage
  When the page loading overlay has been dismissed
  Then the search input "input[placeholder='Find your product']" becomes visible and enabled
  And the search input accepts keyboard input without error
```
**Traceability:** TC-83226 | AC-01 | Type: boundary

---

### FTC_01_02_03 — Empty search term does not display no-results message [Negative]

```gherkin
@FE @home-page @search @validation @P1
Scenario: TC-83226-N - Submitting an empty search term does not navigate to no-results page
  Given the user has navigated to the London Drugs UAT homepage
  And the search input is visible and enabled
  When the user submits the search without entering any text
  Then no-results heading is not displayed
  And the user remains on or near the homepage
```
**Traceability:** TC-83226 | AC-02 | Type: negative

---

## Story TC-83227: Home Page — Search for 'vitamin' via Enter key returns relevant results

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Typing 'vitamin' and pressing Enter submits the search and changes URL to /search?q=vitamin
- AC-02: At least one heading (h2 or h3 in main) containing 'vitamin' (case-insensitive) is visible

---

### FTC_01_03_01 — Valid search via Enter key returns relevant product results [Positive]

```gherkin
@FE @home-page @search @results @P0
Scenario: TC-83227 - Search for vitamin via Enter key returns relevant results
  Given the user has navigated to the London Drugs UAT homepage
  And the search input is visible and enabled
  When the user clicks the search input field
  And the user types "vitamin" in the search input
  And the user presses Enter to submit the search
  And the page loading is unblocked after search
  Then the URL changes to include "/search?q=vitamin" or equivalent search path
  And at least one h2 or h3 heading in the main content area contains "vitamin" (case-insensitive)
```
**Traceability:** TC-83227 | AC-01, AC-02 | Type: positive

---

### FTC_01_03_02 — Search results count is greater than zero for valid term [Boundary]

```gherkin
@FE @home-page @search @results @P1
Scenario: TC-83227-B - Search results count is greater than zero for vitamin search
  Given the user has performed a search for "vitamin" on the homepage
  When the search results page has loaded
  Then the count of headings matching "vitamin" is greater than zero
  And the search results are rendered in the main content area
```
**Traceability:** TC-83227 | AC-02 | Type: boundary

---

### FTC_01_03_03 — Search submitted via button click also returns relevant results [Negative]

```gherkin
@FE @home-page @search @results @P2
Scenario: TC-83227-N - Search is not submitted when Enter is pressed before React hydration
  Given the user has navigated to the London Drugs UAT homepage
  When the user attempts to type in the search input before React hydration completes
  Then the search input does not accept the input
  And no search is submitted prematurely
```
**Traceability:** TC-83227 | AC-01 | Type: negative

---

## Story TC-83228: Home Page — 'Select Your Store' and 'Find All Stores by Province' navigation

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Clicking 'Select Your Store' header link navigates to /stores and shows 'Find a Store Near You' h1
- AC-02: Clicking 'Find All Stores by Province' link navigates to /stores/all-stores
- AC-03: Province heading (e.g. 'British Columbia') is visible on the all-stores page

---

### FTC_01_04_01 — Select Your Store navigates to Store Locator page [Positive]

```gherkin
@FE @home-page @store-locator @navigation @P0
Scenario: TC-83228-A - Select Your Store link navigates to Store Locator
  Given the user has navigated to the London Drugs UAT homepage
  And the page loading overlay has been dismissed
  When the user clicks the "Select Your Store" stores link in the header "a[href='/stores']"
  And the browser navigates and DOM content is loaded
  Then the URL matches the pattern "**/stores"
  And an h1 heading "Find a Store Near You" is visible on the page
```
**Traceability:** TC-83228 | AC-01 | Type: positive

---

### FTC_01_04_02 — Find All Stores by Province navigates to all-stores page [Positive]

```gherkin
@FE @home-page @store-locator @navigation @P0
Scenario: TC-83228-B - Find All Stores by Province link navigates to all-stores page
  Given the user is on the Store Locator page "/stores"
  When the user clicks the "Find All Stores by Province" link "a[href*='all-stores']"
  And the browser navigates and DOM content is loaded
  Then the URL matches the pattern "**/stores/all-stores"
  And a province heading such as "British Columbia" or "Alberta" is visible on the page
```
**Traceability:** TC-83228 | AC-02, AC-03 | Type: positive

---

### FTC_01_04_03 — All-stores page does not render province content via direct URL only [Boundary]

```gherkin
@FE @home-page @store-locator @spa-navigation @P1
Scenario: TC-83228-C - Province content requires SPA navigation not direct URL load
  Given the user directly navigates to "/stores/all-stores" via URL bar
  Then the province store list may not render (spinner shown)
  And proper content renders only after SPA navigation from /stores
```
**Traceability:** TC-83228 | AC-03 | Type: boundary

---

### FTC_01_04_04 — Header store link is not present before page hydration [Negative]

```gherkin
@FE @home-page @store-locator @navigation @P2
Scenario: TC-83228-N - Store link is unavailable during loading overlay
  Given the user has navigated to the London Drugs UAT homepage
  When the loading overlay is active and has not been dismissed
  Then the header "Select Your Store" link may not be interactable
```
**Traceability:** TC-83228 | AC-01 | Type: negative

---

## Story TC-83229: Home Page — Mini cart icon opens cart panel and 'View Cart' navigates to cart

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: After adding a product to cart, the mini cart badge shows an item count
- AC-02: Clicking the mini cart icon opens the mini cart panel
- AC-03: Clicking 'View Cart' inside the mini cart navigates to the /cart page
- AC-04: The cart page shows the added product item

---

### FTC_01_05_01 — Mini cart badge shows count after adding product [Positive]

```gherkin
@FE @home-page @mini-cart @cart @P0
Scenario: TC-83229-A - Mini cart badge shows item count after product is added
  Given the user has added a product to the cart via the PDP
  And the user has navigated back to the homepage
  And React hydration is complete (search input is visible and enabled)
  When the mini cart badge element "div[class*='bottom-1']" inside the mini cart button is visible
  Then the item count badge is visible in the header cart icon
```
**Traceability:** TC-83229 | AC-01 | Type: positive

---

### FTC_01_05_02 — Clicking mini cart icon opens mini cart panel [Positive]

```gherkin
@FE @home-page @mini-cart @P0
Scenario: TC-83229-B - Clicking mini cart icon opens the mini cart panel
  Given the mini cart badge is visible with an item count
  When the user clicks the mini cart icon "button[aria-label='Show Mini Cart Items']"
  Then the mini cart panel "div[class*='z-50'][class*='min-w-80']" is visible
```
**Traceability:** TC-83229 | AC-02 | Type: positive

---

### FTC_01_05_03 — View Cart button inside mini cart navigates to cart page [Positive]

```gherkin
@FE @home-page @mini-cart @cart @P0
Scenario: TC-83229-C - View Cart button navigates to the cart page
  Given the mini cart panel is open and visible
  When the user clicks the "View Cart" button inside the mini cart panel
  Then the URL matches "/cart"
  And an h1 heading "Cart" is visible on the page
  And the added product item is listed in the cart
```
**Traceability:** TC-83229 | AC-03, AC-04 | Type: positive

---

### FTC_01_05_04 — Mini cart panel does not open when cart is empty [Negative]

```gherkin
@FE @home-page @mini-cart @P1
Scenario: TC-83229-N - Mini cart shows empty state when no products in cart
  Given the user has not added any products to the cart
  And the user is on the homepage
  When the user clicks the mini cart icon
  Then either the mini cart panel opens showing an empty state
  Or the mini cart badge is not visible
```
**Traceability:** TC-83229 | AC-01 | Type: negative

---

### FTC_01_05_05 — Mini cart button text is 'View Cart' not 'Proceed to Checkout' in UAT [Boundary]

```gherkin
@FE @home-page @mini-cart @uat-specific @P1
Scenario: TC-83229-B2 - UAT environment shows View Cart button text not Proceed to Checkout
  Given the mini cart panel is open in the UAT environment
  Then the primary button inside the panel has the text "View Cart"
  And the button does not display "Proceed to Checkout"
```
**Traceability:** TC-83229 | AC-03 | Type: boundary

---

## Story TC-83230: Home Page — Hamburger button opens Mega Menu navigation panel

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Clicking the hamburger button opens the mega menu container
- AC-02: The hamburger button remains visible after the menu opens

---

### FTC_01_06_01 — Hamburger button opens mega menu [Positive]

```gherkin
@FE @home-page @mega-menu @navigation @P0
Scenario: TC-83230 - Hamburger button click opens the mega menu panel
  Given the user has navigated to the London Drugs UAT homepage
  And the page loading overlay has been dismissed
  When the user clicks the visible hamburger menu button "button[aria-label='Opens Mega Menu']:visible"
  Then the mega menu container "div[class*='bg-txtmegamenu-secondary']" is visible
  And the hamburger button "button[aria-label='Opens Mega Menu']" is still visible
```
**Traceability:** TC-83230 | AC-01, AC-02 | Type: positive

---

### FTC_01_06_02 — Three DOM copies of hamburger button exist for breakpoints [Boundary]

```gherkin
@FE @home-page @mega-menu @responsive @P1
Scenario: TC-83230-B - Only the visible hamburger button at Desktop viewport is interactable
  Given the user is on the homepage at Desktop Chrome viewport
  When the test queries for the hamburger button "button[aria-label='Opens Mega Menu']"
  Then exactly one of the three DOM copies is visible at the current viewport
  And only the visible copy should be used for interaction
```
**Traceability:** TC-83230 | AC-01 | Type: boundary

---

### FTC_01_06_03 — Mega menu closes when hamburger is clicked again [Negative]

```gherkin
@FE @home-page @mega-menu @navigation @P2
Scenario: TC-83230-N - Mega menu can be dismissed or toggled
  Given the mega menu panel is open and visible
  When the user clicks the hamburger button again or clicks outside the menu
  Then the mega menu container is no longer visible
```
**Traceability:** TC-83230 | AC-01 | Type: negative

---

## Story TC-83231: Home Page — Main navigation links are visible and redirect correctly

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Deals and Events link has href `/category/deals-and-events/c/1027`
- AC-02: Services link has href `/our-services`
- AC-03: Flyers link has href `/flyer`
- AC-04: Gift Registry link has href `/myaccount/wishlist#registry`

---

### FTC_01_07_01 — All main navigation links are present with correct hrefs [Positive]

```gherkin
@FE @home-page @navigation @links @P0
Scenario: TC-83231 - Main navigation links are visible with correct hrefs
  Given the user has navigated to https://www.londondrugs.com
  When the page has loaded
  Then the Deals and Events link with href "/category/deals-and-events/c/1027" is present
  And the Services link with href "/our-services" is present
  And the Flyers link with href "/flyer" is present
  And the Gift Registry link with href "/myaccount/wishlist#registry" is present
```
**Traceability:** TC-83231 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_01_07_02 — Navigation links are absent when page fails to load [Negative]

```gherkin
@FE @home-page @navigation @links @P2
Scenario: TC-83231-N - Navigation links not present if header fails to render
  Given the user navigates to the homepage but the header component fails to render
  Then the navigation links for Deals, Services, Flyers, and Gift Registry are not visible
```
**Traceability:** TC-83231 | AC-01 | Type: negative

---

## Story TC-83232: Home Page — Newsletter signup in footer accepts valid email and confirms via API

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: User scrolls to the newsletter section in the footer
- AC-02: User enters a valid email address and clicks 'SIGN UP'
- AC-03: Newsletter subscription API responds successfully
- AC-04: Success message is visible after signup

---

### FTC_01_08_01 — Newsletter signup with valid email shows success message [Positive]

```gherkin
@FE @home-page @newsletter @footer @P0
Scenario: TC-83232 - Newsletter signup with valid email triggers API success
  Given the user has navigated to https://www.londondrugs.com
  When the user scrolls to the newsletter section in the footer
  And the user enters a valid email address in the email input field
  And the user clicks the "SIGN UP" button
  And the newsletter subscription API response is received
  Then a success message or confirmation is visible to the user
```
**Traceability:** TC-83232 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_01_08_02 — Newsletter signup with invalid email format shows error [Negative]

```gherkin
@FE @home-page @newsletter @footer @validation @P1
Scenario: TC-83232-N1 - Newsletter signup with invalid email format is rejected
  Given the user has navigated to the newsletter section in the footer
  When the user enters an invalid email format (e.g. "notanemail") in the email input
  And the user clicks the "SIGN UP" button
  Then the subscription API call is not made or returns an error
  And a validation error or failure message is shown to the user
```
**Traceability:** TC-83232 | AC-02 | Type: negative

---

### FTC_01_08_03 — Newsletter section requires scroll to become visible [Boundary]

```gherkin
@FE @home-page @newsletter @footer @scroll @P1
Scenario: TC-83232-B - Newsletter input becomes visible only after scrolling to footer
  Given the user is at the top of the London Drugs homepage
  When the newsletter section in the footer is outside the visible viewport
  Then the newsletter email input "div.bg-primary input[type='email']" is not visible
  When the user scrolls down to the footer newsletter section
  Then the newsletter email input becomes visible and enabled
```
**Traceability:** TC-83232 | AC-01 | Type: boundary

---

### FTC_01_08_04 — Newsletter signup with empty email shows validation error [Negative]

```gherkin
@FE @home-page @newsletter @footer @validation @P1
Scenario: TC-83232-N2 - Newsletter signup with empty email does not submit
  Given the user has scrolled to the newsletter section in the footer
  When the user clicks the "SIGN UP" button without entering an email address
  Then the subscription API call is not made
  And a required-field or validation error is shown
```
**Traceability:** TC-83232 | AC-02 | Type: negative

---

### FTC_01_08_05 — Newsletter API error response shows failure feedback [Negative]

```gherkin
@FE @home-page @newsletter @footer @api-failure @P2
Scenario: TC-83232-N3 - Newsletter API failure shows error feedback to user
  Given the user has entered a valid email and clicked SIGN UP
  When the newsletter subscription API returns an error response
  Then the user sees an error or failure message
  And the success state is not displayed
```
**Traceability:** TC-83232 | AC-03, AC-04 | Type: negative
