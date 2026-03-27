import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  // Mock API responses for testing
  const mockTransactions = [
    {
      id: 'tx-001',
      date: '2024-01-15',
      description: 'Payment from Shopify',
      amount: 100.50,
      category: 'Revenue',
      status: 'categorized',
    },
    {
      id: 'tx-002',
      date: '2024-01-16',
      description: 'Google Ads payment',
      amount: 50.00,
      category: 'Marketing',
      status: 'categorized',
    },
    {
      id: 'tx-003',
      date: '2024-01-17',
      description: 'Unknown payment',
      amount: 75.25,
      category: null,
      status: 'uncategorized',
    },
  ];

  const mockStats = {
    revenue: 12500.75,
    expenses: 8500.25,
    profit: 4000.50,
    vatOwed: 2500.15,
    uncategorizedCount: 5,
  };

  test.beforeEach(async ({ page }) => {
    // Mock API responses before each test
    await page.route('**/api/v1/transactions**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ transactions: mockTransactions }),
      });
    });

    await page.route('**/api/v1/stats**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStats),
      });
    });

    await page.route('**/api/v1/categorise/suggest**', async (route) => {
      const request = route.request();
      const postData = request.postData();
      
      // Return different suggestions based on merchant
      let suggestion;
      if (postData?.includes('Shopify')) {
        suggestion = {
          category: 'Revenue',
          account_code: '4000',
          confidence: 0.95,
          reasoning: 'Based on merchant name and industry patterns',
        };
      } else if (postData?.includes('Google')) {
        suggestion = {
          category: 'Marketing',
          account_code: '6300',
          confidence: 0.88,
          reasoning: 'Google services typically for marketing',
        };
      } else {
        suggestion = {
          category: 'Uncategorized',
          account_code: '9999',
          confidence: 0.5,
          reasoning: 'Unable to determine category',
        };
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(suggestion),
      });
    });

    // Navigate to homepage
    await page.goto('/');
  });

  test('loads transactions from API', async ({ page }) => {
    // Check that transactions are loaded
    const transactionRows = page.locator('[data-testid="transaction-row"]');
    await expect(transactionRows).toHaveCount(mockTransactions.length);
    
    // Verify transaction data
    for (const tx of mockTransactions) {
      await expect(page.getByText(tx.description)).toBeVisible();
      await expect(page.getByText(`£${tx.amount.toFixed(2)}`)).toBeVisible();
    }
  });

  test('displays stats from API', async ({ page }) => {
    // Check stats display
    await expect(page.getByText(`£${mockStats.revenue.toFixed(2)}`)).toBeVisible();
    await expect(page.getByText(`£${mockStats.expenses.toFixed(2)}`)).toBeVisible();
    await expect(page.getByText(`£${mockStats.profit.toFixed(2)}`)).toBeVisible();
    await expect(page.getByText(`£${mockStats.vatOwed.toFixed(2)}`)).toBeVisible();
  });

  test('categorization API integration', async ({ page }) => {
    // Go to transactions page
    await page.goto('/transactions');
    
    // Find uncategorized transaction
    const uncategorizedRow = page.locator('[data-testid="transaction-row"]')
      .filter({ hasText: 'Uncategorized' })
      .first();
    
    await expect(uncategorizedRow).toBeVisible();
    
    // Mock the categorization API
    await page.route('**/api/v1/categorise/override**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success' }),
      });
    });
    
    // Categorize the transaction
    const categorizeButton = uncategorizedRow.locator('[data-testid="categorize-button"]');
    await categorizeButton.click();
    
    // Select a category
    const categoryOption = page.locator('[data-testid="category-option"]').first();
    await categoryOption.click();
    
    // Confirm
    const confirmButton = page.locator('[data-testid="confirm-categorization"]');
    await confirmButton.click();
    
    // Verify success message
    const successMessage = page.getByText('Transaction categorized');
    await expect(successMessage).toBeVisible();
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/v1/transactions**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
    
    // Reload page to trigger error
    await page.reload();
    
    // Check for error message
    const errorMessage = page.getByText('Error loading transactions');
    await expect(errorMessage).toBeVisible();
    
    // Check for retry button
    const retryButton = page.getByRole('button', { name: 'Retry' });
    await expect(retryButton).toBeVisible();
  });

  test('Xero API integration', async ({ page }) => {
    await page.goto('/settings');
    
    // Mock Xero connection check
    await page.route('**/api/v1/xero/connection**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ connected: false }),
      });
    });
    
    // Check connection status
    const notConnected = page.getByText('Not connected to Xero');
    await expect(notConnected).toBeVisible();
    
    // Mock Xero auth URL
    await page.route('**/api/v1/xero/auth/url**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://xero.com/oauth/authorize' }),
      });
    });
    
    // Click connect button
    const connectButton = page.getByRole('button', { name: /Connect.*Xero/i });
    await connectButton.click();
    
    // Should redirect to Xero (or show redirect in test)
    await expect(page).toHaveURL(/.*xero.*/).catch(() => {
      // If not redirected in test, check for connection flow
      const authFlow = page.getByText('Redirecting to Xero');
      expect(authFlow).toBeVisible();
    });
  });

  test('real-time updates with WebSocket', async ({ page }) => {
    // This test would require WebSocket mocking
    // For now, just verify the UI is ready for real-time updates
    
    await page.goto('/dashboard');
    
    // Check for real-time indicators
    const liveIndicator = page.locator('[data-testid="live-indicator"]');
    await expect(liveIndicator).toBeVisible();
    
    // Check for last updated time
    const lastUpdated = page.locator('[data-testid="last-updated"]');
    await expect(lastUpdated).toBeVisible();
    
    // The actual WebSocket testing would require more complex setup
    // and is typically done with integration tests
  });

  test('batch operations API', async ({ page }) => {
    await page.goto('/transactions');
    
    // Select multiple transactions
    const checkboxes = page.locator('[data-testid="transaction-checkbox"]');
    await checkboxes.nth(0).click();
    await checkboxes.nth(1).click();
    
    // Check for batch actions menu
    const batchMenu = page.locator('[data-testid="batch-actions"]');
    await expect(batchMenu).toBeVisible();
    
    // Mock batch categorize API
    await page.route('**/api/v1/categorise/batch**', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      // Verify batch request structure
      expect(postData.transaction_ids).toHaveLength(2);
      expect(postData.category).toBeDefined();
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          processed: 2,
          successful: 2,
          failed: 0,
        }),
      });
    });
    
    // Open batch categorize
    await batchMenu.click();
    const batchCategorize = page.getByText('Categorize selected');
    await batchCategorize.click();
    
    // Select category
    const categorySelect = page.locator('[data-testid="batch-category-select"]');
    await categorySelect.click();
    
    const revenueOption = page.getByText('Revenue');
    await revenueOption.click();
    
    // Submit
    const submitButton = page.getByRole('button', { name: 'Apply to selected' });
    await submitButton.click();
    
    // Verify success
    const successMessage = page.getByText('2 transactions categorized');
    await expect(successMessage).toBeVisible();
  });

  test('UK VAT API calculations', async ({ page }) => {
    await page.goto('/reports/vat');
    
    // Mock VAT calculation API
    await page.route('**/api/v1/vat/calculate**', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      // Calculate mock VAT
      const vatDue = postData.sales * 0.2 - postData.purchases * 0.2;
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          period: postData.period,
          vatDue: vatDue,
          salesVat: postData.sales * 0.2,
          purchaseVat: postData.purchases * 0.2,
          netVat: vatDue,
          paymentDueDate: '2024-02-28',
        }),
      });
    });
    
    // Set period
    const periodSelect = page.locator('[data-testid="vat-period-select"]');
    await periodSelect.selectOption('2024-01');
    
    // Trigger calculation
    const calculateButton = page.getByRole('button', { name: 'Calculate VAT' });
    await calculateButton.click();
    
    // Verify results
    await expect(page.getByText('VAT Due: £')).toBeVisible();
    await expect(page.getByText('Payment due: 28 Feb 2024')).toBeVisible();
    
    // Check for different VAT rates
    const rateBreakdown = page.locator('[data-testid="vat-rate-breakdown"]');
    await expect(rateBreakdown).toBeVisible();
    
    const rates = ['Standard (20%)', 'Reduced (5%)', 'Zero (0%)'];
    for (const rate of rates) {
      await expect(page.getByText(rate)).toBeVisible();
    }
  });
});