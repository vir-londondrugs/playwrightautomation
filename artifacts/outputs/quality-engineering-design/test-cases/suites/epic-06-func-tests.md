# London Drugs UAT -- EPIC-06: Store Locator Functional Tests
Priority: P1 | MVP: No | Stories: 2
Source: UAT Regression Testing Master Plan (TC IDs 83245–83246)
---

## Story TC-83245: Store Locator — Page loads with heading and 'Find All Stores' link visible

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to /stores loads the Store Locator page
- AC-02: 'Find a Store Near You' heading is visible
- AC-03: 'Find All Stores' link is visible on the page

---

### FTC_06_01_01 — Store Locator page loads with heading and Find All Stores link [Positive]

```gherkin
@FE @store-locator @page-load @P1
Scenario: TC-83245 - Store Locator page loads with heading and Find All Stores link visible
  Given the user navigates to "https://www.londondrugs.com/stores"
  When the Store Locator page has loaded
  Then the "Find a Store Near You" heading is visible on the page
  And the "Find All Stores" link is visible on the page
```
**Traceability:** TC-83245 | AC-01, AC-02, AC-03 | Type: positive

---

### FTC_06_01_02 — Store Locator page is accessible directly via URL [Boundary]

```gherkin
@FE @store-locator @direct-url @P1
Scenario: TC-83245-B - Store Locator page renders correctly when accessed via direct URL
  Given the user directly navigates to "https://www.londondrugs.com/stores" via URL bar
  When the page finishes loading
  Then the page renders the Store Locator content correctly
  And the heading "Find a Store Near You" is visible
  And no spinner or loading state is stuck
```
**Traceability:** TC-83245 | AC-01 | Type: boundary

---

### FTC_06_01_03 — Store Locator page shows error or empty state when service unavailable [Negative]

```gherkin
@FE @store-locator @service-unavailable @P2
Scenario: TC-83245-N - Store Locator shows graceful error when store service is unavailable
  Given the user navigates to the Store Locator page
  When the store listing API or service is unavailable
  Then the page does not crash or show unhandled errors
  And the user sees a graceful error or fallback message
```
**Traceability:** TC-83245 | AC-01 | Type: negative

---

## Story TC-83246: Store Locator — 'Find All Stores by Province' navigates to all-stores page

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: User is on the /stores page
- AC-02: Clicking 'Find All Stores by Province' link navigates to /stores/all-stores
- AC-03: The store list renders on the all-stores page
- AC-04: The URL after navigation matches /stores/all-stores

---

### FTC_06_02_01 — Find All Stores by Province navigates to all-stores page with list [Positive]

```gherkin
@FE @store-locator @all-stores @navigation @P1
Scenario: TC-83246 - Find All Stores by Province link navigates to all-stores page
  Given the user navigates to "https://www.londondrugs.com/stores"
  And the Store Locator page has loaded
  When the user clicks the "Find All Stores by Province" link
  And the browser navigates to the all-stores page
  Then the URL matches "/stores/all-stores"
  And the store list renders on the page
```
**Traceability:** TC-83246 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_06_02_02 — All-stores page shows province sections in the store list [Boundary]

```gherkin
@FE @store-locator @all-stores @province-list @P1
Scenario: TC-83246-B - All-stores page groups stores by province
  Given the user has navigated to the all-stores page via SPA navigation
  When the store list has rendered
  Then province grouping headers (e.g. "British Columbia", "Alberta") are visible
  And each province section contains at least one store listing
```
**Traceability:** TC-83246 | AC-03 | Type: boundary

---

### FTC_06_02_03 — Direct URL load of all-stores page shows loading spinner without store content [Negative]

```gherkin
@FE @store-locator @all-stores @direct-url @spa-navigation @P2
Scenario: TC-83246-N - Direct URL access to all-stores page may show spinner without content
  Given the user directly navigates to "https://www.londondrugs.com/stores/all-stores" via URL bar
  When the page loads
  Then the store list may not render (only a spinner is shown)
  And full store content requires SPA navigation from the /stores page
```
**Traceability:** TC-83246 | AC-03 | Type: negative
