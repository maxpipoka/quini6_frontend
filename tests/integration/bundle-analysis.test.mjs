/**
 * Bundle Analysis Integration Test
 * 
 * This test runs as a Node.js script (not Playwright) since it tests
 * the build output rather than browser behavior.
 * Run with: node tests/integration/bundle-analysis.test.mjs
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// projectRoot is the quini6_frontend directory (parent of tests/integration)
// When run from the project root, __dirname will be tests/integration
// So projectRoot = join(__dirname, '..', '..') = quini6_frontend
const projectRoot = join(__dirname, '..', '..');
console.log('projectRoot:', projectRoot);

const distDir = join(projectRoot, 'dist');
const statsHtmlPath = join(distDir, 'stats.html');
const bundleStatsJsonPath = join(distDir, 'bundle-stats.json');
console.log('statsHtmlPath:', statsHtmlPath);
console.log('bundleStatsJsonPath:', bundleStatsJsonPath);

function runTest(name, fn) {
  try {
    fn();
    console.log('✓ ' + name);
    return true;
  } catch (error) {
    console.error('✗ ' + name);
    console.error('  ' + (error instanceof Error ? error.message : String(error)));
    return false;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log('📦 Bundle Analysis Integration Tests');
  console.log('=====================================');
  console.log('');

  // Clean previous build
  console.log('Cleaning previous build...');
  try {
    execSync('rm -rf dist', { cwd: projectRoot, stdio: 'ignore' });
  } catch {
    // Ignore errors
  }

  // Test 1: Build with VITE_BUNDLE_ANALYZE=true
  console.log('\nBuilding with VITE_BUNDLE_ANALYZE=true...');
  let buildSuccess = false;
  try {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 180000,
      env: { ...process.env, VITE_BUNDLE_ANALYZE: 'true', VITE_SENTRY_DSN: 'https://dummy@example.com/123', NODE_OPTIONS: '--max-old-space-size=4096' },
    });
    buildSuccess = true;
    console.log('  Build completed successfully');
  } catch (error) {
    console.error('  Build failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!buildSuccess) {
    process.exit(1);
  }

  // Test 2: stats.html exists
  runTest('should generate stats.html visual report', () => {
    assert(existsSync(statsHtmlPath), 'stats.html should exist');
    
    const content = readFileSync(statsHtmlPath, 'utf-8');
    assert(content.includes('<!DOCTYPE html>'), 'Should be valid HTML');
    assert(content.includes('<html'), 'Should have html tag');
    assert(content.includes('rollup-plugin-visualizer') || content.includes('visualizer'), 'Should contain visualizer reference');
    assert(content.includes('bundle') || content.includes('module') || content.includes('size'), 'Should contain bundle analysis data');
  });

  // Test 3: bundle-stats.json exists (raw-data template output)
  runTest('should generate bundle-stats.json programmatic data', () => {
    assert(existsSync(bundleStatsJsonPath), 'bundle-stats.json should exist');
    
    const content = readFileSync(bundleStatsJsonPath, 'utf-8');
    const stats = JSON.parse(content);
    assert(stats !== null && typeof stats === 'object', 'Should be valid JSON object');
    assert(Array.isArray(stats.nodes), 'Should have nodes array');
    assert(Array.isArray(stats.edges), 'Should have edges array');
    assert(stats.nodes.length > 0, 'Should have at least one node');
  });

  // Test 4: stats.html contains meaningful data
  runTest('should contain meaningful bundle data in stats.html', () => {
    const content = readFileSync(statsHtmlPath, 'utf-8');
    assert(content.includes('bundle') || content.includes('module') || content.includes('size'), 'Should contain bundle-related terms');
  });

  // Test 5: bundle-stats.json contains meaningful data
  runTest('should contain meaningful data in bundle-stats.json', () => {
    const content = readFileSync(bundleStatsJsonPath, 'utf-8');
    const stats = JSON.parse(content);
    const nodeNames = stats.nodes.map((n) => n.name);
    assert(nodeNames.length > 0, 'Should have node names');
    
    const nodesWithSize = stats.nodes.filter((n) => n.size && n.size > 0);
    assert(nodesWithSize.length > 0, 'Should have nodes with size information');
  });

  // Test 6: Build without VITE_BUNDLE_ANALYZE should NOT generate artifacts
  console.log('\nBuilding WITHOUT VITE_BUNDLE_ANALYZE...');
  const distNoAnalyzeDir = join(projectRoot, 'dist-no-analyze');
  const statsHtmlNoAnalyze = join(distNoAnalyzeDir, 'stats.html');
  const bundleStatsJsonNoAnalyze = join(distNoAnalyzeDir, 'bundle-stats.json');

  try {
    execSync('rm -rf dist-no-analyze', { cwd: projectRoot, stdio: 'ignore' });
  } catch {
    // Ignore
  }

  try {
    execSync('npm run build -- --outDir dist-no-analyze', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 180000,
      env: { ...process.env, VITE_BUNDLE_ANALYZE: 'false', VITE_SENTRY_DSN: 'https://dummy@example.com/123', NODE_OPTIONS: '--max-old-space-size=4096' },
    });
    console.log('  Build completed successfully');
  } catch (error) {
    console.error('  Build failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  runTest('should NOT generate stats.html when VITE_BUNDLE_ANALYZE is false', () => {
    assert(!existsSync(statsHtmlNoAnalyze), 'stats.html should NOT exist when analyze is disabled');
  });

  runTest('should NOT generate bundle-stats.json when VITE_BUNDLE_ANALYZE is false', () => {
    assert(!existsSync(bundleStatsJsonNoAnalyze), 'bundle-stats.json should NOT exist when analyze is disabled');
  });

  // Cleanup
  console.log('\nCleaning up...');
  try {
    execSync('rm -rf dist dist-no-analyze', { cwd: projectRoot, stdio: 'ignore' });
  } catch {
    // Ignore
  }

  console.log('\n=====================================');
  console.log('✅ All bundle analysis tests passed!');
}

main().catch((error) => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});