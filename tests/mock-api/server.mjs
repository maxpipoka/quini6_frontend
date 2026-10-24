/**
 * Minimal mock API for Playwright E2E runs.
 * Mirrors the backend contract consumed by src/lib/api/client.ts.
 * Usage: node tests/mock-api/server.mjs (listens on PORT, default 3001)
 */
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 3001);
const MODALITIES = ['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE'];
const EXACT_MATCH = [5, 12, 23, 34, 41, 45];

const BASE_DATE = Date.UTC(2024, 5, 1, 20, 0, 0);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function buildNumbers(seed, modalityIndex) {
  return Array.from({ length: 6 }, (_, k) => ((seed * 3 + modalityIndex * 7 + k * 5) % 46));
}

const draws = Array.from({ length: 30 }, (_, index) => {
  const drawDate = new Date(BASE_DATE - index * WEEK_MS).toISOString();
  return {
    id: randomUUID(),
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

function toSummary(draw) {
  return {
    id: draw.id,
    officialNumber: draw.officialNumber,
    drawDate: draw.drawDate,
    results: draw.results.map(({ modality, numbers }) => ({ modality, numbers })),
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(JSON.stringify(payload));
}

function notFound(res, path, message) {
  sendJson(res, 404, {
    statusCode: 404,
    message,
    error: 'Not Found',
    timestamp: new Date().toISOString(),
    path,
    requestId: randomUUID(),
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (path === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (path === '/api/draws/latest' && req.method === 'GET') {
    sendJson(res, 200, draws[0]);
    return;
  }

  if (path === '/api/draws' && req.method === 'GET') {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const year = url.searchParams.get('year');
    const filtered = year ? draws.filter((draw) => draw.drawDate.startsWith(year)) : draws;
    const start = (page - 1) * limit;
    sendJson(res, 200, {
      data: filtered.slice(start, start + limit).map(toSummary),
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    });
    return;
  }

  const drawMatch = path.match(/^\/api\/draws\/(\d+)$/);
  if (drawMatch && req.method === 'GET') {
    const officialNumber = Number(drawMatch[1]);
    const draw = draws.find((item) => item.officialNumber === officialNumber);
    if (!draw) {
      notFound(res, path, 'Sorteo no encontrado');
      return;
    }
    sendJson(res, 200, draw);
    return;
  }

  if (path === '/api/search/exact' && req.method === 'POST') {
    const body = await readBody(req);
    const numbers = Array.isArray(body?.numbers) ? body.numbers : [];
    const isExactMatch = numbers.length === 6 && numbers.join(',') === EXACT_MATCH.join(',');

    sendJson(res, 200, {
      found: isExactMatch,
      totalMatches: isExactMatch ? 1 : 0,
      matches: isExactMatch
        ? [
            {
              drawDate: draws[0].drawDate,
              officialNumber: draws[0].officialNumber,
              modality: 'TRADICIONAL',
              numbers: numbers,
            },
          ]
        : [],
    });
    return;
  }

  notFound(res, path, 'Recurso no encontrado');
});

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}/api`);
});
