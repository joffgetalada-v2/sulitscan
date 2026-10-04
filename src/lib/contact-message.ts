const CONTACT_SUBJECTS = [
  "deal-suggestion", "outdated-price", "partnership", "broken-link", "feedback", "other",
] as const

type ContactSubject = typeof CONTACT_SUBJECTS[number]

export type ContactMessage = {
  name: string
  email: string
  subject: ContactSubject
  message: string
}

export type ContactMessageResult =
  | { ok: true; message: ContactMessage }
  | { ok: false; status: 400 | 422; error: string }

export function parseContactMessage(value: unknown): ContactMessageResult {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, status: 400, error: "Invalid request." }
  }

  const fields = value as Record<string, unknown>
  if (["name", "email", "subject", "message"].some((field) => typeof fields[field] !== "string")) {
    return { ok: false, status: 422, error: "Name, email, topic, and message must be text." }
  }

  const name = (fields.name as string).trim()
  const email = (fields.email as string).trim()
  const subject = (fields.subject as string).trim()
  const message = (fields.message as string).trim()
  if (!name || !email || !subject || !message) {
    return { ok: false, status: 422, error: "Name, email, topic, and message are required." }
  }

  for (const [field, text, maximum] of [
    ["Name", name, 100], ["Email", email, 254], ["Topic", subject, 50], ["Message", message, 5000],
  ] as const) {
    if (text.length > maximum) {
      return { ok: false, status: 422, error: `${field} must be ${maximum} characters or fewer.` }
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 422, error: "Please enter a valid email address." }
  }
  if (!CONTACT_SUBJECTS.some((supported) => supported === subject)) {
    return { ok: false, status: 422, error: "Please select a supported topic." }
  }

  return { ok: true, message: { name, email, subject: subject as ContactSubject, message } }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export function sanitizeSubjectFragment(value: string): string {
  return value.replace(/[\r\n]/g, "")
}
