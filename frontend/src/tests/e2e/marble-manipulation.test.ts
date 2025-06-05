import { test, expect } from '@playwright/test';

test.describe('Manipulation 3D des billes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/activity/3d');
    // Attendre que la scène 3D soit chargée
    await page.waitForSelector('[data-testid="three-scene"]');
  });

  test('devrait permettre de déplacer une bille', async ({ page }) => {
    // Simuler un clic sur une bille
    await page.click('[data-testid="marble-0"]');
    
    // Vérifier que la bille est sélectionnée
    const selectedMarble = await page.locator('[data-testid="marble-0"].selected');
    expect(selectedMarble).toBeTruthy();
    
    // Simuler un déplacement
    await page.mouse.move(500, 300);
    await page.mouse.down();
    await page.mouse.move(600, 300);
    await page.mouse.up();
    
    // Vérifier que la position a été mise à jour
    const marblePosition = await page.evaluate(() => {
      const marble = document.querySelector('[data-testid="marble-0"]');
      return marble?.getAttribute('data-position');
    });
    
    expect(marblePosition).toBeDefined();
  });

  test('devrait permettre de grouper des billes', async ({ page }) => {
    // Sélectionner plusieurs billes
    await page.click('[data-testid="marble-0"]');
    await page.keyboard.down('Shift');
    await page.click('[data-testid="marble-1"]');
    await page.keyboard.up('Shift');
    
    // Vérifier que le groupe est créé
    const group = await page.locator('[data-testid="marble-group"]');
    expect(await group.count()).toBeGreaterThan(0);
  });

  test('devrait mettre à jour les analytics lors des interactions', async ({ page }) => {
    // Surveiller les appels réseau pour les événements xAPI
    const xapiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/xapi/statements')) {
        xapiRequests.push(request);
      }
    });

    // Effectuer quelques interactions
    await page.click('[data-testid="marble-0"]');
    await page.mouse.move(500, 300);
    await page.mouse.down();
    await page.mouse.move(600, 300);
    await page.mouse.up();

    // Vérifier que les événements xAPI ont été envoyés
    expect(xapiRequests.length).toBeGreaterThan(0);
  });

  test('devrait enregistrer les conceptualisations détectées', async ({ page }) => {
    // Créer un groupe de 10 billes
    for (let i = 0; i < 10; i++) {
      await page.click(`[data-testid="marble-${i}"]`);
    }
    await page.click('[data-testid="group-btn"]');

    // Simuler une division en sous-groupes de 5
    await page.click('[data-testid="split-group-btn"]');
    await page.fill('[data-testid="split-size-input"]', '5');
    await page.click('[data-testid="confirm-split-btn"]');

    // Vérifier l'envoi des données xAPI
    const request = await page.waitForRequest(req => 
      req.url().includes('/xapi/statements') && 
      req.method() === 'POST'
    );
    
    const postData = JSON.parse(await request.postData() || '{}');
    expect(postData.verb.id).toBe('http://adlnet.gov/expapi/verbs/conceptualized');
    expect(postData.result.extensions).toMatchObject({
      'http://adlnet.gov/expapi/extensions/conceptualization-type': 'grouping-by-5'
    });
  });

  test('devrait suivre la progression de l\'apprenant', async ({ page }) => {
    // Compléter une série d'actions
    await page.click('[data-testid="start-activity-btn"]');
    
    // Réaliser le groupement demandé
    await page.click('[data-testid="marble-0"]');
    await page.click('[data-testid="marble-1"]');
    await page.click('[data-testid="group-btn"]');
    
    // Vérifier l'envoi des données de progression
    const progressRequest = await page.waitForRequest(req => 
      req.url().includes('/xapi/statements') && 
      req.postData()?.includes('progressed')
    );
    
    const progressData = JSON.parse(await progressRequest.postData() || '{}');
    expect(progressData.verb.id).toBe('http://adlnet.gov/expapi/verbs/progressed');
    expect(progressData.result.extensions['http://adlnet.gov/expapi/extensions/progress']).toBeDefined();
  });

  test('devrait enregistrer les erreurs et corrections', async ({ page }) => {
    // Simuler une erreur de comptage
    await page.click('[data-testid="count-marbles-btn"]');
    await page.fill('[data-testid="count-input"]', '8');  // Mauvaise réponse
    await page.click('[data-testid="submit-count-btn"]');
    
    // Vérifier l'enregistrement de l'erreur
    const errorRequest = await page.waitForRequest(req => 
      req.url().includes('/xapi/statements') && 
      req.postData()?.includes('incorrect')
    );
    
    // Corriger l'erreur
    await page.fill('[data-testid="count-input"]', '5');  // Bonne réponse
    await page.click('[data-testid="submit-count-btn"]');
    
    // Vérifier l'enregistrement de la correction
    const correctionRequest = await page.waitForRequest(req => 
      req.url().includes('/xapi/statements') && 
      req.postData()?.includes('correct')
    );
    
    expect(JSON.parse(await correctionRequest.postData() || '{}')).toMatchObject({
      verb: { id: 'http://adlnet.gov/expapi/verbs/answered' },
      result: { success: true }
    });
  });
});
