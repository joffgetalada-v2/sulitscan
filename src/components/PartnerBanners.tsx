import Image from "next/image"
import { ExternalLink, Megaphone } from "lucide-react"
import type { PartnerBanner } from "@/data/partner-banners"

interface PartnerBannersProps {
  /** Heading text, e.g. "Featured partner offers" */
  title: string
  /** Optional supporting line under the heading */
  subtitle?: string
  banners: PartnerBanner[]
  /** Unique id used to label the section for assistive tech */
  headingId: string
}

const DISCLAIMER =
  "SulitScan may earn a commission when you visit partner stores through these links. Always confirm prices, shipping, availability, and return terms on the partner site."

export default function PartnerBanners({ title, subtitle, banners, headingId }: PartnerBannersProps) {
  if (banners.length === 0) return null

  return (
    <section aria-labelledby={headingId}>
      <div className="flex items-center gap-2 mb-1.5">
        <Megaphone className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-widest uppercase text-green-700">Sponsored</span>
      </div>
      <h2 id={headingId} className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-slate-500 text-sm max-w-2xl">{subtitle}</p>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {banners.map((b) => (
          <a
            key={b.id}
            href={b.href}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            aria-label={`${b.advertiserName}: ${b.title}, sponsored partner, opens in a new tab`}
            className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {/* Banner image */}
            <div className="relative overflow-hidden bg-slate-100">
              <Image
                src={b.imageSrc}
                alt={b.imageAlt}
                width={1731}
                height={909}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full">
                <Megaphone className="w-2.5 h-2.5" aria-hidden="true" />
                Sponsored partner
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
              <span className="text-xs font-semibold text-slate-400">{b.category}</span>
              <h3 className="mt-0.5 text-sm font-bold text-slate-900 leading-snug group-hover:text-green-700 transition-colors">
                {b.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">{b.description}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-green-600 group-hover:gap-2 transition-all">
                {b.ctaLabel}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400 leading-relaxed max-w-3xl">{DISCLAIMER}</p>
    </section>
  )
}
