export { auth as middleware } from "./auth"

export const config = {
  matcher: [
    '/create/:path*',
    '/profile/:path*',
    '/api/posts/:path*',
    '/api/comments/:path*',
    '/api/votes/:path*',
  ],
}
