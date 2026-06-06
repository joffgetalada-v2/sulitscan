import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms of Use | SulitScan PH",
  description: "SulitScan PH terms of use. How to use this site responsibly and what our limitations are.",
  alternates: { canonical: `${siteConfig.url}/terms` },
}

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Terms of Use", url: `${siteConfig.url}/terms` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Terms of Use</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: June 2025</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing SulitScan PH (&quot;the Site&quot;), you agree to these Terms of Use. If you do not
              agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Nature of the Site</h2>
            <p>
              SulitScan PH is a deals aggregation and affiliate marketing website. We do not sell
              products directly, process payments, or hold inventory. All purchases occur on
              third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Affiliate Links</h2>
            <p>
              Some links on this site are affiliate links. Clicking them and making a purchase may
              result in a commission being paid to SulitScan PH. This does not affect the price you
              pay. See our{" "}
              <a href="/affiliate-disclosure" className="text-green-600 underline">
                Affiliate Disclosure
              </a>{" "}
              for more details.
            </p>
          </section>

          <section id="disclaimer">
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Disclaimer</h2>
            <p className="mb-3">
              All deals, prices, and information on SulitScan PH are provided for informational
              purposes only. We make no guarantees about:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The accuracy or completeness of deal information</li>
              <li>The availability of deals at the time you click</li>
              <li>The quality of products or services offered by third-party sellers</li>
              <li>The security or privacy practices of linked third-party sites</li>
            </ul>
            <p className="mt-3">
              <strong>All prices shown on this site are sample/demo data.</strong> Always verify
              prices and deal terms directly on the partner platform before purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
            <p>
              SulitScan PH is not liable for any direct, indirect, incidental, or consequential
              damages arising from your use of this site or any linked third-party sites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Intellectual Property</h2>
            <p>
              All content on SulitScan PH, including text, design, and code, is owned by or
              licensed to SulitScan PH. Do not reproduce or distribute without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Changes</h2>
            <p>
              We may update these terms at any time. Continued use of the site constitutes
              acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of the Philippines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact</h2>
            <p>
              Questions? Email us at{" "}
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
