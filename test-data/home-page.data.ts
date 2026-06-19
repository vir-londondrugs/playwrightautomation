export const homePageData = {
    urls: {
        home: 'https://london-drugs-uat-origin.kibology.us/',
        stores: 'https://london-drugs-uat-origin.kibology.us/stores',
    },

    logo: {
        expectedTitle: 'London Drugs | 100% Canadian Owned Retail Store',
        expectedHomeUrlGlob: '**/',
        expectedHomeUrlRegex: /\/$/ ,
    },

    search: {
        validTerm: 'vitamins',
        invalidTerm: 'xyznotaproduct999',
        expectedResultsUrlGlob: (term: string): string => `**/search?text=${term}`,
        expectedResultsUrlRegex: (term: string): RegExp => new RegExp(`/search\\?text=${term}`),
    },
} as const;
