import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    /** Email address input on the login form */
    readonly emailInput: Locator;

    /** Password input on the login form */
    readonly passwordInput: Locator;

    /** Login / Sign In submit button */
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('input[name="email"][type="email"]').first();
        this.passwordInput = page.locator('input[name="password"][type="password"]').first();
        this.loginButton = page.locator('button[type="submit"]').filter({ hasText: /login/i }).first();
    }

    /**
     * Navigates to the My Account page (which redirects to the login form when
     * the user is not authenticated) and logs in with the provided credentials.
     * Waits for the URL to leave /myaccount/login as confirmation of success.
     */
    async login(email: string, password: string): Promise<void> {
        await this.navigate('/myaccount');
        await this.emailInput.waitFor({ state: 'visible', timeout: 15_000 });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // Wait until the login page is gone (redirect to account dashboard or back to home)
        await this.page.waitForURL((url) => !url.pathname.includes('/myaccount/login') && !url.pathname.includes('/login'), {
            timeout: 20_000,
        });
    }
}
