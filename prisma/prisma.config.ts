import { defineConfig } from '@prisma/config';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('Environment variable DATABASE_URL is required');

const cfg: any = {
  datasource: {
    provider: 'postgresql',
    url,
  },
};

export default defineConfig(cfg);
