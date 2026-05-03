import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseEnv } from "./env"

/**
 * Refresh the Supabase session on every request and apply route protection
 * for /admin/* (admin role required), /create (any signed-in user),
 * plus reverse-redirect for already-authenticated users hitting /login,
 * /signup, or /admin/login.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  let supabaseResponse = NextResponse.next({ request })
  // Forward pathname for server components
  supabaseResponse.headers.set("x-pathname", pathname)

  const env = getSupabaseEnv()

  // If Supabase isn't configured yet (or env vars are placeholders), allow all
  // traffic through so the app continues to render. Auth gating activates
  // once valid env vars are set.
  if (!env) return supabaseResponse

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        supabaseResponse.headers.set("x-pathname", pathname)
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Resolve role for authenticated users
  let role: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    role = profile?.role ?? null
  }

  // Protect /admin/* (excluding /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user || role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Protect /create
  if (pathname.startsWith("/create")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Authenticated admin away from /admin/login
  if (pathname === "/admin/login" && user && role === "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Authenticated customer away from /login or /signup
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
