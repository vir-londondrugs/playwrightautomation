import { Page } from '@playwright/test';

/** Timeout (ms) to wait for the page to reach 'load' state before clicking to dismiss loaders */
const LOAD_STATE_TIMEOUT_MS = 15_000;

/**
 * Timeout (ms) to wait for the site's React/Next.js app shell (header) to hydrate.
 * On the UAT origin the SPA may finish 'load' before the header is interactive.
 */
const HYDRATION_TIMEOUT_MS = 20_000;

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
        await this.dismissLoadingIfStuck();
        // After 'load', the Next.js app may still be hydrating (React errors are
        // hydration mismatches that leave a loading spinner visible).
        // Wait for the site header to appear as a signal that hydration completed.
        await this.waitForAppShell();
    }

    /**
     * Waits for the page to fully load. If it stays stuck in a loading state
     * beyond the threshold, clicks the page body to dismiss overlays/spinners
     * and gives the page another chance to finish loading.
     */
    async dismissLoadingIfStuck(): Promise<void> {
        try {
            await this.page.waitForLoadState('load', { timeout: LOAD_STATE_TIMEOUT_MS });
        } catch {
            // Page did not reach 'load' state in time: click body to dismiss
            // any blocking overlay or infinite spinner and wait once more
            await this.page.locator('body').click({ force: true });
            await this.page.waitForLoadState('domcontentloaded');
        }
    }

    /**
     * Waits for the site's app shell (header element) to become visible,
     * confirming that the Next.js/React SPA has hydrated past the loading state.
     * Silently continues if the header does not appear within the timeout -- some
     * pages (e.g. login redirect) may render without a standard header.
     */
    async waitForAppShell(): Promise<void> {
        try {
            await this.page.locator('header').first().waitFor({
                state: 'visible',
                timeout: HYDRATION_TIMEOUT_MS,
            });
        } catch {
            // Header did not appear -- page may be mid-redirect or a login page.
            // Click body to unblock any remaining hydration overlay and continue.
            await this.page.locator('body').click({ force: true }).catch(() => undefined);
        }
    }
}
