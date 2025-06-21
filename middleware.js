import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const protectedPaths = ['/admin'];
  const isProtected = protectedPaths.some(p => path.startsWith(p));

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    
    if (!token || token.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Log API requests
  if (path.startsWith('/api')) {
    console.log(`API Request: ${req.method} ${path}`);
  }

  return NextResponse.next();
}