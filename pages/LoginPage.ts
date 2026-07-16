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
     * Navigates directly to the login page and logs in with the provided credentials.
     * Waits for the URL to leave /auth/login as confirmation of success.
     *
     * Navigates to /auth/login directly (UAT redirects /myaccount → /auth/login)
     * to skip the redirect round-trip and reduce flakiness caused by the double
     * navigation on slow UAT origins.
     *
     * Uses a 45s timeout for the email input because the UAT origin can be slow
     * to hydrate the React form, leaving only a loading spinner visible for 15-25 s.
     */
    async login(email: string, password: string): Promise<void> {
        // Use BasePage.navigate() which includes dismissLoadingIfStuck() and
        // waitForAppShell() — these help Edge dismiss the "Loading…" spinner that
        // can get stuck for 30-45 s before the React form mounts.
        await this.navigate('/auth/login');

        // Wait for network activity to settle so the React form is fully hydrated.
        await this.page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});

        // The React login form can take up to 30-40 s to mount on UAT after
        // the page loads due to server-side rendering and hydration delays.
        // Retry the body click once more in case the loading overlay re-appeared.
        await this.page.locator('body').click({ force: true }).catch(() => undefined);
        await this.emailInput.waitFor({ state: 'visible', timeout: 45_000 });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // Wait until the login page is gone (redirect to account dashboard or home).
        // /auth/login contains "/login"; success lands on a URL without "/login".
        await this.page.waitForURL(
            (url) => !url.pathname.includes('/auth/login') && !url.pathname.includes('/myaccount/login'),
            { timeout: 45_000 },
        );
    }
}
