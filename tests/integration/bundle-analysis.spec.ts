import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

test.describe('Bundle Analysis', () => {
  const distDir = join(projectRoot, 'dist');
  const statsHtmlPath = join(distDir, 'stats.html');
  const bundleStatsJsonPath = join(distDir, 'bundle-stats.json');

  test.beforeAll(async () => {
    // Clean previous build
    try {
      execSync('rm -rf dist', { cwd: projectRoot, stdio: 'ignore' });
    } catch {
      // Ignore errors
    }

    // Run build with bundle analysis enabled
    try {
      const isWindows = process.platform === 'win32';
      const buildCmd = isWindows
        ? '$env:VITE_BUNDLE_ANALYZE="true"; npm run build'
        : 'VITE_BUNDLE_ANALYZE=true npm run build';
      execSync(buildCmd, {
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 180000, // 3 minutes timeout
        shell: isWindows ? 'powershell.exe' : undefined,
      });
    } catch (error) {
      console.error('Build failed:', error);
      throw error;
    }
  });

  test.afterAll(async () => {
    // Clean up after tests
    try {
      execSync('rm -rf dist', { cwd: projectRoot, stdio: 'ignore' });
    } catch {
      // Ignore errors
    }
  });

  test('should generate stats.html visual report', () => {
    expect(existsSync(statsHtmlPath)).toBe(true);

    const content = readFileSync(statsHtmlPath, 'utf-8');

    // Verify it's a valid HTML file with expected content
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    expect(content).toContain('Rollup Visualizer');
    expect(content).toContain('stats');
  });

  test('should generate bundle-stats.json programmatic data', () => {
    expect(existsSync(bundleStatsJsonPath)).toBe(true);

    const content = readFileSync(bundleStatsJsonPath, 'utf-8');
    const stats = JSON.parse(content);

    // Verify it's valid JSON with expected structure
    expect(stats).toBeDefined();
    expect(typeof stats).toBe('object');
    // rollup-plugin-visualizer JSON output (raw-data template) uses tree structure
    expect(stats).toHaveProperty('tree');
    expect(stats.tree).toHaveProperty('children');
    expect(Array.isArray(stats.tree.children)).toBe(true);

    // Should have at least some nodes (entry points, chunks, etc.)
    expect(stats.tree.children.length).toBeGreaterThan(0);
  });

  test('should contain meaningful bundle data in stats.html', () => {
    const content = readFileSync(statsHtmlPath, 'utf-8');

    // Check for key visualizer elements
    expect(content).toContain('bundle');
    expect(content).toContain('module');
    expect(content).toContain('size');
  });

  test('should contain meaningful data in bundle-stats.json', () => {
    const content = readFileSync(bundleStatsJsonPath, 'utf-8');
    const stats = JSON.parse(content);

    // Check for entry points or chunks in tree structure
    const collectNodeNames = (tree: { name: string; children?: any[] }): string[] => {
      const names = [tree.name];
      if (tree.children) {
        tree.children.forEach((child) => names.push(...collectNodeNames(child)));
      }
      return names;
    };

    const nodeNames = collectNodeNames(stats.tree);

    // Should contain some entry points or significant chunks
    expect(nodeNames.length).toBeGreaterThan(0);

    // Check that we have meaningful chunk names (not just 'root')
    const meaningfulNames = nodeNames.filter((name) => name !== 'root');
    expect(meaningfulNames.length).toBeGreaterThan(0);
  });
});

// Separate test to verify the build command works without VITE_BUNDLE_ANALYZE
test.describe('Bundle Analysis - Build without analyze flag', () => {
  const distDir = join(projectRoot, 'dist-no-analyze');
  const statsHtmlPath = join(distDir, 'stats.html');
  const bundleStatsJsonPath = join(distDir, 'bundle-stats.json');

  test.beforeAll(async () => {
    // Clean previous build
    try {
      execSync('rm -rf dist-no-analyze', { cwd: projectRoot, stdio: 'ignore' });
    } catch {
      // Ignore errors
    }

    // Run build WITHOUT bundle analysis
    try {
      const isWindows = process.platform === 'win32';
      const buildCmd = isWindows
        ? '$env:VITE_BUNDLE_ANALYZE="false"; npm run build -- --outDir dist-no-analyze'
        : 'VITE_BUNDLE_ANALYZE=false npm run build -- --outDir dist-no-analyze';
      execSync(buildCmd, {
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 180000,
        shell: isWindows ? 'powershell.exe' : undefined,
      });
    } catch (error) {
      console.error('Build failed:', error);
      throw error;
    }
  });

  test.afterAll(async () => {
    try {
      execSync('rm -rf dist-no-analyze', { cwd: projectRoot, stdio: 'ignore' });
    } catch {
      // Ignore errors
    }
  });

  test('should NOT generate stats.html when VITE_BUNDLE_ANALYZE is false', () => {
    expect(existsSync(statsHtmlPath)).toBe(false);
  });

  test('should NOT generate bundle-stats.json when VITE_BUNDLE_ANALYZE is false', () => {
    expect(existsSync(bundleStatsJsonPath)).toBe(false);
  });
});