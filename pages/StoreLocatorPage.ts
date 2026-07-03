import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class StoreLocatorPage extends BasePage {
    /** Main heading on the Store Locator page */
    readonly heading: Locator;

    /**
     * "Find All Stores by Province" link.
     * UAT renders this as a relative href ("stores/all-stores") with no leading slash.
     * Using href*= (contains) makes the selector resilient to both relative and
     * absolute href variants (e.g. "/stores/all-stores") without breaking the match.
     * Confirmed from live UAT: exactly one such link exists on /stores.
     */
    readonly allStoresLink: Locator;

    /**
     * Province heading on the All Stores page (e.g. "British Columbia").
     * The /stores/all-stores page renders province groups as h2 headings followed
     * by store-card links -- confirmed from live UAT via SPA navigation from /stores.
     * Filtering by province name avoids false positives from other h2 elements
     * that may appear in the page header or footer during loading.
     * NOTE: this page only renders correctly via SPA navigation from /stores;
     * a direct full-page load triggers a loading spinner and no province content.
     */
    readonly storeList: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.locator('h1').filter({ hasText: 'Find a Store Near You' });
        // href*= matches both relative ("stores/all-stores") and absolute ("/stores/all-stores").
        // Confirmed on live UAT: exactly one such link exists on /stores.
        this.allStoresLink = page.locator('a[href*="all-stores"]').first();
        // /stores/all-stores renders province groups as h2 headings after SPA navigation.
        // Filtering for a known province name avoids false positives from other h2 elements
        // that may appear during loading or in footer/header areas.
        // Confirmed on live UAT (SPA navigation): "British Columbia" is always the first h2.
        this.storeList = page.locator('h2').filter({ hasText: /British Columbia|Alberta|Manitoba|Saskatchewan/ }).first();
    }
}
