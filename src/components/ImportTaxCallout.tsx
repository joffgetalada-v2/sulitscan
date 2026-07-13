import { Calculator } from "lucide-react"
import TrackedSisterSiteLink from "@/components/TrackedSisterSiteLink"

interface ImportTaxCalloutProps {
  sourceSlug: string
  platform?: "temu" | "general"
  placement?: string
}

/**
 * Callout to ImportTaxPH (our free sister tool) for overseas-shopping pages.
 * Not an affiliate link, uses a normal external rel.
 */
export default function ImportTaxCallout({
  sourceSlug,
  platform = "general",
  placement = "import-tax-callout",
}: ImportTaxCalloutProps) {
  const href = platform === "temu"
    ? "https://importtaxph.com/temu-import-tax"
    : "https://importtaxph.com/"

  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
      <Calculator className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong>Ordering from overseas?</strong> Use{" "}
          <TrackedSisterSiteLink
            href={href}
            sourceSlug={sourceSlug}
            placement={placement}
            className="text-blue-700 font-semibold underline hover:text-blue-800"
          >
            ImportTaxPH
          </TrackedSisterSiteLink>{" "}
          to estimate possible customs duty, VAT, and total landed cost before you buy.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Our free sister tool, estimates only, not a Bureau of Customs assessment.
        </p>
      </div>
    </div>
  )
}
