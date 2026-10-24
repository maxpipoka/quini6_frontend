import { defineMiddleware } from 'astro:middleware';

const PUBLIC_PATHS = [
  '/admin/login',
  '/admin/auth/login',
  '/admin/auth/me',
  '/admin/auth/logout',
  '/admin/auth/change-password',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return next();
  }

  // Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Check for session cookie (set by backend on login)
    const sessionCookie = cookies.get('session');

    if (!sessionCookie) {
      // Redirect to login with redirect parameter
      const redirectUrl = `/admin/login?redirect=${encodeURIComponent(pathname + url.search)}`;
      return redirect(redirectUrl, 302);
    }
  }

  return next();
});
