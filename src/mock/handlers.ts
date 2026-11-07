import { http, HttpResponse } from 'msw';

// Mock import data
const mockImports = [
  {
    importId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    fileName: 'draws_2024_q1.csv',
    date: '2024-03-15T10:30:00Z',
    rowsProcessed: 50,
    succeeded: 48,
    failed: 2,
    policy: 'skip',
  },
  {
    importId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    fileName: 'draws_2024_q2.xlsx',
    date: '2024-06-20T14:45:00Z',
    rowsProcessed: 75,
    succeeded: 75,
    failed: 0,
    policy: 'replace',
  },
];

const mockImportErrors = {
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [
    {
      rowNumber: 12,
      field: 'TRADICIONAL_number_3',
      message: 'Number must be between 0 and 45',
      rawValue: 50,
    },
    {
      rowNumber: 34,
      field: 'REVANCHA_number_1',
      message: 'Numbers cannot repeat within a modality',
      rawValue: '1,2,3,4,5,1',
    },
  ],
  'b2c3d4e5-f6a7-8901-bcde-f23456789012': [],
};

export const handlers = [
  // Health check endpoints (for HealthDashboard tests)
  http.get('http://localhost:3001/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: 123.45,
    });
  }),

  http.get('http://localhost:3001/api/health/db', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      latency: 12.5,
    });
  }),

  // Auth endpoints
  http.get('/api/admin/auth/me', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
      },
    });
  }),

  http.post('/api/admin/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'test@test.com' && body.password === 'pass') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'admin',
        },
      });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/api/admin/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/admin/auth/change-password', () => {
    return HttpResponse.json({ success: true });
  }),

  // Draw list endpoint
  http.get('/api/sorteos', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const year = url.searchParams.get('year');

    const draws = [
      {
        officialNumber: 3245,
        date: '2024-01-15',
        numbers: [5, 12, 23, 34, 41, 45],
        complementary: 3,
        reintegro: 7,
        prizes: [
          { category: '6 aciertos', winners: 0, amount: 0 },
          { category: '5 aciertos + C', winners: 2, amount: 125000 },
          { category: '5 aciertos', winners: 45, amount: 3500 },
          { category: '4 aciertos', winners: 2100, amount: 50 },
          { category: '3 aciertos', winners: 45000, amount: 10 },
          { category: '2 aciertos', winners: 580000, amount: 4 },
          { category: 'Reintegro', winners: 1200000, amount: 1 },
        ],
      },
      {
        officialNumber: 3244,
        date: '2024-01-10',
        numbers: [3, 18, 27, 31, 39, 44],
        complementary: 8,
        reintegro: 2,
        prizes: [
          { category: '6 aciertos', winners: 1, amount: 2500000 },
          { category: '5 aciertos + C', winners: 5, amount: 85000 },
          { category: '5 aciertos', winners: 120, amount: 2800 },
          { category: '4 aciertos', winners: 3200, amount: 45 },
          { category: '3 aciertos', winners: 62000, amount: 10 },
          { category: '2 aciertos', winners: 750000, amount: 4 },
          { category: 'Reintegro', winners: 1500000, amount: 1 },
        ],
      },
    ];

    const filtered = year ? draws.filter((d) => d.date.startsWith(year)) : draws;

    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paginated,
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    });
  }),

  // Exact search endpoint
  http.get('/api/buscar/exacta', ({ request }) => {
    const url = new URL(request.url);
    const numbers = url.searchParams.get('numbers')?.split(',').map(Number) ?? [];

    if (numbers.length === 6 && numbers.every((n) => n >= 1 && n <= 49)) {
      // Mock exact match found for a specific combination
      if (numbers.join(',') === '5,12,23,34,41,45') {
        return HttpResponse.json({
          found: true,
          draw: {
            officialNumber: 3245,
            date: '2024-01-15',
            numbers: [5, 12, 23, 34, 41, 45],
            complementary: 3,
            reintegro: 7,
            prizes: [
              { category: '6 aciertos', winners: 0, amount: 0 },
              { category: '5 aciertos + C', winners: 2, amount: 125000 },
            ],
          },
        });
      }

      return HttpResponse.json({
        found: false,
        message: 'No se encontró un sorteo con esa combinación exacta',
      });
    }

    return HttpResponse.json({ error: 'Invalid numbers' }, { status: 400 });
  }),

  // Partial search endpoint
  http.get('/api/buscar/parcial', ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');

    const mockResults = [
      {
        officialNumber: 3245,
        date: '2024-01-15',
        numbers: [5, 12, 23, 34, 41, 45],
        complementary: 3,
        reintegro: 7,
        matches: 3,
      },
      {
        officialNumber: 3230,
        date: '2023-12-20',
        numbers: [5, 12, 28, 30, 40, 48],
        complementary: 1,
        reintegro: 4,
        matches: 2,
      },
    ];

    const filtered = year ? mockResults.filter((d) => d.date.startsWith(year)) : mockResults;

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
    });
  }),

  // Draw detail endpoint
  http.get('/api/sorteos/:officialNumber', ({ params }) => {
    const officialNumber = parseInt(params.officialNumber as string);

    if (officialNumber === 3245) {
      return HttpResponse.json({
        officialNumber: 3245,
        date: '2024-01-15',
        numbers: [5, 12, 23, 34, 41, 45],
        complementary: 3,
        reintegro: 7,
        prizes: [
          { category: '6 aciertos', winners: 0, amount: 0 },
          { category: '5 aciertos + C', winners: 2, amount: 125000 },
          { category: '5 aciertos', winners: 45, amount: 3500 },
          { category: '4 aciertos', winners: 2100, amount: 50 },
          { category: '3 aciertos', winners: 45000, amount: 10 },
          { category: '2 aciertos', winners: 580000, amount: 4 },
          { category: 'Reintegro', winners: 1200000, amount: 1 },
        ],
      });
    }

    return HttpResponse.json({ error: 'Sorteo no encontrado' }, { status: 404 });
  }),

  // ============================================================================
  // Import Endpoints (Phase 3 Bulk Import)
  // ============================================================================

  // POST admin/imports/preview - Submit rows for preview
  http.post('admin/imports/preview', async ({ request }) => {
    const body = await request.json();
    const { rows } = body as { rows: unknown[] };

    // Validate rows structure
    if (!Array.isArray(rows)) {
      return HttpResponse.json({ message: 'rows must be an array' }, { status: 400 });
    }

    // Count valid vs invalid (simplified: check if row has required fields)
    let validCount = 0;
    let invalidCount = 0;

    for (const row of rows) {
      if (
        row &&
        typeof row === 'object' &&
        'officialNumber' in row &&
        'drawDate' in row &&
        'results' in row
      ) {
        validCount++;
      } else {
        invalidCount++;
      }
    }

    // Return importId for commit
    return HttpResponse.json({
      importId: crypto.randomUUID(),
      validCount,
      invalidCount,
    });
  }),

  // POST admin/imports/:id/commit - Commit previewed import with policy
  http.post('admin/imports/:id/commit', ({ request }) => {
    const url = new URL(request.url);
    const policy = url.searchParams.get('policy') as 'skip' | 'replace' | 'merge' | null;

    if (!policy || !['skip', 'replace', 'merge'].includes(policy)) {
      return HttpResponse.json(
        { message: 'Invalid policy. Must be skip, replace, or merge' },
        { status: 400 }
      );
    }

    // Simulate processing result
    return HttpResponse.json({
      created: 45,
      updated: 3,
      skipped: 2,
      failed: 0,
      errors: [],
    });
  }),

  // GET admin/imports - Paginated import history
  http.get('admin/imports', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '10');
    const sort = url.searchParams.get('sort') ?? 'date';
    const order = url.searchParams.get('order') ?? 'desc';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const policy = url.searchParams.get('policy');

    let filtered = [...mockImports];

    // Apply filters
    if (startDate) {
      filtered = filtered.filter((i) => i.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((i) => i.date <= endDate);
    }
    if (policy) {
      filtered = filtered.filter((i) => i.policy === policy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sort as keyof typeof a];
      const bVal = b[sort as keyof typeof b];
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginate
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data,
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    });
  }),

  // GET admin/imports/:id/errors - Get error details for an import
  http.get('admin/imports/:id/errors', ({ params }) => {
    const importId = params.id as string;
    const errors = mockImportErrors[importId as keyof typeof mockImportErrors] ?? [];

    return HttpResponse.json({
      errors,
    });
  }),
];
