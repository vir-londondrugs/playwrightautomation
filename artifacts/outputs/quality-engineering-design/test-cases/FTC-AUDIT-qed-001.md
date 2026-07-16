# London Drugs UAT -- FTC Session Audit
session: qed-001
version: 1.0.0
mode: BUILD
scope: All Epics
date: 2026-07-15T00:00:00Z

---

## sources

| source | path | status |
|--------|------|--------|
| User Stories / Test Cases | artifacts/inputs/UAT - Regression testing - Master plan_UAT - Regression testing - Master plan.csv | Loaded |
| Test Strategy | artifacts/outputs/quality-engineering-planning/qa-test-strategy | Not provided — defaults applied (Gherkin, standard positive/negative/boundary) |
| Master Test Plan | artifacts/outputs/quality-engineering-planning/qa-master-test-plan | Not provided — all epics treated as MVP |
| PRD | artifacts/outputs/product-definition/prd | Not provided — PRD cross-reference skipped |
| Epics | artifacts/outputs/product-definition/epics | Not provided — epic context derived from CSV area paths |
| ADRs | artifacts/outputs/software-architecture/adrs | Not provided |

---

## generation_log

| epic | stories | tcs | positive | negative | boundary | mvp_depth |
|------|---------|-----|----------|----------|----------|-----------|
| EPIC-01: Home Page | 8 | 28 | 10 | 14 | 4 | Yes — overlay, API, hydration, SPA scenarios |
| EPIC-02: PLP / Search | 3 | 12 | 5 | 5 | 2 | Yes — filter reset, no-results, default sort |
| EPIC-03: PDP | 7 | 20 | 9 | 8 | 3 | Yes — invalid postal, store selection, auth errors |
| EPIC-04: Cart | 2 | 7 | 2 | 4 | 1 | Yes — empty cart, API failure, delivery switch |
| EPIC-05: My Account | 2 | 10 | 1 | 7 | 2 | Yes — SQL injection, XSS, empty fields, auth |
| EPIC-06: Store Locator | 2 | 6 | 2 | 2 | 2 | No (non-MVP) |
| EPIC-07: Checkout | 2 | 7 | 2 | 3 | 2 | Yes — declined card, missing fields, iframe |
| **TOTAL** | **26** | **90** | **31** | **43** | **16** | All MVP epics verified |

---

## validation_summary

| check | result | details |
|-------|--------|---------|
| 1. Story Coverage | PASS | 26/26 stories covered (100%) |
| 2. AC Exhaustion | PASS | All ACs covered across all 26 stories |
| 3. Business Rule Coverage | PASS | Rules embedded in ACs — fully covered |
| 4. Test Type Distribution | PASS | Pos 34%, Neg 48%, Bound 18% — healthy |
| 5. MVP Depth | PASS | 6 MVP epics have extra negative depth |
| 6. Domain Tag Consistency | PASS | All [FE] matching source |
| 7. Count Verification | PASS | 7 files for 7 epics, counts match |
| 8. Anti-Fade | PASS | EPIC-07 depth comparable to EPIC-01 |
| 9. Gherkin Format | PASS | Strict Given/When/Then throughout |
| 10. Source Fidelity | PASS | All TCs trace to canonical CSV TC IDs |
