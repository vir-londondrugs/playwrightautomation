export const homePageData = {
    urls: {
        home: 'https://london-drugs-uat-origin.kibology.us/',
        stores: 'https://london-drugs-uat-origin.kibology.us/stores',
        allStores: 'https://london-drugs-uat-origin.kibology.us/stores/all-stores',
        cart: 'https://london-drugs-uat-origin.kibology.us/cart',
    },

    logo: {
        expectedTitle: 'London Drugs | 100% Canadian Owned Retail Store',
        expectedHomeUrlGlob: '**/',
        expectedHomeUrlRegex: /\/$/ ,
    },

    search: {
        validTerm: 'vitamin',
        invalidTerm: 'xyznotaproduct999',
        expectedResultsUrlGlob: (term: string): string => `**/search?q=${term}*`,
        expectedResultsUrlRegex: (term: string): RegExp => new RegExp(`/search\\?q=${term}`),
    },

    miniCart: {
        // Generic search term used to discover a product at runtime.
        // No product URL or name is hardcoded; the test picks the first
        // available result so it stays resilient to catalog changes.
        searchTerm: 'vitamin',
        cartPageHeading: 'Cart',
        expectedCartUrlRegex: /\/cart/,
    },
} as const;
