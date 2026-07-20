---
skill: playwright-automation-plan
session_id: Fix_execution_tc
version: 1.0.0
date: 2026-07-20
type: PLAN-AUDIT
---

# PLAN-AUDIT — Fix_execution_tc

## Compliance Gate Results

| Check | ID | Result | Evidence |
|-------|----|--------|----------|
| All TCs traceable to requirement | PL-01 | PASS | 65 TCs mapped to FTC-MANIFEST (65 TC_ID entries confirmed via grep) |
| No test code written | PL-02 | PASS | Section 4 contains only structural sketches; all locators commented out |
| No secrets hardcoded | PL-03 | PASS | All credentials/card numbers reference env vars (TEST_USER_EMAIL, SANDBOX_CARD_NUMBER, etc.) |
| Fixture import specified | PL-04 | PASS | All spec sketches import from `../helpers/fixtures` |
| Evidence screenshots specified | PL-05 | PASS | All spec sketches include `test.afterEach` with `takeEvidenceScreenshot` |
| Risks documented | PL-06 | PASS | 11 risks (R-01 to R-11) with affected TCs and mitigations |
| Open questions documented | PL-07 | PASS | 10 OQs (OQ-01 to OQ-DEALS-01) with resolution paths |
| Existing POMs reused where possible | PL-08 | PASS | StoreLocatorPage and LoginPage marked REUSE; existing POM locators cited by line number |
| TC count matches manifest | PL-09 | PASS | 65 (corrected from prior session's 63) |
| Environment: UAT-only | PL-10 | PASS | baseURL confirmed as UAT origin; no production references |

## Comparison with Prior Plan (Fix_execution_GitHub)

| Item | Prior (Fix_execution_GitHub) | This Plan (Fix_execution_tc) | Delta |
|------|------------------------------|------------------------------|-------|
| TC count | 63 | 65 | +2 (EPIC-01 had 14 not 13; EPIC-03 had 14 not 13) |
| Spec file strategy | Same 3 EXTEND + 5 NEW | Same 3 EXTEND + 5 NEW | No change |
| POM strategy | Same 4 NEW + 2 REUSE | Same 4 NEW + 2 REUSE | No change |
| Risks | 10 risks | 11 risks (added R-10 mobile viewport, R-11 Deals API) | +2 |
| Open questions | 4 OQs | 10 OQs (detailed per new POM) | +6 |
| Section 5 (Assumptions) | Not present | Present | Added |

## Decisions Log

| ID | Decision | Rationale |
|----|----------|-----------|
| D-01 | Correct TC count from 63 to 65 | Re-grep of all 8 epic suite files shows 65 TC_ID entries. EPIC-01 = 14, EPIC-03 = 14. |
| D-02 | Keep same spec file + POM architecture as Fix_execution_GitHub | Architecture is validated and correct; no reason to change. |
| D-03 | Negative/regression-guard tests assert element IS present on live UAT | Live UAT cannot simulate absent-element states; regression guard is the correct interpretation. |
| D-04 | FTC_01_06_02 mobile viewport handled via test.use() not new project | Playwright supports per-describe viewport override without new project config. |
| D-05 | Deals and Events path = `/category/deals-and-events/c/1027` | Derived from confirmed HomePage.ts:76 dealsLink locator href. |
| D-06 | FTC_06_02_03 inverted to assert ≥1 store present | Zero-store state untestable on live UAT; regression guard is the correct interpretation. |

## Hard Stops (Human Approval Required)

This PLAN-SPEC requires human approval before the `playwright-automation-implement` skill is invoked.

**Approval checklist**:
- [ ] TC count (65) confirmed correct against manifest
- [ ] Spec file strategy (EXTEND/NEW verdicts) approved
- [ ] Risk register reviewed and accepted
- [ ] Open questions reviewed — implementer will run MCP discovery to resolve OQ-01 to OQ-DEALS-01 before writing code
- [ ] Environment prerequisites (env vars, storageState) confirmed available

**HARD STOP: Do not proceed to implementation until this checklist is signed off.**
