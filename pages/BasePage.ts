import { Page } from '@playwright/test';

/** Timeout (ms) to wait for the page to reach 'load' state before clicking to dismiss loaders */
const LOAD_STATE_TIMEOUT_MS = 15_000;

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
        await this.dismissLoadingIfStuck();
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
}
