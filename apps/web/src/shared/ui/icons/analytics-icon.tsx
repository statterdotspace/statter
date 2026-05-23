import { forwardRef } from "react"
import { cn } from "@/shared/lib/utils"

export const AnalyticsIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      {...props}
      className={cn("size-6", className)}
    >
      <path
        d="M5 21v-6"
        className="bar bar-1 origin-bottom group-hover:animate-[wave_0.75s_ease-in-out_infinite]"
      />
      <path
        d="M12 21V3"
        className="bar bar-2 origin-bottom group-hover:animate-[wave_0.75s_ease-in-out_infinite_0.2s]"
      />
      <path
        d="M19 21V9"
        className="bar bar-3 origin-bottom group-hover:animate-[wave_0.75s_ease-in-out_infinite_0.4s]"
      />
      <style>{`
        @keyframes wave {
          0%,100% { transform: scaleY(1); }
          50% { transform: scaleY(1.4); }
        }
      `}</style>
    </svg>
  )
)

AnalyticsIcon.displayName = "AnalyticsIcon"
