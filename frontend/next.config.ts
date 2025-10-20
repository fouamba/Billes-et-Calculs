import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Configuration Webpack (utilisée en production ou si Turbopack n'est pas activé)
  webpack: (config, { dev }) => {
    // Seulement appliquer en mode développement sans Turbopack
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/docs/**',
          '**/.git/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
