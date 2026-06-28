import { test, expect } from '@playwright/test';

test.describe('Patients Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the locally running app
    await page.goto('http://localhost:5173');
  });

  test('should display the main title and at least one patient', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Patient Records');
    
    // Wait for patients to load (the grid should appear)
    const patientCards = page.locator('.bg-white.rounded-lg.border.border-gray-200').first();
    await expect(patientCards).toBeVisible();
  });

  test('should allow searching for a patient', async ({ page }) => {
    // Type a nonexistent name to see the empty state
    await page.fill('input[placeholder="Filter patients by name..."]', 'NoExisteEstePaciente');
    await expect(page.locator('text=No patients found matching "NoExisteEstePaciente"')).toBeVisible();

    // Clear search
    await page.fill('input[placeholder="Filter patients by name..."]', '');
  });

  test('should allow adding a new patient via the modal', async ({ page }) => {
    // Click Add Patient (navbar button)
    await page.getByRole('button', { name: '+ Add Patient' }).click();
    
    // Check if modal is visible
    const modal = page.locator('.fixed.inset-0'); // The modal overlay container
    await expect(modal.locator('h2', { hasText: 'Add Patient' })).toBeVisible();

    // Fill form
    await page.getByPlaceholder('Patient name').fill('Automated Patient');
    await page.getByPlaceholder('Patient description').fill('This was added by Playwright!');
    
    // Submit form (button inside modal)
    await modal.getByRole('button', { name: 'Add patient', exact: true }).click();

    // Verify modal closes and success toast appears
    await expect(modal).not.toBeVisible();
    await expect(page.locator('text=Patient added successfully')).toBeVisible();
  });
});
