import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { homePageData } from '../test-data/home-page.data';
import { takeEvidenceScreenshot } from '../helpers/evidence';

// Capture a full-page screenshot after every TC and save it to artifacts/outputs/
test.afterEach(async ({ page }, testInfo) => {
    await takeEvidenceScreenshot(page, testInfo);
});

// ---------------------------------------------------------------------------
// TC-79593-01  Home Page — Logo Click navigates to Home
// Original TC: 79593 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-79593-01 — Logo click navigates to home @homepage @navigation @smoke',
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
// TC-79593-02-negative  Home Page — Search with no results shows 'Nothing found'
// Original TC: 79593 | Priority: P1 | Type: Negative
// ---------------------------------------------------------------------------
test(
    "TC-79593-02-negative — Search with invalid term shows 'Nothing found!' @search @negative",
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
// TC-79593-02-positive  Home Page — Search returns relevant results
// Original TC: 79593 | Priority: P0 | Type: Positive
// ---------------------------------------------------------------------------
test(
    'TC-79593-02-positive — Search returns relevant results for a valid term @search @positive @smoke',
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
            await expect(matchingHeadings.first()).toBeVisible({ timeout: 15_000 });
            await expect(matchingHeadings).not.toHaveCount(0);
        });
    }
);
