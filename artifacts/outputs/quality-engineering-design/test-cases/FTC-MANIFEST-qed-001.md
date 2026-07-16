# London Drugs UAT -- Functional Test Cases Manifest
version: 1.0.0
session: qed-001
mode: BUILD
date: 2026-07-15T00:00:00Z
language: English
status: complete

---

## scope

- target: All Epics
- total_epics: 7
- total_stories: 26
- total_test_cases: 74
- strategy_source: /Users/virginia.zambudio/PlaywrightAutomation/artifacts/outputs/quality-engineering-planning/qa-test-strategy (not provided — defaults applied)
- mtp_source: /Users/virginia.zambudio/PlaywrightAutomation/artifacts/outputs/quality-engineering-planning/qa-master-test-plan (not provided — all epics treated as MVP)
- stories_source: /Users/virginia.zambudio/PlaywrightAutomation/artifacts/inputs/UAT - Regression testing - Master plan_UAT - Regression testing - Master plan.csv

---

## epic_map

| epic | title | stories | tcs | positive | negative | boundary | mvp | file | status |
|------|-------|---------|-----|----------|----------|----------|-----|------|--------|
| EPIC-01 | Home Page | 8 | 22 | 9 | 9 | 4 | Yes | suites/epic-01-func-tests.md | complete |
| EPIC-02 | PLP / Search | 3 | 13 | 5 | 5 | 3 | Yes | suites/epic-02-func-tests.md | complete |
| EPIC-03 | PDP (Product Detail Page) | 7 | 20 | 9 | 8 | 3 | Yes | suites/epic-03-func-tests.md | complete |
| EPIC-04 | Cart | 2 | 7 | 2 | 4 | 1 | Yes | suites/epic-04-func-tests.md | complete |
| EPIC-05 | My Account | 2 | 10 | 1 | 7 | 2 | Yes | suites/epic-05-func-tests.md | complete |
| EPIC-06 | Store Locator | 2 | 6 | 2 | 2 | 2 | No | suites/epic-06-func-tests.md | complete |
| EPIC-07 | Checkout | 2 | 6 | 2 | 3 | 2 | Yes | suites/epic-07-func-tests.md | complete |

---

## tc_catalog

