import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

export interface StoreBannerItem {
  storeName: string
  /** Optional — when absent, a gradient fallback with the store name is shown. */
  imageSrc?: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  /** Internal store-detail page, e.g. /stores/temu */
  detailHref: string
  /** External affiliate URL from store data; button hidden when undefined. */
  visitHref?: string
  /** Tailwind gradient classes used for the image fallback. */
  gradient: string
}

interface StoreHeroBannerProps {
  title: string
  description: string
  items: StoreBannerItem[]
  disclosureText: string
  headingId: string
}

export default function StoreHeroBanner({
  title,
  description,
  items,
  disclosureText,
  headingId,
}: StoreHeroBannerProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby={headingId} className="mb-12">
      <h2 id={headingId} className="text-2xl font-black text-slate-900 tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-2xl">{description}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <div
            key={item.storeName}
            className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Banner image (or gradient fallback) */}
            <div className="relative bg-slate-100">
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto"
                  priority={i === 0}
                />
              ) : (
                <div
                  className={`flex items-center justify-center w-full bg-gradient-to-br ${item.gradient}`}
                  style={{ aspectRatio: `${item.imageWidth} / ${item.imageHeight}` }}
                  aria-hidden="true"
                >
                  <span className="text-2xl font-black text-white">{item.storeName}</span>
                </div>
              )}
            </div>

            {/* Real, accessible buttons (not relying on text inside the image) */}
            <div className="flex flex-wrap items-center gap-2.5 p-4">
              <Link
                href={item.detailHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                View {item.storeName} store details
                <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </Link>
              {item.visitHref && (
                <a
                  href={item.visitHref}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  aria-label={`Visit ${item.storeName} (affiliate link, opens in a new tab)`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 hover:text-green-700 hover:border-green-200 text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  Visit {item.storeName}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-400 leading-relaxed max-w-3xl">{disclosureText}</p>
    </section>
  )
}
