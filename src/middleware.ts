import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const { pathname } = nextUrl

  const isApiAuthRoute = pathname.startsWith("/api/auth")

  if (isApiAuthRoute) return null

  if (pathname === "/") {
    if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl))
    return null
  }

  if (pathname === "/login") {
    if (isLoggedIn) return Response.redirect(new URL("/tasks", nextUrl))
    return null
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
