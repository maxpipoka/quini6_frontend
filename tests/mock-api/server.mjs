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

function sendJson(res, status, payload, req, extraHeaders = {}) {
  const origin = req.headers.origin || '*';
  const credentials = origin !== '*';
  
  // Build headers object
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': credentials ? 'true' : 'false',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-CSRF-Token,X-Request-ID',
  };
  
  // Handle extraHeaders - Set-Cookie can be string or array
  for (const [key, value] of Object.entries(extraHeaders)) {
    if (key.toLowerCase() === 'set-cookie') {
      headers[key] = value; // Node.js accepts array for Set-Cookie
    } else {
      headers[key] = value;
    }
  }
  
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
}

function notFound(res, path, message, req) {
  sendJson(res, 404, {
    statusCode: 404,
    message,
    error: 'Not Found',
    timestamp: new Date().toISOString(),
    path,
    requestId: randomUUID(),
  }, req);
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

  // DEBUG: log all POST requests
  if (req.method === 'POST') {
    console.log('[Mock API] POST request:', { path, url: req.url });
  }
  
  // Add error handler to prevent crash
  req.on('error', (err) => {
    console.error('Request error:', err);
  });
  res.on('error', (err) => {
    console.error('Response error:', err);
  });

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {}, req);
    return;
  }

  if (path === '/api/health') {
    sendJson(res, 200, { status: 'ok' }, req, {
      'Set-Cookie': 'csrf_token=test-csrf-token; Path=/; SameSite=Lax',
    });
    return;
  }

  // CSRF token endpoint for login page
  if (path === '/api/admin/auth/csrf' && req.method === 'GET') {
    sendJson(res, 200, { csrfToken: 'test-csrf-token' }, req, {
      'Set-Cookie': 'csrf_token=test-csrf-token; Path=/; SameSite=Lax',
    });
    return;
  }

  // Admin auth login endpoint
  if (path === '/api/admin/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        const email = parsed.email ?? '';
        const password = parsed.password ?? '';
        
        if (email === 'admin@quini6.com' && password === 'password123') {
          // Set session cookie
          console.log('[Mock API] Setting session cookie');
          sendJson(res, 200, { user: { email, role: 'admin' } }, req, {
            'Set-Cookie': [
              'session=e2e; Path=/; HttpOnly; SameSite=Lax',
              'csrf_token=test-csrf-token; Path=/; SameSite=Lax'
            ],
          });
        } else {
          sendJson(res, 401, { message: 'Credenciales inválidas' }, req);
        }
      } catch (e) {
        console.error('Login parse error:', e);
        sendJson(res, 400, { message: 'Bad request' }, req);
      }
    });
    return;
  }

  if (path === '/api/admin/auth/me' && req.method === 'GET') {
    const cookie = req.headers.cookie || '';
    if (cookie.includes('session=e2e')) {
      sendJson(res, 200, { user: { email: 'admin@quini6.com', role: 'admin' } }, req);
    } else {
      sendJson(res, 401, { message: 'No autorizado' }, req);
    }
    return;
  }

  if (path === '/api/admin/auth/logout' && req.method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (path === '/api/admin/auth/change-password' && req.method === 'POST') {
    sendJson(res, 200, { success: true }, req);
    return;
  }

  // Debug endpoint to check cookies
  if (path === '/api/admin/auth/debug-cookies' && req.method === 'GET') {
    sendJson(res, 200, { 
      cookies: req.headers.cookie || 'none',
      origin: req.headers.origin || 'none'
    }, req);
    return;
  }

  // Admin draws endpoint (for admin dashboard redirect after login)
  if (path === '/api/admin/draws' && req.method === 'GET') {
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
    }, req);
    return;
  }

  if (path === '/api/draws/latest' && req.method === 'GET') {
    sendJson(res, 200, draws[0], req);
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
    }, req);
    return;
  }

  const drawMatch = path.match(/^\/api\/draws\/(\d+)$/);
  if (drawMatch && req.method === 'GET') {
    const officialNumber = Number(drawMatch[1]);
    const draw = draws.find((item) => item.officialNumber === officialNumber);
    if (!draw) {
      notFound(res, path, 'Sorteo no encontrado', req);
      return;
    }
    sendJson(res, 200, draw, req);
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
    }, req);
    return;
  }

  // Import preview endpoint
  if (path === '/api/admin/imports/preview' && req.method === 'POST') {
    const body = await readBody(req);
    console.log('[Mock API] Import preview request body:', JSON.stringify(body, null, 2));
    const rows = Array.isArray(body?.rows) ? body.rows : [];
    console.log('[Mock API] Rows received:', rows.length);
    let validCount = 0;
    let invalidCount = 0;
    for (const row of rows) {
      if (row && typeof row === 'object' && 'officialNumber' in row && 'drawDate' in row && 'results' in row) {
        validCount++;
      } else {
        invalidCount++;
      }
    }
    console.log('[Mock API] validCount:', validCount, 'invalidCount:', invalidCount);
    sendJson(res, 200, {
      importId: randomUUID(),
      validCount,
      invalidCount,
    }, req);
    return;
  }

  // Import commit endpoint
  const commitMatch = path.match(/^\/api\/admin\/imports\/([^/]+)\/commit$/);
  if (commitMatch && req.method === 'POST') {
    const importId = commitMatch[1];
    const policy = url.searchParams.get('policy') ?? 'skip';
    console.log('[Mock API] Import commit request:', { importId, policy, path });
    // Add delay to simulate real import processing time
    // This gives the ImportProgress component time to render in the 'progress' step
    await new Promise(resolve => setTimeout(resolve, 1500));
    const response = {
      created: 2,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };
    console.log('[Mock API] Import commit response (full):', JSON.stringify(response, null, 2));
    console.log('[Mock API] Import commit response:', JSON.stringify(response));
    sendJson(res, 200, response, req);
    return;
  }
  
  // Also catch any path that contains commit for debugging
  if (path.includes('/commit') && req.method === 'POST') {
    console.log('[Mock API] Matched commit path:', { path, method: req.method });
  }

  // Import history endpoint
  if (path === '/api/admin/imports' && req.method === 'GET') {
    sendJson(res, 200, {
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }, req);
    return;
  }

  // Import errors endpoint
  const errorsMatch = path.match(/^\/api\/admin\/imports\/([^/]+)\/errors$/);
  if (errorsMatch && req.method === 'GET') {
    sendJson(res, 200, {
      data: [],
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
    }, req);
    return;
  }

  notFound(res, path, 'Recurso no encontrado', req);
});

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}/api`);
});
