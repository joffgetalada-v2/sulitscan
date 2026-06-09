import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import ContactForm from "@/components/ContactForm"
import { Mail, MessageSquare, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: { absolute: "Contact SulitScan PH | Deal Reports, Feedback, and Partnerships" },
  description: "Get in touch with SulitScan PH. Report an outdated price, suggest a deal, or ask about affiliate partnerships. We review messages within 2–3 business days.",
  alternates: { canonical: `${siteConfig.url}/contact` },
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; deal?: string; message?: string }>
}) {
  const { topic, deal, message } = await searchParams

  const initialSubject = topic ?? ""
  const initialMessage = deal
    ? `Deal: ${deal}\n\nPlease describe the issue with this deal's pricing or information:`
    : (message ?? "")

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
        <ContactForm initialSubject={initialSubject} initialMessage={initialMessage} />
      </div>
    </>
  )
}
