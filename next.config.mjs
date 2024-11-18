/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Define __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        port: '',
      },
    ],
  },
  transpilePackages: ['geist'],
  env: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    REPO_PATH: process.env.REPO_PATH,
    WEBHOOKS_SECRET: process.env.WEBHOOKS_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
