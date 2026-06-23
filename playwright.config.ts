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
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Open browser window during test execution */
    headless: false,
    /* Suppress browser permission/translate popups */
    locale: 'en-CA',
    geolocation: { latitude: 49.2827, longitude: -123.1207 },
    permissions: ['geolocation'],
    launchOptions: {
      args: [
        '--lang=en-CA',
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
  ],
});
