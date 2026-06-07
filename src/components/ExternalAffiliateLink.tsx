import type { AnchorHTMLAttributes } from "react"

interface ExternalAffiliateLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  platform: string
}

/**
 * Use this component for every outbound affiliate CTA.
 * It enforces: target="_blank" rel="sponsored nofollow noopener noreferrer"
 * Never use raw <a> for affiliate links — this wrapper prevents accidental omissions.
 */
export function ExternalAffiliateLink({
  href,
  platform,
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: ExternalAffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={ariaLabel ?? `${String(children)} — opens on ${platform} (affiliate link, new tab)`}
      className={className}
      {...rest}
    >
      {children}
    </a>
  )
}
