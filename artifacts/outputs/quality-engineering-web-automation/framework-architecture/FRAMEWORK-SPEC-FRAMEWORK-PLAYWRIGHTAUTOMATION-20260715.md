# FRAMEWORK-SPEC-FRAMEWORK-PLAYWRIGHTAUTOMATION-20260715

**Version:** 1.0.0  
**Session ID:** FRAMEWORK-PLAYWRIGHTAUTOMATION-20260715  
**Scenario:** 2 — First Interaction with Existing Framework  
**Generated:** 2026-07-15  
**Project:** PlaywrightAutomation — London Drugs UAT Regression Suite

---

## 1. Project Overview

| Field | Value |
|---|---|
| Project name | playwrightautomation |
| Repository path | `/Users/virginia.zambudio/PlaywrightAutomation` |
| Environment under test | `https://london-drugs-uat-origin.kibology.us/` |
| Framework type | Playwright + TypeScript, Page Object Model |
| Test runner | `@playwright/test` v1.61.x |
| TypeScript version | 6.x |
| Node module format | CommonJS |
| CI system | GitHub Actions (`.github/workflows/playwright.yml`, `regression.yml`) |

**Application profile:**  
London Drugs e-commerce (Next.js + Builder.io). Characterized by slow React hydration on UAT (15–45 s spinners), Builder.io lazy-rendered sections (intersection-observer gated), geolocation-driven store pre-selection, and cross-domain sort/filter redirects to `www.londondrugs.com`.

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Test framework | `@playwright/test` | ^1.61.0 |
| Language | TypeScript | ^6.0.3 |
| Node types | `@types/node` | ^25.9.4 |
| Browsers | Chromium, Firefox, WebKit, Edge (msedge) | Playwright-bundled |
| Build/run | `npx playwright test` | — |
| Reporting | JUnit XML + Playwright HTML reporter | built-in |
| CI | GitHub Actions | — |

**Notable runtime settings (playwright.config.ts):**
- `baseURL`: `https://london-drugs-uat-origin.kibology.us/` (overridable via `BASE_URL` env var)
- `locale`: `en-CA`
- `geolocation`: Vancouver BC `{lat: 49.2827, lng: -123.1207}` — triggers store pre-selection on Firefox/WebKit
- `permissions`: `['geolocation']`
- `headless`: true in CI, false locally
- `slowMo`: 800 ms locally, 0 in CI
- `retries`: 2 in CI, 0 locally
- `workers`: 1 in CI (serial), unlimited locally
- `trace`: off (ZIP stream corruption workaround for Playwright 1.61)
- `screenshot`: off (custom evidence helper handles this)
- Global timeout: 60 000 ms (individual tests may override with `test.setTimeout()`)

---

## 3. Component Catalog

### 3.1 Page Objects (`pages/`)

| Class | File | Responsibility |
|---|---|---|
| `BasePage` | `BasePage.ts` | Base class: `navigate()`, `dismissLoadingIfStuck()`, `waitForAppShell()`. Handles Next.js/Builder.io hydration stalls via body-click. |
| `HomePage` | `HomePage.ts` | Home page: logo, search input, mini cart, mega menu, header nav links (Deals, Services, Flyers, Gift Registry), footer newsletter signup. |
| `LoginPage` | `LoginPage.ts` | Login form: email/password inputs, submit button. `login()` navigates directly to `/auth/login` (skips `/myaccount` redirect round-trip). |
| `ProductDetailPage` | `ProductDetailPage.ts` | PDP: breadcrumbs, price, availability, fulfillment radios, store selector dialog, delivery postal code modal, Add to Cart, mini cart badge, wishlist button. |
| `SearchResultsPage` | `SearchResultsPage.ts` | PLP/search: filter, sort, product card interactions. |
| `StoreLocatorPage` | `StoreLocatorPage.ts` | Store locator page interactions. |

**BasePage contract:**
- `navigate(url)` — `goto()` + `domcontentloaded` + `dismissLoadingIfStuck()` + `waitForAppShell()`
- `dismissLoadingIfStuck()` — waits for `load` (15 s); if timeout, force-clicks body + waits `domcontentloaded`
- `waitForAppShell()` — waits for `header` to be visible (20 s); on failure force-clicks body

### 3.2 Test Specs (`tests/`)

| File | Test IDs covered |
|---|---|
| `home-page.spec.ts` | TC-83225, TC-83226, TC-83228, TC-83229, TC-83230, TC-83231, TC-83232 |
| `pdp.spec.ts` | TC-83235, TC-83236, TC-83237, TC-83238, TC-83239, TC-83240 |
| `plp.spec.ts` | FTC_02_01_x, FTC_02_02_x (PLP filter/sort scenarios) |

All specs use `test.afterEach` to call `takeEvidenceScreenshot()` on failure.

