// Test E2E Playwright pour la manipulation 3D des billes
import { test, expect } from '@playwright/test';

test('child completes marble counting activity', async ({ page }) => {
  await page.goto('/activity/3d');

  // Attendre le chargement de la scène 3D
  await expect(page.locator('canvas')).toBeVisible();

  // Simuler comptage des billes rouges
  const redMarbles = page.locator('[data-testid="red-marble"]');
  const count = await redMarbles.count();

  for (let i = 0; i < count; i++) {
    await redMarbles.nth(i).click();
  }

  await page.fill('#count-input', count.toString());
  await page.click('#validate-count');

  // Vérifier la rétroaction
  await expect(page.locator('.teacher-speech')).toContainText('Très bien');
});
