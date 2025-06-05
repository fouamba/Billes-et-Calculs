import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';

test.describe('Pipeline d\'analyse d\'apprentissage', () => {
  let mongoClient: MongoClient;

  test.beforeAll(async () => {
    mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI as string);
    await mongoClient.connect();
  });

  test.afterAll(async () => {
    await mongoClient.close();
  });

  test('devrait enregistrer les déclarations xAPI correctement', async ({ page }) => {
    await page.goto('/activity/1');
    await page.click('.start-activity');
    
    // Attendre que l'activité soit terminée
    await page.waitForSelector('.activity-completed');
    
    // Vérifier les données dans Learning Locker
    const statements = await mongoClient
      .db('learninglocker')
      .collection('statements')
      .find({
        'actor.mbox': 'mailto:test@example.com',
        'verb.id': 'http://adlnet.gov/expapi/verbs/completed'
      })
      .toArray();
    
    expect(statements.length).toBeGreaterThan(0);
    expect(statements[0].result).toHaveProperty('completion', true);
  });

  test('devrait mettre à jour le tableau de bord étudiant', async ({ page }) => {
    await page.goto('/student-dashboard');
    
    // Vérifier que les graphiques sont chargés
    await page.waitForSelector('.cognitive-load-chart');
    const chartVisible = await page.isVisible('.cognitive-load-chart');
    expect(chartVisible).toBeTruthy();
    
    // Vérifier les données de progression
    const progressElement = await page.locator('.progress-tracker');
    const progressText = await progressElement.textContent();
    expect(progressText).toContain('Progression');
  });

  test('devrait adapter le contenu en fonction des analyses', async ({ page }) => {
    await page.goto('/adaptive-content');
    
    // Simuler une performance faible
    await page.evaluate(() => {
      localStorage.setItem('cognitiveLoad', JSON.stringify({ value: 0.8 }));
    });
    
    await page.reload();
    
    // Vérifier que le contenu a été adapté
    const contentDifficulty = await page.getAttribute('.content-section', 'data-difficulty');
    expect(contentDifficulty).toBe('easier');
  });
});
