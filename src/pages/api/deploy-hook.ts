/**
 * Vercel Deploy Hook Endpoint
 * POST /api/deploy-hook
 *
 * Triggers a Vercel rebuild when a new draw is published.
 * Validates secret token, payload, and implements idempotency.
 */

import type { APIRoute } from 'astro';

// In-memory store for processed draw IDs (use Redis in production)
const processedDrawIds = new Set<string>();

interface DeployHookPayload {
  drawId: string;
  drawDate: string;
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Validate secret token
  const authHeader = request.headers.get('authorization');
  const expectedSecret = import.meta.env.VERCEL_DEPLOY_HOOK_SECRET;

  if (!expectedSecret) {
    console.error('VERCEL_DEPLOY_HOOK_SECRET not configured');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const providedSecret = authHeader?.replace('Bearer ', '');
  if (providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Invalid secret token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Parse and validate payload
  let payload: DeployHookPayload;
  try {
    payload = (await request.json()) as DeployHookPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!payload.drawId || !payload.drawDate) {
    return new Response(JSON.stringify({ error: 'Missing required fields: drawId, drawDate' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate drawDate is a valid ISO date
  const drawDate = new Date(payload.drawDate);
  if (isNaN(drawDate.getTime())) {
    return new Response(JSON.stringify({ error: 'Invalid drawDate format, expected ISO 8601' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Idempotency check
  const drawIdKey = `${payload.drawId}:${payload.drawDate}`;
  if (processedDrawIds.has(drawIdKey)) {
    console.log(`Draw ${payload.drawId} already processed, returning 200`);
    return new Response(
      JSON.stringify({
        message: 'Already building',
        drawId: payload.drawId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Mark as processing
  processedDrawIds.add(drawIdKey);

  // 4. Trigger Vercel rebuild via Deploy Hook URL
  const deployHookUrl = import.meta.env.VERCEL_DEPLOY_HOOK_URL as string | undefined;

  if (!deployHookUrl) {
    console.error('VERCEL_DEPLOY_HOOK_URL not configured');
    processedDrawIds.delete(drawIdKey);
    return new Response(JSON.stringify({ error: 'Deploy hook URL not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(deployHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        drawId: payload.drawId,
        drawDate: payload.drawDate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vercel deploy hook failed:', response.status, errorText);
      processedDrawIds.delete(drawIdKey);
      return new Response(
        JSON.stringify({
          error: 'Failed to trigger Vercel rebuild',
          details: errorText,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Vercel rebuild triggered for draw ${payload.drawId}`);
    return new Response(
      JSON.stringify({
        message: 'Rebuild triggered',
        drawId: payload.drawId,
        status: 'accepted',
      }),
      {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error triggering Vercel deploy hook:', error);
    processedDrawIds.delete(drawIdKey);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
