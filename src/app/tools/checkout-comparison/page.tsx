import type { Metadata } from "next"
import Link from "next/link"
import CheckoutComparisonCalculator from "@/components/CheckoutComparisonCalculator"
import { BreadcrumbJsonLd, FAQJsonLd } from "@/components/SeoJsonLd"
import TrackedSisterSiteLink from "@/components/TrackedSisterSiteLink"
import { siteConfig } from "@/lib/seo"

const pageUrl = `${siteConfig.url}/tools/checkout-comparison`

export const metadata: Metadata = {
  title: "Checkout Price Comparison Tool Philippines",
  description:
    "Compare two online shopping offers by final checkout total, including quantity, shipping, vouchers, payment discounts, fees, and estimated import costs.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Checkout Price Comparison Tool Philippines",
    description:
      "Compare the final total and per-unit cost of two online shopping offers before you buy.",
    url: pageUrl,
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout Price Comparison Tool Philippines",
    description:
      "Compare the final total and per-unit cost of two online shopping offers before you buy.",
    images: [siteConfig.ogImage],
  },
}

const faqItems = [
  {
    question: "Does this tool check live store prices?",
    answer:
      "No. Enter the amounts currently shown in each store's checkout. SulitScan does not monitor or refresh the prices in this calculator.",
  },
  {
    question: "Does the lower total guarantee the better deal?",
    answer:
      "No. The calculation compares entered costs only. Also consider seller reliability, product quality, delivery time, warranty, and return terms.",
  },
  {
    question: "Are my checkout amounts saved?",
    answer:
      "No. The calculation runs in your browser. The completion event contains only the tool source and never includes labels, prices, or entered values.",
  },
  {
    question: "What should I enter for import cost?",
    answer:
      "Use a planning estimate for possible duties, taxes, or handling costs on a cross-border order. Confirm actual charges with official sources and your courier.",
  },
]

export default function CheckoutComparisonPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Checkout comparison tool", url: pageUrl },
        ]}
      />
      <FAQJsonLd items={faqItems} />

      <section className="border-b border-slate-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>Checkout comparison</span>
          </nav>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-700">
            Free shopping utility
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Compare final checkout prices, not headline discounts
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Add the item price, quantity, shipping, discounts, fees, and any import-cost estimate
            for two offers. The calculator shows each final total and per-unit cost so you can make
            a clearer comparison before paying.
          </p>
        </div>
      </section>

      <main className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CheckoutComparisonCalculator />

          <div className="mx-auto mt-16 max-w-4xl space-y-12">
            <section aria-labelledby="formula-heading">
              <h2 id="formula-heading" className="text-2xl font-black text-slate-900">
                How the final-total formula works
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Final total = item price × quantity + shipping + other fees + import cost − voucher
                discount − payment discount. The result cannot go below zero, and the per-unit cost
                is the final total divided by quantity.
              </p>
            </section>

            <section aria-labelledby="compare-heading">
              <h2 id="compare-heading" className="text-2xl font-black text-slate-900">
                What to copy from each checkout
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
                <li>Use the price for the exact size, color, bundle, and quantity you intend to buy.</li>
                <li>Enter only vouchers and payment discounts you can actually apply.</li>
                <li>Include shipping, service charges, insurance, and other visible fees.</li>
                <li>For overseas orders, add a reasonable import-cost estimate when relevant.</li>
              </ul>
              <p className="mt-4 text-slate-600">
                Read more about{" "}
                <Link
                  href="/blog/why-final-prices-change-at-checkout"
                  className="font-semibold text-green-700 underline underline-offset-2"
                >
                  why final prices change at checkout
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="cross-border-heading" className="rounded-2xl bg-amber-50 p-6">
              <h2 id="cross-border-heading" className="text-xl font-black text-slate-900">
                Comparing a cross-border order?
              </h2>
              <p className="mt-3 leading-relaxed text-slate-700">
                Use{" "}
                <TrackedSisterSiteLink
                  href="https://www.importtaxph.com/"
                  destination="importtaxph"
                  sourceSlug="checkout-comparison-tool"
                  placement="checkout-comparison"
                  className="font-semibold text-green-700 underline underline-offset-2"
                >
                  ImportTaxPH
                </TrackedSisterSiteLink>{" "}
                for a planning estimate of possible import costs, then enter that estimate above.
                It is not an official assessment or a guarantee of the final charge. Our{" "}
                <Link
                  href="/blog/philippine-import-tax-guide-online-shoppers"
                  className="font-semibold text-green-700 underline underline-offset-2"
                >
                  Philippine import tax guide
                </Link>{" "}
                explains the factors to check.
              </p>
            </section>

            <section aria-labelledby="limits-heading">
              <h2 id="limits-heading" className="text-2xl font-black text-slate-900">
                Limits of this comparison
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                This tool calculates only the figures you enter. It does not fetch live prices,
                verify voucher eligibility, predict exchange-rate or courier adjustments, or
                guarantee the lowest price. A lower total may still come with slower delivery,
                weaker seller support, different return terms, or a different product variant.
              </p>
            </section>

            <section aria-labelledby="privacy-heading">
              <h2 id="privacy-heading" className="text-2xl font-black text-slate-900">
                Your entries stay in your browser
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Prices and other amounts are calculated on your device and are not saved or included
                in analytics. SulitScan records only that the comparison tool was completed.
              </p>
            </section>

            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-black text-slate-900">
                Frequently asked questions
              </h2>
              <div className="mt-5 space-y-3">
                {faqItems.map((item) => (
                  <details key={item.question} className="rounded-xl border border-slate-200 bg-white p-5">
                    <summary className="cursor-pointer font-bold text-slate-900">{item.question}</summary>
                    <p className="mt-3 leading-relaxed text-slate-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
