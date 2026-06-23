import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
    /** Heading shown when a search returns zero results */
    readonly noResultsHeading: Locator;

    /** The global site search input (present in the header on all pages) */
    readonly searchInput: Locator;

    /**
     * Product name/title elements (h3) within the search results list.
     * Uses h3 to target product card titles specifically, avoiding section
     * headings (h1/h2) that may also contain the search term.
     */
    readonly productTitles: Locator;

    constructor(page: Page) {
        super(page);
        this.noResultsHeading = page.locator('h1').filter({ hasText: 'We are sorry, no results were found for' });
        this.searchInput = page.getByPlaceholder('Find your product').first();
        this.productTitles = page.locator('main h3');
    }

    /**
     * Returns headings (h2 section names or h3 product titles) within the
     * main content area that contain the given search term.
     * Covers both cases: term appears in a product name OR in a section heading.
     */
    headingsMatching(term: string): Locator {
        return this.page.locator('main h2, main h3').filter({ hasText: new RegExp(term, 'i') });
    }
}