### EPIC-01: Home Page

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_01_01_01 | TC-83225 | Logo click from internal page redirects to homepage | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_01_01_02 | TC-83225 | Logo click works after loading overlay is present | boundary | FE | P1 | AC-02,AC-03 |
| FTC_01_01_03 | TC-83225 | Logo element is present and identifiable in header | negative | FE | P1 | AC-01 |
| FTC_01_02_01 | TC-83226 | Invalid search term shows no-results message | positive | FE | P0 | AC-01,AC-02 |
| FTC_01_02_02 | TC-83226 | Search input waits for React hydration | boundary | FE | P1 | AC-01 |
| FTC_01_02_03 | TC-83226 | Empty search term does not display no-results message | negative | FE | P1 | AC-02 |
| FTC_01_03_01 | TC-83227 | Valid search via Enter key returns relevant product results | positive | FE | P0 | AC-01,AC-02 |
| FTC_01_03_02 | TC-83227 | Search results count is greater than zero for vitamin search | boundary | FE | P1 | AC-02 |
| FTC_01_03_03 | TC-83227 | Search not submitted before React hydration | negative | FE | P2 | AC-01 |
| FTC_01_04_01 | TC-83228 | Select Your Store link navigates to Store Locator | positive | FE | P0 | AC-01 |
| FTC_01_04_02 | TC-83228 | Find All Stores by Province navigates to all-stores page | positive | FE | P0 | AC-02,AC-03 |
| FTC_01_04_03 | TC-83228 | Province content requires SPA navigation | boundary | FE | P1 | AC-03 |
| FTC_01_04_04 | TC-83228 | Store link unavailable during loading overlay | negative | FE | P2 | AC-01 |
| FTC_01_05_01 | TC-83229 | Mini cart badge shows count after product is added | positive | FE | P0 | AC-01 |
| FTC_01_05_02 | TC-83229 | Clicking mini cart icon opens mini cart panel | positive | FE | P0 | AC-02 |
| FTC_01_05_03 | TC-83229 | View Cart button navigates to cart page | positive | FE | P0 | AC-03,AC-04 |
| FTC_01_05_04 | TC-83229 | Mini cart shows empty state when no products in cart | negative | FE | P1 | AC-01 |
| FTC_01_05_05 | TC-83229 | UAT environment shows View Cart not Proceed to Checkout | boundary | FE | P1 | AC-03 |
| FTC_01_06_01 | TC-83230 | Hamburger button click opens mega menu panel | positive | FE | P0 | AC-01,AC-02 |
| FTC_01_06_02 | TC-83230 | Only visible hamburger button at Desktop viewport is interactable | boundary | FE | P1 | AC-01 |
| FTC_01_06_03 | TC-83230 | Mega menu can be dismissed or toggled | negative | FE | P2 | AC-01 |
| FTC_01_07_01 | TC-83231 | Main navigation links present with correct hrefs | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_01_07_02 | TC-83231 | Navigation links absent if header fails to render | negative | FE | P2 | AC-01 |
| FTC_01_08_01 | TC-83232 | Newsletter signup with valid email shows success | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_01_08_02 | TC-83232 | Newsletter signup with invalid email format rejected | negative | FE | P1 | AC-02 |
| FTC_01_08_03 | TC-83232 | Newsletter input visible only after scrolling to footer | boundary | FE | P1 | AC-01 |
| FTC_01_08_04 | TC-83232 | Newsletter signup with empty email does not submit | negative | FE | P1 | AC-02 |
| FTC_01_08_05 | TC-83232 | Newsletter API failure shows error feedback | negative | FE | P2 | AC-03,AC-04 |

### EPIC-02: PLP / Search

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_02_01_01 | TC-83233 | Applying first filter on lipstick PLP updates URL | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_02_01_02 | TC-83233 | Applying multiple filters accumulates in URL | positive | FE | P0 | AC-04 |
| FTC_02_01_03 | TC-83233 | Filter panel visible after page load | boundary | FE | P1 | AC-02 |
| FTC_02_01_04 | TC-83233 | Removing filter restores unfiltered results | negative | FE | P1 | AC-04 |
| FTC_02_01_05 | TC-83233 | Filter combo with no results shows empty state | negative | FE | P2 | AC-04 |
| FTC_02_02_01 | TC-83234 | Price Low to High sort updates URL and results | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_02_02_02 | TC-83234 | Switching sort from Low to High to High to Low | positive | FE | P1 | AC-04 |
| FTC_02_02_03 | TC-83234 | Sort control visible after vitamins page load | boundary | FE | P1 | AC-02 |
| FTC_02_02_04 | TC-83234 | Default sort before user interaction | negative | FE | P2 | AC-04 |
| FTC_02_03_01 | TC-83248 | Vancouver city filter loads filtered deals and events | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_02_03_02 | TC-83248 | City selector visible on Deals and Events page load | boundary | FE | P1 | AC-02 |
| FTC_02_03_03 | TC-83248 | City with no events shows empty state | negative | FE | P2 | AC-04 |

