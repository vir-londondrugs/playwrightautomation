/**
 * Page Load Strategy — Body-Click Unblocking
 *
 * The UAT London Drugs site (Next.js + Builder.io) sometimes gets stuck in a
 * "loading" state where a blocking overlay or an infinite spinner prevents user
 * interaction.  A synthetic body click reliably dismisses these overlays and
 * triggers the site's client-side hydration to complete.
 *
 * Usage:
 *
 *   import { simulateBodyClickToUnblock } from '../helpers/page-load';
 *
 *   await homePage.navigate(url);
 *   await simulateBodyClickToUnblock(page);
 *
 * This helper is intentionally thin — it wraps the pattern already used inside
 * `BasePage.dismissLoadingIfStuck()` so that individual spec files can call it
 * with a single descriptive name inside `test.step`.
 */

import { Page } from '@playwright/test';

/**
 * Simulates a body click to unblock page loading.
 *
 * After any navigation that may leave the page in a partially hydrated state,
 * call this helper to force-click the body element.  This action:
 *   1. Dismisses blocking overlays (cookie banners, permission prompts, etc.).
 *   2. Triggers React / Builder.io hydration if it stalled on the first render.
 *   3. Unlocks lazy-initialised event listeners that only attach after a click.
 *
 * The click uses `force: true` so it succeeds even when an overlay covers the
 * body and Playwright would otherwise refuse to click an obscured element.
 *
 * The 500ms wait after the click is intentional — it allows the Next.js / Builder.io
 * hydration cycle to complete before the next interaction. This is NOT a reliability
 * wait; it is the documented pattern from DISCOVERY-SPEC (Journey A step 2).
 */
export async function simulateBodyClickToUnblock(page: Page): Promise<void> {
    await page.locator('body').click({ force: true });
    await page.waitForTimeout(500);
}
