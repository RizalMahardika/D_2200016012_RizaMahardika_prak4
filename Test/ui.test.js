// ui.test.js

import { Builder, By } from 'selenium-webdriver';
import { expect } from 'chai';

let driver;

describe('UI Testing using Selenium', function() {
    before(async function() {
        this.timeout(10000); // Meningkatkan batas waktu menjadi 10 detik
        try {
            driver = await new Builder().forBrowser('chrome').build();
            await driver.get('http://localhost:8000/loginPage.html');
        } catch (error) {
            console.error('Error during setup:', error);
            throw error; // Menyebabkan pengujian gagal
        }
    });

    it('should input username and password using CSS Selector', async function() {
        await driver.findElement(By.css('#username')).sendKeys('testuser');
        await driver.findElement(By.css('#password')).sendKeys('password123');
    });

    it('should click the login button', async function() {
        await driver.findElement(By.id('loginButton')).click();
        // Mengatasi alert setelah klik
        try {
            await driver.switchTo().alert().accept();
        } catch (error) {
            console.error('No alert to accept:', error);
        }
    });

    it('should fail to login with invalid credentials', async function() {
        await driver.findElement(By.css('#username')).sendKeys('wronguser');
        await driver.findElement(By.css('#password')).sendKeys('wrongpass');
        await driver.findElement(By.id('loginButton')).click();

        // Memeriksa keberadaan pesan kesalahan di halaman
        const errorMessage = await driver.findElement(By.id('error')).getText();
        expect(errorMessage).to.equal('Invalid username or password');
    });

    it('should validate visual elements', async function() {
        const isDisplayed = await driver.findElement(By.id('loginButton')).isDisplayed();
        expect(isDisplayed).to.be.true;
    });

    after(async function() {
        await driver.quit();
    });
});
