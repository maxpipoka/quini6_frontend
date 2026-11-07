import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/sorteos', name: 'Draw History' },
  { path: '/buscar', name: 'Combination Search' },
  { path: '/sorteos/3245', name: 'Draw Detail' },
  { path: '/sorteos/3244', name: 'Draw Detail (prev)' },
];

test.describe('SEO Meta Tags', () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) has proper SEO meta tags`, async ({ page: pageObj }) => {
      await pageObj.goto(page.path);
      await pageObj.waitForLoadState('networkidle');

      // Check title
      const title = await pageObj.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // Check meta description
      const metaDescription = pageObj.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /.+/);

      // Check canonical URL
      const canonical = pageObj.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', /^https?:\/\/.+/);

      // Check Open Graph tags
      await expect(pageObj.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        /website|article/
      );
      await expect(pageObj.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        /^https?:\/\/.+/
      );
      await expect(pageObj.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
      await expect(pageObj.locator('meta[property="og:description"]')).toHaveAttribute(
        'content',
        /.+/
      );
      await expect(pageObj.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\/.+/
      );
      await expect(pageObj.locator('meta[property="og:image:width"]')).toHaveAttribute(
        'content',
        '1200'
      );
      await expect(pageObj.locator('meta[property="og:image:height"]')).toHaveAttribute(
        'content',
        '630'
      );
      await expect(pageObj.locator('meta[property="og:site_name"]')).toHaveAttribute(
        'content',
        'Quini 6 Estadísticas'
      );
      await expect(pageObj.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        'es_AR'
      );

      // Check Twitter Card tags
      await expect(pageObj.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      );
      await expect(pageObj.locator('meta[name="twitter:url"]')).toHaveAttribute(
        'content',
        /^https?:\/\/.+/
      );
      await expect(pageObj.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /.+/);
      await expect(pageObj.locator('meta[name="twitter:description"]')).toHaveAttribute(
        'content',
        /.+/
      );
      await expect(pageObj.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /^https?:\/\/.+/
      );
    });
  }

  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) og:image resolves with declared dimensions`, async ({
      page: pageObj,
      request,
    }) => {
      await pageObj.goto(page.path);
      await pageObj.waitForLoadState('networkidle');

      const ogImage = pageObj.locator('meta[property="og:image"]');
      const imageUrl = await ogImage.getAttribute('content');
      expect(imageUrl).toMatch(/^https?:\/\/.+/);

      // The single default asset must resolve for every page (no 404s)
      const parsedImageUrl = new URL(imageUrl!);
      expect(parsedImageUrl.pathname).toMatch(/\.(?:jpg|jpeg|png|webp|svg)$/);
      const response = await request.get(parsedImageUrl.pathname);
      expect(response.status()).toBe(200);

      await expect(pageObj.locator('meta[property="og:image:width"]')).toHaveAttribute(
        'content',
        '1200'
      );
      await expect(pageObj.locator('meta[property="og:image:height"]')).toHaveAttribute(
        'content',
        '630'
      );
    });
  }
});

interface SearchActionJsonLd {
  '@type'?: string;
  target?: { urlTemplate?: string };
  'query-input'?: string;
}

interface JsonLd {
  '@context'?: string;
  '@type'?: string;
  name?: string;
  url?: string;
  potentialAction?: SearchActionJsonLd;
}

function parseJsonLd(raw: string | null): JsonLd {
  expect(raw).toBeTruthy();
  return JSON.parse(raw ?? '{}') as JsonLd;
}

