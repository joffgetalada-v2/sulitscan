export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "…"
}

export function getSulitScoreColor(score: number): string {
  if (score >= 9) return "text-green-600"
  if (score >= 7) return "text-emerald-500"
  if (score >= 5) return "text-amber-500"
  return "text-red-500"
}

export function getSulitScoreBg(score: number): string {
  if (score >= 9) return "bg-green-100 text-green-700 border-green-200"
  if (score >= 7) return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (score >= 5) return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-red-50 text-red-700 border-red-200"
}

export function dealPlural(count: number): string {
  return count === 1 ? "1 deal" : `${count} deals`
}

export function getSulitScoreLabel(score: number): string {
  if (score >= 9) return "Excellent"
  if (score >= 7) return "Good Deal"
  if (score >= 5) return "Decent"
  return "Check First"
}
