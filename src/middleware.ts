import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Importa desde jose

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;
  if (!token) {
  console.log('sin token', token)
  const url = req.nextUrl.clone();
  url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  try {
    // Verificar el token con 'jose'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // Propagar el rol al backend si es necesario
    req.headers.set('user-role', payload.role as string);
    return NextResponse.next();
  } catch (error) {
    console.log('error middleware', error)
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // Aplica el middleware solo en rutas protegidas
};
