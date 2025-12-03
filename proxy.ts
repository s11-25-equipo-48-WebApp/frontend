import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user;
  // Rutas públicas
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/public', '/_next/static',];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Si la ruta es pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no está autenticado y trata de acceder a una ruta protegida
  if (!isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Usuario autenticado, permitir acceso
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*',],
};
