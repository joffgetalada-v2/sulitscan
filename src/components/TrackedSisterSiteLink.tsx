"use client"

import type { AnchorHTMLAttributes } from "react"
import { track } from "@vercel/analytics/react"

interface TrackedSisterSiteLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  destination: "importtaxph" | "applyreadycv"
  sourceSlug: string
  placement: string
}

export default function TrackedSisterSiteLink({
  href,
  destination,
  sourceSlug,
  placement,
  children,
  onClick,
  ...rest
}: TrackedSisterSiteLinkProps) {
  const url = new URL(href)
  url.searchParams.set("utm_source", "sulitscan")
  url.searchParams.set("utm_medium", "referral")
  url.searchParams.set("utm_campaign", "cross_site")
  url.searchParams.set("utm_content", `${sourceSlug}:${placement}`)

  return (
    <a
      {...rest}
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        try {
          track("sister_site_click", {
            destination,
            placement,
            source: sourceSlug,
          })
        } catch {
          // Analytics must never prevent outbound navigation.
        }
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
}
