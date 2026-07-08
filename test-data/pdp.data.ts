/**
 * Test data for Product Detail Page (PDP) test cases TC-83235 to TC-83240.
 *
 * Design principles:
 *  - No hardcoded product URLs or product names.
 *    Products are discovered at runtime via search → first result.
 *  - Postal code V6B 1A1 is a Vancouver downtown postal code used across
 *    TC-83238 (In-Store Pickup) and TC-83239 (Ship to Home).
 *  - Credentials for TC-83240 (wishlist) are read from environment variables
 *    so they are never committed to source control.
 */
export const pdpData = {
    urls: {
        home: 'https://london-drugs-uat-origin.kibology.us/',
        myAccount: 'https://london-drugs-uat-origin.kibology.us/myaccount',
    },

    /** Generic search term used to navigate to a vitamins product at runtime */
    vitaminsSearchTerm: 'vitamins',

    /** Postal code used for both In-Store and Ship to Home fulfillment tests */
    postalCode: 'V6B 1A1',

    price: {
        /**
         * Regex for a valid CAD price string: "$" followed by one or more digits,
         * a period, and exactly two digits (e.g. "$3.19", "$12.49", "$149.99").
         * Validation is case-insensitive (no letter characters in price anyway).
         */
        validPriceRegex: /^\$\d+\.\d{2}\s*$/,
    },

    /**
     * Credentials for TC-83240 (authenticated wishlist test).
     * Values are read from environment variables to avoid hardcoding secrets.
     *
     * Set in your shell or .env file (never committed):
     *   TEST_USER_EMAIL=ldtestfour@yopmail.com
     *   TEST_USER_PASSWORD=LDTestfour4*
     */
    auth: {
        email: process.env['TEST_USER_EMAIL'] ?? 'ldtestfour@yopmail.com',
        password: process.env['TEST_USER_PASSWORD'] ?? 'LDTestfour4*',
    },
} as const;
