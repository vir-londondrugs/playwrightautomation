import * as fs from 'fs';
import * as path from 'path';
import { Page, TestInfo } from '@playwright/test';

const EVIDENCE_DIR = path.resolve(__dirname, '../artifacts/outputs');

/**
 * Takes a screenshot and saves it as evidence for the current TC.
 *
 * Filename format: {TC-number}_{YYYY-MM-DD_HH-mm-ss}.png
 * Example: TC-79593-02-negative_2026-06-23_14-30-05.png
 *
 * The TC number is extracted from the test title (e.g. "TC-79593-02-negative — …").
 * If no TC number is found the sanitized test title is used as fallback.
 */
export async function takeEvidenceScreenshot(page: Page, testInfo: TestInfo): Promise<void> {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

    const tcMatch = testInfo.title.match(/TC-[\w-]+/);
    const tcId = tcMatch ? tcMatch[0] : testInfo.title.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 60);

    const now = new Date();
    const timestamp = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-') + '_' + [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0'),
    ].join('-');

    const filename = `${tcId}_${timestamp}.png`;
    const filepath = path.join(EVIDENCE_DIR, filename);

    await page.screenshot({ path: filepath, fullPage: true });
}