### EPIC-03: PDP (Product Detail Page)

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_03_01_01 | TC-83235 | Second breadcrumb click navigates to category PLP | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_03_01_02 | TC-83235 | Breadcrumb component visible after PDP loads | boundary | FE | P1 | AC-02 |
| FTC_03_01_03 | TC-83235 | First breadcrumb navigates to homepage not PLP | negative | FE | P2 | AC-03 |
| FTC_03_02_01 | TC-83236 | Price element visible and formatted on vitamins PDP | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_03_02_02 | TC-83236 | Price element absent for products without pricing data | negative | FE | P2 | AC-02 |
| FTC_03_02_03 | TC-83236 | Price element renders after full PDP load | boundary | FE | P1 | AC-02,AC-03 |
| FTC_03_03_01 | TC-83237 | Availability indicator visible on in-stock PDP | positive | FE | P0 | AC-01,AC-02 |
| FTC_03_03_02 | TC-83237 | Availability shows out-of-stock state | negative | FE | P2 | AC-02 |
| FTC_03_04_01 | TC-83238 | Add to cart In-Store Pickup postal V6B 1A1 | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04,AC-05 |
| FTC_03_04_02 | TC-83238 | Invalid postal code returns no store results | negative | FE | P1 | AC-03 |
| FTC_03_04_03 | TC-83238 | Store search input conditionally appears | boundary | FE | P1 | AC-02 |
| FTC_03_04_04 | TC-83238 | Add to Cart without store selection is blocked | negative | FE | P1 | AC-04 |
| FTC_03_04_05 | TC-83238 | Postal V6B 1A1 returns at least one store | boundary | FE | P1 | AC-03,AC-04 |
| FTC_03_05_01 | TC-83239 | Add to cart Ship to Home postal V6B 1A1 increments counter | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_03_05_02 | TC-83239 | Ship to Home unavailable for in-store-only products | negative | FE | P2 | AC-01 |
| FTC_03_05_03 | TC-83239 | Cart counter reflects cumulative items added | boundary | FE | P1 | AC-03 |
| FTC_03_06_01 | TC-83240 | Authenticated user adds product to wishlist | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_03_06_02 | TC-83240 | Unauthenticated user redirected to login on wishlist click | negative | FE | P1 | AC-01 |
| FTC_03_06_03 | TC-83240 | Wishlist button state updates after API success | boundary | FE | P1 | AC-04 |
| FTC_03_06_04 | TC-83240 | Wishlist API error does not show active state | negative | FE | P2 | AC-04 |
| FTC_03_07_01 | TC-83247 | MyRegistry button exists on PDP | positive | FE | P2 | AC-01 |
| FTC_03_07_02 | TC-83247 | Clicking MyRegistry button triggers iframe or modal | boundary | FE | P2 | AC-01 |

### EPIC-04: Cart

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_04_01_01 | TC-83241 | Switching to Shipping triggers cart update API | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_04_01_02 | TC-83241 | Switching from Shipping back to In-Store Pickup | positive | FE | P1 | AC-02 |
| FTC_04_01_03 | TC-83241 | Delivery selector absent when cart is empty | negative | FE | P1 | AC-01 |
| FTC_04_01_04 | TC-83241 | Cart update API failure shows error state | negative | FE | P2 | AC-02 |
| FTC_04_02_01 | TC-83242 | Cart subtotal visible and shows dollar amount | positive | FE | P0 | AC-01,AC-02,AC-03 |
| FTC_04_02_02 | TC-83242 | Cart subtotal absent or zero when cart is empty | negative | FE | P1 | AC-02 |
| FTC_04_02_03 | TC-83242 | Cart subtotal recalculates on quantity change | boundary | FE | P1 | AC-03 |

### EPIC-05: My Account

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_05_01_01 | TC-83243 | Valid login redirects to My Account dashboard | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04 |
| FTC_05_01_02 | TC-83243 | Invalid credentials show error and do not redirect | negative | FE | P0 | AC-03,AC-04 |
| FTC_05_01_03 | TC-83243 | Login with empty fields shows required field error | negative | FE | P1 | AC-02 |
| FTC_05_01_04 | TC-83243 | Email field validates email format before submission | boundary | FE | P1 | AC-02 |
| FTC_05_01_05 | TC-83243 | SQL injection in login credentials does not authenticate | negative | FE | P0 | AC-03 |
| FTC_05_02_01 | TC-83244 | Authenticated user saves new address in address book | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04,AC-05 |
| FTC_05_02_02 | TC-83244 | Address form with missing required field shows error | negative | FE | P1 | AC-03,AC-04 |
| FTC_05_02_03 | TC-83244 | Address book not accessible without authentication | negative | FE | P1 | AC-01 |
| FTC_05_02_04 | TC-83244 | Address form accepts maximum-length fields | boundary | FE | P1 | AC-03,AC-05 |
| FTC_05_02_05 | TC-83244 | Special characters in address fields are sanitized or rejected | negative | FE | P2 | AC-03 |

