export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCsrfHeader(request: Request): Request {
  const csrfToken = getCsrfToken();
  if (!csrfToken) return request;

  const headers = new Headers(request.headers);
  headers.set('X-CSRF-Token', csrfToken);
  return new Request(request, { headers });
}