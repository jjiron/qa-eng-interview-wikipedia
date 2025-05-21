import { Page, expect } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Alenoach"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Alenoach" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */


/**
 * This function automates testing of Wikipedia's search functionality using Playwright.
 * It navigates to Wikipedia, searches for the "Artificial intelligence" page, and performs
 * various assertions to ensure the page loads correctly and meets expectations.
 *
 * Steps:
 * 1. Loads environment variables including SEARCH_TERM and TARGET_URL.
 * 2. Navigates to the specified TARGET_URL.
 * 3. Inputs 'art' into the search field and selects the 'Artificial Intelligence' link.
 * 4. Verifies the page title is visible and matches the search term.
 * 5. Clicks 'View history' link and verifies the history page title is correct.
 * 6. Asserts that the latest edit to the page was made by the user 'Alenoach'.
 *
 * @param page - The Playwright page object representing the browser page.
 * @param params - Additional parameters for the test, currently unused.
 * @throws Error if required environment variables are not set.
 */

export async function run(page: Page, params: {}) {

    // Load environment variables from .env file
    const searchTerm = process.env.SEARCH_TERM;
    
    // Checks if the environment variable is set
    if (!searchTerm) { 
        throw new Error('SEARCH_TERM environment variable is not set!');
    }


    /** STEP: Navigate to URL */
    const targetUrl = process.env.TARGET_URL;
    if (!targetUrl) {
        throw new Error('TARGET_URL environment variable is not set!');
    }
    await page.goto(targetUrl);
    // Wait for the page to load
    await page.waitForLoadState(`networkidle`);

    /** STEP: Enter text 'art' into the search input field */
    const searchInputField = page.getByRole('searchbox', {
        name: 'Search Wikipedia',
    });
    await searchInputField.fill('art');

    /** STEP: Click the 'Artificial Intelligence' link in the search suggestions */
    const artificialIntelligenceLink = page.getByRole('link', {name: searchTerm});
    await artificialIntelligenceLink.click();

    // Read the page title and assert it's visible and that it contains the search term
    const pageTitle = page.getByRole('heading', 
        { name: searchTerm, exact: true }).locator('span')
    
    // Assert that the page title is correct
    await expect(pageTitle).toBeVisible();
    // Assert that the page title contains the search term  
    await expect(pageTitle).toContainText(searchTerm);

    /** STEP: Click the 'View history' link */
    const viewHistoryLink = page.getByRole('link', { name: 'View history' });
    await viewHistoryLink.click();

    // Read the history page title and assert it's visible and that it contains the search term
    // The page title is a heading with the text 'Artificial Intelligence: Revision history'
    const expectedPageTitle = `${searchTerm}: Revision history`;
    const pageTitleHistory = page.getByRole('heading', 
        { name: expectedPageTitle});
    
    // Assert that the page title is correct
    await expect(pageTitleHistory).toBeVisible();
    // Assert that the page title contains the search term
    await expect(pageTitleHistory).toContainText(expectedPageTitle);

    /** STEP: Assert that the latest edit was made by the user 'Alenoach' */
    // The latest edit is the first row in the history table
    // The user link is a link with the class 'mw-userlink'
    const latestEditUser = page.locator('.mw-userlink').first();

    // Assert that the latest edit was made by the user 'Alenoach'
    // At the moment of writing this test, the latest edit was made by 'Alenoach'
    // Therefore the test will fail if the latest edit is made by another user when the test is run
    const expectedUser = 'Alenoach';
    await expect(latestEditUser).toHaveText(expectedUser);

}
