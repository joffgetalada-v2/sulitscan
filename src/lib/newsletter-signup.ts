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

export interface NewsletterTiming {
  now(): number
  delay(milliseconds: number): Promise<void>
  jitter(): number
}

export type NewsletterFailureCategory = "missing_configuration" | "provider_unavailable"

export type NewsletterResult =
  | {
      status: 200 | 400 | 422
      body: { success: true } | { error: string }
      headers: { "Cache-Control": "no-store" }
    }
  | {
      status: 503
      body: { error: string }
      headers: { "Cache-Control": "no-store" }
      category: NewsletterFailureCategory
    }

const headers = { "Cache-Control": "no-store" } as const
const validSources = new Set(["homepage", "blog-index", "blog-article"])
const successFloorMs = 900
const maximumJitterMs = 200
const defaultTiming: NewsletterTiming = {
  now: () => Date.now(),
  delay: (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  jitter: () => Math.floor(Math.random() * (maximumJitterMs + 1)),
}

function success(): NewsletterResult {
  return { status: 200, body: { success: true }, headers }
}

function invalidRequest(): NewsletterResult {
  return { status: 400, body: { error: "Invalid newsletter request." }, headers }
}

function invalid(): NewsletterResult {
  return { status: 422, body: { error: "Invalid newsletter signup." }, headers }
}

function unavailable(category: NewsletterFailureCategory): NewsletterResult {
  return {
    status: 503,
    body: { error: "Newsletter signup is temporarily unavailable. Please try again." },
    headers,
    category,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNotFoundError(error: unknown): boolean {
  return isRecord(error) && error.name === "not_found"
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null

  const email = value.trim().toLowerCase()
  if (
    email.length === 0 ||
    email.length > 254 ||
    /[/?#]/.test(email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
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

  if (!contacts) return unavailable("missing_configuration")

  try {
    const existing = await contacts.get({ email })
    if (existing.data) {
      const confirmed = await contacts.get({ email })
      return confirmed.data ? success() : unavailable("provider_unavailable")
    }
    if (!isNotFoundError(existing.error)) return unavailable("provider_unavailable")

    try {
      const created = await contacts.create({ email, unsubscribed: false })
      if (!created.error && created.data) return success()
    } catch {
      // A request can complete before the client observes a network failure.
    }

    const recovered = await contacts.get({ email })
    return recovered.data ? success() : unavailable("provider_unavailable")
  } catch {
    return unavailable("provider_unavailable")
  }
}

export async function handleNewsletterRequest(
  request: Request,
  contacts: NewsletterContactsClient | null,
  timing: NewsletterTiming = defaultTiming
): Promise<NewsletterResult> {
  const startedAt = timing.now()
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return invalidRequest()
  }

  const result = await handleNewsletterSignup(body, contacts)

  if (contacts && result.status === 200) {
    const jitterMs = Math.min(maximumJitterMs, Math.max(0, Math.floor(timing.jitter())))
    const remainingMs = successFloorMs + jitterMs - (timing.now() - startedAt)
    if (remainingMs > 0) await timing.delay(remainingMs)
  }

  return result
}
