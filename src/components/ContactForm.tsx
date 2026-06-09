"use client"

import { useState, useRef } from "react"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

type Status = "idle" | "submitting" | "success" | "error"

interface ContactFormProps {
  initialSubject?: string
  initialMessage?: string
}

export default function ContactForm({ initialSubject = "", initialMessage = "" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    setErrorMsg("")

    const fd = new FormData(e.currentTarget)
    const payload = {
      name:    (fd.get("name") as string).trim(),
      email:   (fd.get("email") as string).trim(),
      subject: fd.get("subject") as string,
      message: (fd.get("message") as string).trim(),
    }

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      setStatus("success")
      formRef.current?.reset()
    } catch {
      setErrorMsg("Could not reach the server. Please try again or email us directly.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white border border-slate-100 rounded-2xl shadow-sm text-center px-6">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Message sent!</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          We received your message and will reply within 2–3 business days.
          Check your inbox — our reply will come from <strong>hello@e.sulitscan.com</strong>.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-xs text-green-600 hover:underline font-medium mt-2"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
      aria-label="Contact form"
      noValidate
    >
      <h2 className="text-lg font-bold text-slate-900">Send a message</h2>
      <p className="text-xs text-slate-500">
        We&apos;ll reply to your email within 2–3 business days.
      </p>

      {status === "error" && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-red-700">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
          Topic
        </label>
        <select
          id="subject"
          name="subject"
          defaultValue={initialSubject}
          disabled={status === "submitting"}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a topic…</option>
          <option value="deal-suggestion">Deal Suggestion</option>
          <option value="outdated-price">Report Outdated Price</option>
          <option value="partnership">Affiliate Partnership</option>
          <option value="broken-link">Broken Link / Error</option>
          <option value="feedback">General Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={initialMessage}
          disabled={status === "submitting"}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Tell us what's on your mind…"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Or email us directly at{" "}
        <a href="mailto:hello@sulitscan.com" className="underline hover:text-slate-600">
          hello@sulitscan.com
        </a>
      </p>
    </form>
  )
}
