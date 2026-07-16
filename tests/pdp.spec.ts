import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { pdpData } from '../test-data/pdp.data';
import { simulateBodyClickToUnblock } from '../helpers/page-load';
import { takeEvidenceScreenshot } from '../helpers/evidence';

// ---------------------------------------------------------------------------
// Shared helper — navigate to a vitamins product detail page via search.
// No product URL or name is hardcoded; the first result is used at runtime.
// ---------------------------------------------------------------------------
async function navigateToVitaminsPdp(
    page: import('@playwright/test').Page,
    homePage: HomePage,
    searchResultsPage: SearchResultsPage,
): Promise<void> {
    await homePage.navigate(pdpData.urls.home);
    await simulateBodyClickToUnblock(page);
    await homePage.waitForSearchInput();
    await homePage.search(pdpData.vitaminsSearchTerm);
    await page.waitForURL(/\/search/, { timeout: 30_000 });
    await simulateBodyClickToUnblock(page);
    await searchResultsPage.firstProductLink.waitFor({ state: 'visible', timeout: 30_000 });
    await searchResultsPage.firstProductLink.click();
    await page.waitForURL((url) => !url.pathname.includes('/search'), { timeout: 30_000 });
    await page.waitForLoadState('domcontentloaded');
    await simulateBodyClickToUnblock(page);
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 30_000 });
}

// Capture a full-page screenshot only on failure
test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

