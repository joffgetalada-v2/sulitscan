import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoMarkProps {
  size?: number
  className?: string
}

export function LogoMark({ size = 36, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="10" fill="#16a34a" />
      <path d="M9 16V9H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 16V9H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 24V31H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 24V31H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 20L18 23L25 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  dark?: boolean
  size?: "sm" | "md" | "lg"
  hideText?: boolean
  href?: string
}

export default function Logo({ className, dark = false, size = "md", hideText = false, href = "/" }: LogoProps) {
  const markSizes = { sm: 28, md: 36, lg: 44 }
  const textSizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" }

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 group shrink-0", className)}
      aria-label="SulitScan PH — home"
    >
      <LogoMark
        size={markSizes[size]}
        className="group-hover:opacity-90 transition-opacity shrink-0"
      />
      {!hideText && (
        <span
          className={cn(
            textSizes[size],
            "font-bold tracking-tight select-none",
            dark ? "text-white" : "text-slate-900"
          )}
        >
          Sulit<span className="text-green-500">Scan</span>
          <span className={cn("font-normal text-[0.7em]", dark ? "text-slate-400" : "text-slate-400")}> PH</span>
        </span>
      )}
    </Link>
  )
}
