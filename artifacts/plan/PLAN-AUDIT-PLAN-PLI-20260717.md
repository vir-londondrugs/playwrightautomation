---
id: PLAN-AUDIT-PLAN-PLI-20260717
session: Fix_execution_GitHub
skill: playwright-automation-plan
date: 2026-07-17
plan_spec: PLAN-SPEC-PLAN-PLI-20260717.md
---

# PLAN-AUDIT — LondonDrugs Playwright Automation
## Session: PLAN-PLI-20260717

---

## Audit Gate Results

| # | Gate | Result | Evidence |
|---|------|--------|----------|
| A1 | All 63 FTC_IDs from manifest accounted for | ✅ PASS | Section 10 traceability matrix covers all 63 IDs; no TC dropped or silently skipped |
| A2 | Every FTC maps to exactly one target spec file | ✅ PASS | Each row in Section 10 names exactly one `.spec.ts` file |
| A3 | automation-standards.md §Priority Order honoured | ✅ PASS | EPIC-08 (Checkout) and EPIC-04 (Cart) ranked highest; sequence in Section 9.3 follows §§1-2 |
| A4 | automation-standards.md §File Naming pattern followed | ✅ PASS | All new spec files use `<feature>.spec.ts` pattern under `tests/` folder |
| A5 | automation-standards.md §Environment Management — UAT only, never production | ✅ PASS | All URLs hardcoded to `https://london-drugs-uat-origin.kibology.us/`; production URLs absent from plan |
| A6 | automation-standards.md §Test Data — no real credentials committed | ✅ PASS | Credentials use `process.env` with test-account fallback; sandbox payment data via env vars; no real PII planned |
| A7 | OQ-02 (MyRegistry/PayPal — BLOCKED) handled correctly | ✅ PASS | FTC_07_01_01, FTC_07_01_02, FTC_08_01_01, FTC_08_01_02 scoped to button existence only |
| A8 | OQ-03 (DataDome on login) handled | ✅ PASS | All new spec files import from `helpers/fixtures` (anti-bot applied automatically) |
| A9 | OQ-04 (sandbox iframe) handled | ✅ PASS | `frameLocator` strategy planned for FTC_08_02_01, FTC_08_02_02, FTC_08_02_05; sandbox card via env var |
| A10 | No test code written — plan-only output | ✅ PASS | All spec content expressed as step summaries and assertion descriptions; no TypeScript code written |
| A11 | Existing assets reused before new creation | ✅ PASS | Existing POMs, helpers, fixtures reused; 5 new POMs created only for uncovered epics |
| A12 | `helpers/fixtures.ts` used in all new specs | ✅ PASS | Import from `../helpers/fixtures` specified for all 5 new spec files and 2 extensions |
| A13 | `takeEvidenceScreenshot` attached in afterEach for all new specs | ✅ PASS | Section 8.1 mandates `test.afterEach` with `takeEvidenceScreenshot` for all specs |
| A14 | API interception registered BEFORE action trigger | ✅ PASS | Section 8.1 wait strategy explicitly states this ordering rule |
| A15 | No hardcoded product URLs or names | ✅ PASS | All product navigation via search-first pattern (reuse of `navigateToVitaminsPdp` / `navigateToPLP` pattern); no hardcoded SKUs |

---

## TC Coverage Verification

| Epic | TCs in FTC Manifest | TCs in Plan | Delta |
|------|---------------------|-------------|-------|
| EPIC-01 | 13 | 13 | 0 |
| EPIC-02 | 7 | 7 | 0 |
| EPIC-03 | 13 | 13 | 0 |
| EPIC-04 | 6 | 6 | 0 |
| EPIC-05 | 7 | 7 | 0 |
| EPIC-06 | 5 | 5 | 0 |
| EPIC-07 | 5 | 5 | 0 |
| EPIC-08 | 7 | 7 | 0 |
| **TOTAL** | **63** | **63** | **0** |

---

## Risk Register

| Risk ID | Risk | Severity | Mitigation |
|---------|------|----------|------------|
| R-01 | Cart delivery selector locator unknown (PQ-01) — `CartPage.ts` locator may need revision during implementation | High | MCP discovery run before writing `CartPage.ts`; plan is locator-agnostic |
| R-02 | Payment iframe selector unknown (PQ-05) — `frameLocator` selector may need adjustment | High | MCP discovery on checkout page; frameLocator pattern is correct approach |
| R-03 | DataDome may block login tests in CI (OQ-03) — `applyAntiBotMeasures` reduces but does not eliminate risk | Medium | IP whitelisting on DataDome dashboard is definitive fix; test user credentials via env vars |
| R-04 | Sandbox payment environment not confirmed — actual Moneris/CyberSource test credentials must be sourced | High | Obtain from DevOps before checkout test implementation; blocked without this |
| R-05 | Non-deliverable postal code for STH test (FTC_03_05_02) — exact code not confirmed | Low | Use `'X0A 0A0'` (Nunavut remote) or discover at runtime which postal shows "unavailable" |
| R-06 | Deals and Events city filter may not have a city with zero deals at all times (FTC_07_02_03 boundary) | Medium | Test soft-fails if all cities show deals; document as data-dependent at runtime |
| R-07 | Guest checkout confirmation URL pattern may differ from `/order-confirmation` | Medium | MCP discovery during implementation; plan uses regex pattern `checkoutData.orderConfirmation.urlPattern` which is easy to update |

---

## Automation Standards Compliance

| Standard Section | Compliant | Notes |
|-----------------|-----------|-------|
| §Framework Selection — E2E → Playwright | ✅ | All planned files use Playwright |
| §File Naming — `<feature>.spec.ts` in `tests/` | ✅ | All 5 new spec files comply |
| §Priority Order | ✅ | Checkout (§1) and Cart (§2) first in Section 9.3 sequence |
| §Environment Management — UAT only | ✅ | Only `london-drugs-uat-origin.kibology.us` referenced |
| §Environment Management — test credentials only | ✅ | `process.env` + test-only fallbacks; no real customer data |
| §Environment Management — Moneris/CyberSource test | ✅ | Sandbox card via env var; no real card planned |
| §Test Data — `artifacts/inputs` | ✅ | Referenced; checkout data file follows same pattern |

---

## Open Questions Summary

| PQ_ID | Blocking For | Must Resolve Before |
|-------|-------------|---------------------|
| PQ-01 | `pages/CartPage.ts` locators | Implementation of `cart.spec.ts` |
| PQ-02 | `MyAccountPage.navigateToAddressBook()` | Implementation of `my-account.spec.ts` |
| PQ-03 | `DealsAndEventsPage.citySelector` | Implementation of `deals-and-events.spec.ts` |
| PQ-04 | MyRegistry button locator | Implementation of FTC_07_01_01/02 — low risk, text-based fallback available |
| PQ-05 | `CheckoutPage.fillSandboxCardNumber()` | Implementation of `checkout.spec.ts` |
| PQ-06 | Guest checkout entry flow | Implementation of FTC_08_02_01 |
| PQ-07 | `SANDBOX_CARD_NUMBER` env var in CI | Implementation of FTC_08_02_01/02 |

---

## Verdict

**PLAN-SPEC status: READY FOR IMPLEMENTATION**

All 63 test cases are covered. No gates failed. 7 open questions are non-blocking at the plan level and are expected inputs to the `playwright-automation-implement` step (MCP discovery + sandbox credential provisioning). The `playwright-automation-implement` skill should resolve PQ-01, PQ-05, PQ-06 via live MCP browser exploration before writing POMs.
