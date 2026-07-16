# London Drugs UAT -- EPIC-02: PLP / Search Functional Tests
Priority: P0 | MVP: Yes | Stories: 3
Source: UAT Regression Testing Master Plan (TC IDs 83233, 83234, 83248)
---

## Story TC-83233: PLP — Applying first available filter triggers API call and reflects filter in URL

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to /search?text=lipstick loads the page with search results
- AC-02: The filter panel loads after the results page renders
- AC-03: Applying the first available filter option sends an API call
- AC-04: The URL reflects the active filter after applying

---

### FTC_02_01_01 — Applying first filter on lipstick PLP triggers API call and updates URL [Positive]

```gherkin
@FE @plp @filter @search @P0
Scenario: TC-83233 - Applying first available filter on lipstick search updates URL
  Given the user navigates to "https://www.londondrugs.com/search?text=lipstick"
  And the search results page loads with products visible
  When the filter panel has loaded
  And the user applies the first available filter option
  And the filtered results API call completes
  Then the URL reflects the applied filter parameter
  And the product listing reflects the filtered results
```
**Traceability:** TC-83233 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_02_01_02 — Applying multiple filters accumulates filter parameters in URL [Positive]

```gherkin
@FE @plp @filter @search @P0
Scenario: TC-83233-A2 - Applying multiple filters on lipstick PLP accumulates filters in URL
  Given the user is on the lipstick search PLP with at least two filter options available
  When the user applies the first available filter
  And the user applies a second available filter
  Then the URL contains both filter parameters
  And the product listing reflects all applied filters
```
**Traceability:** TC-83233 | AC-04 | Type: positive

---

### FTC_02_01_03 — Filter panel is visible after page load [Boundary]

```gherkin
@FE @plp @filter @load-order @P1
Scenario: TC-83233-B - Filter panel renders after search results are loaded
  Given the user navigates to "https://www.londondrugs.com/search?text=lipstick"
  When the search results have fully loaded
  Then the filter panel is visible on the page
  And at least one filter option is available to select
```
**Traceability:** TC-83233 | AC-02 | Type: boundary

---

### FTC_02_01_04 — Removing applied filter on lipstick PLP restores unfiltered results [Negative]

```gherkin
@FE @plp @filter @reset @P1
Scenario: TC-83233-N - Removing an applied filter restores unfiltered URL and results
  Given the user has applied a filter on the lipstick PLP
  And the URL reflects the filter parameter
  When the user removes the applied filter
  Then the URL no longer contains the filter parameter
  And the product listing is restored to unfiltered results
```
**Traceability:** TC-83233 | AC-04 | Type: negative

---

### FTC_02_01_05 — No results shown when filter combination eliminates all products [Negative]

```gherkin
@FE @plp @filter @no-results @P2
Scenario: TC-83233-N2 - Filter combination that yields no results shows empty state
  Given the user is on the lipstick search PLP
  When the user applies a filter combination that yields zero products
  Then a no-results message or empty product grid is displayed
  And the URL still reflects the applied filter parameters
```
**Traceability:** TC-83233 | AC-04 | Type: negative

---

## Story TC-83234: PLP — Selecting 'Price: Low to High' sort triggers API call and reflects in URL

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to /search?text=vitamins loads search results
- AC-02: Sort control is visible and available after page loads
- AC-03: Selecting 'Price: Low to High' option sends a sorted results API call
- AC-04: The URL reflects the active sort parameter after selection

---

### FTC_02_02_01 — Selecting Price Low to High sort updates URL and results [Positive]

```gherkin
@FE @plp @sort @search @P0
Scenario: TC-83234 - Selecting Price Low to High sort on vitamins PLP updates URL
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  And the search results page loads with products visible
  When the sort control has loaded
  And the user selects the "Price: Low to High" sorting option
  And the sorted results API call completes
  Then the URL reflects the active sort parameter
  And the product listing is sorted by price from lowest to highest
```
**Traceability:** TC-83234 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_02_02_02 — Switching sort from 'Price: Low to High' to 'Price: High to Low' updates URL [Positive]

```gherkin
@FE @plp @sort @search @P1
Scenario: TC-83234-A2 - Switching sort from Price Low to High to Price High to Low updates results
  Given the user is on the vitamins search PLP with "Price: Low to High" sort active
  When the user selects the "Price: High to Low" sorting option
  And the sorted results API call completes
  Then the URL reflects the new sort parameter
  And the product listing is sorted by price from highest to lowest
```
**Traceability:** TC-83234 | AC-04 | Type: positive

---

### FTC_02_02_03 — Sort control is visible after page load [Boundary]

```gherkin
@FE @plp @sort @load-order @P1
Scenario: TC-83234-B - Sort control renders after vitamins search results are loaded
  Given the user navigates to "https://www.londondrugs.com/search?text=vitamins"
  When the search results have fully loaded
  Then the sort control/dropdown is visible on the page
  And it contains at least the "Price: Low to High" option
```
**Traceability:** TC-83234 | AC-02 | Type: boundary

---

### FTC_02_02_04 — Default sort order is applied before any user selection [Negative]

```gherkin
@FE @plp @sort @default @P2
Scenario: TC-83234-N - Default sort is applied without user interaction
  Given the user navigates to the vitamins search PLP for the first time
  When no sort option has been selected by the user
  Then the URL does not contain an explicit sort parameter
  Or the URL contains the default sort parameter
  And the products are displayed in the default order
```
**Traceability:** TC-83234 | AC-04 | Type: negative

---

## Story TC-83248: Deals and Events — City filter 'Vancouver' loads filtered deals via API

**Story tag:** [FE]
**Acceptance Criteria:**
- AC-01: Navigating to /category/deals-and-events/c/1027 loads the Deals and Events page
- AC-02: The city selector is visible and available
- AC-03: Selecting 'Vancouver' from the selector triggers a filtered API call
- AC-04: Deals or events are visible after city selection

---

### FTC_02_03_01 — Selecting Vancouver city filter loads filtered deals and events [Positive]

```gherkin
@FE @plp @deals-events @city-filter @P0
Scenario: TC-83248 - Selecting Vancouver from city filter loads filtered deals and events
  Given the user navigates to "https://www.londondrugs.com/category/deals-and-events/c/1027"
  And the Deals and Events page loads
  When the city selector control has loaded
  And the user selects "Vancouver" as the city
  And the filtered events API call completes
  Then deals or events relevant to Vancouver are visible on the page
```
**Traceability:** TC-83248 | AC-01, AC-02, AC-03, AC-04 | Type: positive

---

### FTC_02_03_02 — City selector is visible on Deals and Events page load [Boundary]

```gherkin
@FE @plp @deals-events @city-filter @P1
Scenario: TC-83248-B - City selector control renders on Deals and Events page
  Given the user navigates to the Deals and Events page
  When the page has loaded
  Then the city selector control is visible
  And "Vancouver" is an available option in the selector
```
**Traceability:** TC-83248 | AC-02 | Type: boundary

---

### FTC_02_03_03 — Selecting a city with no events shows empty state [Negative]

```gherkin
@FE @plp @deals-events @city-filter @no-results @P2
Scenario: TC-83248-N - City filter with no active deals shows empty or no-events state
  Given the user is on the Deals and Events page
  When the user selects a city for which no deals or events currently exist
  Then an empty state or "no events" message is displayed
  And no deals cards are rendered
```
**Traceability:** TC-83248 | AC-04 | Type: negative
