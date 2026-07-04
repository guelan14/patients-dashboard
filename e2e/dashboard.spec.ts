import { test, expect } from '@playwright/test';

test.describe('Patients Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the locally running app
    await page.goto('http://localhost:5173');
  });

  test('should display the main title and at least one patient', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Patient Records');
    
    // Wait for patients to load (the grid should appear)
    const patientCards = page.getByTestId('patient-card').first();
    await expect(patientCards).toBeVisible();
  });

  test('should allow searching for a patient', async ({ page }) => {
    // Wait for cards to load and get the name of the first patient
    await expect(page.getByTestId('patient-card').first()).toBeVisible();
    const firstPatientName = await page.getByTestId('patient-card').first().locator('h3').innerText();

    // Search for an existing patient
    await page.getByPlaceholder('Filter patients by name...').fill(firstPatientName);
    
    // Check if the filtered patient is shown
    const filteredCard = page.getByTestId('patient-card').first();
    await expect(filteredCard).toBeVisible();
    await expect(filteredCard.locator('h3')).toContainText(firstPatientName);

    // Type a nonexistent name to see the empty state
    await page.getByPlaceholder('Filter patients by name...').fill('NoExisteEstePaciente');
    await expect(page.getByText('No hay resultados que coincidan con la búsqueda "NoExisteEstePaciente"')).toBeVisible();

    // Clear search
    await page.getByPlaceholder('Filter patients by name...').fill('');
  });

  test('should allow adding a new patient via the modal', async ({ page }) => {
    // Click Add Patient (navbar button)
    await page.getByRole('button', { name: '+ Add Patient' }).click();
    
    // Check if modal is visible using the dialog role
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2', { hasText: 'Add Patient' })).toBeVisible();

    // Fill form
    await page.getByPlaceholder('Patient name').fill('Automated Patient');
    await page.getByPlaceholder('Patient description').fill('This was added by Playwright!');
    
    // Submit form (button inside modal)
    await modal.getByRole('button', { name: 'Add patient', exact: true }).click();

    // Verify modal closes and success toast appears
    await expect(modal).not.toBeVisible();
    await expect(page.getByText('Patient added successfully')).toBeVisible();
  });
});
