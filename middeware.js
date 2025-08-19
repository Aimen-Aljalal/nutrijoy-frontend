import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || null;
  const role = req.cookies.get("role")?.value || null;

  const url = req.nextUrl.clone();

   if (!token || role !== "admin") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], 
};
