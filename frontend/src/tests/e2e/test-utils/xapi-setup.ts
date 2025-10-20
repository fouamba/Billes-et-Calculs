import { test as base } from '@playwright/test';
import { XAPIProvider } from '../../services/xapi';

// Étendre le type de test pour inclure le provider xAPI
export const test = base.extend<{ xapi: XAPIProvider }>({
  xapi: async ({ page }, useXapi) => {
    // Créer une instance du provider xAPI pour les tests
    const xapi = new XAPIProvider({
      endpoint: process.env.LEARNING_LOCKER_ENDPOINT || 'http://localhost:8080/data/xAPI',
      auth: {
        key: process.env.LL_KEY || 'testkey',
        secret: process.env.LL_SECRET || 'testsecret'
      }
    });

    // Injecter le provider dans la page
    await page.evaluate((config) => {
      window.__XAPI_CONFIG__ = config;
    }, {
      endpoint: xapi.endpoint,
      auth: xapi.auth
    });

    // Rendre le provider disponible pour les tests
    await useXapi(xapi);
  }
});
