import { test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;
const wikipediaUrl = process.env.TARGET_URL?.toString();
const authFile = process.env.AUTH_FILE;

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }
    if (!wikipediaUrl) {
        throw new Error('TARGET_URL environment variable is not set!');
    }
    // Go to the home page of Wikipedia website.
    await page.goto(wikipediaUrl);

    // Click the "Log in" link.
    const loginLink = page.getByRole('link', {name: 'Log in'});
    await loginLink.click();
    
    // Wait for the login form to be displayed.
    const loginForm = page.getByRole('form', { name: 'userlogin' });
    await page.pause();
    //await loginForm.waitFor();
    
    // Fill in the username and password fields.
    const usernameField = page.getByPlaceholder('Enter your username');
    await usernameField.fill(wikipediaUsername);
    const passwordField = page.getByPlaceholder('Enter your password');
    await passwordField.fill(wikipediaPassword);
    
    // Click the "Log in" button.
    const loginButton = page.getByRole('button', { name: 'Log in' });
    await loginButton.click();
    
    // Wait for the login to complete and the user to be redirected to the main page.
    await page.waitForLoadState(`networkidle`);
    
    // Check if the login was successful by looking for the userName link.
    const userNameLink = page.getByRole('link', { name: wikipediaUsername });
    const isLoggedIn = await userNameLink.isVisible();
    if (!isLoggedIn) {
        throw new Error('Login failed! Please check your username and password.');
    }
    else {
        // Verifies the variable is set.
        // If the variable is not set, it will throw an error.
        // This is to ensure that the test will not fail if the variable is not set.
        if (!authFile) {
            throw new Error('AUTH_FILE environment variable is not set!');
        }
        // Save the authenticated session to a file.
        // The file will be created if it doesn't exist.
        // If the file already exists, it will be overwritten.
        await page.context().storageState({ path: authFile });
    }
});
