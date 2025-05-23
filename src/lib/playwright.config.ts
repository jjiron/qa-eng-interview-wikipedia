import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './',
    testMatch: '**/all.test.ts',
    workers: 1,
    fullyParallel: false,
    retries: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['list', { printSteps: true }], ['html', { open: 'never' }]],
    timeout: 180000,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL: process.env.TARGET_URL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on',
        actionTimeout: 60000,
        headless: false,
        contextOptions: {
            permissions: ['clipboard-read', 'clipboard-write'],
        },
        screenshot: 'on',
        video: 'on',
    },
    expect: {
        timeout: 60000,
    },
    projects: [
        {
            name: 'login',
            testMatch: '**/login.test.ts',
        },
        {
            name: 'core tests',
            testIgnore: ['**/login.test.ts'],
            dependencies: ['login'],
            use: {
                ...devices['Desktop Chrome'],
                storageState: process.env.AUTH_FILE,
            },
        },
    ],
});
