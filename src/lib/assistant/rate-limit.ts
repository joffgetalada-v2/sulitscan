/**
 * Sliding-window rate limiter for the Sulit Assistant, keyed per visitor.
 * In-memory by design: on serverless hosting each instance keeps its own
 * window, so this is a cost/abuse damper rather than a hard global quota —
 * acceptable for a free chat widget where the real backstop is the Anthropic
 * account's own spend limits.
 */

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 10
// Prevent unbounded memory growth from many unique IPs on a long-lived server.
const MAX_TRACKED_VISITORS = 5_000

const requestLog = new Map<string, number[]>()

export function isRateLimited(visitorKey: string, now: number = Date.now()): boolean {
  const cutoff = now - WINDOW_MS
  const recent = (requestLog.get(visitorKey) ?? []).filter((timestamp) => timestamp > cutoff)

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(visitorKey, recent)
    return true
  }

  if (requestLog.size >= MAX_TRACKED_VISITORS && !requestLog.has(visitorKey)) {
    // Drop the stalest entries rather than refuse new visitors.
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => timestamp <= cutoff)) requestLog.delete(key)
      if (requestLog.size < MAX_TRACKED_VISITORS) break
    }
  }

  requestLog.set(visitorKey, [...recent, now])
  return false
}

/** Test hook: clear all tracked windows. */
export function resetRateLimiter(): void {
  requestLog.clear()
}
