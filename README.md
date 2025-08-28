# fabric_proj_1


>>>> ParaBank Playwright Framework v2

End-to-end (E2E) test automation framework built with [Playwright](https://playwright.dev/) for testing the [ParaBank demo application](https://parabank.parasoft.com).

This project follows **Page Object Model (POM)** design pattern and includes:
- UI flows (Registration, Login, Open Account, Transfer, Bill Payment)
- API validations
- Test data management

---

>>>> Project Structure



parabank-playwright-framework-v2/
│── package.json
│── playwright.config.js # Playwright configuration
│
├── pages/ # Page Object classes
│ ├── BasePage.js
│ └── ParaBank.js
│
├── tests/
│ └── e2e/
│ └── parabank.spec.js # Main E2E test flow
│
└── utils/
└── data.js # Test data & helpers


---

 Setup
 1. Clone Repository
```bash
git clone https://github.com/your-username/parabank-playwright-framework-v2.git
cd parabank-playwright-framework-v2

2. Install Dependencies
npm install

3. Install Playwright Browsers
npx playwright install

>>>> Running Tests

Run all tests:

npm test


Run with UI mode:

npx playwright test --ui


Run a specific test file:

npx playwright test tests/e2e/parabank.spec.js


Run headed (non-headless) mode:

npx playwright test --headed

>>>>> Reports

Generate & view HTML report:

npm run report

>>>> Framework Highlights

Playwright Test Runner (@playwright/test)

Page Object Model (modular, reusable locators & actions)

Data-driven approach (utils/data.js)

Dynamic user generation (generateUsername())

Combined UI + API assertions

Screenshots & Traces on Failure

>>>>Sample Flow Covered

Register a new user

Login with registered user

Open a new Savings Account

Verify account in Overview

Transfer funds

Pay a bill

Validate transaction via API
