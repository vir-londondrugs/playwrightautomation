# FRAMEWORK-AUDIT-FRAMEWORK-PLAYWRIGHTAUTOMATION-20260715

**Version:** 1.0.0  
**Session ID:** FRAMEWORK-PLAYWRIGHTAUTOMATION-20260715  
**Mode:** BUILD  
**Generated:** 2026-07-15  
**Auditor:** framework-exploration skill (Scenario 2 — First Interaction)

---

## Audit Summary

| Category | Status | Notes |
|---|---|---|
| Framework existence | CONFIRMED | Existing Playwright + TypeScript POM framework |
| Scenario detected | 2 — First Interaction | No prior FRAMEWORK-SPEC existed |
| Browser-verified selectors | PASS | Newsletter + login selectors validated via MCP browser inspection |
| Active test failures | 3 distinct root causes | All addressed by existing code modifications (git status M) |
| Spec files scanned | 3 | home-page.spec.ts, pdp.spec.ts, plp.spec.ts |
| Page objects scanned | 6 | BasePage, HomePage, LoginPage, ProductDetailPage, SearchResultsPage, StoreLocatorPage |
| Helpers scanned | 3 | evidence.ts, page-load.ts, apiInterceptor.ts |

---

## Failure Triage (from CI Run — 2026-07-15 Additional Instructions)

### F-01 — TC-83232 Newsletter Timeout [Chromium, Edge]

| Field | Detail |
|---|---|
| Test | `TC-83232 — Newsletter signup in footer accepts valid email` |
| Step | `Scroll to footer newsletter form` |
| Error | `TimeoutError: locator.waitFor: Timeout 30000ms exceeded` on `div.bg-primary input[type="email"]` |
| Root cause | 30 s timeout with no retry loop insufficient for Builder.io intersection-observer lazy render |
| Selector validity | CONFIRMED VALID — Browser inspection returned `{found:true, visible:true, display:"inline-block", offsetHeight:43}` after scroll |
| Fix status | APPLIED (in `tests/home-page.spec.ts`) — 15-iteration scroll retry loop + 45 s final `waitFor` |
| Remaining risk | Builder.io may fail to render on low-memory CI runners; retry loop mitigates |

### F-02 — TC-83240 Login Timeout [Chromium, Edge]

| Field | Detail |
|---|---|
| Test | `TC-83240 — Authenticated user adds product to wishlist` |
| Step | `Log in with test user credentials` |
| Error | `TimeoutError: locator.waitFor: Timeout 15000ms exceeded` on `input[name="email"][type="email"]` |
| Root cause | Navigation to `/myaccount` triggers redirect → `/auth/login`, causing double-navigation + 15 s timeout insufficient for hydration |
| Selector validity | CONFIRMED VALID — Browser inspection of `/auth/login` returned `{emailFound:true, passFound:true, emailVisible:true}` |
| Fix status | APPLIED (in `pages/LoginPage.ts`) — Navigate directly to `/auth/login` + `networkidle` + body click + 45 s `waitFor` |
| Remaining risk | UAT origin latency on login form hydration; 45 s should be sufficient based on observed 15–30 s hydration times |

### F-03 — TC-83238 Store Selector Timeout [Firefox, WebKit]

| Field | Detail |
|---|---|
| Test | `TC-83238 — Add to cart with In-Store Pickup (postal V6B 1A1)` |
| Step | `Open store selector dialog and set store using postal code V6B 1A1` |
| Error | `TimeoutError: locator.waitFor: Timeout 15000ms exceeded` on `p.cursor-pointer.text-primary` filter `set your store` |
| Root cause | `playwright.config.ts` grants geolocation (Vancouver) to all browsers; Firefox/WebKit pre-select a store, replacing "Set your store" with "Check availability at other stores" — no fallback in old code |
| Fix status | APPLIED (in `pages/ProductDetailPage.ts`) — `openStoreSelectorDialog()` try/catch (5 s) → fallback to "Check availability" link (15 s) |
| Remaining risk | Low — if site renders a third state (neither link), test would still fail; add observability if recurrence detected |

