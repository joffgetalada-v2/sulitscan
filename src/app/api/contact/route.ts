import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const TOPIC_LABELS: Record<string, string> = {
  "deal-suggestion":  "Deal Suggestion",
  "outdated-price":   "Outdated Price Report",
  "partnership":      "Affiliate Partnership",
  "broken-link":      "Broken Link / Error",
  "feedback":         "General Feedback",
  "other":            "Other",
}

// Per-topic routing. Deal-related topics go to deals@, partnerships to
// partners@, everything else to hello@. The monitored ops inbox is BCC'd on
// every message during soft launch so nothing is lost if an alias isn't live.
const TOPIC_ROUTING: Record<string, string> = {
  "deal-suggestion":  "deals@sulitscan.com",
  "outdated-price":   "deals@sulitscan.com",
  "broken-link":      "deals@sulitscan.com",
  "partnership":      "partners@sulitscan.com",
  "feedback":         "hello@sulitscan.com",
  "other":            "hello@sulitscan.com",
}
const DEFAULT_RECIPIENT = "hello@sulitscan.com"
const OPS_INBOX = "joff.getalada@dovrmedia.com"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 })

  const { name, email, subject, message } = body as {
    name?: string
    email?: string
    subject?: string
    message?: string
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 422 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 })
  }

  const topicLabel = TOPIC_LABELS[subject ?? ""] ?? "General"
  const recipient = TOPIC_ROUTING[subject ?? ""] ?? DEFAULT_RECIPIENT

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from:    "SulitScan PH <hello@e.sulitscan.com>",
      to:      [recipient],
      bcc:     [OPS_INBOX],
      replyTo: email.trim(),
      subject: `[SulitScan Contact] ${topicLabel} — ${name.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
          <div style="background:#f0fdf4;padding:24px 24px 16px;border-radius:12px 12px 0 0;border-bottom:2px solid #bbf7d0">
            <h2 style="margin:0 0 4px;font-size:18px;color:#15803d">New Contact Form Submission</h2>
            <p style="margin:0;font-size:13px;color:#64748b">From the SulitScan PH contact form</p>
          </div>
          <div style="padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr>
                <td style="padding:8px 0;color:#64748b;width:100px;vertical-align:top"><strong>Name</strong></td>
                <td style="padding:8px 0;color:#1e293b">${escapeHtml(name.trim())}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;vertical-align:top"><strong>Email</strong></td>
                <td style="padding:8px 0"><a href="mailto:${escapeHtml(email.trim())}" style="color:#16a34a">${escapeHtml(email.trim())}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;vertical-align:top"><strong>Topic</strong></td>
                <td style="padding:8px 0;color:#1e293b">${escapeHtml(topicLabel)}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Message</p>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#334155">${escapeHtml(message.trim())}</div>
          </div>
          <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:16px">Sent via sulitscan.com contact form · Reply directly to this email to respond to the sender</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[contact/route] Resend error:", err)
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email us directly at hello@sulitscan.com." },
      { status: 500 }
    )
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}
