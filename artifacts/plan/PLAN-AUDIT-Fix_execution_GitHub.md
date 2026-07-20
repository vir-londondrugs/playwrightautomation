---
skill: playwright-automation-plan
session_id: Fix_execution_GitHub
mode: BUILD
date: 2026-07-17
requirement_summary: Translate 63 validated FTC-LONDONDRUGS-20260702 test cases into Playwright/TypeScript automation for London Drugs UAT
---

# PLAN-AUDIT — Fix_execution_GitHub

## Session Metadata

| Field | Value |
|-------|-------|
| session_id | Fix_execution_GitHub |
| skill | playwright-automation-plan |
| mode | BUILD |
| date | 2026-07-17 |
| requirement_source | ./artifacts/outputs/quality-engineering-design/test-cases (FTC-LONDONDRUGS-20260702) |
| target_repo | /Users/virginia.zambudio/PlaywrightAutomation |
| environment | UAT — https://london-drugs-uat-origin.kibology.us/ |

## Files Written

| File | Type | Location |
|------|------|----------|
| `PLAN-SPEC-Fix_execution_GitHub.md` | Primary deliverable | /Users/virginia.zambudio/PlaywrightAutomation/artifacts/plan/ |
| `PLAN-AUDIT-Fix_execution_GitHub.md` | Audit/provenance | /Users/virginia.zambudio/PlaywrightAutomation/artifacts/plan/ |
| `_progress.json` | Heartbeat / progress | /Users/virginia.zambudio/PlaywrightAutomation/artifacts/plan/ |
| `00-index.md` | Living progress tracker | /Users/virginia.zambudio/PlaywrightAutomation/artifacts/plan/ |

## Validation Results

| Check | Result | Evidence |
|-------|--------|----------|
| 1. All 6 sections populated | PASS | grep for "pending - will be generated" returns 0 matches |
| 2. TC count stated (63) matches catalog | PASS | Section 2.9 Total = 63; FTC-MANIFEST Total = 63 |
| 3. Every TC has ID, title, type, priority, spec-file, POM(s) | PASS | All 8 subsections of Section 2 contain complete rows |
| 4. Every risk has category in {auth, locator, timing, data, environment, test logic} | PASS | R-01 auth, R-02 environment, R-03 environment, R-04 data, R-05 timing, R-06 locator, R-07 locator, R-08 test logic, R-09 environment, R-10 timing |
| 5. Every risk has specific mitigation | PASS | Section 3 — all 10 risks have concrete mitigations |
| 6. Code sketch imports from valid fixture path | PASS | All sketches import from `../helpers/fixtures` — confirmed path: repo:helpers/fixtures.ts |
| 7. Code sketch uses test.describe with tags | PASS | All describe blocks include @epic-XX + feature-area tags |
| 8. No hardcoded URLs in sketch | PASS | All URL refs use data-file constant references (e.g., `storeLocatorData.urls.storeLocator`) |
| 9. No raw expect()/locator.click() in sketch | PASS | All assertions are commented-out pseudocode inside test.step() blocks |
| 10. Assumptions section lists every locator gap and POM gap | PASS | Section 5.2 lists all 10 new-POM locator gaps; Section 5.3 lists all 12 LIKELY COVERED assumptions |

## Provenance Chain

| Source | Extracted To | Used In |
|--------|-------------|---------|
| FTC-MANIFEST-FTC-LONDONDRUGS-20260702.md | Section 1, 2, 6 | spec file strategy, TC catalog, open questions |
| suites/epic-01-func-tests.md through epic-08-func-tests.md | Section 2 (all subsections) | all 63 TC rows |
| context-pack/automation-standards.md | Section 1, 3, 5 | priority order, env rules, fixture pattern, data security rules |
| repo:pages/*.ts (6 files) | Section 1.3, 5.2, 5.4 | POM REUSE/EXTEND/NEW decisions, locator gap identification |
| repo:helpers/fixtures.ts | Section 4 (all sketches) | fixture import pattern confirmed |
| repo:tests/home-page.spec.ts | Section 1, 4, 5 | afterEach evidence pattern confirmed |
| repo:test-data/pdp.data.ts | Section 5.1 P-02/P-03 | env-var auth pattern confirmed |
| repo:playwright.config.ts | Section 5.4 A-04 | 60 s global timeout confirmed |
| repo:AGENTS.md | Section 5.1 P-07 | run commands confirmed |

## Duplicate Coverage Verdict

- **EPIC-01 home-page.spec.ts**: EXTEND — existing TC-83225–83232 partially overlap; 8–9 new tests needed
- **EPIC-02 plp.spec.ts**: EXTEND — existing TC-83233–83234 partially overlap; 5 new tests needed
- **EPIC-03 pdp.spec.ts**: EXTEND — existing TC-83235–83240 partially overlap; 7 new tests needed
- **EPIC-04–08**: NEW spec files — zero existing coverage confirmed

## Open Questions Summary

| ID | Blocking? | Resolved in Plan? |
|----|-----------|-------------------|
| OQ-01 | No | Partial — implementation must verify coverage overlap |
| OQ-02 | No | Documented in Section 3 R-02 |
| OQ-03 | Yes (FTC_08_02_01, FTC_08_02_05) | Tracked — requires UAT DOM inspection |
| OQ-04 | No | Tracked — storageState expiry unknown |
| OQ-05 | No | Tracked — cart API availability unknown |
| OQ-HAM-01 | Yes (FTC_01_06_xx) | Tracked — hamburger locator not in existing POM |
| OQ-CART-01 | No | Tracked |
| OQ-DEALS-01 | No | Tracked |
| OQ-MYREGISTRY-01 | No | Tracked |

## Validation Gate: PASS

All 10 checks passed. No skeleton stubs remain in PLAN-SPEC.
Total test cases planned: **63** across **8 epic suites** targeting **8 spec files**.

**Hard-stop:** This plan is ready for human review. Do NOT proceed to
`playwright-automation-implement` until this PLAN-SPEC is approved.