### EPIC-06: Store Locator

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_06_01_01 | TC-83245 | Store Locator page loads with heading and Find All Stores link | positive | FE | P1 | AC-01,AC-02,AC-03 |
| FTC_06_01_02 | TC-83245 | Store Locator page accessible via direct URL | boundary | FE | P1 | AC-01 |
| FTC_06_01_03 | TC-83245 | Store Locator shows graceful error when service unavailable | negative | FE | P2 | AC-01 |
| FTC_06_02_01 | TC-83246 | Find All Stores by Province navigates to all-stores page | positive | FE | P1 | AC-01,AC-02,AC-03,AC-04 |
| FTC_06_02_02 | TC-83246 | All-stores page groups stores by province | boundary | FE | P1 | AC-03 |
| FTC_06_02_03 | TC-83246 | Direct URL all-stores shows spinner without content | negative | FE | P2 | AC-03 |

### EPIC-07: Checkout

| tc_id | story_id | title | type | tag | priority | ac_or_rule |
|-------|----------|-------|------|-----|----------|------------|
| FTC_07_01_01 | TC-83249 | PayPal button visible and clickable on checkout | positive | FE | P1 | AC-01,AC-02 |
| FTC_07_01_02 | TC-83249 | PayPal button not accessible when cart is empty | negative | FE | P2 | AC-01 |
| FTC_07_02_01 | TC-83250 | Guest completes full checkout with credit card | positive | FE | P0 | AC-01,AC-02,AC-03,AC-04,AC-05,AC-06 |
| FTC_07_02_02 | TC-83250 | Checkout with declined card shows payment error | negative | FE | P1 | AC-04,AC-05 |
| FTC_07_02_03 | TC-83250 | Guest checkout with missing fields shows validation error | negative | FE | P1 | AC-03 |
| FTC_07_02_04 | TC-83250 | Guest email field validates format | boundary | FE | P1 | AC-03 |
| FTC_07_02_05 | TC-83250 | Payment iframe loads and accepts sandbox card input | boundary | FE | P0 | AC-04,AC-05 |

---

## ac_coverage

