// Project: parabank-playwright-framework-v2


/* ==================================================
FILE: package.json
================================================== */
{
"name": "parabank-playwright-framework-v2",
"version": "1.0.0",
"description": "Playwright E2E test automation framework for ParaBank (alternative version)",
"scripts": {
"test": "playwright test",
"report": "playwright show-report"
},
"devDependencies": {
"@playwright/test": "^1.40.0"
}
}

/* ==================================================
FILE: playwright.config.js
================================================== */
import { defineConfig } from '@playwright/test';

export default defineConfig({
testDir: './tests',
reporter: [['html']],
use: {
baseURL: 'https://parabank.parasoft.com',
headless: true,
screenshot: 'only-on-failure',
trace: 'retain-on-failure'
}
});

/* ==================================================
FILE: utils/data.js
================================================== */
export const TestData = {
userTemplate: {
firstName: 'QA',
lastName: 'Engineer',
address: '123 Automation Street',
city: 'Bangalore',
state: 'KA',
zip: '560001',
phone: '9876543210',
password: 'Passw0rd123'
},
payee: {
name: 'UtilityCorp',
address: '456 Energy Road',
city: 'Chennai',
state: 'TN',
zip: '600001',
phone: '9988776655',
accountNumber: '99999'
}
};

export function generateUsername() {
return `qa_${Date.now()}`;
}

/* ==================================================
FILE: pages/BasePage.js
================================================== */
export class BasePage {
constructor(page) {
this.page = page;
}

async navigateTo(path) {
await this.page.goto(path);
}
}

/* ==================================================
FILE: pages/ParaBank.js
================================================== */
import { BasePage } from './BasePage.js';

export class ParaBank extends BasePage {
constructor(page) {
super(page);
this.locators = {
registerLink: 'a[href*="register.htm"]',
overviewLink: 'a[href*="overview.htm"]',
openAccountLink: 'a[href*="openaccount.htm"]',
transferLink: 'a[href*="transfer.htm"]',
billPayLink: 'a[href*="billpay.htm"]',
logoutLink: 'a[href*="logout.htm"]'
};
}

async goToRegistration() {
await this.page.click(this.locators.registerLink);
}

async goToOverview() {
await this.page.click(this.locators.overviewLink);
}

async goToOpenAccount() {
await this.page.click(this.locators.openAccountLink);
}

async goToTransfer() {
await this.page.click(this.locators.transferLink);
}

async goToBillPay() {
await this.page.click(this.locators.billPayLink);
}

async logout() {
await this.page.click(this.locators.logoutLink);
}
}

/* ==================================================
FILE: tests/e2e/parabank.spec.js
================================================== */
import { test, expect } from '@playwright/test';
import { ParaBank } from '../../pages/ParaBank.js';
import { TestData, generateUsername } from '../../utils/data.js';

test('Full ParaBank E2E Flow', async ({ page, request }) => {
const app = new ParaBank(page);
const username = generateUsername();
const password = TestData.userTemplate.password;

// 1. Register user
await page.goto('/parabank/index.htm');
await app.goToRegistration();
await page.fill('input[name="customer.firstName"]', TestData.userTemplate.firstName);
await page.fill('input[name="customer.lastName"]', TestData.userTemplate.lastName);
await page.fill('input[name="customer.address.street"]', TestData.userTemplate.address);
await page.fill('input[name="customer.address.city"]', TestData.userTemplate.city);
await page.fill('input[name="customer.address.state"]', TestData.userTemplate.state);
await page.fill('input[name="customer.address.zipCode"]', TestData.userTemplate.zip);
await page.fill('input[name="customer.phoneNumber"]', TestData.userTemplate.phone);
await page.fill('input[name="customer.ssn"]', `${Date.now()}`);
await page.fill('input[name="customer.username"]', username);
await page.fill('input[name="customer.password"]', password);
await page.fill('input[name="repeatedPassword"]', password);
await page.click('input[value="Register"]');
await expect(page.locator('.title')).toContainText('Welcome');

// 2. Login
await page.fill('input[name="username"]', username);
await page.fill('input[name="password"]', password);
await page.click('input[value="Log In"]');
await expect(page.locator(app.locators.logoutLink)).toBeVisible();

// 3. Open new savings account
await app.goToOpenAccount();
await page.selectOption('#type', '1');
await page.click('input[value="Open New Account"]');
const newAccountId = await page.locator('#newAccountId').innerText();
expect(newAccountId).not.toBeNull();

// 4. Verify account overview
await app.goToOverview();
const accountExists = await page.locator(`#accountTable a:has-text("${newAccountId}")`).isVisible();
expect(accountExists).toBeTruthy();

// 5. Transfer funds
await app.goToTransfer();
const toAccount = await page.locator('select[name="toAccountId"] option').nth(1).textContent();
await page.fill('input[name="amount"]', '50');
await page.selectOption('select[name="fromAccountId"]', { label: newAccountId });
await page.selectOption('select[name="toAccountId"]', { label: toAccount });
await page.click('input[value="Transfer"]');
await expect(page.locator('.title')).toContainText('Transfer');

// 6. Pay a bill
await app.goToBillPay();
await page.fill('input[name="payee.name"]', TestData.payee.name);
await page.fill('input[name="payee.address.street"]', TestData.payee.address);
await page.fill('input[name="payee.address.city"]', TestData.payee.city);
await page.fill('input[name="payee.address.state"]', TestData.payee.state);
await page.fill('input[name="payee.address.zipCode"]', TestData.payee.zip);
await page.fill('input[name="payee.phoneNumber"]', TestData.payee.phone);
await page.fill('input[name="payee.accountNumber"]', TestData.payee.accountNumber);
await page.fill('input[name="verifyAccount"]', TestData.payee.accountNumber);
await page.fill('input[name="amount"]', '100');
await page.selectOption('select[name="fromAccountId"]', { label: newAccountId });
await page.click('input[value="Send Payment"]');
await expect(page.locator('.title')).toContainText('Bill Payment');

// 7. API validation
const resp = await request.get('/parabank/services/bank/findtransbyamount', {
params: { amount: '100' }
});
expect(resp.ok()).toBeTruthy();
const txns = await resp.json();
expect(Array.isArray(txns)).toBeTruthy();

});
