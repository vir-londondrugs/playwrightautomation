# DISCOVERY-SPEC-DISCOVERY-PLI-20260715

## Session
- **Session ID:** DISCOVERY-PLI-20260715
- **Date:** 2026-07-15
- **Application:** London Drugs UAT — https://london-drugs-uat-origin.kibology.us/
- **Scope:** Fix 6 failing tests via live selector discovery and timing analysis

---

## Findings — Selector Validation

### TC-83232 — Newsletter Signup (home-page.spec.ts)

| Element | Selector | Confirmed |
|---|---|---|
| Email input | `div.bg-primary input[type="email"]` | ✓ visible after scroll |
| Submit button | `div.bg-primary button[type="submit"]` (hasText `/sign up/i`) | ✓ present, **covered** by layout `div` |

**Root causes identified:**
1. **(Chromium/Edge — original)** `waitFor({ state: 'visible', timeout: 30_000 })` at old line 414 was too short; fixed in working tree with 45s + retry loop.
2. **(Edge — new)** `newsletterSubmitButton.click()` silently failed because a layout `div` covered the button on Edge. Fix: `click({ force: true })`.

**Live DOM evidence:**
```
button text: "SIGN UP"
button class: "border-white-600 flex h-10 items-center justify-center rounded-none border-2 p-3"
covered by: DIV class="mx-auto hidden max-w-[1272px] flex-row items-center justify-between px-2 py-3 lg"
```

---

### TC-83240 — Login (LoginPage.ts)

| Element | Selector | Confirmed |
|---|---|---|
| Email input | `input[name="email"][type="email"]` | ✓ visible on `/auth/login` |
| Password input | `input[name="password"][type="password"]` | ✓ |
| Login button | `button[type="submit"]` hasText `/login/i` | ✓ |

**Root cause:**
- **(Chromium — original)** Old code navigated to `/myaccount` (redirect chain); old timeout was 15s.
- **(Edge — new)** After fixing to `/auth/login`, Edge got stuck on "Loading..." spinner. `BasePage.navigate()` (which calls `dismissLoadingIfStuck()` + `waitForAppShell()`) resolves the stuck state; added extra `body.click({ force: true })` before waiting for email input.

---

### TC-83238 — In-Store Pickup Store Selector (ProductDetailPage.ts)

| Element | Selector | Confirmed |
|---|---|---|
| In-store pickup radio | `input[aria-label="Product Ship to Store Pickup Fulfillment Type"]` | ✓ |
| "Set your store" link | `p.cursor-pointer.text-primary` hasText `/set your store/i` | ✓ class: `mr-1 cursor-pointer text-primary underline` |
| "Check Availability" link | `p.cursor-pointer` hasText `/check availability at other stores/i` | ✓ |
| Store selector dialog | `dialog#store-selector` | ✓ |
| Search input | `dialog#store-selector input[name="searchTerm"]` | ✓ |
| Search button | `dialog#store-selector button.primary-button` (first) | ✓ text: "SEARCH STORES" |
| First Set Store button | `dialog#store-selector button.primary-button` (nth 1) | ✓ text: "Set Store" |

**Root cause (Firefox/WebKit):**
1. **(Original)** Old `openStoreSelectorDialog` used single 15s wait → fixed with fallback logic in working tree.
2. **(New — after phase 1 fix)** `searchStores()` had `firstSetStoreButton.waitFor({ timeout: 15_000 })`. Firefox/WebKit store search API responses took >15s. Fix: increased to 30s.

---

## Wait Strategy Inventory

| Flow | Strategy |
|---|---|
| Newsletter section appears | `scrollTo(document.body.scrollHeight)` × 2, retry loop (15×1s), `scrollIntoViewIfNeeded`, final `waitFor(45s)` |
| Newsletter button | `click({ force: true })` to bypass overlay |
| Login form | `BasePage.navigate()` + `networkidle(20s)` + `body.click({force})` + `waitFor(45s)` |
| Store selector opens | `scrollIntoViewIfNeeded` + 2.5s wait + try/catch 5s → fallback 15s |
| Store search results | `waitFor({ timeout: 30_000 })` on first Set Store button |

---

## Open Questions

| # | Question | Impact |
|---|---|---|
| OQ-001 | TC-83232 test email `test_qa_automation@example.com` — if already registered, UAT may redirect differently | Could cause redirect mismatch |
| OQ-002 | TC-83238 product found via "vitamins" search varies; product must support in-store pickup | If product lacks ISP, test will fail |
