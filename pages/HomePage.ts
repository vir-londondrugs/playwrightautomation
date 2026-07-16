import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    /** The London Drugs logo image inside the home anchor link */
    readonly logo: Locator;

    /** The global site search input field */
    readonly searchInput: Locator;

    /** Header link to the Store Locator page */
    readonly storesLink: Locator;

    /** Mini cart icon button in the header */
    readonly miniCartButton: Locator;

    /** Mini cart slide-out panel that appears after clicking the cart icon */
    readonly miniCartPanel: Locator;

    /** "View Cart" button/link inside the mini cart panel (UAT label) */
    readonly proceedToCheckoutButton: Locator;

    /** Hamburger / mega menu toggle button in the header */
    readonly megaMenuButton: Locator;

    /** Mega menu container that opens after clicking the hamburger button */
    readonly megaMenu: Locator;

    // -- Header navigation links (TC-83231) ----------------------------------

    /** "Deals & Events" link in the top header nav */
    readonly dealsLink: Locator;

    /** "Services" link in the top header nav */
    readonly servicesLink: Locator;

    /** "Flyers" link in the top header nav */
    readonly flyersLink: Locator;

    /** "Gift Registry" link in the top header nav */
    readonly giftRegistryLink: Locator;

    // -- Footer newsletter signup (TC-83232) ---------------------------------

    /** Email input in the footer newsletter signup form */
    readonly newsletterEmailInput: Locator;

    /** Submit button ("SIGN UP") in the footer newsletter signup form */
    readonly newsletterSubmitButton: Locator;

    constructor(page: Page) {
        super(page);
        this.logo = page.locator('a[href="/"] img[alt="London Drugs"]').first();
        this.searchInput = page.getByPlaceholder('Find your product').first();
        this.storesLink = page.locator('a[href="/stores"]').first();
        this.miniCartButton = page.locator('button[aria-label="Show Mini Cart Items"]').first();
        // Mini-cart panel: confirmed on UAT as an absolute z-50 div with min-w-80.
        // Always present in DOM regardless of cart state; using min-w-80 makes the selector
        // unique to this panel (no other z-50 element has min-w-80 on the page).
        this.miniCartPanel = page.locator('div[class*="z-50"][class*="min-w-80"]').first();
        // Checkout CTA inside the mini-cart panel: UAT shows "View Cart" (not "Proceed to Checkout").
        // button.primary-button.w-full confirmed on live UAT DOM inspection.
        this.proceedToCheckoutButton = page.locator('button.primary-button.w-full').filter({ hasText: 'View Cart' }).first();
        // Mega-menu button: three are in the DOM for responsive breakpoints; :visible picks the rendered one.
        this.megaMenuButton = page.locator('button[aria-label="Opens Mega Menu"]:visible').first();
        // Mega-menu container: confirmed on UAT as a <div> with class containing "bg-txtmegamenu-secondary".
        // There are two such divs: the first is the mobile drawer (lg:hidden), the second is the
        // persistent desktop nav (lg:flex). Using .last() targets the always-visible desktop nav
        // that becomes the verified "mega menu is open" state at Desktop Chrome viewport.
        this.megaMenu = page.locator('div[class*="bg-txtmegamenu-secondary"]').last();

        // Header nav links -- confirmed hrefs from live UAT DOM inspection.
        this.dealsLink = page.locator('header a[href="/category/deals-and-events/c/1027"]').first();
        this.servicesLink = page.locator('header a[href="/our-services"]').first();
        this.flyersLink = page.locator('header a[href="/flyer"]').first();
        this.giftRegistryLink = page.locator('header a[href="/myaccount/wishlist#registry"]').first();

        // Newsletter signup section -- confirmed from live UAT DOM inspection (2026-07-08).
        // The section is a <div class="...bg-primary..."> directly under <body> (NOT inside
        // <footer>). The email input has placeholder "Enter your email" and type="email".
        // The button text is "SIGN UP".
        // The section is present in the DOM on page load but requires scrolling to become
        // visible (intersection-observer driven rendering).
        this.newsletterEmailInput = page.locator('div.bg-primary input[type="email"]').first();
        this.newsletterSubmitButton = page.locator('div.bg-primary button[type="submit"]').filter({ hasText: /sign up/i }).first();
    }

    async clickLogo(): Promise<void> {
        await this.logo.waitFor({ state: 'visible' });
        await this.logo.click();
    }

    /**
     * Waits for the search input to be visible and enabled (React hydration complete).
     * Call this after navigate() before interacting with the search input.
     *
     * Uses a try/catch fallback to handle cross-browser timing differences
     * (Edge, WebKit) where React hydration may delay the locator resolution.
     */
    async waitForSearchInput(): Promise<void> {
        try {
            await this.searchInput.waitFor({ state: 'visible', timeout: 60_000 });
        } catch {
            // Fallback for browsers where the Playwright locator resolves late:
            // wait directly on the DOM for the input to exist and be interactive.
            await this.page.waitForSelector('input[placeholder="Find your product"]', {
                state: 'visible',
                timeout: 60_000,
            });
        }
        // Final check: confirm the input is not disabled (hydration complete).
        await this.page.waitForFunction(
            () => {
                const input = document.querySelector<HTMLInputElement>('input[placeholder="Find your product"]');
                return input !== null && !input.disabled;
            },
            { timeout: 30_000 }
        );
    }

    async search(term: string): Promise<void> {
        await this.searchInput.click();
        await this.searchInput.fill(term);
        await this.searchInput.press('Enter');
    }
}
