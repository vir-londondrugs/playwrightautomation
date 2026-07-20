import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage -- covers the PLP (Product Listing Page) rendered at /search?q=<term>
 * and /search?text=<term> on the London Drugs UAT site.
 *
 * Existing locators (MCP-validated in discovery session):
 *   noResultsHeading, searchInput, productTitles, firstProductLink
 *
 * New locators (MCP-validated, DISCOVERY-SPEC-DISCOVERY-PLI-20260713.md, PO-03):
 *   resultsHeading, filterTrigger, filterDrawer, facetAccordion,
 *   filterCheckboxes, applyFiltersButton, clearFiltersButton,
 *   sortButton, sortOptions, productCardLink
 */
export class SearchResultsPage extends BasePage {
    // ---- Existing locators (unchanged) ----------------------------------------

    /** Heading shown when a search returns zero results. */
    readonly noResultsHeading: Locator;

    /** The global site search input (present in the header on all pages). */
    readonly searchInput: Locator;

    /**
     * Product name/title elements (h3) within the search results list.
     * Uses h3 to target product card titles specifically, avoiding section
     * headings (h1/h2) that may also contain the search term.
     */
    readonly productTitles: Locator;

    /**
     * First product-detail page link in the search results.
     * Product URLs on this site always contain "/products/", so this
     * targets the first such anchor inside main.
     * Catalog-agnostic: no SKU or product name is hardcoded.
     */
    readonly firstProductLink: Locator;

    // ---- New PLP filter locators (MCP-validated, PO-03) -----------------------

    /**
     * "Results for X" heading rendered at the top of a successful PLP.
     * MCP-validated: h1:has-text('Results for') (DISCOVERY-SPEC PO-03).
     */
    readonly resultsHeading: Locator;

    /**
     * Filter drawer trigger button (label element).
     * MCP-validated: label.drawer-button (DISCOVERY-SPEC PO-03).
     */
    readonly filterTrigger: Locator;

    /**
     * The sliding filter drawer container shown after clicking filterTrigger.
     * MCP-validated: section.drawer-side.z-20.h-full (DISCOVERY-SPEC PO-03).
     */
    readonly filterDrawer: Locator;

    /**
     * Facet accordion toggle input inside the filter drawer.
     * MCP-validated: input[name='facet-accordion'] (DISCOVERY-SPEC PO-03).
     */
    readonly facetAccordion: Locator;

    /**
     * All filter checkboxes inside facet accordion items.
     * MCP-validated: label.label.cursor-pointer input[type='checkbox'].checkbox (DISCOVERY-SPEC PO-03).
     */
    readonly filterCheckboxes: Locator;

    /**
     * "Show results" button that applies the selected filters.
     * MCP-validated: button.primary-button.w-1\/2 (DISCOVERY-SPEC PO-03).
     */
    readonly applyFiltersButton: Locator;

    /**
     * "Clear" button that removes all selected filters.
     * MCP-validated: button.secondary-button.w-1\/2 (DISCOVERY-SPEC PO-03).
     */
    readonly clearFiltersButton: Locator;

    // ---- New PLP sort locators (MCP-validated, PO-03) -------------------------

    /**
     * Sort overlay trigger button with data-category attribute.
     * MCP-validated: button[data-category='overlay:sort'] (DISCOVERY-SPEC PO-03).
     */
    readonly sortButton: Locator;

    /**
     * Sort option items inside the sort overlay.
     * MCP-validated: li.cursor-pointer.text-sm (DISCOVERY-SPEC PO-03).
     */
    readonly sortOptions: Locator;

    /**
     * Product card links in the results list.
     * MCP-validated: a[data-action='product click'][data-category='product list'] (DISCOVERY-SPEC PO-03).
     */
    readonly productCardLink: Locator;

    constructor(page: Page) {
        super(page);

        // Existing locators
        // Broad regex covers UAT/prod variants: "We are sorry, no results were found",
        // "No results found", "Nothing found", etc. Also matches role=heading elements
        // in case the tag is not h1 (observed on some WebKit renders).
        this.noResultsHeading = page.locator('h1, [role="heading"]').filter({ hasText: /no results|we are sorry|sorry.*no|nothing found/i }).first();
        this.searchInput = page.getByPlaceholder('Find your product').first();
        this.productTitles = page.locator('main h3');
        this.firstProductLink = page.locator('main a[href*="/products/"]').first();

        // New PLP filter locators (MCP-validated)
        this.resultsHeading = page.locator('h1:has-text("Results for")');
        this.filterTrigger = page.locator('label.drawer-button');
        this.filterDrawer = page.locator('section.drawer-side.z-20.h-full');
        this.facetAccordion = page.locator('input[name="facet-accordion"]');
        this.filterCheckboxes = page.locator('label.label.cursor-pointer input[type="checkbox"].checkbox');
        this.applyFiltersButton = page.locator('button.primary-button.w-1\\/2');
        this.clearFiltersButton = page.locator('button.secondary-button.w-1\\/2');

        // New PLP sort locators (MCP-validated)
        this.sortButton = page.locator('button[data-category="overlay:sort"]');
        this.sortOptions = page.locator('li.cursor-pointer.text-sm');
        this.productCardLink = page.locator('a[data-action="product click"][data-category="product list"]');
    }

