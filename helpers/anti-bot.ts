/**
 * anti-bot.ts -- DataDome / WAF bypass helpers
 *
 * CONTEXT
 * -------
 * GitHub Actions runs on Microsoft Azure public IP ranges.  The London Drugs
 * site (UAT and PROD) is protected by DataDome, a WAF that blocks requests
 * from known data-centre IPs with an invisible Captcha iframe served from
 * geo.captcha-delivery.com.  When the iframe fires it intercepts all pointer
 * events and causes every Playwright interaction to time out at 60 s.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * 1. applyAntiBotMeasures(page)
 *    - Aborts requests to captcha-delivery.com and datadome.co so the
 *      blocking iframe is never injected into the page.
 *    - Overrides navigator.webdriver to `false` via addInitScript so the
 *      DataDome client-side sensor cannot detect headless Chrome.
 *
 * USAGE
 * -----
 * Call once per page BEFORE the first navigation (e.g. in test.beforeEach or
 * at the top of the test body):
 *
 *   import { applyAntiBotMeasures } from '../helpers/anti-bot';
 *
 *   test.beforeEach(async ({ page }) => {
 *     await applyAntiBotMeasures(page);
 *   });
 *
 * LONG-TERM FIX
 * -------------
 * These mitigations reduce the attack surface but are not a permanent
 * solution. The definitive fix is to ask the DevOps / Infrastructure team to
 * whitelist GitHub Actions IP ranges in DataDome (or disable DataDome on the
 * UAT origin).  GitHub publishes its IP ranges at:
 *   https://api.github.com/meta  (field: "actions")
 * Pass those CIDR blocks to the DataDome dashboard under
 *   Settings > IP Allowlist > Add IP range.
 */

import { Page } from '@playwright/test';

/** Hostname patterns whose requests will be aborted to prevent the
 *  DataDome captcha iframe from being injected into the page. */
const CAPTCHA_HOSTS: string[] = [
  'captcha-delivery.com',
  'datadome.co',
  'geo.captcha-delivery.com',
];

/**
 * Applies anti-bot mitigations to the given Playwright page.
 *
 * Must be called BEFORE the first page.goto() so that:
 *  - The init script runs before any page JS executes.
 *  - The route handlers are registered before the first navigation fires.
 *
 * @param page - The Playwright Page instance to protect.
 */
export async function applyAntiBotMeasures(page: Page): Promise<void> {
  /* 1. Remove the navigator.webdriver fingerprint.
        --disable-blink-features=AutomationControlled in launchOptions.args
        already removes it at the browser level for Chromium/Edge.
        This addInitScript is a belt-and-suspenders layer that also covers
        Firefox and WebKit where the CLI flag is not available. */
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true,
    });
  });

  /* 2. Abort DataDome captcha domain requests.
        DataDome delivers its blocking iframe from captcha-delivery.com.
        Aborting those requests prevents the iframe from being injected,
        so Playwright interactions are never intercepted by the overlay.
        This does NOT bypass DataDome on the server side -- it only prevents
        the client-side overlay from rendering. Server-side blocks still
        return 403/503; IP whitelisting is required for a full bypass. */
  for (const host of CAPTCHA_HOSTS) {
    await page.route(`**${host}**`, (route) => route.abort('blockedbyclient'));
  }
}
