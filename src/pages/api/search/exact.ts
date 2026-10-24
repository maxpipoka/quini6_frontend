/**
 * Search API Endpoint - Exact combination search
 * Handles POST /api/search/exact
 */

import type { APIRoute } from 'astro';
import { getApiClient } from '../../../lib/api/client';
import { ExactSearchRequestSchema } from '../../../lib/schemas';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: unknown = await request.json();

    // Validate request body
    const validationResult = ExactSearchRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: validationResult.error.errors.map((e) => e.message).join(', '),
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          path: '/api/search/exact',
          requestId: crypto.randomUUID(),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiClient = getApiClient();
    const result = await apiClient.searchExactCombination(validationResult.data.numbers);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search API error:', error);

    // Handle API client errors
    const apiError = error as { requestId?: string; statusCode?: number; message?: string };
    const requestId = apiError.requestId ?? crypto.randomUUID();
    const statusCode = apiError.statusCode ?? 500;
    const message = apiError.message ?? 'Error interno del servidor';

    return new Response(
      JSON.stringify({
        statusCode,
        message,
        error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/api/search/exact',
        requestId,
      }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
