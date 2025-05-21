import { Page, expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */



    /**
     * Returns the font size of the body element of the page in pixels.
     * The font size is retrieved by executing `window.getComputedStyle` on the body element.
     * @param page The page object from playwright.
     * @returns The font size of the body element in pixels.
     */
async function getFontSize(page: Page): Promise<number> {
    // Get the body element
    const bodySelector = '#bodyContent';
    // Get the computed style of the body element
    const bodyFontSize = await page.$eval(bodySelector, el => window.getComputedStyle(el).fontSize);
    // Return the font size of the body element in pixels
    return parseFloat(bodyFontSize);
}
    

    /**
     * This test navigates to Wikipedia's homepage, asserts there are less than 7,000,000 articles in English,
     * and then selects the 'Small', 'Large', and 'Standard' text size options in the appearance settings.
     * It asserts that each option changes the font size of the page as expected.
     *
     * @param page The page object from playwright.
     * @param params An empty object.
     */
export async function run(page: Page, params: {}) {
    
    /** STEP 1: Navigate to Wikipedia's homepage */
    const targetUrl = process.env.TARGET_URL;
    if (!targetUrl) {
        throw new Error('TARGET_URL environment variable is not set!');
    }
    await page.goto(targetUrl);
    // Wait for the page to load
    await page.waitForLoadState(`networkidle`);

    /** STEP: Click the link to view the total number of articles in English */
    // The original code used a role selector to find the link by its name, but I commented it out.
    // The link is located in the second list item of the article count section.
    // I replaced the commented code with a locator that directly targets the link using its href and title attributes.
    // Althought the original code used a locator that follows Playwirght best practices, the number of articles will change over time.
    // So at least for this link in particular, I think it is better to use a locator that is less likely to change.
    //const totalArticlesLink = page.getByRole('link', { name: '6,996,186' });
    const totalArticlesLink = page.locator('#articlecount ul li:nth-child(2) a[href="/wiki/Special:Statistics"][title="Special:Statistics"]');
    const textContent = await totalArticlesLink.innerText();
    const articleCount = parseInt(textContent.replace(/[,]/g, ''), 10);
    // Asserts there are less than 7,000,000 articles in English
    expect(articleCount).toBeLessThan(7000000);
    
  

    /** STEP 2: Select the 'Small' text size option in the appearance settings */
    
    // First I get the default font size of the page from the boby element
    const defaultFontSize = await getFontSize(page);

    /*  Then I click the 'Small' text size option to change the display size
        I use the locator to find the radio button by its name
        and then I click it to select the 'Small' text size option
        I also assert that the font size of the page has changed
        to a smaller size than the default font size*/
    const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
    await smallTextSizeOption.click();
    const smallFontSize = await getFontSize(page);
    // Assert that the font size of the page is smaller than the default font size
    expect(smallFontSize).toBeLessThan(defaultFontSize);


    /** STEP: Click the 'Large' text size option to change the display size */
    // Same as above, but for the 'Large' text size option
    const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
    await largeTextSizeOption.click();
    const largeFontSize = await getFontSize(page);
    // Assert that the font size of the page is larger than the default font size
    expect(largeFontSize).toBeGreaterThan(defaultFontSize);


    /** STEP: Click the 'Standard' text size option in the appearance settings */
    const standardTextSizeButton = page.getByLabel('Standard').first();
    await standardTextSizeButton.click();
    // Assert that the font size of the page is equal to the default font size
    const standardFontSize = await getFontSize(page);
    expect(standardFontSize).toEqual(defaultFontSize);
}
