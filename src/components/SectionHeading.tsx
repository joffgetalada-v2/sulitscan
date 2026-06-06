import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  tag?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
  id?: string
}

export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = "center",
  className,
  id,
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
        <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 border border-green-100 rounded-full">
          {tag}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          "text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-base text-slate-500 leading-relaxed",
            align === "center" && "max-w-2xl mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