---

## Framework Health Assessment

### Strengths

1. **Solid POM structure** — All page interactions encapsulated in page objects; tests contain no raw selectors.
2. **Hydration-aware base class** — `BasePage` centralizes the Next.js/Builder.io body-click pattern; no duplication across specs.
3. **Stable selector strategy** — Uses `aria-label`, `name`, `type`, and filtered text selectors; avoids fragile nth-child or volatile class-only selectors.
4. **API interception layer** — `apiInterceptor.ts` cleanly isolates the UAT redirect workaround (OQ-01).
5. **Deterministic evidence collection** — `evidence.ts` captures failure screenshots with TC-ID + timestamp; no conflicts.
6. **4-browser coverage** — Chromium, Firefox, WebKit, Edge matrix catches browser-specific bugs (proved by F-03 geolocation issue).

### Weaknesses / Risks

| ID | Issue | Severity | Recommendation |
|---|---|---|---|
| W-01 | `trace: 'off'` — no traces in CI for failure investigation | Medium | Upgrade Playwright past 1.61 to restore trace support |
| W-02 | `retries: 2` in CI may mask flaky tests as passing | Low | Add flakiness annotation (`@flaky`) to known-flaky tests instead of relying on retries |
| W-03 | `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` not documented in CI secrets config | High | Ensure CI secrets are set; TC-83240 will fail without them |
| W-04 | `slowMo: 800` locally makes full suite slow (~10 min) | Low | Consider reducing to 300 ms for local iteration speed |
| W-05 | No test tag filtering documented in CI workflows | Low | Document `--grep @smoke` pattern for smoke-only CI runs |
| W-06 | Edge (`msedge`) requires manual install step in CI (not in `--with-deps`) | Medium | Add `npx playwright install msedge` to CI workflow explicitly |
| W-07 | Builder.io newsletter (F-01) has 180 s timeout — may block CI worker 3 min on failure | Low | Consider making newsletter test CI-skip until Builder.io reliability improves |

---

## Selector Inventory (Browser-Validated)

| Locator | File | Browser-Validated | Status |
|---|---|---|---|
| `div.bg-primary input[type="email"]` | `HomePage.ts` | YES (headless Chromium) | VALID |
| `input[name="email"][type="email"]` | `LoginPage.ts` | YES (headless Chromium, `/auth/login`) | VALID |
| `p.cursor-pointer.text-primary` filter `set your store` | `ProductDetailPage.ts` | Not re-validated (PDP requires product navigation) | ASSUMED valid per prior UAT discovery |
| `p.cursor-pointer` filter `check availability at other stores` | `ProductDetailPage.ts` | Not re-validated | ASSUMED valid — fallback path |
| `dialog#store-selector` | `ProductDetailPage.ts` | Not re-validated | ASSUMED valid per prior UAT discovery |
| `button[aria-label="Add to cart button"]` | `ProductDetailPage.ts` | Not re-validated | ASSUMED valid |

---

## Repair History

_No repairs — this is a BUILD audit (first run)._

---

## Open Questions Registry

| ID | Question | Impact | Owner |
|---|---|---|---|
| OQ-01 | UAT sort/filter redirects to `www.londondrugs.com`. Will this behavior persist after UAT promotion? | Medium — `interceptAndAbortSortRedirect` must be removed/updated on PROD | QA Lead |
| OQ-02 | Are `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` configured as GitHub Actions secrets? | High — TC-83240 fails without them | DevOps |
| OQ-03 | Edge (`msedge`) install step confirmed in CI workflows? | Medium — Edge browser tests fail on fresh CI agents | DevOps |
| OQ-04 | Builder.io newsletter section: does it render consistently on headless browsers? | Medium — F-01 has been addressed but Builder.io CSP `unsafe-eval` errors observed in headless run | QA Lead |
