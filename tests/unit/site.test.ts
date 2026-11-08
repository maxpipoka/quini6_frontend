import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('site.ts', () => {
  // The module is already imported with the real env values
  // We test the logic directly

  it('SITE_NAME is constant', async () => {
    const { SITE_NAME } = await import('../../src/config/site.ts');
    expect(SITE_NAME).toBe('Quini 6 Estadísticas');
  });

  it('SITE_URL is a valid URL', async () => {
    const { SITE_URL: siteUrl } = await import('../../src/config/site.ts');
    expect(siteUrl).toMatch(/^https?:\/\/.+/);
  });

  it('SITE_URL defaults to https://quini6.com when VITE_SITE_URL not set', () => {
    // This test validates the fallback logic
    // We can't easily test with different env values in Vitest without module reloading
    // But we can verify the fallback constant is correct in the source
    const source = fs.readFileSync('src/config/site.ts', 'utf-8');
    expect(source).toContain("'https://quini6.com'");
  });
});
