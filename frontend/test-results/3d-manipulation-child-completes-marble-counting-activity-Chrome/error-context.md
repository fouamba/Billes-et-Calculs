# Test info

- Name: child completes marble counting activity
- Location: C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\3d-manipulation.spec.ts:4:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/activity/3d
Call log:
  - navigating to "http://localhost:3000/activity/3d", waiting until "load"

    at C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\3d-manipulation.spec.ts:5:14
```

# Test source

```ts
   1 | // Test E2E Playwright pour la manipulation 3D des billes
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | test('child completes marble counting activity', async ({ page }) => {
>  5 |   await page.goto('/activity/3d');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/activity/3d
   6 |
   7 |   // Attendre le chargement de la scène 3D
   8 |   await expect(page.locator('canvas')).toBeVisible();
   9 |
  10 |   // Simuler comptage des billes rouges
  11 |   const redMarbles = page.locator('[data-testid="red-marble"]');
  12 |   const count = await redMarbles.count();
  13 |
  14 |   for (let i = 0; i < count; i++) {
  15 |     await redMarbles.nth(i).click();
  16 |   }
  17 |
  18 |   await page.fill('#count-input', count.toString());
  19 |   await page.click('#validate-count');
  20 |
  21 |   // Vérifier la rétroaction
  22 |   await expect(page.locator('.teacher-speech')).toContainText('Très bien');
  23 | });
  24 |
```