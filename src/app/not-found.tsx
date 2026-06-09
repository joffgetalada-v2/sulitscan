import Link from "next/link"
import { ArrowLeft, Search, ShoppingBag, BookOpen, Mail } from "lucide-react"

export const metadata = {
  title: "Page Not Found | SulitScan PH",
  description: "The page you're looking for doesn't exist. Browse deals, guides, or contact us.",
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <p className="text-8xl font-black text-slate-100 leading-none select-none mb-2" aria-hidden="true">
          404
        </p>
        <h1 className="text-2xl font-black text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Try one of these instead:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href="/deals"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all group"
          >
            <ShoppingBag className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Browse Deals</span>
          </Link>
          <Link
            href="/categories"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all group"
          >
            <Search className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Categories</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all group"
          >
            <BookOpen className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Shopping Guides</span>
          </Link>
          <Link
            href="/contact"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all group"
          >
            <Mail className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Contact Us</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
