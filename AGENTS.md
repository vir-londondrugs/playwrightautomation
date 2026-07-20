# AGENTS.md — Project conventions for Coda / AI agents

## Test case source of truth

**The canonical test case file is:**

```
artifacts/inputs/UAT - Regression testing - Master plan_UAT - Regression testing - Master plan.csv
```

All agents must read test cases **exclusively from this file**.  
Do **not** use any of the following legacy files:

- `artifacts/inputs/playwright_test_cases.csv`
- `artifacts/inputs/playwright_test_cases_backup.csv`
- `artifacts/inputs/playwright_test_cases copy.csv`
- `artifacts/inputs/playwright_test_cases.json`

If a task requires parsing, updating, or referencing test cases, always resolve the path to:

```
/Users/virginia.zambudio/PlaywrightAutomation/artifacts/inputs/UAT - Regression testing - Master plan_UAT - Regression testing - Master plan.csv
```

## Project structure

| Path | Purpose |
|---|---|
| `tests/` | Playwright spec files |
| `pages/` | Page Object Model classes |
| `helpers/evidence.ts` | Screenshot helper (saves to `artifacts/outputs/`) |
| `test-data/` | Static test data (URLs, selectors, expected values) |
| `artifacts/inputs/` | Test case CSV — use canonical file above |
| `artifacts/outputs/` | Evidence screenshots (auto-generated) |

## Azure DevOps

- Project: `LD.com - Globant`
- Test case IDs currently automated: 83225, 83226, 83227, 83228, 83229, 83230
- Environment under test (UAT): `https://london-drugs-uat-origin.kibology.us/`

## Commands

```bash
# Run all tests (headless by default)
npx playwright test

# Run with browsers visible
HEADED=1 npx playwright test

# Run with interactive UI
npx playwright test --ui

# Run a specific test file (headless)
npx playwright test tests/home-page.spec.ts

# Run a specific test file with browsers visible
HEADED=1 npx playwright test tests/home-page.spec.ts
```
