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
              <p className="text-sm text-slate-400">Last updated: June 2026</p>
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
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Cookies We Use</h2>
            <p className="mb-3">SulitScan PH uses a limited number of cookies:</p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Analytics Cookies</h3>
                <p className="text-xs text-slate-500">
                  We use <strong>Vercel Analytics</strong> to understand how visitors use the site, such as
                  which pages are most visited and how users navigate. This data is aggregated and does not
                  personally identify you. Vercel Analytics is privacy-focused and does not use third-party
                  advertising cookies.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Strictly Necessary</h3>
                <p className="text-xs text-slate-500">
                  Session and preference cookies required for the website to function. These cannot be
                  disabled without breaking site functionality.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Affiliate Tracking</h3>
                <p className="text-xs text-slate-500">
                  When you click an affiliate link to Temu or Sephora PH, those partner sites may set their
                  own tracking cookies to attribute the referral. SulitScan does not control third-party
                  cookies. Refer to{" "}
                  <a href="https://www.temu.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Temu&apos;s Privacy Policy</a> and{" "}
                  <a href="https://www.sephora.ph/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Sephora PH&apos;s Privacy Policy</a> for details.
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h3 className="text-sm font-semibold text-amber-800 mb-1">Advertising Cookies (Possible Future Use)</h3>
                <p className="text-xs text-amber-700">
                  SulitScan PH does not currently run display advertising. If we add Google AdSense or a
                  similar ad network in the future, this policy will be updated and we will add a cookie
                  consent notice before enabling advertising cookies.
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
