import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function ArticleTrustPanel() {
  return (
    <section
      aria-labelledby="about-this-guide"
      className="mb-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-5"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
        <div>
          <h2 id="about-this-guide" className="text-sm font-bold text-slate-900">
            About this guide
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            The SulitScan editorial team prepares buyer guides using desk-researched product
            information, primary guidance where available, and practical pre-purchase checks.
            We do not claim hands-on testing unless an article explicitly says a product was tested.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
            <Link href="/about" className="text-blue-700 hover:underline">About SulitScan</Link>
            <Link href="/editorial-policy" className="text-blue-700 hover:underline">Editorial process</Link>
            <Link href="/contact" className="text-blue-700 hover:underline">Request a correction</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
