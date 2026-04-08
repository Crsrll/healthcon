import { NextResponse } from "next/server";

export default function proxy(request) {
  const { pathname } = request.nextUrl;

  const userCookie = request.cookies.get("hc_user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  const role = user?.role;

  if (user && !role) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("hc_user");
    return response;
  }


  // ← If already logged in, block access to auth pages
  const isAuthRoute = pathname.startsWith("/auth");
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  const isPatientRoute = pathname.startsWith("/patient");
  const isClinicRoute  = pathname.startsWith("/clinic");
  const isAdminRoute   = pathname.startsWith("/admin");

  // Not logged in → redirect to login
  if ((isPatientRoute || isClinicRoute || isAdminRoute) && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Wrong role → redirect to their own dashboard
  if (isPatientRoute && role !== "patient") {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }
  if (isClinicRoute && role !== "clinic") {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/clinic/:path*", "/admin/:path*", "/auth/:path*"],
};