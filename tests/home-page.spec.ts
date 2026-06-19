import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { homePageData } from '../test-data/home-page.data';

// ---------------------------------------------------------------------------
// TC-79593-01  Home Page — Logo Click navigates to Home
// Original TC: 79593 | Priority: P1 | Type: Positive
// ---------------------------------------------------------------------------
test.skip(
    'TC-79593-01 — Logo click navigates to home @homepage @navigation @smoke',
    async ({ page }) => {
        const homePage = new HomePage(page);

        await test.step('Navigate to an internal page (not home)', async () => {
            await homePage.navigate(homePageData.urls.home);
        });

        await test.step('Click the London Drugs logo', async () => {
            await homePage.clickLogo();
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

        await test.step('Type non-existent search term', async () => {
            await homePage.searchInput.fill(homePageData.search.invalidTerm);
        });

        await test.step('Submit search', async () => {
            await homePage.searchInput.press('Enter');
        });

        await test.step("Wait for no-results message'", async () => {
            await expect(searchResultsPage.noResultsHeading).toBeVisible();
        });
    }
);

// ---------------------------------------------------------------------------
// TC-79593-02-positive  Home Page — Search returns relevant results
// Original TC: 79593 | Priority: P0 | Type: Positive
// ---------------------------------------------------------------------------
test.skip(
    'TC-79593-02-positive — Search returns relevant results for a valid term @search @positive @smoke',
    async ({ page }) => {
        const homePage = new HomePage(page);
        const searchResultsPage = new SearchResultsPage(page);

        await test.step('Navigate to homepage', async () => {
            await homePage.navigate(homePageData.urls.home);
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

        await test.step('Verify search results page URL and search input is visible', async () => {
            await page.waitForURL(homePageData.search.expectedResultsUrlGlob(homePageData.search.validTerm));
            await expect(page).toHaveURL(homePageData.search.expectedResultsUrlRegex(homePageData.search.validTerm));
            await expect(searchResultsPage.searchInput).toBeVisible();
        });
    }
);
