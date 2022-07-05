import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { jwt } from '../../utils';

export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log({ session });

  if (!session) {
      const { origin, pathname } = req.nextUrl.clone();
      return NextResponse.redirect(`${origin}/auth/login?page=${pathname}`);
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/checkout/address'],
};