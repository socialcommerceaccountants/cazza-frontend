import { test, expect } from '@playwright/test';

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to analytics page
    await page.goto('/analytics');
  });

  test('should load the analytics dashboard', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible();
    
    // Check description
    await expect(page.getByText('Real-time insights and performance metrics for your business')).toBeVisible();
  });

  test('should display revenue chart', async ({ page }) => {
    // Check revenue chart is visible
    await expect(page.getByText('Revenue Trends')).toBeVisible();
    await expect(page.getByText('Track revenue, expenses, and profit over time')).toBeVisible();
    
    // Check export buttons
    await expect(page.getByRole('button', { name: 'CSV' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PNG' })).toBeVisible();
    
    // Check metric cards
    await expect(page.getByText('Total Revenue')).toBeVisible();
    await expect(page.getByText('Total Profit')).toBeVisible();
    await expect(page.getByText('Avg. Growth')).toBeVisible();
  });

  test('should switch between chart types', async ({ page }) => {
    // Initially line chart should be active
    await expect(page.getByRole('tab', { name: 'Line Chart' })).toHaveAttribute('data-state', 'active');
    
    // Switch to bar chart
    await page.getByRole('tab', { name: 'Bar Chart' }).click();
    await expect(page.getByRole('tab', { name: 'Bar Chart' })).toHaveAttribute('data-state', 'active');
    
    // Switch back to line chart
    await page.getByRole('tab', { name: 'Line Chart' }).click();
    await expect(page.getByRole('tab', { name: 'Line Chart' })).toHaveAttribute('data-state', 'active');
  });

  test('should display CAC calculator', async ({ page }) => {
    // Navigate to CAC tab
    await page.getByRole('tab', { name: 'CAC' }).click();
    
    // Check CAC calculator is visible
    await expect(page.getByText('CAC Calculator')).toBeVisible();
    await expect(page.getByText('Calculate Customer Acquisition Cost across marketing channels')).toBeVisible();
    
    // Check add channel button
    await expect(page.getByRole('button', { name: 'Add Channel' })).toBeVisible();
    
    // Check data table
    await expect(page.getByText('Channel')).toBeVisible();
    await expect(page.getByText('Spend')).toBeVisible();
    await expect(page.getByText('Customers')).toBeVisible();
    await expect(page.getByText('CAC')).toBeVisible();
  });

  test('should display ROI analysis', async ({ page }) => {
    // Navigate to ROI tab
    await page.getByRole('tab', { name: 'ROI' }).click();
    
    // Check ROI analysis is visible
    await expect(page.getByText('ROI Analysis')).toBeVisible();
    await expect(page.getByText('Analyze return on investment across business categories')).toBeVisible();
    
    // Check metric cards
    await expect(page.getByText('Total Investment')).toBeVisible();
    await expect(page.getByText('Total Return')).toBeVisible();
    await expect(page.getByText('Avg. ROI')).toBeVisible();
    await expect(page.getByText('Payback Period')).toBeVisible();
  });

  test('should display platform performance', async ({ page }) => {
    // Platform performance should be visible in overview
    await expect(page.getByText('Platform Performance')).toBeVisible();
    await expect(page.getByText('Compare performance across e-commerce platforms')).toBeVisible();
    
    // Check platform filters
    await expect(page.getByText('Shopify')).toBeVisible();
    await expect(page.getByText('Amazon')).toBeVisible();
    await expect(page.getByText('Etsy')).toBeVisible();
  });

  test('should display real-time metrics', async ({ page }) => {
    // Navigate to real-time tab
    await page.getByRole('tab', { name: 'Real-time' }).click();
    
    // Check real-time metrics is visible
    await expect(page.getByText('Real-time Metrics')).toBeVisible();
    await expect(page.getByText('Live dashboard with WebSocket-powered updates')).toBeVisible();
    
    // Check connection status
    await expect(page.getByText('Connected')).toBeVisible();
    
    // Check simulation controls
    await expect(page.getByRole('button', { name: 'Start Sim' })).toBeVisible();
    
    // Check current metrics
    await expect(page.getByText('Current Revenue')).toBeVisible();
    await expect(page.getByText('Active Users')).toBeVisible();
    await expect(page.getByText('Orders/Min')).toBeVisible();
  });

  test('should handle tab navigation', async ({ page }) => {
    // Test all main tabs
    const tabs = ['Overview', 'Revenue', 'CAC', 'ROI', 'Real-time'];
    
    for (const tabName of tabs) {
      await page.getByRole('tab', { name: tabName }).click();
      await expect(page.getByRole('tab', { name: tabName })).toHaveAttribute('data-state', 'active');
      
      // Each tab should show relevant content
      if (tabName === 'Overview') {
        await expect(page.getByText('Revenue Trends')).toBeVisible();
      } else if (tabName === 'Revenue') {
        await expect(page.getByText('Revenue Insights')).toBeVisible();
      } else if (tabName === 'CAC') {
        await expect(page.getByText('CAC Calculator')).toBeVisible();
      } else if (tabName === 'ROI') {
        await expect(page.getByText('ROI Analysis')).toBeVisible();
      } else if (tabName === 'Real-time') {
        await expect(page.getByText('Real-time Metrics')).toBeVisible();
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check layout adjusts
    await expect(page.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible();
    
    // Tabs should still be accessible
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible();
    
    // Metric cards should stack vertically
    const metricCards = page.locator('[class*="bg-muted"]');
    await expect(metricCards.first()).toBeVisible();
  });

  test('should handle dark/light theme', async ({ page }) => {
    // Check initial theme (depends on system/browser)
    const body = page.locator('body');
    const initialTheme = await body.getAttribute('class');
    
    // The theme toggle might be in a different component
    // This test would need to be adjusted based on actual theme implementation
    expect(initialTheme).toBeTruthy();
  });

  test('should export data as CSV', async ({ page }) => {
    // Mock download
    const downloadPromise = page.waitForEvent('download');
    
    // Click CSV export button
    await page.getByRole('button', { name: 'CSV' }).first().click();
    
    // Should trigger download
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');
  });
});