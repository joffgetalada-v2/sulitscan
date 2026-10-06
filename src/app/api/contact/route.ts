import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { escapeHtml, parseContactMessage, sanitizeSubjectFragment } from "@/lib/contact-message"

const TOPIC_LABELS: Record<string, string> = {
  "deal-suggestion":  "Deal Suggestion",
  "outdated-price":   "Outdated Price Report",
  "partnership":      "Affiliate Partnership",
  "broken-link":      "Broken Link / Error",
  "feedback":         "General Feedback",
  "other":            "Other",
}

// Per-topic routing. Deal-related topics go to deals@, partnerships to
// partners@, everything else to hello@.
const TOPIC_ROUTING: Record<string, string> = {
  "deal-suggestion":  "deals@sulitscan.com",
  "outdated-price":   "deals@sulitscan.com",
  "broken-link":      "deals@sulitscan.com",
  "partnership":      "partners@sulitscan.com",
  "feedback":         "hello@sulitscan.com",
  "other":            "hello@sulitscan.com",
}
const DEFAULT_RECIPIENT = "hello@sulitscan.com"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = parseContactMessage(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  }
  const { name, email, subject, message } = parsed.message

  const topicLabel = TOPIC_LABELS[subject]
  const recipient = TOPIC_ROUTING[subject] ?? DEFAULT_RECIPIENT

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from:    "SulitScan PH <hello@e.sulitscan.com>",
      to:      [recipient],
      replyTo: email,
      subject: `[SulitScan Contact] ${sanitizeSubjectFragment(topicLabel)}, ${sanitizeSubjectFragment(name)}`,
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
                <td style="padding:8px 0;color:#1e293b">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;vertical-align:top"><strong>Email</strong></td>
                <td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#16a34a">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b;vertical-align:top"><strong>Topic</strong></td>
                <td style="padding:8px 0;color:#1e293b">${escapeHtml(topicLabel)}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Message</p>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#334155">${escapeHtml(message)}</div>
          </div>
          <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:16px">Sent via sulitscan.com contact form · Reply directly to this email to respond to the sender</p>
        </div>
      `,
    })
    if (result.error) throw result.error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[contact/route] Resend error:", err)
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email us directly at hello@sulitscan.com." },
      { status: 500 }
    )
  }
}
