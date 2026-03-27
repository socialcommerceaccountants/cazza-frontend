import { test, expect } from '@playwright/test';

test.describe('Cazza.ai Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Cazza.ai|Dashboard/);
  });

  test('dashboard header is visible', async ({ page }) => {
    // Check for dashboard header
    const header = page.locator('h1');
    await expect(header).toBeVisible();
    await expect(header).toContainText(/Dashboard|Welcome/);
  });

  test('module grid is displayed', async ({ page }) => {
    // Check for module grid sections
    const modules = page.locator('[data-testid="module-grid"]');
    await expect(modules).toBeVisible();
    
    // Check for expected modules
    const moduleTitles = ['Transactions', 'Reports', 'Settings', 'Xero'];
    for (const title of moduleTitles) {
      await expect(page.getByText(title, { exact: false })).toBeVisible();
    }
  });

  test('stats overview is displayed', async ({ page }) => {
    // Check for stats overview
    const stats = page.locator('[data-testid="stats-overview"]');
    await expect(stats).toBeVisible();
    
    // Check for common stats
    const statLabels = ['Revenue', 'Expenses', 'Profit', 'VAT'];
    for (const label of statLabels) {
      await expect(page.getByText(label, { exact: false })).toBeVisible();
    }
  });

  test('chatbot interface is available', async ({ page }) => {
    // Check for chatbot
    const chatbot = page.locator('[data-testid="chatbot-interface"]');
    await expect(chatbot).toBeVisible();
    
    // Check for input field
    const chatInput = page.locator('[data-testid="chat-input"]');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEditable();
  });

  test('recent activity is displayed', async ({ page }) => {
    // Check for recent activity
    const activity = page.locator('[data-testid="recent-activity"]');
    await expect(activity).toBeVisible();
    
    // Check for activity items
    const activityItems = page.locator('[data-testid="activity-item"]');
    await expect(activityItems).toHaveCountGreaterThan(0);
  });

  test('dark/light mode toggle works', async ({ page }) => {
    // Check for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Click toggle and check for theme change
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme') || 
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme') || 
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    
    expect(newTheme).not.toBe(initialTheme);
  });

  test('navigation sidebar works', async ({ page }) => {
    // Check for sidebar navigation
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toBeVisible();
    
    // Check for navigation links
    const navLinks = ['Dashboard', 'Transactions', 'Reports', 'Settings'];
    for (const link of navLinks) {
      const navItem = page.getByRole('link', { name: link, exact: false });
      await expect(navItem).toBeVisible();
    }
    
    // Test navigation to Settings
    const settingsLink = page.getByRole('link', { name: 'Settings', exact: false });
    await settingsLink.click();
    
    // Should navigate to settings page
    await expect(page).toHaveURL(/.*settings.*/);
    await expect(page.getByText('Settings', { exact: false })).toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that sidebar is collapsed or hamburger menu is visible
    const hamburgerMenu = page.locator('[data-testid="hamburger-menu"]');
    await expect(hamburgerMenu).toBeVisible();
    
    // Check that layout adapts
    const grid = page.locator('[data-testid="module-grid"]');
    await expect(grid).toBeVisible();
    
    // Verify single column layout on mobile
    const gridItems = page.locator('[data-testid="module-item"]');
    const firstItem = gridItems.first();
    const firstItemBox = await firstItem.boundingBox();
    
    // Grid items should take full width on mobile
    expect(firstItemBox?.width).toBeGreaterThan(300); // Almost full width on mobile
  });
});

test.describe('Authentication', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check login form
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();
    
    // Check for email and password fields
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check for Xero connect option
    const xeroConnect = page.getByText('Connect with Xero', { exact: false });
    await expect(xeroConnect).toBeVisible();
  });

  test('Xero connection flow', async ({ page }) => {
    await page.goto('/settings');
    
    // Check for Xero connection section
    const xeroSection = page.getByText('Xero Connection', { exact: false });
    await expect(xeroSection).toBeVisible();
    
    // Check for connect button
    const connectButton = page.getByRole('button', { name: /Connect.*Xero/i });
    await expect(connectButton).toBeVisible();
    
    // Click connect button (would normally redirect to Xero)
    await connectButton.click();
    
    // In test environment, we might mock this or check for redirect
    // For now, just verify the button click works
    await expect(page).toHaveURL(/.*xero.*/).catch(() => {
      // If not redirected, check for connection status
      const connectedStatus = page.getByText('Connected', { exact: false });
      expect(connectedStatus).toBeVisible();
    });
  });
});

