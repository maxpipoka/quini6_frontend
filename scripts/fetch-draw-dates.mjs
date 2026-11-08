/**
 * Build-time script to fetch draw dates from API
 * Generates a JSON file with draw dates for sitemap generation
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const OUTPUT_FILE = path.resolve(ROOT, 'src/lib/draw-dates.json');

// Mock API deterministic constants (must match tests/mock-api/server.mjs)
const MODALITIES = ['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE'];
const EXACT_MATCH = [5, 12, 23, 34, 41, 45];
const BASE_DATE = Date.UTC(2024, 5, 1, 20, 0, 0);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function buildNumbers(seed, modalityIndex) {
  return Array.from({ length: 6 }, (_, k) => ((seed * 3 + modalityIndex * 7 + k * 5) % 46));
}

function generateDraws(count = 30) {
  return Array.from({ length: count }, (_, index) => {
    const drawDate = new Date(BASE_DATE - index * WEEK_MS).toISOString();
    return {
      id: crypto.randomUUID(),
      officialNumber: 3245 - index,
      drawDate,
      createdAt: drawDate,
      updatedAt: drawDate,
      results: MODALITIES.map((modality, modalityIndex) => ({
        modality,
        numbers:
          index === 0 && modalityIndex === 0 ? [...EXACT_MATCH] : buildNumbers(index + 1, modalityIndex),
        createdAt: drawDate,
        updatedAt: drawDate,
      })),
    };
  });
}

async function fetchFromAPI() {
  try {
    console.log(`Fetching draws from ${API_BASE_URL}/draws...`);
    const response = await fetch(`${API_BASE_URL}/draws?limit=100`);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn(`Failed to fetch from API: ${error.message}`);
    console.log('Falling back to deterministic generation...');
    return null;
  }
}

function generateDrawDates(draws) {
  const drawDates = {};
  for (const draw of draws) {
    drawDates[draw.officialNumber] = draw.drawDate;
  }
  return drawDates;
}

async function main() {
  console.log('=== Fetching draw dates for sitemap generation ===');
  
  // Try to fetch from API first
  let draws = await fetchFromAPI();
  
  // Fallback to deterministic generation
  if (!draws) {
    console.log('Using deterministic draw generation (matching mock API)...');
    draws = generateDraws(50); // Generate more to be safe
  }
  
  const drawDates = generateDrawDates(draws);
  
  // Write output file
  const output = {
    generatedAt: new Date().toISOString(),
    source: draws.length > 30 ? 'api' : 'deterministic',
    drawCount: draws.length,
    dates: drawDates,
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`✓ Generated ${OUTPUT_FILE} with ${Object.keys(drawDates).length} draw dates`);
  console.log(`Source: ${output.source}`);
  
  // Also generate a TypeScript module for easy import
  const tsOutput = path.resolve(ROOT, 'src/lib/draw-dates.ts');
  const tsContent = `/**
 * Build-time generated draw dates for sitemap generation
 * Generated at: ${output.generatedAt}
 * Source: ${output.source}
 * Draw count: ${output.drawCount}
 * 
 * DO NOT EDIT MANUALLY - Run \`node scripts/fetch-draw-dates.mjs\` to regenerate
 */

export const drawDates: Record<number, string> = ${JSON.stringify(drawDates, null, 2)};

export function getDrawDate(officialNumber: number): string | undefined {
  return drawDates[officialNumber];
}

export function getAllDrawNumbers(): number[] {
  return Object.keys(drawDates).map(Number).sort((a, b) => b - a);
}
`;
  fs.writeFileSync(tsOutput, tsContent);
  console.log(`✓ Generated ${tsOutput}`);
}

main().catch((err) => {
  console.error('Failed to fetch draw dates:', err);
  process.exit(1);
});