import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "SulitScan PH affiliate disclosure. Learn how we earn commissions and how that affects our deal recommendations.",
  alternates: { canonical: `${siteConfig.url}/affiliate-disclosure` },
}

const partners = ["Temu", "Sephora PH (via Involve Asia)"]

export default function AffiliateDisclosurePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home",                 url: siteConfig.url },
          { name: "Affiliate Disclosure", url: `${siteConfig.url}/affiliate-disclosure` },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-amber-50 to-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-amber-700" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-amber-700">
                Legal
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Affiliate Disclosure
              </h1>
              <p className="text-sm text-slate-400">Last updated: June 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10 text-sm text-slate-600 leading-relaxed">
          <section aria-labelledby="disclosure-intro">
            <h2 id="disclosure-intro" className="text-lg font-bold text-slate-900 mb-3">
              How SulitScan PH Earns Money
            </h2>
            <p>
              SulitScan PH participates in affiliate marketing programs. This means that when you
              click certain links on this website and make a purchase, we may earn a commission at
              no additional cost to you.
            </p>
          </section>

          <section aria-labelledby="disclosure-partners">
            <h2 id="disclosure-partners" className="text-lg font-bold text-slate-900 mb-3">
              Our Affiliate Partners
            </h2>
            <p className="mb-4">
              We currently maintain affiliate relationships with the following platforms only:
            </p>
            <div className="flex flex-wrap gap-2">
              {partners.map((p) => (
                <span key={p} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-600">
                  {p}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="disclosure-links">
            <h2 id="disclosure-links" className="text-lg font-bold text-slate-900 mb-3">
              How to Identify Affiliate Links
            </h2>
            <p>
              All external affiliate links on SulitScan PH are labeled with button text like
              &quot;View Deal on [Platform]&quot;. External links use the attributes{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">rel=&quot;sponsored nofollow noopener noreferrer&quot;</code>{" "}
              and open in a new tab.
            </p>
          </section>

          <section aria-labelledby="disclosure-integrity">
            <h2 id="disclosure-integrity" className="text-lg font-bold text-slate-900 mb-3">
              Editorial Integrity
            </h2>
            <p>
              Our affiliate relationships do not influence which deals we feature. We only include
              deals that we believe offer genuine value to Filipino shoppers. Every deal card
              includes a reason note and a SulitScan Score based on honest assessment of deal quality.
            </p>
          </section>

          <section aria-labelledby="disclosure-demo">
            <h2 id="disclosure-demo" className="text-lg font-bold text-slate-900 mb-3">
              Demo Data Notice
            </h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p>
                All deals currently displayed on SulitScan PH are <strong>sample/demo content</strong>.
                Prices shown are illustrative only and may not reflect actual current prices. Always
                check the partner store directly before making a purchase decision.
              </p>
            </div>
          </section>

          <section aria-labelledby="disclosure-compliance">
            <h2 id="disclosure-compliance" className="text-lg font-bold text-slate-900 mb-3">
              Compliance
            </h2>
            <p>
              This disclosure is provided in accordance with the FTC&apos;s guidelines on endorsements
              and testimonials, and similar regulations. We aim to be transparent about all
              commercial relationships that may influence the content on this site.
            </p>
          </section>

          <section aria-labelledby="disclosure-contact">
            <h2 id="disclosure-contact" className="text-lg font-bold text-slate-900 mb-3">
              Questions?
            </h2>
            <p>
              If you have questions about our affiliate relationships or how we evaluate deals,
              please{" "}
              <a href="/contact" className="text-green-600 underline hover:text-green-700">
                contact us
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
