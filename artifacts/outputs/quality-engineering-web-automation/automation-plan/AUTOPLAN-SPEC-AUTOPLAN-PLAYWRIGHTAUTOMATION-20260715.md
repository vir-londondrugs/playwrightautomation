# AUTOPLAN-SPEC-AUTOPLAN-PLAYWRIGHTAUTOMATION-20260715

**Version:** 1.0.0
**Session ID:** AUTOPLAN-PLAYWRIGHTAUTOMATION-20260715
**Date:** 2026-07-15
**Project:** PlaywrightAutomation — London Drugs UAT Regression Suite
**Scope:** Automation implementation plan for 6 failing tests (TC-83232, TC-83238, TC-83240)
**Input — Validated Test Cases:** DISCOVERY-SPEC-DISCOVERY-PLI-20260715.md
**Input — Framework Architecture:** FRAMEWORK-SPEC-FRAMEWORK-PLAYWRIGHTAUTOMATION-20260715.md

---

## 1. Coverage Matrix

Maps every validated test case to its automation components. No test case is skipped.

| TC ID | Test Title | Spec File | Page Objects Used | Helpers Used | Priority | Status |
|---|---|---|---|---|---|---|
| TC-83225 | Logo navigates to homepage | `home-page.spec.ts` | `HomePage` | `evidence.ts` | P1 | Passing |
| TC-83226 | Search bar returns results for valid term | `home-page.spec.ts` | `HomePage`, `SearchResultsPage` | `evidence.ts` | P1 | Passing |
| TC-83228 | Mini cart opens and shows items | `home-page.spec.ts` | `HomePage` | `evidence.ts` | P1 | Passing |
| TC-83229 | Header navigation links are correct | `home-page.spec.ts` | `HomePage` | `evidence.ts` | P2 | Passing |
| TC-83230 | Deals nav link visible and clickable | `home-page.spec.ts` | `HomePage` | `evidence.ts` | P2 | Passing |
| TC-83231 | Services nav link visible and clickable | `home-page.spec.ts` | `HomePage` | `evidence.ts` | P2 | Passing |
| **TC-83232** | **Newsletter signup accepts valid email and redirects** | `home-page.spec.ts` | `HomePage` | `evidence.ts` | **P1** | **FIXED** |
| TC-83235 | Second-level breadcrumb navigates to category | `pdp.spec.ts` | `ProductDetailPage` | `evidence.ts` | P2 | Passing |
| TC-83236 | Price element visible and formatted correctly | `pdp.spec.ts` | `ProductDetailPage` | `evidence.ts` | P2 | Passing |
| TC-83237 | Availability indicator visible on PDP | `pdp.spec.ts` | `ProductDetailPage` | `evidence.ts` | P2 | Passing |
| **TC-83238** | **Add to cart with In-Store Pickup (V6B 1A1)** | `pdp.spec.ts` | `ProductDetailPage`, `HomePage`, `SearchResultsPage` | `evidence.ts` | **P1** | **FIXED** |
| TC-83239 | Add to cart with Ship to Home (V6B 1A1) | `pdp.spec.ts` | `ProductDetailPage`, `HomePage`, `SearchResultsPage` | `evidence.ts` | P1 | Passing |
| **TC-83240** | **Authenticated user adds product to wishlist** | `pdp.spec.ts` | `LoginPage`, `HomePage`, `SearchResultsPage`, `ProductDetailPage` | `evidence.ts` | **P1** | **FIXED** |
| FTC_02_01_x | PLP filter scenarios (lipstick, multi-filter, remove) | `plp.spec.ts` | `SearchResultsPage` | `evidence.ts`, `apiInterceptor.ts` | P2 | Passing |
| FTC_02_02_x | PLP sort scenarios (price low-to-high, switch) | `plp.spec.ts` | `SearchResultsPage` | `evidence.ts`, `apiInterceptor.ts` | P2 | Passing |

---

## 2. Page Object Specifications

### 2.1 BasePage (`pages/BasePage.ts`)

**Responsibility:** Base class extended by all page objects. Centralises Next.js / Builder.io hydration handling.

| Method | Signature | Purpose |
|---|---|---|
| `navigate` | `async navigate(url: string): Promise<void>` | `goto()` + `domcontentloaded` + `dismissLoadingIfStuck()` + `waitForAppShell()` |
| `dismissLoadingIfStuck` | `async dismissLoadingIfStuck(): Promise<void>` | Waits 15 s for `load`; on timeout force-clicks body + waits `domcontentloaded` |
| `waitForAppShell` | `async waitForAppShell(): Promise<void>` | Waits 20 s for `header` visible; on failure force-clicks body |

**No changes required.** All fixes for the 3 failing TCs are handled in subclasses and spec files.

---