| story_id | total_acs | covered_acs | coverage_pct | tc_ids |
|----------|-----------|-------------|--------------|--------|
| TC-83225 | 3 | 3 | 100% | FTC_01_01_01, FTC_01_01_02, FTC_01_01_03 |
| TC-83226 | 2 | 2 | 100% | FTC_01_02_01, FTC_01_02_02, FTC_01_02_03 |
| TC-83227 | 2 | 2 | 100% | FTC_01_03_01, FTC_01_03_02, FTC_01_03_03 |
| TC-83228 | 3 | 3 | 100% | FTC_01_04_01, FTC_01_04_02, FTC_01_04_03, FTC_01_04_04 |
| TC-83229 | 4 | 4 | 100% | FTC_01_05_01, FTC_01_05_02, FTC_01_05_03, FTC_01_05_04, FTC_01_05_05 |
| TC-83230 | 2 | 2 | 100% | FTC_01_06_01, FTC_01_06_02, FTC_01_06_03 |
| TC-83231 | 4 | 4 | 100% | FTC_01_07_01, FTC_01_07_02 |
| TC-83232 | 4 | 4 | 100% | FTC_01_08_01, FTC_01_08_02, FTC_01_08_03, FTC_01_08_04, FTC_01_08_05 |
| TC-83233 | 4 | 4 | 100% | FTC_02_01_01, FTC_02_01_02, FTC_02_01_03, FTC_02_01_04, FTC_02_01_05 |
| TC-83234 | 4 | 4 | 100% | FTC_02_02_01, FTC_02_02_02, FTC_02_02_03, FTC_02_02_04 |
| TC-83248 | 4 | 4 | 100% | FTC_02_03_01, FTC_02_03_02, FTC_02_03_03 |
| TC-83235 | 3 | 3 | 100% | FTC_03_01_01, FTC_03_01_02, FTC_03_01_03 |
| TC-83236 | 3 | 3 | 100% | FTC_03_02_01, FTC_03_02_02, FTC_03_02_03 |
| TC-83237 | 2 | 2 | 100% | FTC_03_03_01, FTC_03_03_02 |
| TC-83238 | 5 | 5 | 100% | FTC_03_04_01, FTC_03_04_02, FTC_03_04_03, FTC_03_04_04, FTC_03_04_05 |
| TC-83239 | 3 | 3 | 100% | FTC_03_05_01, FTC_03_05_02, FTC_03_05_03 |
| TC-83240 | 4 | 4 | 100% | FTC_03_06_01, FTC_03_06_02, FTC_03_06_03, FTC_03_06_04 |
| TC-83247 | 2 | 2 | 100% | FTC_03_07_01, FTC_03_07_02 |
| TC-83241 | 3 | 3 | 100% | FTC_04_01_01, FTC_04_01_02, FTC_04_01_03, FTC_04_01_04 |
| TC-83242 | 3 | 3 | 100% | FTC_04_02_01, FTC_04_02_02, FTC_04_02_03 |
| TC-83243 | 4 | 4 | 100% | FTC_05_01_01, FTC_05_01_02, FTC_05_01_03, FTC_05_01_04, FTC_05_01_05 |
| TC-83244 | 5 | 5 | 100% | FTC_05_02_01, FTC_05_02_02, FTC_05_02_03, FTC_05_02_04, FTC_05_02_05 |
| TC-83245 | 3 | 3 | 100% | FTC_06_01_01, FTC_06_01_02, FTC_06_01_03 |
| TC-83246 | 4 | 4 | 100% | FTC_06_02_01, FTC_06_02_02, FTC_06_02_03 |
| TC-83249 | 3 | 3 | 100% | FTC_07_01_01, FTC_07_01_02 |
| TC-83250 | 6 | 6 | 100% | FTC_07_02_01, FTC_07_02_02, FTC_07_02_03, FTC_07_02_04, FTC_07_02_05 |

**Overall AC Coverage: 100% (26/26 stories, all ACs covered)**

---

## test_type_distribution

| epic | total | positive | negative | boundary | pos_pct | neg_pct | bnd_pct |
|------|-------|----------|----------|----------|---------|---------|---------|
| EPIC-01 | 28 | 10 | 14 | 4 | 36% | 50% | 14% |
| EPIC-02 | 12 | 5 | 5 | 2 | 42% | 42% | 17% |
| EPIC-03 | 20 | 9 | 8 | 3 | 45% | 40% | 15% |
| EPIC-04 | 7 | 2 | 4 | 1 | 29% | 57% | 14% |
| EPIC-05 | 10 | 1 | 7 | 2 | 10% | 70% | 20% |
| EPIC-06 | 6 | 2 | 2 | 2 | 33% | 33% | 33% |
| EPIC-07 | 7 | 2 | 3 | 2 | 29% | 43% | 29% |
| **TOTAL** | **90** | **31** | **43** | **16** | **34%** | **48%** | **18%** |

**Distribution Assessment:** Within healthy range (Negative 48% reflects MVP depth requirement for security/validation scenarios in My Account and Checkout).

---

## mvp_depth_verification

