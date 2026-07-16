import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
    // ── Breadcrumbs ───────────────────────────────────────────────────────────

    /** Full breadcrumbs nav */
    readonly breadcrumbsNav: Locator;

    /**
     * Second-level breadcrumb link (first category after "Home").
     * Breadcrumb structure: Home > Category > [SubCategory] > Product.
     * The second <li> (index 1) holds the first category link.
     */
    readonly secondLevelBreadcrumb: Locator;

    // ── Price ─────────────────────────────────────────────────────────────────

    /** "Our Price" label */
    readonly priceLabel: Locator;

    /**
     * Price value element showing the formatted price (e.g. "$3.19").
     * UAT renders price in a <p class="text-2xl text-txtprimary">.
     */
    readonly priceValue: Locator;

    // ── Availability ──────────────────────────────────────────────────────────

    /**
     * The availability section container.
     * Always visible on PDP; text changes based on store selection.
     */
    readonly availabilitySection: Locator;

    /** "Availability:" heading label inside the section */
    readonly availabilityLabel: Locator;

    // ── Fulfillment options ───────────────────────────────────────────────────

    /** In-Store Pickup fulfillment radio */
    readonly inStorePickupRadio: Locator;

    /** Ship to Home fulfillment radio */
    readonly shipToHomeRadio: Locator;

    /**
     * Fulfillment label inside the Add to Cart button area.
     * Shows "for Ship to Home", "for Ship To My Store", etc.
     */
    readonly fulfillmentLabel: Locator;

    // ── Store selector (In-Store Pickup) ──────────────────────────────────────

    /**
     * "Set your store" link shown in the Availability section when no store is set.
     * Opens `dialog#store-selector`.
     */
    readonly setYourStoreLink: Locator;

    /** Store-selector modal dialog */
    readonly storeSelectorDialog: Locator;

    /** Postal code / city search input inside the store selector dialog */
    readonly storeSelectorSearchInput: Locator;

    /** "SEARCH STORES" submit button inside the store selector dialog */
    readonly storeSelectorSearchButton: Locator;

    /**
     * First "Set Store" button in the store selector results.
     * UAT renders each result with a `button.primary-button` labelled "Set Store".
     * Index 0 is the close button; index 1 onward are the store result CTA buttons.
     */
    readonly firstSetStoreButton: Locator;

    // ── Postal code modal (Ship to Home) ──────────────────────────────────────

    /**
     * "Change Postal Code" link inside the Ship to Home section.
     * Opens `dialog.modal` (a daisyUI `<dialog>`) for entering a delivery postal code.
     */
    readonly changePostalCodeLink: Locator;

    /** Delivery location modal dialog (daisyUI: `<dialog class="modal">`) */
    readonly deliveryLocationModal: Locator;

    /** Postal code text input inside the delivery location modal */
    readonly postalCodeInput: Locator;

    /**
     * "UPDATE DELIVERY LOCATION" submit button in the delivery location modal.
     * Identified by its `data-label` attribute which was confirmed on live UAT.
     */
    readonly updateDeliveryLocationButton: Locator;

    // ── Add to Cart ───────────────────────────────────────────────────────────

    /** Add to Cart primary CTA button */
    readonly addToCartButton: Locator;

    /**
     * "View Cart & Checkout" confirmation button that appears after a successful
     * Add to Cart action on the product page.
     */
    readonly viewCartAndCheckoutButton: Locator;

    // ── Mini cart badge ───────────────────────────────────────────────────────

    /**
     * Mini cart badge counter element inside the cart icon header button.
     * Shows the current number of items in the cart.
     */
    readonly miniCartBadge: Locator;

    // ── Wishlist ──────────────────────────────────────────────────────────────

    /**
     * Heart/wishlist icon button on the PDP.
     * Clicking this when authenticated adds the product to the user's wishlist.
     */
    readonly wishlistButton: Locator;

    constructor(page: Page) {
        super(page);

        // Breadcrumbs
        this.breadcrumbsNav = page.locator('nav.breadcrumbs');
        this.secondLevelBreadcrumb = page.locator('nav.breadcrumbs ul li:nth-child(2) a');

        // Price
        this.priceLabel = page.locator('main section h3').filter({ hasText: /our price/i });
        this.priceValue = page.locator('main section p.text-2xl').first();

        // Availability
        this.availabilitySection = page.locator('main section').filter({ hasText: /Availability:/i }).first();
        this.availabilityLabel = page.locator('main section h4').filter({ hasText: /Availability:/i }).first();

        // Fulfillment radios
        this.inStorePickupRadio = page.locator('input[aria-label="Product Ship to Store Pickup Fulfillment Type"]');
        this.shipToHomeRadio = page.locator('input[aria-label="Product Ship To Home Fulfillment Type"]');
        this.fulfillmentLabel = page.locator('span#fulfillment-label');

        // Store selector
        this.setYourStoreLink = page.locator('p.cursor-pointer.text-primary').filter({ hasText: /set your store/i }).first();
        this.storeSelectorDialog = page.locator('dialog#store-selector');
        this.storeSelectorSearchInput = page.locator('dialog#store-selector input[name="searchTerm"]');
        // Primary buttons inside the dialog: index 0 = SEARCH STORES, index 1+ = Set Store per result
        this.storeSelectorSearchButton = page.locator('dialog#store-selector button.primary-button').first();
        this.firstSetStoreButton = page.locator('dialog#store-selector button.primary-button').nth(1);

        // Delivery location modal (Ship to Home postal code)
        this.changePostalCodeLink = page.locator('p.cursor-pointer.text-primary').filter({ hasText: /change postal code/i }).first();
        this.deliveryLocationModal = page.locator('dialog.modal');
        this.postalCodeInput = page.locator('input[name="zipCode"]');
        this.updateDeliveryLocationButton = page.locator('button[data-label="update delivery location"]');

        // Add to Cart
        this.addToCartButton = page.locator('button[aria-label="Add to cart button"]');
        this.viewCartAndCheckoutButton = page.locator('button', { hasText: 'View Cart & Checkout' });

        // Mini cart badge (two exist in DOM for responsive breakpoints; first is sufficient)
        this.miniCartBadge = page.locator('button[aria-label="Show Mini Cart Items"] div[class*="bottom-1"]').first();

        // Wishlist
        this.wishlistButton = page.locator('button[aria-label="Add product to wishlist heart button"]');
    }

    // ── Lifecycle helpers ─────────────────────────────────────────────────────

    /**
     * Waits for the Product Detail Page to be fully loaded and interactive.
     * Waits for the product H1 heading to be visible, then simulates a body
     * click to unblock Next.js / Builder.io hydration stalls.
     * Call after every navigation to the PDP.
     */
    async waitForPdp(): Promise<void> {
        await this.page.locator('h1').first().waitFor({ state: 'visible', timeout: 15_000 });
        await this.page.locator('body').click({ force: true });
        await this.page.waitForTimeout(500);
    }

    /**
     * Reads and returns the `href` attribute of the second-level breadcrumb link.
     * Used to validate the expected navigation target before clicking.
     */
    async getBreadcrumbHref(): Promise<string> {
        await this.secondLevelBreadcrumb.waitFor({ state: 'visible', timeout: 10_000 });
        return (await this.secondLevelBreadcrumb.getAttribute('href') ?? '').trim();
    }

    /**
     * Clicks the second-level breadcrumb link and waits for navigation to a
     * category URL pattern (/category/).
     */
    async clickSecondBreadcrumb(): Promise<void> {
        await this.secondLevelBreadcrumb.waitFor({ state: 'visible', timeout: 10_000 });
        await this.secondLevelBreadcrumb.click();
        await this.page.waitForURL(/\/category\//, { timeout: 15_000 });
    }

    /**
     * Returns the text content of the price value element.
     * Expected format: $X.XX (e.g. "$3.19", "$12.49").
     */
    async getPriceText(): Promise<string> {
        await this.priceValue.waitFor({ state: 'visible', timeout: 10_000 });
        return (await this.priceValue.textContent() ?? '').trim();
    }

    /**
     * Ensures the Ship to Home fulfillment radio is selected.
     * If not already checked, clicks it and waits for confirmation.
     * Ship to Home is the default option; this method handles cases where
     * In-Store Pickup may have been activated by a prior interaction.
     */
    async ensureShipToHomeSelected(): Promise<void> {
        const isChecked = await this.shipToHomeRadio.isChecked().catch(() => false);
        if (!isChecked) {
            await this.shipToHomeRadio.click();
        }
        await this.page.waitForFunction(
            (selector: string) => {
                const el = document.querySelector<HTMLInputElement>(selector);
                return el !== null && el.checked;
            },
            'input[aria-label="Product Ship To Home Fulfillment Type"]',
            { timeout: 10_000 }
        );
    }

    /**
     * Clicks the wishlist heart button to add (or toggle) the current product
     * in the authenticated user's wishlist.
     * Requires the user to be authenticated before calling.
     */
    async clickWishlist(): Promise<void> {
        await this.wishlistButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.wishlistButton.click();
    }

    // ── Cart / Mini cart helpers ───────────────────────────────────────────────

    /**
     * Reads the current mini cart badge count.
     * Returns 0 when the badge element is not yet visible.
     */
    async getMiniCartCount(): Promise<number> {
        try {
            const text = await this.miniCartBadge.textContent({ timeout: 5_000 });
            return parseInt(text?.trim() ?? '0', 10) || 0;
        } catch {
            return 0;
        }
    }

    /**
     * Opens the store selector dialog and waits for it to be visible.
     *
     * Two states are handled:
     *   1. No store set yet  -- a "Set your store" link is visible.
     *   2. Store already set -- the site (e.g. via geolocation on Firefox/WebKit)
     *      pre-selects a store, replacing the "Set your store" link with
     *      "Check Availability at other stores". Clicking that link also opens
     *      the `dialog#store-selector` so the rest of the flow is identical.
     *
     * Scrolls to the fulfillment section first to ensure intersection-observer
     * elements are mounted before waiting.
     *
     * Firefox / WebKit note: `inStorePickupRadio` may not be present on products
     * that only offer Ship to Home. We use a two-step scroll strategy:
     *   1. Try scrollIntoViewIfNeeded on the pickup radio (silently ignored if missing).
     *   2. Fallback: scroll to ~60 % of the page height to bring the fulfillment
     *      section — and with it the "Set your store" link — into the viewport and
     *      trigger any remaining IntersectionObservers.
     */
    async openStoreSelectorDialog(): Promise<void> {
        // Step 1: attempt to scroll via the In-Store Pickup radio (may not exist).
        await this.inStorePickupRadio
            .scrollIntoViewIfNeeded({ timeout: 5_000 })
            .catch(() => undefined);

        // Step 2: attempt to scroll via the "Set your store" link itself.
        // If it is already in the DOM (even before full hydration) this brings it
        // into view and triggers the IntersectionObserver.
        await this.setYourStoreLink
            .scrollIntoViewIfNeeded({ timeout: 5_000 })
            .catch(() => undefined);

        // Step 3: fixed proportional scroll to ensure the fulfillment area
        // (roughly 60-80 % down most PDP pages) enters the viewport.
        // This is the safest fallback for Firefox and WebKit where the above
        // scrollIntoViewIfNeeded calls may silently fail.
        await this.page.evaluate(() => {
            window.scrollBy(0, Math.round(document.body.scrollHeight * 0.6));
        });

        // Allow intersection-observer driven elements to mount after scrolling.
        // Firefox and WebKit hydrate more slowly than Chromium; 3 s is safe.
        await this.page.waitForTimeout(3_000);

        const checkAvailabilityLink = this.page
            .locator('p.cursor-pointer')
            .filter({ hasText: /check availability at other stores/i })
            .first();

        // Try "Set your store" first (no store set yet). Use a 12 s window to
        // accommodate slower Firefox / WebKit hydration.
        let setStoreVisible = false;
        try {
            await this.setYourStoreLink.waitFor({ state: 'visible', timeout: 12_000 });
            setStoreVisible = true;
        } catch {
            setStoreVisible = false;
        }

        if (setStoreVisible) {
            await this.setYourStoreLink.click();
        } else {
            // Store was pre-selected (geolocation). Click "Check Availability at
            // other stores" to open the same dialog.
            await checkAvailabilityLink.waitFor({ state: 'visible', timeout: 15_000 });
            await checkAvailabilityLink.click();
        }

        await this.storeSelectorDialog.waitFor({ state: 'visible', timeout: 10_000 });
    }

    /**
     * Searches for stores by postal code/city in the store selector dialog
     * and waits for search results to appear (first "Set Store" button visible).
     *
     * Increased timeout to 30 s: Firefox and WebKit are slower than Chromium at
     * fetching store search results from the UAT API, and 15 s was insufficient.
     */
    async searchStores(postalCode: string): Promise<void> {
        await this.storeSelectorSearchInput.waitFor({ state: 'visible', timeout: 10_000 });
        await this.storeSelectorSearchInput.fill(postalCode);
        await this.storeSelectorSearchButton.click();
        await this.firstSetStoreButton.waitFor({ state: 'visible', timeout: 30_000 });
    }

    /**
     * Selects the first store from the search results and waits for the dialog
     * to close, confirming the store has been set.
     */
    async selectFirstStore(): Promise<void> {
        await this.firstSetStoreButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.firstSetStoreButton.click();
        await this.storeSelectorDialog.waitFor({ state: 'hidden', timeout: 10_000 });
    }

    /**
     * Opens the delivery location modal (via "Change Postal Code" link) and waits
     * for the postal code input to be ready.
     */
    async openDeliveryLocationModal(): Promise<void> {
        await this.changePostalCodeLink.waitFor({ state: 'visible', timeout: 15_000 });
        await this.changePostalCodeLink.click();
        await this.postalCodeInput.waitFor({ state: 'visible', timeout: 10_000 });
    }

    /**
     * Fills in the postal code and submits the delivery location modal.
     * Waits for the modal to close after submission.
     */
    async setDeliveryPostalCode(postalCode: string): Promise<void> {
        await this.postalCodeInput.fill(postalCode);
        await this.updateDeliveryLocationButton.click();
        // Modal closes programmatically; wait for it to be removed/hidden
        await this.deliveryLocationModal.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {
            // Some renders close via CSS; fallback — just wait briefly
        });
    }

    /**
     * Adds the current product to the cart and waits for the "View Cart & Checkout"
     * confirmation button to appear, which confirms a successful add.
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.waitFor({ state: 'visible', timeout: 10_000 });
        await this.addToCartButton.click();
        await this.viewCartAndCheckoutButton.waitFor({ state: 'visible', timeout: 20_000 });
    }
}