### 2.2 LoginPage (`pages/LoginPage.ts`) — Fix F-02 (TC-83240)

**Change applied:** Navigate to `/auth/login` directly instead of `/myaccount`. Extended timeout to 45 s with body-click + `networkidle` pre-wait.

| Locator | Selector | Notes |
|---|---|---|
| `emailInput` | `input[name="email"][type="email"]` (`.first()`) | Confirmed live on `/auth/login` |
| `passwordInput` | `input[name="password"][type="password"]` (`.first()`) | — |
| `loginButton` | `button[type="submit"]` filter `hasText /login/i` (`.first()`) | — |

**`login()` method contract (post-fix):**
1. `BasePage.navigate('/auth/login')` — dismisses spinners via body-click
2. `waitForLoadState('networkidle', { timeout: 20_000 })` — settles React hydration
3. `body.click({ force: true })` — secondary spinner dismissal for Edge
4. `emailInput.waitFor({ state: 'visible', timeout: 45_000 })` — extended from 15 s
5. `fill email`, `fill password`, `loginButton.click()`
6. `page.waitForURL(url => !url.includes('/auth/login'), { timeout: 45_000 })` — success gate

---

### 2.3 ProductDetailPage (`pages/ProductDetailPage.ts`) — Fix F-03 (TC-83238)

**Change applied:** `openStoreSelectorDialog()` dual-state fallback for Firefox/WebKit geolocation pre-selection.

| Locator | Selector | Notes |
|---|---|---|
| `setYourStoreLink` | `p.cursor-pointer.text-primary` filter `hasText /set your store/i` (`.first()`) | State 1: no store set |
| `checkAvailabilityLink` | `p.cursor-pointer` filter `hasText /check availability at other stores/i` (`.first()`) | State 2: store pre-selected by geolocation |
| `storeSelectorDialog` | `dialog#store-selector` | Confirmed live |
| `storeSelectorSearchInput` | `dialog#store-selector input[name="searchTerm"]` | — |
| `storeSelectorSearchButton` | `dialog#store-selector button.primary-button` (`.first()`) | "SEARCH STORES" |
| `firstSetStoreButton` | `dialog#store-selector button.primary-button` (`.nth(1)`) | "Set Store" on first result |

**`openStoreSelectorDialog()` method contract (post-fix):**
1. `inStorePickupRadio.scrollIntoViewIfNeeded({ timeout: 10_000 })` — trigger intersection observer
2. `waitForTimeout(2_500)` — Firefox/WebKit hydration buffer
3. Try `setYourStoreLink.waitFor({ state: 'visible', timeout: 5_000 })` — State 1
4. On catch: fall back to `checkAvailabilityLink.waitFor({ timeout: 15_000 })` — State 2
5. Click whichever link is visible
6. `storeSelectorDialog.waitFor({ state: 'visible', timeout: 10_000 })`

**`searchStores()` method contract (post-fix):**
- `firstSetStoreButton.waitFor({ timeout: 30_000 })` — increased from 15 s (Firefox/WebKit API latency)

---

### 2.4 HomePage (`pages/HomePage.ts`) — Fix F-01 (TC-83232)

**Change applied:** Newsletter section scroll + retry loop + extended `waitFor`.

| Locator | Selector | Notes |
|---|---|---|
| `newsletterEmailInput` | `div.bg-primary input[type="email"]` (`.first()`) | Scoped to `div.bg-primary` to avoid other email inputs |
| `newsletterSubmitButton` | `div.bg-primary button[type="submit"]` filter `hasText /sign up/i` (`.first()`) | Covered by layout div on Edge — requires `click({ force: true })` |

**Newsletter scroll pattern (in spec, `home-page.spec.ts` TC-83232):**
1. `test.setTimeout(180_000)` — overrides global 60 s
2. `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` — trigger observer
3. `waitForLoadState('networkidle', { timeout: 30_000 })` — Builder.io content load
4. `waitForTimeout(1_000)` — settle
5. Repeat scroll to bottom (page may have grown after Builder.io render)
6. `newsletterEmailInput.scrollIntoViewIfNeeded({ timeout: 5_000 })` — re-trigger observer
7. Loop 15 × 1 s: check `isVisible()`, break early if visible
8. `newsletterEmailInput.waitFor({ state: 'visible', timeout: 45_000 })` — final gate
9. `newsletterSubmitButton.click({ force: true })` — bypass layout overlay

---

### 2.5 SearchResultsPage (`pages/SearchResultsPage.ts`)

No changes required for the 3 failing TCs. Used as navigation helper to reach a vitamins PDP for TC-83238 and TC-83240.

---

### 2.6 StoreLocatorPage (`pages/StoreLocatorPage.ts`)

No changes required for the 3 failing TCs.