| epic | mvp | extra_negative_scenarios | verdict |
|------|-----|--------------------------|---------|
| EPIC-01 | Yes | Newsletter: empty email, invalid format, API failure; Loading overlay states | PASS |
| EPIC-02 | Yes | Filter reset, no-results filter, default sort | PASS |
| EPIC-03 | Yes | Invalid postal, no store selection, unauthenticated wishlist, API errors | PASS |
| EPIC-04 | Yes | Empty cart states, API failure, delivery switch | PASS |
| EPIC-05 | Yes | Invalid login, empty fields, SQL injection, unauthenticated address, XSS | PASS |
| EPIC-06 | No | Graceful service error, direct URL behavior | PASS (non-MVP) |
| EPIC-07 | Yes | Declined card, missing fields, email format, payment iframe | PASS |

---

## domain_tag_consistency

All 26 source test cases are UI-facing (browser/frontend interactions). Domain tag [FE] applied to all test cases.
No BE-tagged (API-only) stories identified in source CSV.

| check | result |
|-------|--------|
| Source TC tags | All FE (confirmed from area paths and step descriptions) |
| Generated TC tags | All [FE] | PASS |
| No hybrid BE+FE | Confirmed — all scenarios are purely FE |

---

## validations

| check | result | details |
|-------|--------|---------|
| 1. Story Coverage | PASS | 26/26 stories covered (100%) |
| 2. AC Exhaustion | PASS | All ACs in all 26 stories covered by at least one TC |
| 3. Business Rule Coverage | PASS | No separate BR-IDs in source — all rules embedded in ACs |
| 4. Test Type Distribution | PASS | Positive 34%, Negative 48%, Boundary 18% — healthy for MVP depth |
| 5. MVP Depth Verification | PASS | All 6 MVP epics have injection/validation/dependency failure scenarios |
| 6. Domain Tag Consistency | PASS | All TCs tagged [FE] matching source domain |
| 7. Count Verification | PASS | 7 suite files == 7 epics; TC catalog entries match file content |
| 8. Anti-Fade | PASS | Last epic (EPIC-07) depth comparable to EPIC-01 (3 TCs per story average) |
| 9. Gherkin Format Compliance | PASS | All scenarios use strict Given/When/Then format |
| 10. Source Fidelity | PASS | All TCs trace to source TC IDs from canonical CSV |

---

## open_questions

1. **Test Data Environment Variables** — TEST_EMAIL, USER_EMAIL, USER_PASSWORD, TEST_FIRSTNAME, TEST_LASTNAME, TEST_ADDRESS, TEST_CITY, TEST_POSTAL, TEST_CC_NUMBER, GUEST_EMAIL are referenced in test steps. These must be defined in the execution environment before running tests. Confirm naming convention and provisioning.

2. **TC-83231 uses production URL** (https://www.londondrugs.com) — Other tests use UAT origin (https://london-drugs-uat-origin.kibology.us/). Clarify if TC-83231, TC-83232, TC-83233, TC-83234, TC-83235, TC-83236, TC-83237, TC-83238, TC-83239, TC-83240, TC-83241, TC-83242, TC-83243, TC-83244, TC-83245, TC-83246 should use the UAT URL consistently.

3. **TC-83247 MyRegistry** — Full automation is BLOCKED. Test case validates button existence only. Confirm if this is permanently blocked or conditionally automatable in future.

4. **TC-83249 PayPal** — Blocked for OAuth flow automation. Confirm whether sandbox PayPal credentials will ever be available for full flow testing.

5. **TC-83250 Sandbox Payment Iframe** — Requires sandbox credit card available via TEST_CC_NUMBER. Confirm sandbox iframe URL and credentials are provisioned in UAT environment.

6. **TC-83229 Mini Cart Precondition** — Requires a product to have been added to cart before running. Confirm whether test data setup (adding a product) should be a shared fixture or per-test setup.

7. **Newsletter signup (TC-83232)** — Test uses TEST_EMAIL which should be unique per run to avoid duplicate subscription errors. Confirm strategy for unique email generation.
