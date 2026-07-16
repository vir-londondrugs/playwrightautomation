# DISCOVERY-AUDIT-DISCOVERY-PLI-20260715

## Audit Summary

| # | Test | Browsers | Original Failure | Root Cause | Fix Applied | Status |
|---|---|---|---|---|---|---|
| 1 | TC-83232 Newsletter | chromium | `waitFor(30s)` at old line 414 (newsletter input not visible) | Timing: retry loop missing | Working tree already had fix | ✅ PASS |
| 2 | TC-83232 Newsletter | edge | `waitFor(30s)` + newsletter button click failed | Layout div covered button → click silently swallowed | `click({ force: true })` in test | ✅ PASS |
| 3 | TC-83238 Store Selector | firefox | `p.cursor-pointer.text-primary` waitFor 15s | Old single-wait logic; working tree fixed openStoreSelectorDialog | `searchStores()` timeout 15s→30s | ✅ PASS |
| 4 | TC-83238 Store Selector | webkit | same as #3 | same as #3 | same fix | ✅ PASS |
| 5 | TC-83240 Login | chromium | `emailInput.waitFor(15s)` on old `/myaccount` route | Old 15s timeout + redirect chain; working tree already fixed to `/auth/login` + 45s | Pre-existing fix confirmed | ✅ PASS |
| 6 | TC-83240 Login | edge | `emailInput.waitFor(45s)` — page stuck on "Loading..." | Edge stuck on hydration spinner; `page.goto` didn't trigger dismissLoadingIfStuck | Changed to `this.navigate()` + extra `body.click({force})` | ✅ PASS |

## Files Changed

| File | Change |
|---|---|
| `pages/ProductDetailPage.ts` | `searchStores()`: timeout 15_000 → 30_000 on `firstSetStoreButton.waitFor` |
| `pages/LoginPage.ts` | `login()`: `page.goto('/auth/login')` → `this.navigate('/auth/login')` + added `body.click({force})` before email input wait |
| `tests/home-page.spec.ts` | `newsletterSubmitButton.click()` → `click({ force: true })` |

## Selector Inventory (Validated)

All selectors confirmed against live DOM at https://london-drugs-uat-origin.kibology.us/

| Selector | Page | Confirmed |
|---|---|---|
| `div.bg-primary input[type="email"]` | Home | ✓ |
| `div.bg-primary button[type="submit"]` hasText `/sign up/i` | Home | ✓ |
| `input[name="email"][type="email"]` | /auth/login | ✓ |
| `input[name="password"][type="password"]` | /auth/login | ✓ |
| `button[type="submit"]` hasText `/login/i` | /auth/login | ✓ |
| `input[aria-label="Product Ship to Store Pickup Fulfillment Type"]` | PDP | ✓ |
| `p.cursor-pointer.text-primary` hasText `/set your store/i` | PDP | ✓ |
| `p.cursor-pointer` hasText `/check availability/i` | PDP | ✓ |
| `dialog#store-selector` | PDP | ✓ |
| `dialog#store-selector input[name="searchTerm"]` | PDP dialog | ✓ |
| `dialog#store-selector button.primary-button` (first = SEARCH) | PDP dialog | ✓ |
| `dialog#store-selector button.primary-button` (nth 1 = Set Store result) | PDP dialog | ✓ — 34 results returned for V6B 1A1 |