### 3.3 Helpers (`helpers/`)

| Helper | File | Responsibility |
|---|---|---|
| Evidence screenshots | `evidence.ts` | Captures full-page PNG on test failure; saves to `artifacts/outputs/` with `{TC-ID}_{timestamp}.png` naming. |
| Page load unblocking | `page-load.ts` | `simulateBodyClickToUnblock()` — thin wrapper for the body-click hydration pattern. |
| API interceptor | `apiInterceptor.ts` | `interceptSearchApi()`, `waitForFilterApiCall()`, `interceptAndAbortSortRedirect()` / `interceptAndAbortFilterRedirect()` — handles UAT search API interception and production-domain redirect abortion. |

### 3.4 Test Data (`test-data/`)

| File | Covers |
|---|---|
| `home-page.data.ts` | URLs, logo assertions, search terms, mini cart data, header nav hrefs, newsletter email + expected redirect pattern |
| `pdp.data.ts` | PDP URLs, postal code `V6B 1A1`, auth credentials (from env vars `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`) |
| `plp.data.ts` | Filter/sort data, URL params for sort verification |

### 3.5 CI Workflows (`.github/workflows/`)

| File | Trigger | Purpose |
|---|---|---|
| `playwright.yml` | Push/PR | Full regression run on all 4 browsers |
| `regression.yml` | Schedule/manual | Scheduled regression with JUnit XML artifact upload |

---

## 4. Architecture Decisions

| ID | Decision | Rationale |
|---|---|---|
| AD-01 | Page Object Model (POM) | Encapsulates selectors and interactions; isolates test logic from DOM changes. |
| AD-02 | `BasePage` hydration pattern | Next.js + Builder.io UAT origin requires body-click + header wait after every navigation to unblock hydration stalls. Centralized in `BasePage` for DRY reuse. |
| AD-03 | Navigate to `/auth/login` directly | Bypasses `/myaccount` → `/auth/login` redirect round-trip; reduces flakiness on slow UAT origin (saves ~5–10 s, avoids double-navigation spinner). |
| AD-04 | Geolocation set to Vancouver | Ensures consistent locale/store availability behavior across all test runs. Side effect: Firefox/WebKit may auto-select a store, requiring fallback logic in store selector interactions. |
| AD-05 | `interceptAndAbortSortRedirect` | UAT sort/filter actions redirect to `www.londondrugs.com`. Route interception aborts the redirect so assertions remain on UAT origin. |
| AD-06 | Custom evidence screenshots (off by default) | `screenshot: 'off'` in config; `evidence.ts` captures only on failure with deterministic filename. Avoids Playwright ZIP stream corruption bug (v1.61). |
| AD-07 | `trace: 'off'` | Playwright 1.61 ZIP stream corruption bug makes traces unreliable; disabled until upstream fix. |
| AD-08 | 4-browser matrix (Chromium, Firefox, WebKit, Edge) | London Drugs has a diverse user agent base; cross-browser coverage catches browser-specific rendering/geolocation differences. |
| AD-09 | Edge via `msedge` channel | Added 2026-07-14; requires separate `npx playwright install msedge` step in CI (not included in `--with-deps`). |
| AD-10 | `openStoreSelectorDialog()` dual-state fallback | Firefox/WebKit auto-select store via geolocation, replacing "Set your store" with "Check availability at other stores". Method tries "Set your store" (5 s) then falls back to "Check availability" (15 s). |
| AD-11 | Builder.io newsletter retry loop | Newsletter section is intersection-observer gated. Scroll + retry loop (15 attempts × 1 s) + 45 s final `waitFor` handles slow UAT Builder.io rendering. |

---

## 5. Configuration Strategy

### 5.1 Environment Variables

| Variable | Usage | Default |
|---|---|---|
| `BASE_URL` | Overrides `playwright.config.ts` `baseURL` | `https://london-drugs-uat-origin.kibology.us/` |
| `CI` | Enables CI mode (headless, no slowMo, 2 retries, 1 worker) | unset (local) |
| `TEST_USER_EMAIL` | Authenticated test user email (TC-83240) | Must be set |
| `TEST_USER_PASSWORD` | Authenticated test user password (TC-83240) | Must be set |

### 5.2 Timeout Hierarchy

| Level | Timeout | Source |
|---|---|---|
| Global test timeout | 60 000 ms | `playwright.config.ts` |
| TC-83232 override | 180 000 ms | `test.setTimeout(180_000)` in spec |
| App shell hydration | 20 000 ms | `BasePage.waitForAppShell()` |
| Load state | 15 000 ms | `BasePage.dismissLoadingIfStuck()` |
| Login email input | 45 000 ms | `LoginPage.login()` |
| Newsletter `waitFor` | 45 000 ms | `home-page.spec.ts` TC-83232 |
| Store selector fallback | 15 000 ms | `ProductDetailPage.openStoreSelectorDialog()` |
| Store search results | 30 000 ms | `ProductDetailPage.searchStores()` |
| Add to Cart confirmation | 20 000 ms | `ProductDetailPage.addToCart()` |

