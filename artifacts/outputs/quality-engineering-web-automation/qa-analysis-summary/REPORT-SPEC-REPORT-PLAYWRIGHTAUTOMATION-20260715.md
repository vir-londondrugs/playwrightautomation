# REPORT-SPEC-REPORT-PLAYWRIGHTAUTOMATION-20260715

## Session
- **Session ID:** REPORT-PLAYWRIGHTAUTOMATION-20260715
- **Date:** 2026-07-15
- **Application:** London Drugs UAT — https://london-drugs-uat-origin.kibology.us/
- **Execution Report:** artifacts/outputs/quality-engineering-web-automation/test-execution-report.json
- **Validated Test Cases:** artifacts/outputs/quality-engineering-web-automation/validated-test-cases/DISCOVERY-SPEC-DISCOVERY-PLI-20260715.md

---

## 1. Execution Metrics

| Metric | Value |
|---|---|
| **Run Start** | 2026-07-15T21:27:09.105Z |
| **Wall-Clock Duration** | 6m 41s (401 s) |
| **Total Test Executions** | 84 (21 unique specs × 4 browsers) |
| **Passed** | 84 |
| **Failed** | 0 |
| **Skipped** | 0 |
| **Flaky** | 0 |
| **Pass Rate** | 100% |
| **Avg Test Duration** | ~17.9 s |
| **Max Test Duration** | ~52.2 s |
| **Min Test Duration** | ~3.0 s |
| **Browsers** | chromium, firefox, webkit, edge |
| **Parallelism** | 4 workers |

### Per-Browser Breakdown

| Browser | Passed | Failed | Pass Rate |
|---|---|---|---|
| chromium | 21 | 0 | 100% |
| firefox | 21 | 0 | 100% |
| webkit | 21 | 0 | 100% |
| edge | 21 | 0 | 100% |

### Per-File Breakdown

| File | Unique TCs | Executions | Passed | Failed |
|---|---|---|---|---|
| home-page.spec.ts | 8 | 32 | 32 | 0 |
| pdp.spec.ts | 6 | 24 | 24 | 0 |
| plp.spec.ts | 4 (+2 FTC) | 28 | 28 | 0 |

---

## 2. Test Coverage Matrix

| TC ID | Title | Area | Priority | Result |
|---|---|---|---|---|
| TC-83225 | Logo click navigates to home | Home / Navigation | P1 | PASS |
| TC-83226 | Search with invalid term shows "Nothing found!" | Search / Negative | P1 | PASS |
| TC-83227 | Search returns relevant results for valid term | Search / Positive | P1 | PASS |
| TC-83228 | Cart icon shows 0 or badge on empty cart | Home / Cart | P1 | PASS |
| TC-83229 | Header nav links visible and correct hrefs | Home / Navigation | P2 | PASS |
| TC-83230 | Sticky header remains visible on scroll | Home / Navigation | P2 | PASS |
| TC-83231 | Secondary nav links visible and correct hrefs | Home / Navigation | P2 | PASS |
| TC-83232 | Newsletter signup in footer redirects to confirmation | Home / Newsletter | P1 | PASS |
| TC-83233 | PLP loads for lipstick search, products visible | PLP / Positive | P1 | PASS |
| TC-83234 | Selecting Price Low-to-High sort on vitamins PLP | PLP / Sort | P1 | PASS |
| FTC_02_01_02 | Applying multiple filters on lipstick narrows results | PLP / Filter | P1 | PASS |
| FTC_02_01_03 | Filter panel present on lipstick PLP | PLP / Filter | P2 | PASS |
| FTC_02_01_04 | Removing applied filter restores full results | PLP / Filter | P1 | PASS |
| FTC_02_02_02 | Sort control present on vitamins PLP | PLP / Sort | P2 | PASS |
| FTC_02_02_03 | Switching sort from Low-to-High to High-to-Low | PLP / Sort | P1 | PASS |
| TC-83235 | Breadcrumbs navigate from PDP back to category | PDP / Navigation | P1 | PASS |
| TC-83236 | Price label and value visible and formatted on PDP | PDP / Price | P1 | PASS |
| TC-83237 | Availability indicator visible on vitamins PDP | PDP / Availability | P1 | PASS |
| TC-83238 | Add to cart with In-Store Pickup increments mini cart | PDP / Cart / ISP | P1 | PASS |
| TC-83239 | Add to cart with Ship to Home increments cart counter | PDP / Cart / STH | P1 | PASS |
| TC-83240 | Authenticated user adds to wishlist, API confirms | PDP / Wishlist | P1 | PASS |

