import { NextResponse } from "next/server"

function isValidEmail(email: string): boolean {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, consent, source, hp } = body

    // Honeypot: silently drop bot submissions
    if (hp && String(hp).length > 0) {
      return NextResponse.json({ success: true })
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ error: "Please check the consent box to continue." }, { status: 400 })
    }

    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json({ pending: true })
    }

    const payload = {
      email: email.trim(),
      source: source ?? "website",
      consent: true,
      site: "SulitScan PH",
    }

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!webhookRes.ok) {
      return NextResponse.json({ pending: true })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
