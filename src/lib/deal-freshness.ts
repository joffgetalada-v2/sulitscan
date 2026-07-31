export const CURRENT_DEAL_MAX_AGE_DAYS = 14
export const REFERENCE_DEAL_MAX_AGE_DAYS = 90

export type DealFreshnessStatus = "current" | "reference" | "expired"

export type ParsedDealLastChecked =
  | { kind: "exact"; date: Date }
  | { kind: "month"; year: number; month: number }

export interface DealFreshness {
  status: DealFreshnessStatus
  parsed?: ParsedDealLastChecked
}

const MONTHS = new Map([
  ["january", 0], ["february", 1], ["march", 2], ["april", 3],
  ["may", 4], ["june", 5], ["july", 6], ["august", 7],
  ["september", 8], ["october", 9], ["november", 10], ["december", 11],
])

function utcCalendarDay(date: Date): number | undefined {
  if (!Number.isFinite(date.getTime())) return undefined
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function parseMonth(monthName: string): number | undefined {
  return MONTHS.get(monthName.toLowerCase())
}

export function parseDealLastChecked(lastChecked: string): ParsedDealLastChecked | undefined {
  const exactMatch = /\bchecked\s+([a-z]+)\s+(\d{1,2}),\s*(\d{4})\b/i.exec(lastChecked)
  if (exactMatch) {
    const month = parseMonth(exactMatch[1])
    const day = Number(exactMatch[2])
    const year = Number(exactMatch[3])
    if (month === undefined) return undefined

    const date = new Date(Date.UTC(year, month, day))
    if (date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day) {
      return { kind: "exact", date }
    }
    return undefined
  }

  const monthMatch = /\b([a-z]+)\s+(\d{4})\b/i.exec(lastChecked)
  if (!monthMatch) return undefined

  const month = parseMonth(monthMatch[1])
  const year = Number(monthMatch[2])
  if (month === undefined) return undefined
  return { kind: "month", year, month }
}

export function getDealFreshness(lastChecked: string, now = new Date()): DealFreshness {
  const parsed = parseDealLastChecked(lastChecked)
  const today = utcCalendarDay(now)
  if (!parsed || today === undefined) return { status: "expired", parsed }

  if (parsed.kind === "exact") {
    const checkedDay = utcCalendarDay(parsed.date)
    if (checkedDay === undefined) return { status: "expired", parsed }

    const age = Math.round((today - checkedDay) / 86_400_000)
    if (age < 0 || age > REFERENCE_DEAL_MAX_AGE_DAYS) return { status: "expired", parsed }
    return {
      status: age <= CURRENT_DEAL_MAX_AGE_DAYS ? "current" : "reference",
      parsed,
    }
  }

  const firstDay = Date.UTC(parsed.year, parsed.month, 1)
  const finalDay = Date.UTC(parsed.year, parsed.month + 1, 0)
  if (today < firstDay || today - finalDay > REFERENCE_DEAL_MAX_AGE_DAYS * 86_400_000) {
    return { status: "expired", parsed }
  }
  return { status: "reference", parsed }
}

export function isDealExpired(deal: Pick<{ lastChecked: string }, "lastChecked">, now = new Date()): boolean {
  return getDealFreshness(deal.lastChecked, now).status === "expired"
}

const PRICE_SENSITIVE_REASON = /(?:₱\s?\d|\b\d+(?:\.\d+)?\s*%|\b(?:price|discounts?|save|saves|saved|saving|costs?)\b)/i

export function getFreshnessSafeReason(
  deal: Pick<{ lastChecked: string; reason: string; category: string; platform: string }, "lastChecked" | "reason" | "category" | "platform">,
  now = new Date()
): string {
  if (getDealFreshness(deal.lastChecked, now).status === "current" || !PRICE_SENSITIVE_REASON.test(deal.reason)) {
    return deal.reason
  }
  return `Explore ${deal.category} options from ${deal.platform} and review the live listing, seller details, and delivery terms before buying.`
}
