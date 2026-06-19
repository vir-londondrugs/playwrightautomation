import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    /** The London Drugs logo image inside the home anchor link */
    readonly logo: Locator;

    /** The global site search input field */
    readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.logo = page.locator('a[href="/"] img[alt="London Drugs"]').first();
        this.searchInput = page.getByPlaceholder('Find your product').first();
    }

    async clickLogo(): Promise<void> {
        await this.logo.waitFor({ state: 'visible' });
        await this.logo.click();
    }

    async search(term: string): Promise<void> {
        await this.searchInput.click();
        await this.searchInput.fill(term);
        await this.searchInput.press('Enter');
    }
}
