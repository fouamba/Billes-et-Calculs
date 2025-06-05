# Test info

- Name: Intégration Learning Analytics >> devrait adapter la difficulté en fonction des performances
- Location: C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\learning-analytics.test.ts:91:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
Call log:
  - navigating to "http://localhost:3000/auth/login", waiting until "load"

    at C:\Users\DELL\Billes-et-Calculs\frontend\src\tests\e2e\learning-analytics.test.ts:6:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Intégration Learning Analytics', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Se connecter avant les tests
>  6 |     await page.goto('/auth/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/auth/login
   7 |     await page.fill('[data-testid="email"]', 'test@example.com');
   8 |     await page.fill('[data-testid="password"]', 'password123');
   9 |     await page.click('[data-testid="login-button"]');
   10 |   });
   11 |
   12 |   test('devrait envoyer des événements xAPI lors des interactions', async ({ page }) => {
   13 |     // Intercepter les requêtes xAPI
   14 |     let xapiRequests = [];
   15 |     await page.route('**/xapi/statements', async (route) => {
   16 |       const request = route.request();
   17 |       xapiRequests.push(request);
   18 |       await route.continue();
   19 |     });
   20 |
   21 |     // Aller sur l'activité de manipulation
   22 |     await page.goto('/activity/manipulation');
   23 |     
   24 |     // Attendre le chargement de la scène
   25 |     await page.waitForSelector('[data-testid="three-scene"]', { state: 'visible' });
   26 |
   27 |     // Effectuer une manipulation de bille
   28 |     const marble = page.locator('[data-testid="marble-0"]');
   29 |     await marble.click();
   30 |     
   31 |     // Déplacer la bille
   32 |     await page.mouse.move(300, 300);
   33 |     await page.mouse.down();
   34 |     await page.mouse.move(400, 300);
   35 |     await page.mouse.up();
   36 |
   37 |     // Vérifier que des événements xAPI ont été envoyés
   38 |     await expect(xapiRequests.length).toBeGreaterThan(0);
   39 |     
   40 |     // Vérifier le contenu du dernier événement
   41 |     const lastRequest = xapiRequests[xapiRequests.length - 1];
   42 |     const body = JSON.parse(await lastRequest.postData());
   43 |     
   44 |     expect(body).toMatchObject({
   45 |       verb: {
   46 |         id: expect.stringContaining('manipulated')
   47 |       },
   48 |       object: {
   49 |         definition: {
   50 |           type: expect.stringContaining('marble')
   51 |         }
   52 |       }
   53 |     });
   54 |   });
   55 |
   56 |   test('devrait tracker les conceptualisations détectées', async ({ page }) => {
   57 |     let analyticsEvents = [];
   58 |     
   59 |     // Intercepter les événements d'analyse
   60 |     await page.route('**/analytics/events', async (route) => {
   61 |       const request = route.request();
   62 |       analyticsEvents.push(request);
   63 |       await route.continue();
   64 |     });
   65 |
   66 |     await page.goto('/activity/grouping');
   67 |     
   68 |     // Effectuer un regroupement de billes
   69 |     const firstMarble = page.locator('[data-testid="marble-0"]');
   70 |     const secondMarble = page.locator('[data-testid="marble-1"]');
   71 |     
   72 |     await page.keyboard.down('Shift');
   73 |     await firstMarble.click();
   74 |     await secondMarble.click();
   75 |     await page.keyboard.up('Shift');
   76 |     
   77 |     // Vérifier la détection de conceptualisation
   78 |     await expect(analyticsEvents.length).toBeGreaterThan(0);
   79 |     
   80 |     const lastEvent = analyticsEvents[analyticsEvents.length - 1];
   81 |     const body = JSON.parse(await lastEvent.postData());
   82 |     
   83 |     expect(body).toMatchObject({
   84 |       type: 'conceptualization',
   85 |       details: {
   86 |         pattern: expect.any(String)
   87 |       }
   88 |     });
   89 |   });
   90 |
   91 |   test('devrait adapter la difficulté en fonction des performances', async ({ page }) => {
   92 |     await page.goto('/activity/adaptive');
   93 |     
   94 |     // Effectuer plusieurs exercices avec succès
   95 |     for (let i = 0; i < 3; i++) {
   96 |       await page.click('[data-testid="correct-answer"]');
   97 |       await page.click('[data-testid="next-exercise"]');
   98 |     }
   99 |     
  100 |     // Vérifier l'adaptation du niveau
  101 |     const difficultyLevel = await page.getAttribute('[data-testid="difficulty-indicator"]', 'data-level');
  102 |     expect(Number(difficultyLevel)).toBeGreaterThan(1);
  103 |   });
  104 | });
  105 |
```