import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { StoreLocatorPage } from '../pages/StoreLocatorPage';
import { homePageData } from '../test-data/home-page.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

// Capture a full-page screenshot only on failure and save it to artifacts/outputs/
test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

// ---------------------------------------------------------------------------
// TC-83225  Home Page — Logo Click navigates to Home
// ADO TC: 83225 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83225 — Logo click navigates to home @homepage @navigation @smoke',
    async ({ page }) => {
        const homePage = new HomePage(page);

        await test.step('Navigate to an internal page (not home)', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Click page body to unblock loading after search', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Click the London Drugs logo', async () => {
            await homePage.clickLogo();
        });

        await test.step('Click page body to dismiss loading overlay if stuck', async () => {
            await homePage.dismissLoadingIfStuck();
        });

        await test.step('Verify home page is loaded after logo click', async () => {
            await page.waitForURL(homePageData.logo.expectedHomeUrlGlob);
            await expect(page).toHaveURL(homePageData.logo.expectedHomeUrlRegex);
            await expect(page).toHaveTitle(homePageData.logo.expectedTitle);
            await expect(homePage.logo).toBeVisible();
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83226  Home Page — Search with no results shows 'Nothing found'
// ADO TC: 83226 | Priority: P1 | Type: Negative
// ---------------------------------------------------------------------------
test(
    "TC-83226 — Search with invalid term shows 'Nothing found!' @search @negative",
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });
        
        await test.step('Click page body to unblock loading after search', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Wait for search input to be ready', async () => {
            await homePage.waitForSearchInput();
        });

        await test.step('Type non-existent search term', async () => {
            await homePage.searchInput.fill(homePageData.search.invalidTerm);
        });

        await test.step('Submit search', async () => {
            await homePage.searchInput.press('Enter');
        });

        await test.step('Click page body to unblock loading after search', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step("Wait for no-results message'", async () => {
            await expect(searchResultsPage.noResultsHeading).toBeVisible({ timeout: 15_000 });
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83227  Home Page — Search returns relevant results
// ADO TC: 83227 | Priority: P0 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-83227 — Search returns relevant results for a valid term @search @positive @smoke',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Click page body to unblock loading after search', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Wait for search input to be ready', async () => {
            await homePage.waitForSearchInput();
        });

        await test.step('Click search input field', async () => {
            await homePage.searchInput.click();
        });

        await test.step('Type search term', async () => {
            await homePage.searchInput.fill(homePageData.search.validTerm);
        });

        await test.step('Submit search by pressing Enter', async () => {
            await homePage.searchInput.press('Enter');
        });

        await test.step('Click page body to unblock loading after search', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Verify search term appears in a product title or section heading', async () => {
            const matchingHeadings = searchResultsPage.headingsMatching(homePageData.search.validTerm);
            await expect(matchingHeadings.first()).toBeVisible({ timeout: 30_000 });
            await expect(matchingHeadings).not.toHaveCount(0);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83228  Home Page — Store Locator opens and allows search
// ADO TC: 83228 | Priority: P1 | Type: Positive
// Note: Google Maps iframe is blocked — test validates heading and list only.
// ---------------------------------------------------------------------------
test(
    'TC-83228 — Store Locator opens and Find All Stores link works @store-locator @navigation',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const storeLocatorPage = new StoreLocatorPage(page);

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
            await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
        });

        await test.step('Click page body to unblock loading', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step("Click 'Select Your Store' / stores link in header", async () => {
            await homePage.storesLink.waitFor({ state: 'visible', timeout: 15_000 });
            await homePage.storesLink.click();
        });

        await test.step('Wait for Store Locator URL', async () => {
            await page.waitForURL('**/stores', { timeout: 20_000 });
            // Allow Next.js SPA to finish client-side rendering after URL change.
            await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
        });

        await test.step("Verify 'Find a Store Near You' heading is visible", async () => {
            await expect(storeLocatorPage.heading).toBeVisible({ timeout: 15_000 });
        });

        await test.step("Click 'Find All Stores by Province' link", async () => {
            await storeLocatorPage.allStoresLink.waitFor({ state: 'visible', timeout: 15_000 });
            await storeLocatorPage.allStoresLink.click();
        });

        await test.step('Wait for All Stores URL', async () => {
            await page.waitForURL('**/stores/all-stores', { timeout: 20_000 });
            // Allow Next.js SPA to finish client-side rendering of province sections after URL change.
            // The /stores/all-stores page only renders province content via SPA navigation;
            // a direct full-page load shows only a loading spinner.
            await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
        });

        await test.step('Verify All Stores list is visible', async () => {
            // storeList matches the first province heading (e.g. "British Columbia").
            // toBeVisible() retries for up to 20 s to handle React hydration delay after SPA navigation.
            await expect(storeLocatorPage.storeList).toBeVisible({ timeout: 20_000 });
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83229  Home Page — Mini Cart opens and View Cart navigates to cart
// ADO TC: 83229 | Priority: P1 | Type: Positive
// Precondition: 1 product is added to cart inline as part of this test setup.
// Fix notes:
//   - miniCartPanel selector updated: UAT uses absolute+z-50 div, no "miniCart" class token.
//   - CTA button text on UAT is "View Cart", not "Proceed to Checkout".
// ---------------------------------------------------------------------------
test(
    'TC-83229 — Mini Cart opens and View Cart navigates to cart page @mini-cart @cart @navigation',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);
        const { miniCart } = homePageData;

        // productName is captured dynamically at runtime from the product page h1.
        // This avoids any hardcoded SKU or product name that could break when the
        // catalog changes. It is populated in the precondition steps below.
        let productName = '';

        // ── Precondition: find a product via search and add it to the cart ────
        await test.step('Search for a product and navigate to the first result', async () => {
            // Search results only render after React/Builder.io hydration — navigating
            // directly to the search URL produces a blank page. Use the search UI instead
            // (same approach as TC-83226) so client-side routing renders the results.
            await homePage.navigate(homePageData.urls.home);
            await page.locator('body').click({ force: true });
            await homePage.waitForSearchInput();
            await homePage.search(miniCart.searchTerm);
            await page.waitForURL(/\/search/, { timeout: 20_000 });
            // Wait for product results to render, then click the first one.
            await searchResultsPage.firstProductLink.waitFor({ state: 'visible', timeout: 20_000 });
            await searchResultsPage.firstProductLink.click();
            // Wait until the browser has left the search page and landed on the product page.
            await page.waitForURL((url) => !url.pathname.includes('/search'), { timeout: 20_000 });
            await page.waitForLoadState('domcontentloaded');
        });

        await test.step('Capture product name from product page', async () => {
            // Read the h1 heading on the product detail page.
            // This is used later to verify the item appears in the cart.
            const h1 = page.locator('h1').first();
            await h1.waitFor({ state: 'visible', timeout: 15_000 });
            productName = (await h1.textContent() ?? '').trim();
        });

        await test.step('Add product to cart', async () => {
            const addToCartBtn = page.locator('button[aria-label="Add to cart button"]');
            await addToCartBtn.waitFor({ state: 'visible', timeout: 15_000 });
            await addToCartBtn.click();
        });

        await test.step('Wait for View Cart & Checkout button and click it', async () => {
            // After adding to cart the product page shows a "View Cart & Checkout" CTA.
            // Waiting for it confirms the item was successfully added to the cart.
            const viewCartCheckoutBtn = page.locator('button', { hasText: 'View Cart & Checkout' });
            await viewCartCheckoutBtn.waitFor({ state: 'visible', timeout: 15_000 });
            await viewCartCheckoutBtn.click();
        });

        await test.step('Wait for cart page to load', async () => {
            await page.waitForURL(miniCart.expectedCartUrlRegex, { timeout: 20_000 });
        });
        // ── End precondition ──────────────────────────────────────────────────

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Wait for homepage React hydration before interacting', async () => {
            // waitForSearchInput() waits for the search input to be enabled, which is a
            // reliable proxy for Builder.io/React hydration being complete on the homepage.
            // Without this, clicking the mini cart button may be a no-op.
            await page.locator('body').click({ force: true });
            await homePage.waitForSearchInput();
        });

        await test.step('Wait for mini cart badge to show item count', async () => {
            // The badge is a <div class="absolute bottom-1 left-8 ..."> inside the cart
            // icon button showing the number of items. Waiting for it ensures the cart
            // state has been loaded from the API before opening the panel.
            await page.locator('button[aria-label="Show Mini Cart Items"] div[class*="bottom-1"]')
                .first()
                .waitFor({ state: 'visible', timeout: 15_000 });
        });

        await test.step('Click mini cart icon in header', async () => {
            await homePage.miniCartButton.waitFor({ state: 'visible', timeout: 10_000 });
            await homePage.miniCartButton.click();
        });

        await test.step('Verify mini cart panel opens', async () => {
            await expect(homePage.miniCartPanel).toBeVisible({ timeout: 15_000 });
        });

        await test.step("Click 'View Cart' button inside mini cart panel", async () => {
            await homePage.proceedToCheckoutButton.waitFor({ state: 'visible', timeout: 10_000 });
            await homePage.proceedToCheckoutButton.click();
        });

        await test.step('Verify cart page opens and shows Cart heading', async () => {
            await page.waitForURL(miniCart.expectedCartUrlRegex, { timeout: 20_000 });
            await expect(page).toHaveURL(miniCart.expectedCartUrlRegex);
            await expect(
                page.locator('h1').filter({ hasText: miniCart.cartPageHeading }).first()
            ).toBeVisible({ timeout: 10_000 });
        });

        await test.step('Verify added product is listed in the cart', async () => {
            // Cart items render as <a data-testid="cart:cart item"> links.
            // Product name appears in <h3 class="text-wrap text-base"> inside each item.
            await expect(
                page.locator('a[data-testid="cart:cart item"]').first()
            ).toBeVisible({ timeout: 10_000 });
            await expect(
                page.locator('h3', {
                    hasText: new RegExp(productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
                })
            ).toBeVisible({ timeout: 10_000 });
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83230  Home Page — Hamburger Menu opens with categories
// ADO TC: 83230 | Priority: P1 | Type: Positive
// Fix notes:
//   - megaMenuButton: three DOM copies for breakpoints; :visible ensures we pick
//     the rendered one instead of a zero-size hidden copy.
//   - megaMenu selector updated: UAT renders the mega menu as a <div> with class
//     containing "bg-txtmegamenu-secondary" (NOT a <nav> and NOT "megamenu-primary").
//     Using .last() targets the always-visible desktop nav at Desktop Chrome viewport.
// ---------------------------------------------------------------------------
test(
    'TC-83230 — Hamburger menu opens and displays category navigation @navigation @mega-menu @hamburger',
    async ({ page }) => {
        const homePage = new HomePage(page);

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Click page body to unblock loading', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Click hamburger / mega menu button', async () => {
            await homePage.megaMenuButton.waitFor({ state: 'visible', timeout: 15_000 });
            await homePage.megaMenuButton.click();
        });

        await test.step('Verify mega menu is visible', async () => {
            await expect(homePage.megaMenu).toBeVisible({ timeout: 15_000 });
        });

        await test.step('Verify the hamburger button itself is still visible', async () => {
            await expect(homePage.megaMenuButton).toBeVisible();
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83231  Home Page — Header nav links have correct hrefs
// ADO TC: 83231 | Priority: P1 | Type: Positive
// Hrefs confirmed from live UAT DOM inspection (header element scope).
// ---------------------------------------------------------------------------
test(
    'TC-83231 — Header nav links for Deals, Services, Flyers and Gift Registry have correct hrefs @navigation @header',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const { headerNav } = homePageData;

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Click page body to unblock loading overlay', async () => {
            await page.locator('body').click({ force: true });
        });

        await test.step('Verify "Deals & Events" link is visible and has correct href', async () => {
            await homePage.dealsLink.waitFor({ state: 'visible', timeout: 15_000 });
            await expect(homePage.dealsLink).toHaveAttribute('href', headerNav.deals.href);
        });

        await test.step('Verify "Services" link is visible and has correct href', async () => {
            await homePage.servicesLink.waitFor({ state: 'visible', timeout: 10_000 });
            await expect(homePage.servicesLink).toHaveAttribute('href', headerNav.services.href);
        });

        await test.step('Verify "Flyers" link is visible and has correct href', async () => {
            await homePage.flyersLink.waitFor({ state: 'visible', timeout: 10_000 });
            await expect(homePage.flyersLink).toHaveAttribute('href', headerNav.flyers.href);
        });

        await test.step('Verify "Gift Registry" link is visible and has correct href', async () => {
            await homePage.giftRegistryLink.waitFor({ state: 'visible', timeout: 10_000 });
            await expect(homePage.giftRegistryLink).toHaveAttribute('href', headerNav.giftRegistry.href);
        });
    }
);

// ---------------------------------------------------------------------------
// TC-83232  Home Page — Newsletter signup in footer submits and redirects
// ADO TC: 83232 | Priority: P1 | Type: Positive
// The SIGN UP button submits via client-side navigation to:
//   /enewsletter-settings?email=<encoded_email>
// No confirmation message is shown on the homepage itself.
// Verification: URL matches /enewsletter-settings after submit.
// ---------------------------------------------------------------------------
test(
    'TC-83232 — Newsletter signup in footer accepts valid email and redirects to confirmation @newsletter @footer',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const { newsletter } = homePageData;

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Scroll to footer newsletter form', async () => {
            await homePage.newsletterEmailInput.scrollIntoViewIfNeeded();
            await homePage.newsletterEmailInput.waitFor({ state: 'visible', timeout: 15_000 });
        });

        await test.step('Fill valid email in newsletter input', async () => {
            await homePage.newsletterEmailInput.fill(newsletter.testEmail);
        });

        await test.step('Click SIGN UP button', async () => {
            await homePage.newsletterSubmitButton.waitFor({ state: 'visible', timeout: 10_000 });
            await homePage.newsletterSubmitButton.click();
        });

        await test.step('Verify page redirects to /enewsletter-settings', async () => {
            // Submit triggers a client-side navigation to /enewsletter-settings?email=<email>.
            // This confirms the form was accepted and the user is routed to the preferences page.
            await page.waitForURL(newsletter.expectedRedirectUrlPattern, { timeout: 15_000 });
            await expect(page).toHaveURL(newsletter.expectedRedirectUrlPattern);
        });
    }
);
