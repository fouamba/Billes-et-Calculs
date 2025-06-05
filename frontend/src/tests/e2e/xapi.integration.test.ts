import { test, expect } from '@playwright/test';
import { XAPIService } from '@/services/xapi.service';

test.describe('Intégration des Learning Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Mock des endpoints xAPI pour les tests
    await page.route('**/xapi/statements', async (route) => {
      const request = route.request();
      const postData = JSON.parse(await request.postData() || '{}');
      
      // Valider la structure des données xAPI
      if (
        !postData.actor ||
        !postData.verb ||
        !postData.object ||
        !postData.context
      ) {
        await route.fulfill({ status: 400 });
        return;
      }
      
      await route.fulfill({ 
        status: 200,
        body: JSON.stringify({ id: 'test-statement-id' })
      });
    });

    await page.goto('/activites/manipulation-billes');
  });

  test('devrait suivre le parcours complet d\'un élève', async ({ page }) => {
    // 1. Démarrage de l'activité
    await page.click('[data-testid="start-activity"]');
    await expect(page.locator('[data-testid="activity-status"]')).toContainText('En cours');

    // 2. Manipulation des billes
    await page.click('[data-testid="marble-1"]');
    await page.click('[data-testid="marble-2"]');
    await page.click('[data-testid="group-btn"]');

    // 3. Réponse à une question
    await page.click('[data-testid="question-1"]');
    await page.fill('[data-testid="answer-input"]', '5');
    await page.click('[data-testid="submit-answer"]');

    // 4. Vérification des données envoyées
    const requests = await page.evaluate(() => {
      // @ts-ignore
      return window.__xapi_requests__ || [];
    });

    expect(requests).toContainEqual(expect.objectContaining({
      verb: { id: 'http://adlnet.gov/expapi/verbs/initialized' }
    }));

    expect(requests).toContainEqual(expect.objectContaining({
      verb: { id: 'http://adlnet.gov/expapi/verbs/grouped' }
    }));

    expect(requests).toContainEqual(expect.objectContaining({
      verb: { id: 'http://adlnet.gov/expapi/verbs/answered' }
    }));
  });

  test('devrait détecter et suivre les stratégies d\'apprentissage', async ({ page }) => {
    // 1. Observer une séquence de manipulations
    for (let i = 1; i <= 10; i++) {
      await page.click(`[data-testid="marble-${i}"]`);
      if (i % 2 === 0) {
        await page.click('[data-testid="group-btn"]');
      }
    }

    // 2. Vérifier la détection de patterns
    const strategies = await page.evaluate(() => {
      // @ts-ignore
      return window.__learning_strategies__ || [];
    });

    expect(strategies).toContainEqual(expect.objectContaining({
      type: 'grouping-pattern',
      pattern: 'by-pairs'
    }));
  });

  test('devrait enregistrer les temps de réflexion et d\'action', async ({ page }) => {
    // 1. Démarrer le tracking temporel
    await page.click('[data-testid="start-activity"]');
    
    // 2. Attendre une période de réflexion
    await page.waitForTimeout(2000);
    
    // 3. Effectuer une action
    await page.click('[data-testid="marble-1"]');
    
    // 4. Vérifier les données temporelles
    const timeData = await page.evaluate(() => {
      // @ts-ignore
      return window.__time_tracking_data__;
    });

    expect(timeData).toMatchObject({
      reflectionTime: expect.any(Number),
      actionTime: expect.any(Number),
      totalTime: expect.any(Number)
    });

    expect(timeData.reflectionTime).toBeGreaterThanOrEqual(2000);
  });
});
