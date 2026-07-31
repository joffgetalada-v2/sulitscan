type NewsletterProviderResponse<T> = {
  data: T | null
  error: unknown | null
  headers: unknown
}

type NewsletterContact = {
  unsubscribed: boolean
}

type NewsletterCreatedContact = {
  id: string
}

export interface NewsletterContactsClient {
  get(input: { email: string }): Promise<NewsletterProviderResponse<NewsletterContact>>
  create(input: { email: string; unsubscribed: false }): Promise<NewsletterProviderResponse<NewsletterCreatedContact>>
}

export type NewsletterResult = {
  status: 200 | 422 | 503
  body: { success: true } | { error: string }
  headers: { "Cache-Control": "no-store" }
}

const headers = { "Cache-Control": "no-store" } as const
const validSources = new Set(["homepage", "blog-index", "blog-article"])

function success(): NewsletterResult {
  return { status: 200, body: { success: true }, headers }
}

function invalid(): NewsletterResult {
  return { status: 422, body: { error: "Invalid newsletter signup." }, headers }
}

function unavailable(): NewsletterResult {
  return {
    status: 503,
    body: { error: "Newsletter signup is temporarily unavailable. Please try again." },
    headers,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null

  const email = value.trim().toLowerCase()
  if (email.length === 0 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null
  }

  return email
}

export async function handleNewsletterSignup(
  body: unknown,
  contacts: NewsletterContactsClient | null
): Promise<NewsletterResult> {
  if (!isRecord(body)) return invalid()
  if (typeof body.hp === "string" && body.hp.length > 0) return success()

  const email = normalizeEmail(body.email)
  if (!email || body.consent !== true || typeof body.source !== "string" || !validSources.has(body.source)) {
    return invalid()
  }

  if (!contacts) return unavailable()

  try {
    const existing = await contacts.get({ email })
    if (existing.error) return unavailable()
    if (existing.data) return success()

    try {
      const created = await contacts.create({ email, unsubscribed: false })
      if (!created.error && created.data) return success()
    } catch {
      // A request can complete before the client observes a network failure.
    }

    const recovered = await contacts.get({ email })
    return recovered.error || !recovered.data ? unavailable() : success()
  } catch {
    return unavailable()
  }
}
