import { request } from '@playwright/test';

export default async () => {
  const ctx = await request.newContext({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: { 'x-api-key': process.env.API_KEY || 'local-dev-key' }
  });
  const res = await ctx.post('/__admin/reset');
  if (res.status() !== 200) {
    throw new Error('Failed to reset API before tests');
  }
  await ctx.dispose();
};
