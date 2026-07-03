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

    /** "Proceed to Checkout" button/link inside the mini cart panel */
    readonly proceedToCheckoutButton: Locator;

    /** Hamburger / mega menu toggle button in the header */
    readonly megaMenuButton: Locator;

    /** Mega menu container that opens after clicking the hamburger button */
    readonly megaMenu: Locator;

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
    }

    async clickLogo(): Promise<void> {
        await this.logo.waitFor({ state: 'visible' });
        await this.logo.click();
    }

    /**
     * Waits for the search input to be visible and enabled (React hydration complete).
     * Call this after navigate() before interacting with the search input.
     */
    async waitForSearchInput(): Promise<void> {
        await this.searchInput.waitFor({ state: 'visible', timeout: 30_000 });
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
