import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET ?? 'dev-secret';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes, but not /admin/login itself
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (session !== SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
