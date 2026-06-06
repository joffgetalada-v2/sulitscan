import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  tag?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {tag && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-widest text-green-700 uppercase bg-green-100 rounded-full">
          {tag}
        </span>
      )}
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
