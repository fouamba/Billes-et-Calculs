import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  if (process.env.CI !== 'true') {
    const { spawn } = require('child_process');
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });

    // Afficher les logs du serveur
    server.stdout.on('data', (data: Buffer) => {
      console.log(`Server stdout: ${data}`);
    });

    server.stderr.on('data', (data: Buffer) => {
      console.error(`Server stderr: ${data}`);
    });

    // Attendre que le serveur soit prêt en vérifiant son état
    let isServerReady = false;
    let retries = 0;
    const maxRetries = 30;

    while (!isServerReady && retries < maxRetries) {
      try {
        const response = await fetch(baseURL as string);
        if (response.ok) {
          isServerReady = true;
          console.log('Server is ready!');
        }
      } catch (error) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!isServerReady) {
      throw new Error('Server failed to start');
    }

    // Vérifie la connexion MongoDB
    try {
      const { MongoClient } = require('mongodb');
      const client = await MongoClient.connect(process.env.MONGODB_ATLAS_URI as string);
      await client.close();
      console.log('MongoDB connection successful!');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      throw new Error('MongoDB connection failed');
    }
  }

  await browser.close();
}

export default globalSetup;