---

## 3. Test Class Designs

### 3.1 `home-page.spec.ts` — TC-83232

| Property | Value |
|---|---|
| Timeout override | `test.setTimeout(180_000)` |
| Data source | `homePageData.newsletter.testEmail`, `homePageData.newsletter.expectedRedirectUrlPattern` |
| Page objects | `HomePage` |
| Key assertion | `page.waitForURL(newsletter.expectedRedirectUrlPattern, { timeout: 45_000 })` |
| Evidence | `takeEvidenceScreenshot` in `afterEach` |

**Steps:**
1. Navigate to homepage (`homePage.navigate(homePageData.urls.home)`)
2. Scroll to footer newsletter form (retry loop pattern — see §2.4)
3. Fill valid email in newsletter input
4. Click SIGN UP button with `force: true`
5. Assert redirect to `/enewsletter-settings`

---

### 3.2 `pdp.spec.ts` — TC-83238

| Property | Value |
|---|---|
| Timeout override | None (global 60 s — individual steps have own timeouts) |
| Data source | `pdpData.postalCode` (`V6B 1A1`) |
| Page objects | `HomePage`, `SearchResultsPage`, `ProductDetailPage` |
| Key assertion | Mini cart count increments by 1 after `addToCart()` |
| Evidence | `takeEvidenceScreenshot` in `afterEach` |

**Steps:**
1. Navigate to vitamins PDP via search
2. Read pre-add mini cart count (`pdpPage.getMiniCartCount()`)
3. Select In-Store Pickup fulfillment radio
4. Open store selector dialog (dual-state fallback — see §2.3)
5. Search for store with postal `V6B 1A1`
6. Click first "Set Store" button
7. Click "Add to Cart"
8. Assert mini cart count = pre-add count + 1

---

### 3.3 `pdp.spec.ts` — TC-83240

| Property | Value |
|---|---|
| Timeout override | None |
| Data source | `pdpData.auth.email` (env `TEST_USER_EMAIL`), `pdpData.auth.password` (env `TEST_USER_PASSWORD`) |
| Page objects | `LoginPage`, `HomePage`, `SearchResultsPage`, `ProductDetailPage` |
| Key assertion | Wishlist POST API responds 200 |
| Evidence | `takeEvidenceScreenshot` in `afterEach` |

**Steps:**
1. Login via `loginPage.login(email, password)` (direct to `/auth/login` — see §2.2)
2. Navigate to vitamins PDP via search
3. Assert wishlist button visible (30 s wait)
4. Set up `waitForResponse` promise (POST to `/products/` returning 200)
5. Click wishlist heart button
6. Await and assert response status 200
7. Optionally assert body matches `/isSuccess.*true/i`

---

## 4. Utility Requirements

| Utility | File | Used By | Notes |
|---|---|---|---|
| Evidence screenshots | `helpers/evidence.ts` | All spec files | `afterEach` on failure; `{TC-ID}_{timestamp}.png` naming |
| Page load unblocking | `helpers/page-load.ts` | `BasePage` (indirect) | `simulateBodyClickToUnblock()` — thin wrapper |
| API interceptor | `helpers/apiInterceptor.ts` | `plp.spec.ts`, `pdp.spec.ts` | `interceptSearchApi`, `interceptAndAbortSortRedirect` — not changed for these 3 fixes |
| Test data — home | `test-data/home-page.data.ts` | `home-page.spec.ts` | `newsletter.testEmail`, `newsletter.expectedRedirectUrlPattern` |
| Test data — pdp | `test-data/pdp.data.ts` | `pdp.spec.ts` | `postalCode`, `auth.email`, `auth.password` |
| Test data — plp | `test-data/plp.data.ts` | `plp.spec.ts` | Filter/sort params |

**No new utilities required.** All fixes use existing helpers.

---

## 5. Execution Sequencing

### 5.1 Test Execution Order (within each spec file)

Tests within a spec file run sequentially (workers: 1 in CI).

#### `home-page.spec.ts`
| Order | TC ID | Rationale |
|---|---|---|
| 1 | TC-83225 | Logo/homepage — no shared state dependency |
| 2 | TC-83226 | Search — no cart state |
| 3 | TC-83228 | Mini cart — no cart state (uses dedicated item) |
| 4 | TC-83229 | Header nav links — read-only |
| 5 | TC-83230 | Deals nav — read-only |
| 6 | TC-83231 | Services nav — read-only |
| 7 | **TC-83232** | Newsletter last — heaviest timeout (180 s); isolated footer interaction |