test.describe('JSON-LD Structured Data', () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) has Organization JSON-LD`, async ({ page: pageObj }) => {
      await pageObj.goto(page.path);
      await pageObj.waitForLoadState('networkidle');

      const jsonLdScripts = pageObj.locator('script[type="application/ld+json"]');
      expect(await jsonLdScripts.count()).toBeGreaterThanOrEqual(1);

      const parsed = parseJsonLd(await jsonLdScripts.first().textContent());
      expect(parsed['@context']).toBe('https://schema.org');
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.name).toBe('Quini 6 Estadísticas');
      expect(parsed.url).toMatch(/^https?:\/\/.+/);
    });
  }

  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) has WebSite JSON-LD`, async ({ page: pageObj }) => {
      await pageObj.goto(page.path);
      await pageObj.waitForLoadState('networkidle');

      const jsonLdScripts = pageObj.locator('script[type="application/ld+json"]');
      const count = await jsonLdScripts.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Find WebSite JSON-LD
      let websiteFound = false;
      for (let i = 0; i < count; i++) {
        const parsed = parseJsonLd(await jsonLdScripts.nth(i).textContent());
        if (parsed['@type'] === 'WebSite') {
          websiteFound = true;
          expect(parsed['@context']).toBe('https://schema.org');
          expect(parsed.name).toBe('Quini 6 Estadísticas');
          expect(parsed.url).toMatch(/^https?:\/\/.+/);

          const searchAction = parsed.potentialAction;
          expect(searchAction).toBeTruthy();
          expect(searchAction?.['@type']).toBe('SearchAction');
          expect(searchAction?.target?.urlTemplate).toMatch(/\/buscar\?q=\{search_term_string\}/);
          expect(searchAction?.['query-input']).toBe('required name=search_term_string');
          break;
        }
      }
      expect(websiteFound).toBe(true);
    });
  }
});

test.describe('Sitemap', () => {
  test('sitemap.xml is generated and accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('xml');
  });

  test('sitemap.xml includes all public pages', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    expect(xml).toContain('<url>');
    // Accept both production URL and dev server URL
    expect(xml).toMatch(/<loc>https?:\/\/[^<]*\//);
    // Check for main public pages that actually exist
    expect(xml).toContain('/buscar');
    expect(xml).toContain('/sorteos');
    // Home page is included
    expect(xml).toMatch(/<loc>https?:\/\/[^<]*\/<\/loc>/);
  });

  test('sitemap.xml includes draw detail pages', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    // Should include at least some draw detail pages (accept both dev and prod URLs)
    expect(xml).toMatch(/<loc>https?:\/\/[^<]*\/sorteos\/\d+<\/loc>/);
  });

  test('sitemap.xml excludes /admin routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    expect(xml).not.toContain('/admin');
  });

  test('sitemap.xml excludes /test-fixtures routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    expect(xml).not.toContain('/test-fixtures');
  });

  test('sitemap.xml has proper changefreq for listing pages (weekly)', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    // Check that listing pages have weekly changefreq
    expect(xml).toMatch(/<changefreq>weekly<\/changefreq>/);
  });

  test('sitemap.xml has proper changefreq for detail pages (yearly)', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    // Check that detail pages have yearly changefreq
    expect(xml).toMatch(/<changefreq>yearly<\/changefreq>/);
  });

  test('sitemap.xml detail lastmod reflects the draw date', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    const xml = await response?.text();
    // Draw 3245 is dated 2024-06-01 in the build-time schedule;
    // a build-time lastmod would be today's date instead.
    expect(xml).toMatch(
      /<loc>[^<]*\/sorteos\/3245<\/loc>[\s\S]*?<lastmod>2024-06-01T20:00:00\.000Z<\/lastmod>/
    );
  });
});

test.describe('Robots.txt', () => {
  test('robots.txt is accessible at /robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('text/plain');
  });

  test('robots.txt references sitemap with correct SITE_URL', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const text = await response?.text();
    expect(text).toContain('Sitemap:');
    expect(text).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  });

  test('robots.txt disallows /admin/', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const text = await response?.text();
    expect(text).toContain('Disallow: /admin/');
  });

  test('robots.txt disallows /api/', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const text = await response?.text();
    expect(text).toContain('Disallow: /api/');
  });

  test('robots.txt disallows /_astro/ and /_image/', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const text = await response?.text();
    expect(text).toContain('Disallow: /_astro/');
    expect(text).toContain('Disallow: /_image/');
  });

  test('robots.txt does not disallow public pages', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const text = await response?.text();
    // Should not have Disallow for root or public paths
    expect(text).not.toMatch(/Disallow: \/$/);
  });
});
