import { http, HttpResponse } from 'msw';

export const handlers = [
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
    const body = await request.json();
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
];
