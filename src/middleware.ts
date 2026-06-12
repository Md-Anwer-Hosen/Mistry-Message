import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // logged in user sign-in page এ গেলে dashboard এ পাঠাও

  if (token && path.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // logged out user dashboard এ গেলে sign-in এ পাঠাও

  if (!token && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};
