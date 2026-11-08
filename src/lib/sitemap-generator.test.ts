import { describe, it, expect } from 'vitest';
import { EnumChangefreq } from 'sitemap';
import {
  drawLastmod,
  sitemapFilter,
  sitemapSerialize,
  generateSitemapUrls,
  generateSitemapXml,
  DEFAULT_SITE_URL,
} from './sitemap-generator';

describe('sitemapFilter', () => {
  it('excludes admin routes', () => {
    expect(sitemapFilter('/admin')).toBe(false);
    expect(sitemapFilter('/admin/import')).toBe(false);
  });

  it('excludes test-fixtures routes', () => {
    expect(sitemapFilter('/test-fixtures')).toBe(false);
    expect(sitemapFilter('/test-fixtures/header')).toBe(false);
  });

  it('keeps public routes', () => {
    expect(sitemapFilter('/')).toBe(true);
    expect(sitemapFilter('/sorteos')).toBe(true);
    expect(sitemapFilter('/sorteos/3245')).toBe(true);
    expect(sitemapFilter('/buscar')).toBe(true);
  });
});

describe('drawLastmod', () => {
  it('returns the latest draw date for draw 3245', () => {
    expect(drawLastmod(3245)).toBe('2024-06-01T20:00:00.000Z');
  });

  it('steps back one week per official number', () => {
    expect(drawLastmod(3244)).toBe('2024-05-25T20:00:00.000Z');
    expect(drawLastmod(3243)).toBe('2024-05-18T20:00:00.000Z');
  });

  it('handles the oldest known draw (3216, 29 weeks before latest)', () => {
    expect(drawLastmod(3216)).toBe('2023-11-11T20:00:00.000Z');
  });
});

describe('sitemapSerialize', () => {
  it('gives the home page weekly cadence and top priority', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/` });
    expect(result.changefreq).toBe(EnumChangefreq.WEEKLY);
    expect(result.priority).toBe(1.0);
    expect(result.lastmod).toBeTruthy();
  });

  it('normalizes a trailing slash on the home page', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/` });
    expect(result.priority).toBe(1.0);
  });

  it('serializes the search page with priority 0.8', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/buscar` });
    expect(result.changefreq).toBe(EnumChangefreq.WEEKLY);
    expect(result.priority).toBe(0.8);
  });

  it('serializes the draws listing with priority 0.9', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/sorteos` });
    expect(result.changefreq).toBe(EnumChangefreq.WEEKLY);
    expect(result.priority).toBe(0.9);
  });

  it('serializes draw detail pages with yearly cadence and draw-date lastmod', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/sorteos/3244` });
    expect(result.changefreq).toBe(EnumChangefreq.YEARLY);
    expect(result.priority).toBe(0.6);
    expect(result.lastmod).toBe('2024-05-25T20:00:00.000Z');
  });

  it('falls back to weekly cadence and priority 0.5 for other pages', () => {
    const result = sitemapSerialize({ url: `${DEFAULT_SITE_URL}/unknown` });
    expect(result.changefreq).toBe(EnumChangefreq.WEEKLY);
    expect(result.priority).toBe(0.5);
    expect(result.lastmod).toBeTruthy();
  });
});

describe('generateSitemapUrls', () => {
  it('emits the three public pages plus all draw detail pages', () => {
    const urls = generateSitemapUrls('https://example.com');
    // 3 public + 50 draws (from build-time generated data)
    expect(urls).toHaveLength(53);
    expect(urls.map((u) => u.url)).toContain('https://example.com/');
    expect(urls.map((u) => u.url)).toContain('https://example.com/sorteos/3245');
    expect(urls.map((u) => u.url)).toContain('https://example.com/sorteos/3196');
  });

  it('never includes admin or test-fixtures URLs', () => {
    const urls = generateSitemapUrls('https://example.com');
    const allUrls = urls.map((u) => u.url).join(' ');
    expect(allUrls).not.toContain('/admin');
    expect(allUrls).not.toContain('/test-fixtures');
  });

  it('uses the provided site URL as the base', () => {
    const urls = generateSitemapUrls('https://other.example');
    expect(urls.every((u) => u.url.startsWith('https://other.example'))).toBe(true);
  });

  it('defaults to the configured site URL', () => {
    const urls = generateSitemapUrls();
    expect(urls[0]?.url?.startsWith(DEFAULT_SITE_URL)).toBe(true);
  });
});

describe('generateSitemapXml', () => {
  it('produces a urlset with one <url> entry per generated URL', () => {
    const xml = generateSitemapXml('https://example.com');
    const urls = generateSitemapUrls('https://example.com');

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
    expect(xml.match(/<url>/g)).toHaveLength(urls.length);
    expect(xml).toContain('<loc>https://example.com/sorteos/3245</loc>');
  });

  it('closes all opened tags (well-formed skeleton)', () => {
    const xml = generateSitemapXml('https://example.com');
    expect(xml.match(/<url>/g)?.length).toBe(xml.match(/<\/url>/g)?.length);
    expect(xml).toContain('<urlset');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });
});
