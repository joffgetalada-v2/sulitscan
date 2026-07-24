export interface CheckoutOfferInput {
  itemPrice: number
  quantity: number
  shipping: number
  voucherDiscount: number
  paymentDiscount: number
  otherFees: number
  importCost: number
}

export interface CheckoutOfferResult {
  subtotal: number
  total: number
  perUnit: number
}

const MAX_NORMALIZED_INPUT = Number.MAX_SAFE_INTEGER

function nonNegativeFinite(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_NORMALIZED_INPUT, Math.max(0, value)) : 0
}

function normalizeQuantity(value: number): number {
  const quantity = Math.floor(nonNegativeFinite(value))
  return quantity || 1
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON * Math.max(1, Math.abs(value))) * 100) / 100
}

export function calculateCheckoutOffer(input: CheckoutOfferInput): CheckoutOfferResult {
  const itemPrice = nonNegativeFinite(input.itemPrice)
  const quantity = normalizeQuantity(input.quantity)
  const shipping = nonNegativeFinite(input.shipping)
  const voucherDiscount = nonNegativeFinite(input.voucherDiscount)
  const paymentDiscount = nonNegativeFinite(input.paymentDiscount)
  const otherFees = nonNegativeFinite(input.otherFees)
  const importCost = nonNegativeFinite(input.importCost)
  const subtotal = roundCurrency(itemPrice * quantity)
  const total = roundCurrency(
    Math.max(
      0,
      itemPrice * quantity + shipping + otherFees + importCost - voucherDiscount - paymentDiscount
    )
  )

  return {
    subtotal,
    total,
    perUnit: roundCurrency(total / quantity),
  }
}

export function compareCheckoutOffers(
  a: CheckoutOfferInput,
  b: CheckoutOfferInput
): { winner: "a" | "b" | "tie"; difference: number } {
  const aTotal = calculateCheckoutOffer(a).total
  const bTotal = calculateCheckoutOffer(b).total

  if (aTotal === bTotal) {
    return { winner: "tie", difference: 0 }
  }

  return {
    winner: aTotal < bTotal ? "a" : "b",
    difference: roundCurrency(Math.abs(aTotal - bTotal)),
  }
}