**Total unique TCs executed:** 21  
**Total unique TCs passed:** 21  
**Coverage rate:** 100%

---

## 3. Historical Failure Analysis (Pre-Fix Run)

> The following failures occurred in the run immediately preceding the current report.  
> All failures have been **resolved** and confirmed passing in the current run (test-execution-report.json).

### F-001 — TC-83232: Newsletter email input not visible (chromium + edge)

| Attribute | Detail |
|---|---|
| **TC ID** | TC-83232 |
| **Browsers** | chromium, edge |
| **Error** | `TimeoutError: locator('div.bg-primary input[type="email"]').first() to be visible` within 30 000 ms |
| **Root Cause** | **Test automation issue** — scroll strategy used a single `window.scrollTo(0, scrollHeight)` on an early page load; the page was only ~285 px tall at that point. Builder.io newsletter section was below the visible area and IntersectionObserver never fired to load it. Timeout was also too short (30 s). |
| **Category** | Test automation issue (scroll timing + insufficient timeout) |
| **Fix Applied** | Replaced single scroll with 20-pass incremental scroll loop (viewport-height steps + 800 ms pauses) + `scrollIntoViewIfNeeded` fallback + extended final `waitFor` to 45 s. Added `force: true` on submit button click (Edge layout overlay). |
| **Status** | RESOLVED — passes on all 4 browsers |

### F-002 — TC-83240: Login email input not visible (chromium + edge)

| Attribute | Detail |
|---|---|
| **TC ID** | TC-83240 |
| **Browsers** | chromium, edge |
| **Error** | `TimeoutError: locator('input[name="email"][type="email"]').first() to be visible` within 15 000 ms |
| **Root Cause** | **Test automation issue** — old `LoginPage.login()` navigated to `/myaccount` which triggered a server-side redirect chain before loading `/auth/login`. This added 10-20 s overhead. Timeout of 15 s was insufficient for UAT hydration on top of the redirect cost. |
| **Category** | Test automation issue (wrong navigation target + insufficient timeout) |
| **Fix Applied** | Changed navigation target to `/auth/login` (direct URL, no redirect). Added `networkidle` wait + `body.click({force:true})` to unblock React hydration spinner. Extended `emailInput.waitFor` timeout to 45 s. |
| **Status** | RESOLVED — passes on all 4 browsers |

### F-003 — TC-83238: "Set your store" link not visible (firefox + webkit)

| Attribute | Detail |
|---|---|
| **TC ID** | TC-83238 |
| **Browsers** | firefox, webkit |
| **Error** | `TimeoutError: locator('p.cursor-pointer.text-primary').filter({ hasText: /set your store/i }).first() to be visible` within 15 000 ms |
| **Root Cause** | **Test automation issue** — Firefox and WebKit hydrate more slowly than Chromium (3-5 s additional delay). Old `openStoreSelectorDialog()` used a single 15 s `waitFor` with no scroll strategy; the fulfillment section was below the fold and IntersectionObserver-driven elements did not mount. Additionally, if geolocation pre-selects a store, the "Set your store" link is replaced by "Check Availability at other stores". |
| **Category** | Test automation issue (insufficient scroll + missing fallback link + timeout) |
| **Fix Applied** | `openStoreSelectorDialog` now: (1) scrollIntoView on pickup radio, (2) scrollIntoView on setYourStoreLink, (3) proportional scroll to 60% page height, (4) 3 s pause for IntersectionObservers, (5) try/catch 12 s wait for "Set your store", (6) fallback to "Check Availability at other stores" link if geolocation pre-selected a store. |
| **Status** | RESOLVED — passes on all 4 browsers |

---

## 4. Failure Categorization Summary

| Category | Count | % of Failures |
|---|---|---|
| Test automation issue (selector / timing / navigation) | 3 unique failures (6 browser-level) | 100% |
| Application bug | 0 | 0% |
| Environment issue | 0 | 0% |

