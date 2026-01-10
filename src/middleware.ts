import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log(pathname);
    

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/register', '/_next', '/favicon.ico'];

    // Verificar si la ruta actual es pública
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (isPublicPath) {
        return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);

    // Comprobar cookie HttpOnly de refresh token que establece el backend
    const token = request.cookies.get('refresh_token')?.value;

    if (!token) {
        return NextResponse.redirect(loginUrl);
    }

    // Validar el token con el backend

    const API_URL = process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin;

    try {
        const resp = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Envia la cookie HttpOnly al backend para verificar
                'Cookie': `refresh_token=${token}`,
            },
        });

        if (!resp.ok) {
            //si no se puede refrescar, limpiar la cookie en el servidor y redirigir al login
            const response = NextResponse.redirect(loginUrl);
            response.cookies.set('refresh_token', '', { 
                maxAge: 0, 
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
            return response; 
        }
        //Si resp.ok, el token es válido, continuar
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set('refresh_token', '', { 
            maxAge: 0,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        });
        return response; 
    }  
    
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