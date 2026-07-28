import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbJsonLd } from "@/components/SeoJsonLd"
import { siteConfig } from "@/lib/seo"
import { Cookie } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "SulitScan PH cookie policy. How we use cookies and similar technologies on this site.",
  alternates: { canonical: `${siteConfig.url}/cookie-policy` },
}

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Cookie Policy", url: `${siteConfig.url}/cookie-policy` },
        ]}
      />

      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-amber-600" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block mb-2 text-xs font-semibold tracking-widest uppercase text-amber-700">
                Legal
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Cookie Policy</h1>
              <p className="text-sm text-slate-400">Last updated: July 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that a website places on your device when you visit. They help the
              site remember information about your visit, such as your preferred language, and can make your
              next visit easier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Cookies and Similar Technologies</h2>
            <p className="mb-3">
              SulitScan does not currently set its own first-party cookies. The following explains our
              cookie-free analytics and when third parties may use cookies or similar technologies.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Cookie-Free Analytics</h3>
                <p className="text-xs text-slate-500">
                  We use <strong>Vercel Analytics</strong> to understand how visitors use the site, such as
                  which pages are most visited and how users navigate. This data is aggregated and does not
                  personally identify you. Vercel Analytics does not use cookies.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Site-Operated Cookies</h3>
                <p className="text-xs text-slate-500">
                  SulitScan does not currently set its own session or preference cookies. If this changes,
                  this policy will be updated to describe their purpose and available controls.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Affiliate Tracking</h3>
                <p className="text-xs text-slate-500">
                  When you click a link marked as affiliate or sponsored, the destination website or an
                  affiliate network, including Involve Asia where applicable, may set cookies or use
                  similar technology to attribute the referral. SulitScan does not set those third-party
                  cookies before you click and does not control them. See our{" "}
                  <Link href="/affiliate-disclosure" className="text-green-600 underline">Affiliate Disclosure</Link>{" "}
                  for the current commercial relationships.
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-800 mb-1">Google AdSense Advertising Cookies</h3>
                <p className="text-xs text-amber-700 mb-2">
                  When Google AdSense advertising is activated on full editorial articles, Google and its
                  partners may use cookies or similar technologies to serve, measure, secure, and limit
                  ads. Personalized ads may use information from your visit when your location and consent
                  choices permit it; otherwise Google may serve non-personalized or limited ads.
                </p>
                <p className="text-xs text-amber-700">
                  SulitScan will not enable AdSense serving where consent is required until a
                  Google-certified consent management platform is configured, including for visitors in
                  the EEA, United Kingdom, and Switzerland. You can also manage Google advertising choices in{" "}
                  <a
                    href="https://myadcenter.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Google Ad Settings
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. How to Control Cookies</h2>
            <p className="mb-3">
              You can control or delete cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "Block all cookies (may break some site features)",
                "Delete existing cookies",
                "Allow cookies only from specific websites",
                "Be notified when a cookie is set",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Learn how to manage cookies in your browser:{" "}
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Chrome
              </a>
              ,{" "}
              <a
                href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Firefox
              </a>
              ,{" "}
              <a
                href="https://support.apple.com/en-ph/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-700"
              >
                Safari
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy when we change the technologies or services we use. The
              &quot;last updated&quot; date at the top will reflect any changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Contact</h2>
            <p>
              For questions about how we use cookies, email us at{" "}
              <a href="mailto:hello@sulitscan.com" className="text-green-600 underline hover:text-green-700">
                hello@sulitscan.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-green-600 underline hover:text-green-700">
                Contact page
              </Link>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              See also:{" "}
              <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>
              {" · "}
              <Link href="/affiliate-disclosure" className="underline hover:text-slate-600">Affiliate Disclosure</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
