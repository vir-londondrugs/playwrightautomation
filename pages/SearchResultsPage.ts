import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
    /** "Nothing found!" heading shown when a search returns zero results */
    readonly noResultsHeading: Locator;

    /** The global site search input (present in the header on all pages) */
    readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        //this.noResultsHeading = page.locator('h2:text("Nothing found!")');
        this.noResultsHeading = page.locator('h1').filter({ hasText: 'We are sorry, no results were found for' });
        this.searchInput = page.getByPlaceholder('Find your product').first();
    }
}
