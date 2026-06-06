import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Privacy Policy | SulitScan PH",
  description: "SulitScan PH privacy policy. How we collect, use, and protect your information.",
  alternates: { canonical: `${siteConfig.url}/privacy-policy` },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy-policy` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: June 2025</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              SulitScan PH may collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Usage data:</strong> Pages visited, clicks, and navigation patterns (via
                analytics tools).
              </li>
              <li>
                <strong>Contact information:</strong> Name and email if you contact us through our
                contact form.
              </li>
              <li>
                <strong>Cookies:</strong> Basic session cookies and analytics cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To improve the website and curate better deals</li>
              <li>To respond to contact form submissions</li>
              <li>To analyze site performance and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Third-Party Links</h2>
            <p>
              SulitScan PH contains affiliate links to third-party websites (Shopee, Lazada, etc.).
              We are not responsible for the privacy practices of those websites. We encourage you
              to read the privacy policies of any third-party site you visit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Cookies</h2>
            <p>
              We use cookies to improve user experience and analyze site traffic. You can disable
              cookies in your browser settings, though some features may not function correctly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no
              internet transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Children&apos;s Privacy</h2>
            <p>
              SulitScan PH is not directed at children under 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this
              page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Contact</h2>
            <p>
              For privacy questions, email us at{" "}
              <a href="mailto:hello@sulitscan.com" className="text-green-600 underline">
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
