import { NextResponse, type NextRequest } from "next/server"

/**
 * Auth gating for API Flora.
 * - /admin/* → require admin session cookie ("flora_admin_session")
 * - /admin/login and /login → if already authenticated, redirect to dashboard/home
 * - /create, /track → public (guest ordering allowed)
 *
 * Also forwards the request pathname as `x-pathname` so server components
 * can branch on the URL (e.g. admin layout hiding the sidebar on /admin/login).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const adminSession = req.cookies.get("flora_admin_session")?.value
  const customerSession = req.cookies.get("flora_customer_session")?.value

  // Forward pathname header
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)

  // /admin (but not /admin/login) requires admin session
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!adminSession) {
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Already-authenticated admin visiting /admin/login → /admin
  if (pathname === "/admin/login" && adminSession) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Already-authenticated customer visiting /login or /signup → home
  if ((pathname === "/login" || pathname === "/signup") && customerSession) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
}