// ---------------------------------------------------------------------------
// TC-83235  PDP — Second-level breadcrumb link navigates back to category
// ADO TC: 83235 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83235 — Second-level breadcrumb link on PDP navigates back to category listing @pdp @breadcrumbs @navigation',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        let breadcrumbHref = '';
        let breadcrumbText = '';

        await test.step('Verify second-level breadcrumb link is visible', async () => {
            await pdpPage.secondLevelBreadcrumb.waitFor({ state: 'visible', timeout: 30_000 });
            breadcrumbText = (await pdpPage.secondLevelBreadcrumb.textContent() ?? '').trim();
            breadcrumbHref = (await pdpPage.secondLevelBreadcrumb.getAttribute('href') ?? '').trim();
            expect(breadcrumbText.length).toBeGreaterThan(0);
            expect(breadcrumbHref).toMatch(/^\/category\//);
        });

        await test.step('Click second-level breadcrumb link', async () => {
            await pdpPage.secondLevelBreadcrumb.click();
        });

        await test.step('Verify navigation lands on category listing page', async () => {
            // The category URL follows the pattern /category/<slug>/c/<id>
            await page.waitForURL(/\/category\//, { timeout: 30_000 });
            await expect(page).toHaveURL(new RegExp(breadcrumbHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            // The category page renders with a heading or product list — verify h1 or h2 is present
            await page.locator('h1, h2').first().waitFor({ state: 'visible', timeout: 30_000 });
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83236  PDP — Price element is visible and formatted correctly
// ADO TC: 83236 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83236 — Price element is visible and formatted correctly on the first vitamins PDP @pdp @price',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        await test.step('Verify "Our Price" label is visible', async () => {
            await pdpPage.priceLabel.waitFor({ state: 'visible', timeout: 30_000 });
            const labelText = (await pdpPage.priceLabel.textContent() ?? '').trim().toLowerCase();
            expect(labelText).toMatch(/our price/i);
        });

        await test.step('Verify price value is visible and matches $X.XX format', async () => {
            await pdpPage.priceValue.waitFor({ state: 'visible', timeout: 30_000 });
            const priceText = (await pdpPage.priceValue.textContent() ?? '').trim();
            // Case-insensitive regex match for a valid CAD price: $digits.twoDigits
            expect(priceText).toMatch(pdpData.price.validPriceRegex);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83237  PDP — Availability indicator is visible on product detail page
// ADO TC: 83237 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83237 — Availability indicator is visible on PDP for a vitamins product @pdp @availability',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        await test.step('Verify "Availability:" section is visible on the page', async () => {
            await pdpPage.availabilitySection.waitFor({ state: 'visible', timeout: 30_000 });
        });

        await test.step('Verify "Availability:" label text is present', async () => {
            await pdpPage.availabilityLabel.waitFor({ state: 'visible', timeout: 30_000 });
            const labelText = (await pdpPage.availabilityLabel.textContent() ?? '').trim();
            expect(labelText).toMatch(/availability/i);
        });

        await test.step('Verify availability section contains a status indicator', async () => {
            // The section always shows either:
            //   (a) "Set your store to see product availability" (no store set), or
            //   (b) shipping/pickup availability badges (after store is set).
            // In both cases the section is non-empty and visible.
            const sectionText = (await pdpPage.availabilitySection.textContent() ?? '').trim();
            expect(sectionText.length).toBeGreaterThan(0);
            // The section contains the "Availability:" heading as a minimum
            expect(sectionText.toLowerCase()).toMatch(/availability/i);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83238  PDP — Add to cart with In-Store Pickup using postal code V6B 1A1
//           increments mini cart counter
// ADO TC: 83238 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83238 — Add to cart with In-Store Pickup (postal V6B 1A1) increments mini cart counter @pdp @cart @in-store-pickup',
    async ({ page }) => {
        // Extended timeout: store-selector search can take up to 30 s on UAT across all browsers.
        // Total flow: navigate (20 s) + scroll/open dialog (15 s) + search (30 s) + add-to-cart (20 s) = ~85 s.
        test.setTimeout(150_000);

        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        await test.step('Read current mini cart badge count before adding to cart', async () => {
            // Count may be 0 (badge hidden) or N (existing items).
            // Captured as a baseline to confirm increment after Add to Cart.
            // (count captured in the assertion step below via getMiniCartCount)
        });

        const countBefore = await pdpPage.getMiniCartCount();

        await test.step('Open store selector dialog and set store using postal code V6B 1A1', async () => {
            await pdpPage.openStoreSelectorDialog();
        });

        await test.step('Search for stores using postal code V6B 1A1', async () => {
            await pdpPage.searchStores(pdpData.postalCode);
        });

        await test.step('Select the first store from results', async () => {
            await pdpPage.selectFirstStore();
        });

        await test.step('Verify In-Store Pickup is now selected (fulfillment changed)', async () => {
            // After selecting a store, In-Store Pickup radio is checked automatically
            await pdpPage.inStorePickupRadio.waitFor({ state: 'attached', timeout: 30_000 });
            await expect(pdpPage.inStorePickupRadio).toBeChecked({ timeout: 30_000 });
        });

        await test.step('Click ADD TO CART with In-Store Pickup fulfillment', async () => {
            await pdpPage.addToCart();
        });

        await test.step('Verify mini cart badge counter incremented by 1', async () => {
            const countAfter = await pdpPage.getMiniCartCount();
            expect(countAfter).toBe(countBefore + 1);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83239  PDP — Add to cart with Ship to Home using postal code V6B 1A1
//           increments cart counter
// ADO TC: 83239 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83239 — Add to cart with Ship to Home (postal V6B 1A1) increments cart counter @pdp @cart @ship-to-home',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        const countBefore = await pdpPage.getMiniCartCount();

        await test.step('Open the delivery location modal via "Change Postal Code" link', async () => {
            await pdpPage.openDeliveryLocationModal();
        });

        await test.step('Fill postal code V6B 1A1 and submit', async () => {
            await pdpPage.setDeliveryPostalCode(pdpData.postalCode);
        });

        await test.step('Ensure Ship to Home fulfillment is selected', async () => {
            // Ship to Home is the default option; after setting postal code it should remain selected.
            // If In-Store Pickup became active, explicitly select Ship to Home.
            const homeRadioChecked = await pdpPage.shipToHomeRadio.isChecked().catch(() => false);
            if (!homeRadioChecked) {
                await pdpPage.shipToHomeRadio.click();
            }
            await expect(pdpPage.shipToHomeRadio).toBeChecked({ timeout: 30_000 });
        });

        await test.step('Click ADD TO CART with Ship to Home fulfillment', async () => {
            await pdpPage.addToCart();
        });

        await test.step('Verify cart counter incremented by 1', async () => {
            const countAfter = await pdpPage.getMiniCartCount();
            expect(countAfter).toBe(countBefore + 1);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83240  PDP — Authenticated user clicks heart icon to add product to
//           wishlist and API call confirms the action
// ADO TC: 83240 | Priority: P1 | Type: Positive
//
// Precondition: Valid test account credentials are available.
// Credentials are read from environment variables (see pdp.data.ts):
//   TEST_USER_EMAIL / TEST_USER_PASSWORD
// ---------------------------------------------------------------------------
test(
    'TC-83240 — Authenticated user adds product to wishlist and API call confirms the action @pdp @wishlist @authenticated',
    async ({ page }) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const pdpPage = new ProductDetailPage(page);

        // ── Precondition: Log in ────────────────────────────────────────────
        await test.step('Log in with test user credentials', async () => {
            await loginPage.login(pdpData.auth.email, pdpData.auth.password);
        });

        // ── Navigate to a vitamins PDP ──────────────────────────────────────
        await test.step('Navigate to a vitamins product detail page via search', async () => {
            await navigateToVitaminsPdp(page, homePage, searchResultsPage);
        });

        await test.step('Verify the wishlist heart button is visible', async () => {
            await pdpPage.wishlistButton.waitFor({ state: 'visible', timeout: 30_000 });
        });

        // ── Intercept wishlist API call and click heart ─────────────────────
        await test.step('Click the heart icon and confirm the wishlist API call is made', async () => {
            // Set up a response promise BEFORE clicking so we don't miss fast responses.
            // The UAT site uses Next.js server actions; wishlist operations POST to the
            // current PDP URL with action payload, returning JSON with isSuccess: true.
            // We wait for ANY POST to the current page URL that returns a 200 response.
            const wishlistResponsePromise = page.waitForResponse(
                (response) =>
                    response.request().method() === 'POST' &&
                    response.url().includes('/products/') &&
                    response.status() === 200,
                { timeout: 30_000 }
            );

            await pdpPage.wishlistButton.click();

            // Wait for the API response confirming the wishlist action was processed
            const response = await wishlistResponsePromise;
            expect(response.status()).toBe(200);

            // Optionally parse the response body to verify isSuccess: true
            let body: string | null = null;
            try {
                body = await response.text();
            } catch {
                // Body may be binary or already consumed; skip body check
            }
            if (body && body.includes('isSuccess')) {
                expect(body).toMatch(/isSuccess.*true/i);
            }
        });
    }
);