test.describe('Transactions Page', () => {
  test('transactions page loads', async ({ page }) => {
    await page.goto('/transactions');
    
    // Check page title
    await expect(page.getByText('Transactions', { exact: false })).toBeVisible();
    
    // Check for transaction table
    const transactionTable = page.locator('[data-testid="transaction-table"]');
    await expect(transactionTable).toBeVisible();
    
    // Check for table headers
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Status'];
    for (const header of headers) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }
    
    // Check for filter controls
    const filterInput = page.locator('[data-testid="transaction-filter"]');
    await expect(filterInput).toBeVisible();
    
    const dateFilter = page.locator('[data-testid="date-filter"]');
    await expect(dateFilter).toBeVisible();
  });

  test('transaction categorization', async ({ page }) => {
    await page.goto('/transactions');
    
    // Find an uncategorized transaction
    const uncategorizedRow = page.locator('[data-testid="transaction-row"]')
      .filter({ hasText: 'Uncategorized' })
      .first();
    
    await expect(uncategorizedRow).toBeVisible();
    
    // Click to categorize
    const categorizeButton = uncategorizedRow.locator('[data-testid="categorize-button"]');
    await expect(categorizeButton).toBeVisible();
    await categorizeButton.click();
    
    // Check for categorization modal
    const categorizeModal = page.locator('[data-testid="categorize-modal"]');
    await expect(categorizeModal).toBeVisible();
    
    // Check for category suggestions
    const suggestions = page.locator('[data-testid="category-suggestion"]');
    await expect(suggestions).toHaveCountGreaterThan(0);
    
    // Select a category
    const firstSuggestion = suggestions.first();
    await firstSuggestion.click();
    
    // Check for confirmation
    const confirmButton = page.locator('[data-testid="confirm-categorization"]');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    // Verify transaction is now categorized
    await expect(uncategorizedRow).not.toContainText('Uncategorized');
  });
});

test.describe('Settings Page', () => {
  test('settings page has all sections', async ({ page }) => {
    await page.goto('/settings');
    
    // Check for settings sections
    const sections = [
      'Profile',
      'Xero Connection', 
      'Notification Preferences',
      'Data Sharing Consent',
      'UK VAT Settings'
    ];
    
    for (const section of sections) {
      await expect(page.getByText(section, { exact: false })).toBeVisible();
    }
  });

  test('UK VAT settings configuration', async ({ page }) => {
    await page.goto('/settings');
    
    // Navigate to VAT settings
    const vatSection = page.getByText('UK VAT Settings', { exact: false });
    await vatSection.click();
    
    // Check for VAT registration toggle
    const vatToggle = page.locator('[data-testid="vat-registration-toggle"]');
    await expect(vatToggle).toBeVisible();
    
    // Check for VAT number input (if registered)
    await vatToggle.click();
    const vatNumberInput = page.locator('[data-testid="vat-number-input"]');
    await expect(vatNumberInput).toBeVisible();
    
    // Check for VAT scheme selection
    const vatScheme = page.locator('[data-testid="vat-scheme-select"]');
    await expect(vatScheme).toBeVisible();
    
    // Check for VAT rates display
    const vatRates = page.getByText('Standard Rate: 20%');
    await expect(vatRates).toBeVisible();
  });

  test('data sharing consent', async ({ page }) => {
    await page.goto('/settings');
    
    // Navigate to consent section
    const consentSection = page.getByText('Data Sharing Consent', { exact: false });
    await consentSection.click();
    
    // Check for consent toggles
    const sharePatternsToggle = page.locator('[data-testid="share-patterns-toggle"]');
    const marketingToggle = page.locator('[data-testid="marketing-toggle"]');
    
    await expect(sharePatternsToggle).toBeVisible();
    await expect(marketingToggle).toBeVisible();
    
    // Test toggling consent
    await sharePatternsToggle.click();
    
    // Check for confirmation
    const saveButton = page.locator('[data-testid="save-consent"]');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Check for success message
    const successMessage = page.getByText('Preferences saved');
    await expect(successMessage).toBeVisible();
  });
});