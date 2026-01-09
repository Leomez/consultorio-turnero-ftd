import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log(pathname);
    

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/register', '/_next', '/favicon.ico'];

    // Verificar si la ruta actual es pública
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (isPublicPath) {
        return NextResponse.next();
    }

    // Comprobar cookie HttpOnly de refresh token que establece el backend
    const token = request.cookies.get('refresh_token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }
    

    // En el middleware del servidor, no podemos acceder a localStorage
    // Por eso usamos la cookie del navegador como fallback
    // Los tokens se guardan en localStorage en el cliente
    
    // Si llegó aquí sin token, debería ir al login
    // El cliente (useAuth) manejará la validación real del token
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};