---

## 6. Known Issues & Fixes Applied (2026-07-15)

The following failures from the previous CI run were diagnosed and fixed:

### F-01: TC-83232 Newsletter Timeout (Chromium, Edge)
- **Root cause:** Old code had `waitFor({ timeout: 30_000 })` with no retry loop; Builder.io section required longer wait and scroll trigger.
- **Fix:** Added 15-iteration scroll retry loop + 45 s final `waitFor`. Selector `div.bg-primary input[type="email"]` confirmed valid via browser inspection.
- **File:** `tests/home-page.spec.ts`

### F-02: TC-83240 Login Timeout (Chromium, Edge)
- **Root cause:** Old code navigated to `/myaccount` with 15 s timeout; `/myaccount` triggers redirect to `/auth/login`, adding a round-trip + double spinner.
- **Fix:** Navigate directly to `/auth/login` + `networkidle` wait + body click + 45 s `waitFor`. Selector `input[name="email"][type="email"]` confirmed valid via browser inspection.
- **File:** `pages/LoginPage.ts`

### F-03: TC-83238 Store Selector Timeout (Firefox, WebKit)
- **Root cause:** Geolocation pre-selects Vancouver store on Firefox/WebKit, hiding "Set your store" link. Old code waited 15 s for that specific locator with no fallback.
- **Fix:** `openStoreSelectorDialog()` now: scrolls fulfillment radio into view → waits 2.5 s → tries "Set your store" (5 s try/catch) → falls back to "Check availability at other stores" (15 s).
- **File:** `pages/ProductDetailPage.ts`

---

## 7. Code Review Checklist

### Selectors
- [x] All selectors use stable attributes (`aria-label`, `name`, `type`, `data-*`) or scoped class+tag combinations
- [x] No bare class selectors on dynamically-generated Tailwind classes
- [x] `p.cursor-pointer.text-primary` is scoped by `.filter({ hasText: ... })` to avoid ambiguity
- [x] Newsletter input scoped to parent `div.bg-primary` to avoid matching other email inputs

### Timing & Stability
- [x] No bare `waitForTimeout` used as primary wait (used only as hydration nudge after scroll)
- [x] All `waitFor({ state: 'visible' })` have explicit timeout values matching the timeout hierarchy
- [x] Login navigates to `/auth/login` directly (no redirect round-trip)
- [x] `openStoreSelectorDialog()` has dual-state fallback for geolocation pre-selection
- [x] `networkidle` waits use `.catch(() => {})` to prevent test failure on busy UAT pages

### API Interception
- [x] `interceptAndAbortSortRedirect` registered before sort/filter action, not after
- [x] `interceptSearchApi` uses `page.unroute()` after first match to avoid leaking route handlers

### Evidence & Reporting
- [x] `takeEvidenceScreenshot` called in `afterEach` on all spec files
- [x] Evidence files saved to `artifacts/outputs/` with deterministic `{TC-ID}_{timestamp}.png` naming
- [x] JUnit XML output (`results.xml`) consumed by ADO publish script

### Open Items
- [ ] OQ-01: Sort/filter on UAT may redirect to `www.londondrugs.com`. `interceptAndAbortSortRedirect` is the current workaround; needs re-validation if UAT is promoted.
- [ ] OQ-02: `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` must be set as GitHub Actions secrets for TC-83240 to pass in CI.
- [ ] OQ-03: Edge (`msedge`) requires separate `npx playwright install msedge` step in CI pipeline — not covered by `--with-deps`.

---

## 8. Architecture Diagram (Logical)

```
tests/
  home-page.spec.ts   → HomePage, StoreLocatorPage, evidence.ts
  pdp.spec.ts         → HomePage, LoginPage, ProductDetailPage, SearchResultsPage, evidence.ts, apiInterceptor.ts
  plp.spec.ts         → SearchResultsPage, evidence.ts, apiInterceptor.ts

pages/
  BasePage.ts         ← extended by all page objects
  HomePage.ts
  LoginPage.ts
  ProductDetailPage.ts
  SearchResultsPage.ts
  StoreLocatorPage.ts

helpers/
  evidence.ts         ← afterEach screenshot on failure
  page-load.ts        ← simulateBodyClickToUnblock()
  apiInterceptor.ts   ← interceptSearchApi, interceptAndAbortSortRedirect

test-data/
  home-page.data.ts
  pdp.data.ts
  plp.data.ts

playwright.config.ts  ← 4-browser matrix, baseURL, geolocation, timeouts
```
