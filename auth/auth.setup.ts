/**
 * Authentication Setup — Playwright Project Dependency
 *
 * This file is the setup step for the `auth` Playwright project (Option A:
 * project-dependency pattern, Playwright 1.61+).
 *
 * Purpose:
 *   Log in to the London Drugs UAT site with a test account and save the
 *   authenticated browser state (cookies + localStorage) to `auth/user.json`.
 *   The `pdp-auth` project then loads this storageState so TC-83240 starts
 *   already authenticated without re-logging in during the test run.
 *
 * Prerequisites:
 *   - Set environment variables TEST_USER_EMAIL and TEST_USER_PASSWORD (never
 *     hardcode credentials — see .env.example).
 *   - `auth/user.json` is gitignored (contains session tokens).
 *
 * Activation:
 *   Add the following to playwright.config.ts projects array:
 *
 *     {
 *       name: 'auth',
 *       testMatch: /auth\/auth\.setup\.ts/,
 *     },
 *     {
 *       name: 'pdp-auth',
 *       dependencies: ['auth'],
 *       use: {
 *         ...devices['Desktop Chrome'],
 *         storageState: 'auth/user.json',
 *       },
 *     },
 *
 *   Run the auth project alone with:
 *     npx playwright test auth/auth.setup.ts
 */

import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { simulateBodyClickToUnblock } from '../helpers/page-load';

/** Path where the authenticated session state will be saved */
const STORAGE_STATE_PATH = 'auth/user.json';

setup('authenticate and save storage state', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const email = process.env['TEST_USER_EMAIL'];
    const password = process.env['TEST_USER_PASSWORD'];

    if (!email || !password) {
        throw new Error(
            'TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables must be set. ' +
            'Copy .env.example to .env and fill in the credentials.'
        );
    }

    // Navigate to login page and complete authentication
    await loginPage.login(email, password);
    await simulateBodyClickToUnblock(page);

    // Save the authenticated browser state for reuse in TC-83240
    await page.context().storageState({ path: STORAGE_STATE_PATH });
});
