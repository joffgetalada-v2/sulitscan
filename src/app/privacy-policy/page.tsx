import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SulitScan PH privacy policy. How we collect, use, and protect your information.",
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",           url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy-policy` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-blue-700">
                Legal
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Privacy Policy</h1>
              <p className="text-sm text-slate-400">Last updated: June 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">SulitScan PH may collect the following types of information:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                <span><strong>Usage data:</strong> Pages visited, clicks, and navigation patterns (via analytics tools).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                <span><strong>Contact information:</strong> Name and email if you contact us through our contact form.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                <span><strong>Cookies:</strong> Basic session cookies and analytics cookies.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. How We Use Information</h2>
            <ul className="space-y-2 pl-4">
              {["To improve the website and curate better deals", "To respond to contact form submissions", "To analyze site performance and user experience"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Third-Party Links</h2>
            <p>
              SulitScan PH contains affiliate links to third-party websites (Temu and Sephora PH).
              We are not responsible for the privacy practices of those websites. We encourage you
              to read the privacy policies of any third-party site you visit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Analytics</h2>
            <p>
              SulitScan PH uses <strong>Vercel Analytics</strong> to collect aggregated, anonymized usage
              data — such as page views and navigation paths. This service does not use advertising
              cookies and does not personally identify individual visitors. We use this data only to
              improve the site experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Cookies</h2>
            <p className="mb-3">
              We use a limited number of cookies. For a full breakdown, see our{" "}
              <a href="/cookie-policy" className="text-green-600 underline hover:text-green-700">Cookie Policy</a>.
            </p>
            <p>
              SulitScan PH does <strong>not</strong> currently use advertising cookies or third-party
              ad networks. If we add advertising in the future, this policy will be updated and a
              cookie consent notice will be shown before enabling advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Affiliate Link Tracking</h2>
            <p>
              When you click a Temu or Sephora PH affiliate link, those partner sites may use their own
              cookies or tracking pixels to record the referral. SulitScan PH does not control this
              tracking. Refer to{" "}
              <a href="https://www.temu.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-green-600 underline hover:text-green-700">Temu&apos;s Privacy Policy</a>{" "}
              and{" "}
              <a href="https://www.sephora.ph/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 underline hover:text-green-700">Sephora PH&apos;s Privacy Policy</a>{" "}
              for details on how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no
              internet transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              SulitScan PH is not directed at children under 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this
              page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">10. Contact</h2>
            <p>
              For privacy questions, email us at{" "}
              <a href="mailto:hello@sulitscan.com" className="text-green-600 underline hover:text-green-700">
                hello@sulitscan.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
