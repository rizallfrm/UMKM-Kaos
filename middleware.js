import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const protectedPaths = ['/admin'];
  
  if (protectedPaths.some(p => path.startsWith(p))) {
    const token = await getToken({ req });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  
  return NextResponse.next();
}