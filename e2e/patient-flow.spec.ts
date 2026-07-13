import { test, expect } from '@playwright/test';

test.describe('Patient Lifecycle Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the locally running app
    await page.goto('http://localhost:5173');
  });

  test('should handle complete patient lifecycle: create, details, favorite, edit, archive, restore', async ({ page }) => {
    // 1. Create a new patient
    await page.getByRole('button', { name: '+ Add Patient' }).click();
    
    const addModal = page.getByRole('dialog');
    await expect(addModal).toBeVisible();

    await page.getByPlaceholder('Patient name').fill('Lifecycle Patient');
    await page.getByPlaceholder('Patient description').fill('E2E Description');
    await page.getByPlaceholder('https://example.com').first().fill('https://lifecycle.com');

    await addModal.getByRole('button', { name: 'Add patient', exact: true }).click();
    
    // Check that modal closes and success toast appears
    await expect(addModal).not.toBeVisible();
    await expect(page.getByText('Patient added successfully')).toBeVisible();

    // 2. Go to patient details page
    // Click on the newly created patient name link in the card
    await page.getByRole('link', { name: 'Lifecycle Patient' }).click();
    await expect(page).toHaveURL(/\/patient\/local-\d+/);
    await expect(page.getByRole('heading', { level: 1, name: 'Lifecycle Patient' })).toBeVisible();

    // 3. Mark as favorite and check in favorites sidebar
    await page.getByLabel('Toggle favorite').click();

    // Open favorites sidebar
    await page.getByLabel('Open favorites').click();

    // Check that patient is inside the sidebar list
    const sidebar = page.locator('div.w-80');
    await expect(sidebar.getByText('Lifecycle Patient')).toBeVisible();

    // Close sidebar
    await page.getByLabel('Close favorites').click();

    // 4. Edit patient from details page
    await page.getByLabel('Edit patient').click();

    const editModal = page.getByRole('dialog');
    await expect(editModal).toBeVisible();

    await page.getByPlaceholder('Patient name').fill('Lifecycle Patient Edited');
    await editModal.getByRole('button', { name: 'Save changes' }).click();

    await expect(editModal).not.toBeVisible();
    await expect(page.getByText('Patient updated successfully')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Lifecycle Patient', exact: true })).not.toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Lifecycle Patient Edited', exact: true })).toBeVisible();

    // 5. Archive patient from details page
    await page.getByLabel('Archive patient').click();

    const archiveModal = page.getByRole('dialog');
    await expect(archiveModal).toBeVisible();

    await archiveModal.getByRole('button', { name: 'Archive' }).click();

    await expect(archiveModal).not.toBeVisible();
    await expect(page.getByText('Patient archived successfully')).toBeVisible();

    // Verify redirection back to dashboard page
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'Lifecycle Patient Edited' })).not.toBeVisible();

    // 6. Navigate to Archived Patients page and restore
    await page.getByRole('link', { name: /Archived Patients/i }).click();
    await expect(page).toHaveURL('http://localhost:5173/archived');
    await expect(page.getByText('Lifecycle Patient Edited')).toBeVisible();

    // Click Restore button on the card (opens restore confirmation modal)
    await page.getByRole('button', { name: 'Restore' }).click();

    const restoreModal = page.getByRole('dialog');
    await expect(restoreModal).toBeVisible();

    await restoreModal.getByRole('button', { name: 'Restore' }).click();

    await expect(restoreModal).not.toBeVisible();
    await expect(page.getByText('Patient restored successfully')).toBeVisible();
    await expect(page.getByText('Lifecycle Patient Edited')).not.toBeVisible();

    // 7. Go back to Dashboard and verify patient is back on main grid
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByRole('link', { name: 'Lifecycle Patient Edited' })).toBeVisible();
  });
});
