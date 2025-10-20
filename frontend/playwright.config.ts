import { PlaywrightTestConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
const config: PlaywrightTestConfig = {
  testDir: './src/tests/e2e',
  timeout: 60000,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        permissions: ['geolocation'],
        launchOptions: {
          args: ['--no-sandbox']
        }
      },
    },
  ],
  reporter: process.env.CI ? 'dot' : [
    ['html', { open: 'never' }],
    ['list']
  ],
  globalSetup: require.resolve('./src/tests/e2e/global-setup.ts'),
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
