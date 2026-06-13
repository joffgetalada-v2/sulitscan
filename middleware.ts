import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Redirect the primary Vercel subdomain to the canonical domain.
  // Preview deploys use project-git-branch-team.vercel.app — not matched here.
  if (host === "sulitscan.vercel.app") {
    const url = request.nextUrl.clone()
    url.protocol = "https:"
    url.host = "sulitscan.com"
    url.port = ""
    return NextResponse.redirect(url, { status: 301 })
  }

  // Redirect www to the apex domain.
  if (host === "www.sulitscan.com") {
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
