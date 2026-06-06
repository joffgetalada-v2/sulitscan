import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { Mail, MessageSquare, Tag } from "lucide-react"

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
          { name: "Home",    url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 mb-4">
            <MessageSquare className="w-6 h-6 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Contact Us</h1>
          <p className="text-slate-500 leading-relaxed">
            Have a deal suggestion, found a broken link, or interested in a partnership? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: Mail,
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-200",
              title: "General Inquiries",
              desc: "Partnerships, feedback, questions.",
              email: "hello@sulitscan.com",
            },
            {
              icon: Tag,
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-200",
              title: "Suggest a Deal",
              desc: "Found a sulit deal we missed?",
              email: "deals@sulitscan.com",
            },
            {
              icon: MessageSquare,
              color: "text-purple-600",
              bg: "bg-purple-50",
              border: "border-purple-200",
              title: "Partnerships",
              desc: "Affiliate or store partnerships.",
              email: "partners@sulitscan.com",
            },
          ].map((c) => (
            <div key={c.title} className={`p-4 ${c.bg} border ${c.border} rounded-2xl`}>
              <c.icon className={`w-5 h-5 ${c.color} mb-2`} aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">{c.title}</h2>
              <p className="text-xs text-slate-500 mb-2">{c.desc}</p>
              <a href={`mailto:${c.email}`} className={`text-xs font-semibold ${c.color} hover:underline`}>
                {c.email}
              </a>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <form
          className="space-y-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          aria-label="Contact form"
        >
          <h2 className="text-lg font-bold text-slate-900">Send a message</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
              Topic
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
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Send Message
          </button>

          <p className="text-xs text-slate-400 text-center">
            Form is for demonstration purposes.{" "}
            <a href="mailto:hello@sulitscan.com" className="underline hover:text-slate-600">
              Email us directly
            </a>{" "}
            for a faster response.
          </p>
        </form>
      </div>
    </>
  )
}
