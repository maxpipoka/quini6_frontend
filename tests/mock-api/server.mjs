/**
 * Stateless mock API for Playwright E2E runs.
 * Each request is handled independently - no global state.
 * Supports worker isolation via PORT env var.
 */
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 3001);
const WORKER_ID = process.env.PLAYWRIGHT_WORKER_INDEX ?? '0';
const MODALITIES = ['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE'];
const EXACT_MATCH = [5, 12, 23, 34, 41, 45];
const BASE_DATE = Date.UTC(2024, 5, 1, 20, 0, 0);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Deterministic draw generation - same input always produces same output
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

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': credentials ? 'true' : 'false',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-CSRF-Token,X-Request-ID',
  };

  for (const [key, value] of Object.entries(extraHeaders)) {
    if (key.toLowerCase() === 'set-cookie') {
      headers[key] = value;
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
    req.on('data', (chunk) => { raw += chunk; });
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

// In-memory session store (per worker, cleared on restart)
const sessions = new Map();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method === 'POST') {
    console.log(`[Mock API W${WORKER_ID}] POST:`, path);
  }

  req.on('error', (err) => console.error('Request error:', err));
  res.on('error', (err) => console.error('Response error:', err));

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {}, req);
    return;
  }

  // Health check
  if (path === '/api/health') {
    sendJson(res, 200, { status: 'ok', worker: WORKER_ID }, req, {
      'Set-Cookie': 'csrf_token=test-csrf-token; Path=/; SameSite=Lax',
    });
    return;
  }

  // CSRF token
  if (path === '/api/admin/auth/csrf' && req.method === 'GET') {
    sendJson(res, 200, { csrfToken: 'test-csrf-token' }, req, {
      'Set-Cookie': 'csrf_token=test-csrf-token; Path=/; SameSite=Lax',
    });
    return;
  }

  // Admin login
  if (path === '/api/admin/auth/login' && req.method === 'POST') {
    const body = await readBody(req);
    const email = body?.email ?? '';
    const password = body?.password ?? '';

    if (email === 'admin@quini6.com' && password === 'password123') {
      const sessionId = `session-${WORKER_ID}-${randomUUID()}`;
      sessions.set(sessionId, { email, role: 'admin', createdAt: Date.now() });
      console.log(`[Mock API W${WORKER_ID}] Login success, session:`, sessionId);
      sendJson(res, 200, { user: { email, role: 'admin' } }, req, {
        'Set-Cookie': [
          `session=${sessionId}; Path=/; HttpOnly; SameSite=Lax`,
          'csrf_token=test-csrf-token; Path=/; SameSite=Lax'
        ],
      });
    } else {
      sendJson(res, 401, { message: 'Credenciales inválidas' }, req);
    }
    return;
  }

  // Get current user
  if (path === '/api/admin/auth/me' && req.method === 'GET') {
    const cookie = req.headers.cookie || '';
    const sessionMatch = cookie.match(/session=([^;]+)/);
    if (sessionMatch && sessions.has(sessionMatch[1])) {
      const session = sessions.get(sessionMatch[1]);
      sendJson(res, 200, { user: { email: session.email, role: session.role } }, req);
    } else {
      sendJson(res, 401, { message: 'No autorizado' }, req);
    }
    return;
  }

  // Logout
  if (path === '/api/admin/auth/logout' && req.method === 'POST') {
    const cookie = req.headers.cookie || '';
    const sessionMatch = cookie.match(/session=([^;]+)/);
    if (sessionMatch) {
      sessions.delete(sessionMatch[1]);
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Debug cookies
  if (path === '/api/admin/auth/debug-cookies' && req.method === 'GET') {
    sendJson(res, 200, {
      cookies: req.headers.cookie || 'none',
      origin: req.headers.origin || 'none',
      sessions: Array.from(sessions.keys()),
    }, req);
    return;
  }

  // Admin draws
  if (path === '/api/admin/draws' && req.method === 'GET') {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const year = url.searchParams.get('year');
    const draws = generateDraws();
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

  // Latest draw
  if (path === '/api/draws/latest' && req.method === 'GET') {
    const draws = generateDraws();
    sendJson(res, 200, draws[0], req);
    return;
  }

  // List draws
  if (path === '/api/draws' && req.method === 'GET') {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const year = url.searchParams.get('year');
    const draws = generateDraws();
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

  // Single draw
  const drawMatch = path.match(/^\/api\/draws\/(\d+)$/);
  if (drawMatch && req.method === 'GET') {
    const officialNumber = Number(drawMatch[1]);
    const draws = generateDraws();
    const draw = draws.find((item) => item.officialNumber === officialNumber);
    if (!draw) {
      notFound(res, path, 'Sorteo no encontrado', req);
      return;
    }
    sendJson(res, 200, draw, req);
    return;
  }

  // Exact search - deterministic based on input
  if (path === '/api/search/exact' && req.method === 'POST') {
    const body = await readBody(req);
    const numbers = Array.isArray(body?.numbers) ? body.numbers : [];
    const normalizedNumbers = numbers.map(n => String(n).padStart(2, '0'));
    const expected = EXACT_MATCH.map(n => String(n).padStart(2, '0')).join(',');
    const isExactMatch = numbers.length === 6 && normalizedNumbers.join(',') === expected;

    console.log(`[Mock API W${WORKER_ID}] Search exact:`, { numbers, normalizedNumbers, isExactMatch });

    sendJson(res, 200, {
      found: isExactMatch,
      totalMatches: isExactMatch ? 1 : 0,
      matches: isExactMatch
        ? [{
            drawDate: generateDraws()[0].drawDate,
            officialNumber: generateDraws()[0].officialNumber,
            modality: 'TRADICIONAL',
            numbers: normalizedNumbers,
          }]
        : [],
    }, req);
    return;
  }

  // Import preview - deterministic based on input
  if (path === '/api/admin/imports/preview' && req.method === 'POST') {
    const body = await readBody(req);
    const rows = Array.isArray(body?.rows) ? body.rows : [];
    let validCount = 0;
    let invalidCount = 0;
    for (const row of rows) {
      if (row && typeof row === 'object' && 'officialNumber' in row && 'drawDate' in row && 'results' in row) {
        validCount++;
      } else {
        invalidCount++;
      }
    }
    console.log(`[Mock API W${WORKER_ID}] Import preview: valid=${validCount}, invalid=${invalidCount}`);

    sendJson(res, 200, {
      importId: randomUUID(),
      validCount,
      invalidCount,
    }, req);
    return;
  }

  // Import commit - deterministic, with longer delay so progress component renders
  // in tests (needs to be visible long enough for a11y checks to find it)
  const commitMatch = path.match(/^\/api\/admin\/imports\/([^/]+)\/commit$/);
  if (commitMatch && req.method === 'POST') {
    const importId = commitMatch[1];
    const policy = url.searchParams.get('policy') ?? 'skip';
    console.log(`[Mock API W${WORKER_ID}] Import commit:`, { importId, policy });

    // Longer delay so ImportProgress component has time to render for a11y tests
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = {
      created: 2,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };
    sendJson(res, 200, response, req);
    return;
  }

  // Import history
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

  // Import errors
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
  console.log(`Mock API W${WORKER_ID} listening on http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`[Mock API W${WORKER_ID}] Shutting down...`);
  server.close(() => process.exit(0));
});