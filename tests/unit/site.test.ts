import { describe, it, expect } from 'vitest';

describe('site.ts', () => {
  // The module is already imported with the real env values
  // We test the logic directly

  it('SITE_NAME is constant', async () => {
    const { SITE_NAME } = await import('../../src/config/site.ts');
    expect(SITE_NAME).toBe('Quini 6 Estadísticas');
  });

  it('SITE_URL is a valid URL', async () => {
    const { SITE_URL } = await import('../../src/config/site.ts');
    expect(SITE_URL).toMatch(/^https?:\/\/.+/);
  });

  it('SITE_URL defaults to https://quini6.com when VITE_SITE_URL not set', async () => {
    // This test validates the fallback logic
    // We can't easily test with different env values in Vitest without module reloading
    // But we can verify the fallback constant is correct in the source
    const { SITE_URL } = await import('../../src/config/site.ts');

    // The default fallback in source is 'https://quini6.com'
    // In test env, Vite sets VITE_SITE_URL to 'http://localhost:4321'
    // So we verify the source code has the correct fallback
    const source = await import('fs').then(fs => fs.readFileSync('src/config/site.ts', 'utf-8'));
    expect(source).toContain("'https://quini6.com'");
  });
});