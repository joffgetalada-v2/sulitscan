import { Check } from "lucide-react"

const SIGNALS = [
  "No checkout on SulitScan",
  "Affiliate links disclosed",
  "Confirm final price on the partner store",
  "We don't guarantee the lowest price",
]

/**
 * Compact, honest trust strip for money pages. No fake urgency or claims —
 * reinforces that SulitScan is a guide, not a seller.
 */
export default function TrustBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 ${className}`}
      role="note"
      aria-label="How SulitScan works"
    >
      {SIGNALS.map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" aria-hidden="true" />
          {s}
        </span>
      ))}
    </div>
  )
}