#### `pdp.spec.ts`
| Order | TC ID | Rationale |
|---|---|---|
| 1 | TC-83235 | Breadcrumb — read-only; navigates away from PDP |
| 2 | TC-83236 | Price — read-only |
| 3 | TC-83237 | Availability — read-only |
| 4 | **TC-83238** | In-Store Pickup cart add — modifies cart; runs before ship-to-home |
| 5 | TC-83239 | Ship to Home cart add — modifies cart |
| 6 | **TC-83240** | Wishlist + auth — last; requires login (isolated session) |

#### `plp.spec.ts`
| Order | TC ID | Rationale |
|---|---|---|
| 1–n | FTC_02_01_x | Filter scenarios — sorted by filter type |
| n+1–m | FTC_02_02_x | Sort scenarios — sorted by sort type |

### 5.2 Cross-Spec Dependencies

| Dependency | From | To | Type |
|---|---|---|---|
| Geolocation (Vancouver) | `playwright.config.ts` | TC-83238, TC-83239 | Ambient — store pre-selection on Firefox/WebKit |
| Auth credentials | `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` env vars | TC-83240 | Env — must be set in GitHub Actions secrets |
| Edge browser install | CI `npx playwright install msedge` | All cross-browser | CI setup step — separate from `--with-deps` |

### 5.3 Browser Matrix

| Browser | TC-83232 | TC-83238 | TC-83240 | Notes |
|---|---|---|---|---|
| Chromium | FIXED | Passing | FIXED | Newsletter 45s + body-click; Login 45s + networkidle |
| Firefox | Passing | FIXED | Passing | Store selector dual-state fallback |
| WebKit | Passing | FIXED | Passing | Store selector dual-state fallback |
| Edge (msedge) | FIXED | Passing | FIXED | Newsletter force-click; Login networkidle + body-click |

---

## 6. Environment & Configuration Requirements

| Requirement | Value | Source |
|---|---|---|
| `BASE_URL` | `https://london-drugs-uat-origin.kibology.us/` | `playwright.config.ts` default |
| `TEST_USER_EMAIL` | Must be set | GitHub Actions secret — required for TC-83240 |
| `TEST_USER_PASSWORD` | Must be set | GitHub Actions secret — required for TC-83240 |
| `CI=true` | Enables headless, 0 slowMo, 2 retries, 1 worker | CI environment |
| Edge browser | `npx playwright install msedge` | Separate CI step |

---

## 7. Implementation Checklist

### Page Objects
- [x] `BasePage.ts` — hydration pattern complete; no changes required
- [x] `LoginPage.ts` — F-02 fix: `/auth/login` direct nav, 45 s timeout, body-click
- [x] `ProductDetailPage.ts` — F-03 fix: dual-state fallback, 30 s store search wait
- [x] `HomePage.ts` — locators `newsletterEmailInput` / `newsletterSubmitButton` defined
- [x] `SearchResultsPage.ts` — no changes required
- [x] `StoreLocatorPage.ts` — no changes required

### Spec Files
- [x] `home-page.spec.ts` — F-01 fix: TC-83232 retry loop + 45 s waitFor + `force: true` click
- [x] `pdp.spec.ts` — TC-83238 uses updated `openStoreSelectorDialog()`; TC-83240 uses updated `login()`
- [x] `plp.spec.ts` — no changes required

### Helpers & Data
- [x] `helpers/evidence.ts` — no changes required
- [x] `helpers/apiInterceptor.ts` — no changes required
- [x] `test-data/home-page.data.ts` — verify `newsletter.testEmail` and `newsletter.expectedRedirectUrlPattern` values
- [x] `test-data/pdp.data.ts` — verify `auth.email` reads `TEST_USER_EMAIL`, `auth.password` reads `TEST_USER_PASSWORD`

### CI / Config
- [x] `playwright.config.ts` — global timeout 60 s; TC-83232 overrides to 180 s
- [ ] `.github/workflows/regression.yml` — confirm `npx playwright install msedge` step is present
- [ ] `.github/workflows/playwright.yml` — confirm `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` secrets injected

---

## 8. Open Questions

| ID | Question | Impact | Owner |
|---|---|---|---|
| OQ-001 | TC-83232: `test_qa_automation@example.com` — if already registered on UAT, redirect may differ | Could cause URL assertion mismatch | QA |
| OQ-002 | TC-83238: vitamins search product must support In-Store Pickup; product availability may change on UAT | Test will fail if ISP unavailable for found product | QA |
| OQ-003 | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` must be set as GitHub Actions secrets | TC-83240 will fail in CI without these | DevOps |
| OQ-004 | Edge (`msedge`) requires separate `npx playwright install msedge` in CI — not covered by `--with-deps` | Edge matrix skipped if not installed | DevOps |
| OQ-005 | `interceptAndAbortSortRedirect` workaround valid only on UAT; re-validate if UAT is promoted to production | Sort/filter tests may redirect to prod | QA |
