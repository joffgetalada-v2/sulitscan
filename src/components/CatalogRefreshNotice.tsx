import Link from "next/link"

interface CatalogRefreshNoticeProps {
  heading?: string
  context?: string
  guides?: { slug: string; title: string }[]
}

export default function CatalogRefreshNotice({
  heading = "Verified listings are being refreshed",
  context = "No verified listings are currently within our freshness window. Use our buyer guides and checkout tool while the catalog is being refreshed.",
  guides = [],
}: CatalogRefreshNoticeProps) {
  return (
    <section aria-label={heading} className="rounded-2xl border border-green-100 bg-green-50 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">{heading}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{context}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Always confirm live prices, product availability, shipping fees, vouchers, and return terms at the partner store before buying.
      </p>
      {guides.length > 0 && (
        <ul className="mt-4 space-y-2">
          {guides.map((guide) => (
            <li key={guide.slug}><Link href={`/blog/${guide.slug}`} className="text-sm font-semibold text-green-800 hover:underline">{guide.title} →</Link></li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/blog" className="rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800">Browse buyer guides</Link>
        <Link href="/tools/checkout-comparison" className="rounded-xl border border-green-200 bg-white px-4 py-3 text-sm font-semibold text-green-800 hover:bg-green-100">Compare a checkout total</Link>
      </div>
      <nav aria-label="Partner store information" className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-green-800">
        <Link href="/stores/temu" className="hover:underline">Temu store guide →</Link>
        <Link href="/stores/shopee-ph" className="hover:underline">Shopee PH store guide →</Link>
        <Link href="/stores/sephora-ph" className="hover:underline">Sephora PH store guide →</Link>
      </nav>
    </section>
  )
}