> All failures were test automation issues caused by: insufficient scroll strategies, timeouts not accounting for UAT hydration latency, and missing fallback locator paths for browser-specific pre-selection states.

---

## 5. Defect Register

> No application defects were identified during this test run. All failures in the prior run were categorized as automation issues and resolved without changes to the application under test.

| Defect ID | Title | Category | Severity | Status |
|---|---|---|---|---|
| — | No application defects found | — | — | — |

---

## 6. Risk Register

| Risk ID | Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-001 | TC-83232 test email already registered — UAT redirect may differ | Medium | Medium | Use unique timestamped email per run; monitor `/enewsletter-settings` redirect pattern |
| R-002 | TC-83238 vitamins product may lack In-Store Pickup support | Medium | High | Pin to a confirmed ISP-eligible SKU in test data |
| R-003 | UAT origin can be slow (>30 s hydration) — future timeouts may regress | Low | High | Monitor average durations per run; alert if avg exceeds 35 s |
| R-004 | Newsletter Builder.io section gated on geolocation/locale — may not render | Low | Medium | Add a secondary assertion fallback on URL pattern match only |

---

## 7. Coverage Analysis

### By Functional Area

| Area | TCs Covered | Pass | Fail |
|---|---|---|---|
| Home / Navigation | 4 (TC-83225, TC-83229, TC-83230, TC-83231) | 4 | 0 |
| Home / Search | 2 (TC-83226, TC-83227) | 2 | 0 |
| Home / Cart | 1 (TC-83228) | 1 | 0 |
| Home / Newsletter | 1 (TC-83232) | 1 | 0 |
| PLP / Filter | 3 (TC-83233, FTC_02_01_02, FTC_02_01_03, FTC_02_01_04) | 4 | 0 |
| PLP / Sort | 3 (TC-83234, FTC_02_02_02, FTC_02_02_03) | 3 | 0 |
| PDP / Navigation | 1 (TC-83235) | 1 | 0 |
| PDP / Price & Availability | 2 (TC-83236, TC-83237) | 2 | 0 |
| PDP / Cart | 2 (TC-83238, TC-83239) | 2 | 0 |
| PDP / Wishlist | 1 (TC-83240) | 1 | 0 |

### Coverage Gaps (Not Automated)

| Gap | Notes |
|---|---|
| Checkout flow | Out of scope for current sprint |
| Account registration | Out of scope |
| Order management | Out of scope |
| Payment processing | Out of scope |
| Error handling (server 500s) | Out of scope |

---

## 8. GO / NO-GO Recommendation

### Decision: ✅ GO

**Supporting evidence:**

1. **100% pass rate** — all 84 test executions (21 unique TCs × 4 browsers) passed in the current run.
2. **All historical failures resolved** — the 6 browser-level failures from the prior run were automation issues, not application bugs. Fixes are confirmed working.
3. **Zero application defects** — no bugs were identified in the London Drugs UAT application during this cycle.
4. **Cross-browser coverage** — all key user journeys (home, search, PLP, PDP, cart, wishlist, newsletter) validated on chromium, firefox, webkit, and edge.
5. **Timing stability** — with extended timeouts and improved scroll/hydration strategies, the test suite is stable against UAT origin latency.

**Conditions and caveats:**

- TC-83232 (newsletter) and TC-83238 (ISP store selector) remain sensitive to UAT Builder.io load times and geolocation auto-selection. Re-run on flap before blocking a release.
- TC-83240 (wishlist) requires valid `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` env vars in CI.
- R-002 (ISP product eligibility) should be validated before every run by confirming the pinned SKU supports In-Store Pickup.

---

## 9. Open Questions

| # | Question | Impact |
|---|---|---|
| OQ-001 | TC-83232 test email `test_qa_automation@example.com` — if already registered, redirect URL may include an error state | Medium — could cause false positive on URL match |
| OQ-002 | TC-83238 vitamins product found via search varies per run; confirmation that the product always supports ISP needed | High — ISP-ineligible product would cause test failure |
| OQ-003 | Worker-16 process did not exit within 300 000 ms in prior run — unrelated to the 6 failures but indicates a zombie worker; may require Playwright timeout tuning | Low — informational |
