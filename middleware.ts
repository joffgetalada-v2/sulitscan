import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Redirect only the primary Vercel subdomain, not preview deploys.
  // Preview deploys use the pattern: project-git-branch-team.vercel.app
  if (host === "sulitscan.vercel.app") {
    const url = request.nextUrl.clone()
    url.protocol = "https:"
    url.host = "sulitscan.com"
    url.port = ""
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
}