    // ---- Existing method (unchanged) ------------------------------------------

    /**
     * Returns headings (h2 section names or h3 product titles) within the
     * main content area that contain the given search term.
     * Covers both cases: term appears in a product name OR in a section heading.
     */
    headingsMatching(term: string): Locator {
        return this.page.locator('main h2, main h3').filter({ hasText: new RegExp(term, 'i') });
    }

    // ---- New PLP filter methods ------------------------------------------------

    /**
     * Waits for the results heading to be visible after a search.
     * Reliable indicator that the PLP has rendered product results.
     *
     * @param timeoutMs - Maximum ms to wait. Default 30 000 ms.
     */
    async waitForResultsHeading(timeoutMs: number = 30_000): Promise<void> {
        await this.resultsHeading.waitFor({ state: 'visible', timeout: timeoutMs });
    }

    /**
     * Opens the filter drawer by clicking the filterTrigger label.
     * Waits for the filterDrawer section to become visible, then expands the first
     * facet accordion (MCP-validated: accordion sections are collapsed by default --
     * filter checkboxes inside .collapse-content are not interactable until expanded).
     */
    async openFilterDrawer(): Promise<void> {
        await this.filterTrigger.first().waitFor({ state: 'visible', timeout: 15_000 });
        await this.filterTrigger.first().click();
        await this.filterDrawer.waitFor({ state: 'visible', timeout: 10_000 });
        // Expand the first accordion so its filter checkboxes become interactable.
        // input[name='facet-accordion'] is the CSS collapse toggle for each accordion section.
        await this.facetAccordion.first().waitFor({ state: 'attached', timeout: 5_000 });
        // Scroll the accordion toggle into view (may be off-screen after URL navigation).
        await this.facetAccordion.first().scrollIntoViewIfNeeded();
        // dispatchEvent bypasses viewport-clipping checks (needed on WebKit where
        // force:true still raises "Element is outside of the viewport").
        await this.facetAccordion.first().dispatchEvent('click');
        // Wait for at least one filter checkbox to become visible after expanding.
        await this.filterCheckboxes.first().waitFor({ state: 'visible', timeout: 5_000 });
    }

    /**
     * Clicks the nth (0-based) filter checkbox inside the filter drawer.
     * Precondition: openFilterDrawer() must have been called (accordion expanded).
     *
     * @param index - 0-based index of the checkbox to click.
     */
    async clickFilterCheckbox(index: number): Promise<void> {
        const checkboxes = this.filterCheckboxes;
        // Click via the parent label to trigger the React checkbox state change reliably.
        const labels = this.page.locator('label.label.cursor-pointer');
        await labels.nth(index).waitFor({ state: 'visible', timeout: 10_000 });
        await labels.nth(index).click();
    }

    /**
     * Clicks the "Show results" button to apply selected filters and waits
     * for the page URL to change (reflecting the applied facet parameters).
     *
     * @param timeoutMs - Maximum ms to wait for URL change. Default 15 000 ms.
     */
    async applyFilters(timeoutMs: number = 15_000): Promise<void> {
        const urlBefore = this.page.url();
        await this.applyFiltersButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.applyFiltersButton.click();
        // Wait for URL to include a filter query parameter after apply.
        await this.page.waitForURL(
            (url) => url.toString() !== urlBefore,
            { timeout: timeoutMs },
        );
    }

    /**
     * Clicks the "Clear" button to remove all selected filters and waits
     * for the page URL to revert to the unfiltered state.
     *
     * @param timeoutMs - Maximum ms to wait for URL change. Default 15 000 ms.
     */
    async clearFilters(timeoutMs: number = 15_000): Promise<void> {
        const urlBefore = this.page.url();
        await this.clearFiltersButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.clearFiltersButton.click();
        await this.page.waitForURL(
            (url) => url.toString() !== urlBefore,
            { timeout: timeoutMs },
        );
    }

    // ---- New PLP sort methods --------------------------------------------------

    /**
     * Opens the sort overlay by clicking the sortButton.
     * Waits for at least one sort option (li) to be visible before returning.
     *
     * Includes a single retry: if the sort options don't appear after the first
     * click (e.g. page is still settling after a previous sort/redirect), the
     * button is clicked a second time before raising a timeout error.
     */
    async openSortOverlay(): Promise<void> {
        await this.sortButton.waitFor({ state: 'visible', timeout: 15_000 });
        await this.sortButton.click();
        // Retry once if sort options don't become visible in a short window.
        const optionsVisible = await this.sortOptions.first()
            .waitFor({ state: 'visible', timeout: 8_000 })
            .then(() => true)
            .catch(() => false);
        if (!optionsVisible) {
            await this.sortButton.waitFor({ state: 'visible', timeout: 5_000 });
            await this.sortButton.click();
            await this.sortOptions.first().waitFor({ state: 'visible', timeout: 10_000 });
        }
    }

    /**
     * Selects a sort option by its 0-based index from the sort overlay.
     * Precondition: openSortOverlay() must have been called first.
     *
     * @param index - 0-based index of the sort option to select.
     */
    async selectSortOption(index: number): Promise<void> {
        await this.sortOptions.nth(index).waitFor({ state: 'visible', timeout: 5_000 });
        await this.sortOptions.nth(index).click();
    }
}
