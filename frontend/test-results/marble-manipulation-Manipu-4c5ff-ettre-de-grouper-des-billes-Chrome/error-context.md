# Test info

- Name: Manipulation 3D des billes >> devrait permettre de grouper des billes
- Location: C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\marble-manipulation.test.ts:33:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/activity/3d
Call log:
  - navigating to "http://localhost:3000/activity/3d", waiting until "load"

    at C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\marble-manipulation.test.ts:5:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Manipulation 3D des billes', () => {
   4 |   test.beforeEach(async ({ page }) => {
>  5 |     await page.goto('/activity/3d');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/activity/3d
   6 |     // Attendre que la scène 3D soit chargée
   7 |     await page.waitForSelector('[data-testid="three-scene"]');
   8 |   });
   9 |
  10 |   test('devrait permettre de déplacer une bille', async ({ page }) => {
  11 |     // Simuler un clic sur une bille
  12 |     await page.click('[data-testid="marble-0"]');
  13 |     
  14 |     // Vérifier que la bille est sélectionnée
  15 |     const selectedMarble = await page.locator('[data-testid="marble-0"].selected');
  16 |     expect(selectedMarble).toBeTruthy();
  17 |     
  18 |     // Simuler un déplacement
  19 |     await page.mouse.move(500, 300);
  20 |     await page.mouse.down();
  21 |     await page.mouse.move(600, 300);
  22 |     await page.mouse.up();
  23 |     
  24 |     // Vérifier que la position a été mise à jour
  25 |     const marblePosition = await page.evaluate(() => {
  26 |       const marble = document.querySelector('[data-testid="marble-0"]');
  27 |       return marble?.getAttribute('data-position');
  28 |     });
  29 |     
  30 |     expect(marblePosition).toBeDefined();
  31 |   });
  32 |
  33 |   test('devrait permettre de grouper des billes', async ({ page }) => {
  34 |     // Sélectionner plusieurs billes
  35 |     await page.click('[data-testid="marble-0"]');
  36 |     await page.keyboard.down('Shift');
  37 |     await page.click('[data-testid="marble-1"]');
  38 |     await page.keyboard.up('Shift');
  39 |     
  40 |     // Vérifier que le groupe est créé
  41 |     const group = await page.locator('[data-testid="marble-group"]');
  42 |     expect(await group.count()).toBeGreaterThan(0);
  43 |   });
  44 |
  45 |   test('devrait mettre à jour les analytics lors des interactions', async ({ page }) => {
  46 |     // Surveiller les appels réseau pour les événements xAPI
  47 |     const xapiRequests = [];
  48 |     page.on('request', request => {
  49 |       if (request.url().includes('/xapi/statements')) {
  50 |         xapiRequests.push(request);
  51 |       }
  52 |     });
  53 |
  54 |     // Effectuer quelques interactions
  55 |     await page.click('[data-testid="marble-0"]');
  56 |     await page.mouse.move(500, 300);
  57 |     await page.mouse.down();
  58 |     await page.mouse.move(600, 300);
  59 |     await page.mouse.up();
  60 |
  61 |     // Vérifier que les événements xAPI ont été envoyés
  62 |     expect(xapiRequests.length).toBeGreaterThan(0);
  63 |   });
  64 | });
  65 |
```