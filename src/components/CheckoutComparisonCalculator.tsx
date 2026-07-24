"use client"

import { useState, type FormEvent } from "react"
import { track } from "@vercel/analytics/react"
import {
  calculateCheckoutOffer,
  compareCheckoutOffers,
  type CheckoutOfferInput,
  type CheckoutOfferResult,
} from "@/lib/checkout-comparison"

type OfferValues = Record<keyof CheckoutOfferInput, string>

interface ComparisonResult {
  a: CheckoutOfferResult
  b: CheckoutOfferResult
  winner: "a" | "b" | "tie"
  difference: number
}

const emptyOffer: OfferValues = {
  itemPrice: "",
  quantity: "1",
  shipping: "",
  voucherDiscount: "",
  paymentDiscount: "",
  otherFees: "",
  importCost: "",
}

const fields: Array<{
  key: keyof CheckoutOfferInput
  label: string
  hint?: string
  step: string
}> = [
  { key: "itemPrice", label: "Item price", step: "0.01" },
  { key: "quantity", label: "Quantity", step: "1" },
  { key: "shipping", label: "Shipping", step: "0.01" },
  { key: "voucherDiscount", label: "Voucher discount", step: "0.01" },
  { key: "paymentDiscount", label: "Payment discount", step: "0.01" },
  { key: "otherFees", label: "Other fees", step: "0.01" },
  {
    key: "importCost",
    label: "Import cost estimate",
    hint: "Optional planning estimate",
    step: "0.01",
  },
]

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function parseOffer(values: OfferValues): CheckoutOfferInput {
  return {
    itemPrice: Number(values.itemPrice),
    quantity: Number(values.quantity),
    shipping: Number(values.shipping),
    voucherDiscount: Number(values.voucherDiscount),
    paymentDiscount: Number(values.paymentDiscount),
    otherFees: Number(values.otherFees),
    importCost: Number(values.importCost),
  }
}

function OfferFields({
  name,
  values,
  onChange,
}: {
  name: "A" | "B"
  values: OfferValues
  onChange: (key: keyof CheckoutOfferInput, value: string) => void
}) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <legend className="px-2 text-lg font-black text-slate-900">Offer {name}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `offer-${name.toLowerCase()}-${field.key}`
          return (
            <div key={field.key} className={field.key === "itemPrice" ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
                {field.label}
              </label>
              <div className="relative">
                {field.key !== "quantity" && (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400"
                    aria-hidden="true"
                  >
                    ₱
                  </span>
                )}
                <input
                  id={id}
                  name={`offer-${name.toLowerCase()}-${field.key}`}
                  type="number"
                  min="0"
                  step={field.step}
                  inputMode={field.key === "quantity" ? "numeric" : "decimal"}
                  value={values[field.key]}
                  onChange={(event) => onChange(field.key, event.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-3 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 ${
                    field.key === "quantity" ? "pl-3" : "pl-8"
                  }`}
                  aria-describedby={field.hint ? `${id}-hint` : undefined}
                />
              </div>
              {field.hint && (
                <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
                  {field.hint}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function CheckoutComparisonCalculator() {
  const [offerA, setOfferA] = useState<OfferValues>({ ...emptyOffer })
  const [offerB, setOfferB] = useState<OfferValues>({ ...emptyOffer })
  const [result, setResult] = useState<ComparisonResult | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const inputA = parseOffer(offerA)
    const inputB = parseOffer(offerB)
    const comparison = compareCheckoutOffers(inputA, inputB)

    setResult({
      a: calculateCheckoutOffer(inputA),
      b: calculateCheckoutOffer(inputB),
      ...comparison,
    })

    try {
      track("checkout_comparison_completed", { source: "checkout-comparison-tool" })
    } catch {
      // Analytics must never prevent an on-device comparison.
    }
  }

  const winnerMessage = result
    ? result.winner === "tie"
      ? "Both offers have the same final total."
      : `Offer ${result.winner.toUpperCase()} costs ${currencyFormatter.format(result.difference)} less.`
    : ""

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <OfferFields
          name="A"
          values={offerA}
          onChange={(key, value) => setOfferA((current) => ({ ...current, [key]: value }))}
        />
        <OfferFields
          name="B"
          values={offerB}
          onChange={(key, value) => setOfferB((current) => ({ ...current, [key]: value }))}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-500/20 transition hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Compare final totals
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`rounded-2xl border p-5 sm:p-6 ${
          result ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        {result ? (
          <>
            <p className="text-lg font-black text-slate-900">{winnerMessage}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["a", "b"] as const).map((offer) => (
                <div key={offer} className="rounded-xl bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Offer {offer.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900">
                    {currencyFormatter.format(result[offer].total)} total
                  </p>
                  <p className="text-sm text-slate-600">
                    {currencyFormatter.format(result[offer].perUnit)} per unit
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Enter the amounts shown at checkout. Your figures stay in this browser and are not sent
            with analytics.
          </p>
        )}
      </div>
    </form>
  )
}
