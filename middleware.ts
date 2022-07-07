import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { origin, pathname } = req.nextUrl.clone();

  if (!session) {
      return NextResponse.redirect(`${origin}/auth/login?page=${pathname}`);
  }
  
  //Middleware para verificar si el usuario esta autenticado y el rol es correcto
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const validRoles = ['admin', 'super-user','SEO'];
    if(!validRoles.includes(session.user.role)){
       return NextResponse.redirect(`${origin}/`);
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/checkout/address','/admin'],
};