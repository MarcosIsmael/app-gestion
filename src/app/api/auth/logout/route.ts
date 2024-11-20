import { NextResponse } from 'next/server';

export async function POST() {
  // Configura la cookie `auth` con un tiempo de vida expirado para eliminarla
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Fecha de expiración pasada para eliminar la cookie
  });

  return response;
}
