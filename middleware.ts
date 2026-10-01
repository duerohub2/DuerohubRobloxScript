import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = ['/dashboard', '/upload', '/settings'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Protected: require login
  if (PROTECTED_ROUTES.some(r => path.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?next=${path}`, request.url));
    }
  }

  // Admin: require mod or admin role
  if (ADMIN_ROUTES.some(r => path.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?next=${path}`, request.url));
    }
    const { data: profile } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (!profile || !['moderator', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Auth pages: redirect logged-in users away
  if (user && AUTH_ROUTES.some(r => path.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Everything else: PUBLIC — no protection
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
