"use client"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { track } from "@vercel/analytics/react"
import Link from "next/link"

interface Props {
  source?: string
  variant?: "full" | "compact"
}

type Status = "idle" | "submitting" | "success" | "error"

export default function NewsletterSignup({ source = "homepage", variant = "full" }: Props) {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!consent) {
      setErrorMsg("Please check the consent box to continue.")
      setStatus("error")
      return
    }
    setStatus("submitting")
    setErrorMsg("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source, hp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus("success")
        try {
          track("newsletter_signup_request_completed", { source })
        } catch {
          // Analytics must never prevent a completed signup from reaching the user.
        }
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Could not reach the server. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
        <p className="text-sm font-bold text-slate-900">Request received</p>
        <p className="text-xs text-slate-500">Thanks for your interest in SulitScan deal alerts.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter signup" className="flex flex-col gap-3">
      {/* Honeypot field - hidden from real users */}
      <input
        type="text"
        name="hp"
        value={hp}
        onChange={e => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div
        className={
          variant === "compact"
            ? "flex w-full flex-col gap-2 sm:flex-row"
            : "flex flex-col gap-2 sm:flex-row"
        }
      >
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={status === "submitting"}
          autoComplete="email"
          className="min-w-0 flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-50 bg-white"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "submitting" || !email}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap"
        >
          {status === "submitting" ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            "Join Free Deal Alerts"
          )}
        </button>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="newsletter-consent"
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          disabled={status === "submitting"}
          className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-400 mt-0.5 shrink-0 cursor-pointer"
        />
        <label htmlFor="newsletter-consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
          I agree to receive SulitScan deal alerts and shopping tips by email.
        </label>
      </div>

      {status === "error" && errorMsg && (
        <p className="text-xs text-red-600" role="alert">{errorMsg}</p>
      )}

      <p className="text-[10px] text-slate-400 leading-relaxed">
        No spam. You can unsubscribe anytime.{" "}
        <Link href="/privacy-policy" className="underline hover:text-slate-600">
          See our Privacy Policy.
        </Link>
      </p>
    </form>
  )
}
