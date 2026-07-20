/**
 * fixtures.ts -- Extended Playwright test with auto-applied anti-bot measures
 *
 * This module re-exports a `test` object that extends the base Playwright
 * `test` with a custom `page` fixture.  The fixture automatically calls
 * applyAntiBotMeasures() before yielding the page to each test, so every
 * spec that imports from this file gets DataDome protection for free.
 *
 * USAGE
 * -----
 * In any spec file, replace:
 *
 *   import { test, expect } from '@playwright/test';
 *
 * with:
 *
 *   import { test, expect } from '../helpers/fixtures';
 *
 * Everything else in the spec file stays the same.
 *
 * WHY NOT MODIFY playwright.config.ts?
 * -------------------------------------
 * Playwright does not support page.addInitScript() or page.route() inside
 * playwright.config.ts -- those are runtime page-level APIs.  The fixture
 * pattern is the official Playwright-recommended way to share page setup
 * across all tests without repeating code in every spec.
 */

import { test as base, expect, Page } from '@playwright/test';
import { applyAntiBotMeasures } from './anti-bot';

/** Empty object -- no additional fixtures are added beyond the overridden page. */
type AntiBotFixtures = {
  page: Page;
};

export const test = base.extend<AntiBotFixtures>({
  page: async ({ page }, use) => {
    /* Apply DataDome / WAF mitigations before the first navigation. */
    await applyAntiBotMeasures(page);
    /* Yield the protected page to the test body. */
    await use(page);
  },
});

export { expect };
