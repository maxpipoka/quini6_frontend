import { defineMiddleware } from 'astro:middleware';

const PUBLIC_PATHS = [
  '/admin/login',
  '/admin/auth/login',
  '/admin/auth/csrf',
  '/admin/auth/me',
  '/admin/auth/logout',
  '/admin/auth/change-password',
  '/admin/auth/debug-cookies',
  '/admin/debug-cookies',
  '/admin/imports/upload',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    console.log('[Middleware] PUBLIC PATH:', pathname);
    return next();
  }

  // Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Check for session cookie (set by backend on login)
    const sessionCookie = cookies.get('session');
    const cookieHeader = context.request.headers.get('cookie') ?? 'none';
    console.log(
      '[Middleware] Path:',
      pathname,
      'Session cookie (get):',
      sessionCookie,
      'Cookie header:',
      cookieHeader
    );

    if (!sessionCookie) {
      // Redirect to login with redirect parameter
      const redirectUrl = `/admin/login?redirect=${encodeURIComponent(pathname + url.search)}`;
      console.log('[Middleware] Redirecting to:', redirectUrl);
      return redirect(redirectUrl, 302);
    }
  }

  return next();
});
