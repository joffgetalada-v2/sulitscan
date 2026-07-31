"use client"

import type { AnchorHTMLAttributes } from "react"
import { track } from "@vercel/analytics/react"

interface ExternalAffiliateLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  platform: string
  placement?: string
  offerId?: string
  position?: number
}

/**
 * Use this component for every outbound affiliate CTA.
 * It enforces: target="_blank" rel="sponsored nofollow noopener noreferrer"
 * Never use raw <a> for affiliate links, this wrapper prevents accidental omissions.
 */
export function ExternalAffiliateLink({
  href,
  platform,
  placement,
  offerId,
  position,
  children,
  className,
  "aria-label": ariaLabel,
  onClick,
  ...rest
}: ExternalAffiliateLinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    try {
      const source = window.location.pathname.split("/").filter(Boolean).pop() ?? "home"
      track("affiliate_click", {
        platform,
        placement: placement ?? "affiliate-link",
        source,
        ...(offerId !== undefined ? { offerId } : {}),
        ...(position !== undefined ? { position } : {}),
      })
    } catch {
      // Analytics must never prevent outbound navigation.
    }
    onClick?.(event)
  }

  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={ariaLabel ?? `${String(children)}, opens on ${platform} (affiliate link, new tab)`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
