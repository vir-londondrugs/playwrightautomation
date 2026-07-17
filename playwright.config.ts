import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Global test timeout - increased for UAT environment latency */
  timeout: 60000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    /* JUnit XML -- consumed by publish-ado-results.py to push results to ADO Test Plans > Runs */
    ['junit', { outputFile: 'results.xml' }],
    /* Interactive HTML report (local drill-down + CI artifact) */
    ['html', { open: 'never' }],
  ],
  /* Shared settings for all the projects below. */
  use: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    /* Base URL: driven by process.env.BASE_URL; falls back to UAT origin for local runs.
       Smoke workflows pass BASE_URL=https://www.londondrugs.com/ for PROD runs.
       Tests that call page.goto('/path') resolve relative to this base URL. */
    baseURL: process.env.BASE_URL || 'https://london-drugs-uat-origin.kibology.us/',
    /* Headless in CI, visible window locally for manual observation */
    headless: !!process.env.CI,
    /* Suppress browser permission/translate popups */
    locale: 'en-CA',
    geolocation: { latitude: 49.2827, longitude: -123.1207 },
    permissions: ['geolocation'],
    launchOptions: {
      /* slowMo only for local runs -- CI must run at full speed */
      slowMo: process.env.CI ? 0 : 800,
      args: [
        '--disable-features=Translate,TranslateUI',
        '--disable-translate',
        '--no-default-browser-check',
      ],
    },
    extraHTTPHeaders: {
      'Accept-Language': 'en-CA,en;q=0.9',
    },
    /* Trace disabled to avoid ZIP stream corruption bug in Playwright 1.61 */
    trace: 'off',
    /* Screenshots are handled by the custom afterEach in helpers/evidence.ts
       (saved to artifacts/outputs/ with TC number + timestamp in the filename) */
    screenshot: 'off',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Microsoft Edge -- AD-09: 4th browser project added 2026-07-14.
       Uses msedge channel; requires separate install step in CI:
         npx playwright install msedge
       (NOT included in --with-deps on ubuntu-latest) */
    {
      name: 'edge',
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
    },
  ],
});
