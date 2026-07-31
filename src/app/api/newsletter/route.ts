import "server-only"

import { Resend } from "resend"

import { handleNewsletterRequest } from "@/lib/newsletter-signup"

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const contacts = apiKey ? new Resend(apiKey).contacts : null
  const result = await handleNewsletterRequest(request, contacts)

  if (result.status === 503) {
    console.error("[newsletter-signup-failure]", { category: result.category, status: result.status })
  }

  return Response.json(result.body, { status: result.status, headers: result.headers })
}
