import { Page, Request, Route } from '@playwright/test';

/** URL pattern for the UAT search API (filter/sort results). */
const SEARCH_API_PATTERN = '**/api/search*';

/** Production hostname that sort may redirect to (OQ-01). */
const PRODUCTION_HOST = 'www.londondrugs.com';

/**
 * Sets up a one-time route handler that intercepts the first outgoing request
 * matching the search API pattern. The intercepted request is resolved via the
 * returned promise, allowing callers to assert on its URL or POST body after
 * the filter/sort action fires.
 *
 * Usage (FTC_02_01_01):
 *   const requestPromise = interceptSearchApi(page);
 *   await searchResultsPage.applyFilters();
 *   const req = await requestPromise;
 *   expect(req.url()).toContain('facet=');
 *
 * @param page - Active Playwright Page.
 * @returns Promise that resolves with the first intercepted search API Request.
 */
export function interceptSearchApi(page: Page): Promise<Request> {
    return new Promise((resolve) => {
        page.route(SEARCH_API_PATTERN, async (route: Route, request: Request) => {
            // Resolve the promise with the intercepted request for assertions.
            resolve(request);
            // Continue the request so the page receives its response.
            await route.continue();
            // Unregister after first match to avoid intercepting subsequent calls.
            await page.unroute(SEARCH_API_PATTERN);
        });
    });
}

/**
 * Waits for the page to make a search API call after a filter or sort action.
 * Simpler alternative to interceptSearchApi when only network activity needs
 * to be confirmed (not request payload inspection).
 *
 * Usage (FTC_02_01_01 simple variant):
 *   await waitForFilterApiCall(page);
 *
 * @param page - Active Playwright Page.
 * @param timeoutMs - Maximum ms to wait. Default 15 000 ms.
 */
export async function waitForFilterApiCall(
    page: Page,
    timeoutMs: number = 15_000,
): Promise<void> {
    await page.waitForRequest(
        (req) => req.url().includes('/api/search') || req.url().includes('/graphql'),
        { timeout: timeoutMs },
    );
}

/**
 * Intercepts any navigation to the production domain that may be triggered by
 * a sort or filter action on UAT (OQ-01). When the browser tries to navigate to
 * www.londondrugs.com, this handler aborts the cross-domain redirect and lets
 * the UAT response proceed instead.
 *
 * MCP-validated 2026-07-13: both sort AND filter apply actions on UAT redirect to
 * www.londondrugs.com. This interceptor must be called before either action.
 *
 * Call BEFORE triggering the sort/filter action. This is registered as a persistent
 * route (not one-time) so callers must call page.unroute() when done, or
 * rely on page teardown.
 *
 * Usage (FTC_02_02_01 sort, FTC_02_01_01 filter):
 *   await interceptAndAbortSortRedirect(page);
 *   // ...trigger sort or filter...
 *   // Assert URL on UAT; production redirect has been aborted.
 *
 * @param page - Active Playwright Page.
 */
export async function interceptAndAbortSortRedirect(page: Page): Promise<void> {
    await page.route(`**${PRODUCTION_HOST}**`, async (route: Route) => {
        const url = route.request().url();
        if (url.includes(PRODUCTION_HOST)) {
            // Abort cross-domain redirect; keep test on UAT origin.
            await route.abort('blockedbyclient');
        } else {
            await route.continue();
        }
    });
}

/**
 * Alias for interceptAndAbortSortRedirect -- covers filter-apply redirects too.
 * MCP-validated 2026-07-13: filter apply on UAT also redirects to www.londondrugs.com.
 *
 * @param page - Active Playwright Page.
 */
export const interceptAndAbortFilterRedirect = interceptAndAbortSortRedirect;
