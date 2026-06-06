import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { Mail, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact SulitScan PH",
  description: "Get in touch with SulitScan PH. Report a deal, suggest a store, or ask about affiliate partnerships.",
  alternates: { canonical: `${siteConfig.url}/contact` },
}

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100 mb-4">
            <MessageSquare className="w-6 h-6 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Contact Us</h1>
          <p className="text-slate-500 leading-relaxed">
            Have a deal suggestion, found a broken link, or interested in a partnership? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-5 bg-green-50 border border-green-200 rounded-2xl">
            <Mail className="w-5 h-5 text-green-600 mb-2" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900 mb-1">Email Us</h2>
            <p className="text-xs text-slate-500 mb-2">
              For partnerships, feedback, or general questions.
            </p>
            <a
              href="mailto:hello@sulitscan.com"
              className="text-sm font-medium text-green-600 hover:underline"
            >
              hello@sulitscan.com
            </a>
          </div>
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
            <MessageSquare className="w-5 h-5 text-blue-600 mb-2" aria-hidden="true" />
            <h2 className="text-sm font-bold text-slate-900 mb-1">Suggest a Deal</h2>
            <p className="text-xs text-slate-500 mb-2">
              Found a sulit deal we missed? Let us know.
            </p>
            <a
              href="mailto:deals@sulitscan.com"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              deals@sulitscan.com
            </a>
          </div>
        </div>

        {/* Simple contact form */}
        <form
          className="space-y-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          aria-label="Contact form"
        >
          <h2 className="text-lg font-bold text-slate-900">Send a message</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white"
            >
              <option value="">Select a topic…</option>
              <option value="deal-suggestion">Deal Suggestion</option>
              <option value="partnership">Affiliate Partnership</option>
              <option value="broken-link">Broken Link / Error</option>
              <option value="feedback">General Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              placeholder="Tell us what's on your mind…"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Send Message
          </button>

          <p className="text-xs text-slate-400 text-center">
            This form is for demonstration. We&apos;ll respond to{" "}
            <a href="mailto:hello@sulitscan.com" className="underline">hello@sulitscan.com</a>.
          </p>
        </form>
      </div>
    </>
  )
}
