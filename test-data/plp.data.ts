/**
 * plp.data.ts -- Test data for PLP (Product Listing Page) test specs.
 * All values are constants derived from MCP-validated discovery and CSV UAT
 * Regression Master Plan (UAT TC-83233, TC-83234).
 *
 * TC-83233 (FTC_02_01_01): Navigate lipstick search, apply first filter,
 *   wait for API response, assert URL reflects active filter.
 * TC-83234 (FTC_02_02_01): Navigate vitamins search, select "Price: Low to
 *   High", wait for API response, assert URL reflects active sort.
 *
 * NEVER add credentials or secrets here. Use process.env for any sensitive values.
 */
export const plpData = {
    urls: {
        /**
         * UAT base URL.
         * MCP-validated: https://london-drugs-uat-origin.kibology.us/
         */
        base: 'https://london-drugs-uat-origin.kibology.us',

        /**
         * PLP URL for lipstick search (TC-83233, FTC_02_01_01).
         * CSV step 1: "Navigate to https://www.londondrugs.com/search?text=lipstick"
         * Note: UAT uses kibology.us origin; text= param confirmed on UAT search UI.
         */
        lipstickSearch: 'https://london-drugs-uat-origin.kibology.us/search?text=lipstick',

        /**
         * PLP URL for vitamins search (TC-83234, FTC_02_02_01).
         * CSV step 1: "Navigate to https://www.londondrugs.com/search?text=vitamins"
         */
        vitaminsSearch: 'https://london-drugs-uat-origin.kibology.us/search?text=vitamins',
    },

    searchTerms: {
        /** Search term used in filter tests (FTC_02_01_xx). */
        lipstick: 'lipstick',
        /** Search term used in sort tests (FTC_02_02_xx). */
        vitamins: 'vitamins',
    },

    filter: {
        /**
         * Index (0-based) of the first available filter checkbox to click.
         * FTC_02_01_01 CSV step 3: "Apply first available filter option"
         */
        firstCheckboxIndex: 0,

        /**
         * URL parameter expected after applying a filter.
         * After facet selection the UAT search URL includes a query param like
         * ?text=lipstick&facets=... or ?text=lipstick&filter=...
         * The test asserts the URL changes from the unfiltered baseline --
         * exact param key verified at runtime.
         */
        urlChangeExpected: true,
    },

    sort: {
        /**
         * Sort overlay option index for "Price: Low to High" (1-based in UI, 0-based here).
         * FTC_02_02_01 CSV step 3: "Select 'Price: Low to High' sorting option"
         * First non-default option in the sort overlay = index 0 (default relevance = 0,
         * Price: Low to High = 1 in most implementations; adjust if UAT differs).
         */
        priceLowToHighIndex: 1,

        /**
         * Sort overlay option index for "Price: High to Low" (FTC_02_02_03).
         */
        priceHighToLowIndex: 2,

        /**
         * Expected URL sort parameter for "Price: Low to High".
         * On some UAT environments sort appends: ?sort=price%2Basc
         * OQ-01: sort may redirect to www.londondrugs.com; interceptAndAbortSortRedirect handles this.
         */
        priceLowHighParam: 'price%2Basc',

        /**
         * Expected URL sort parameter for "Price: High to Low".
         */
        priceHighLowParam: 'price%2Bdesc',
    },
} as const;
