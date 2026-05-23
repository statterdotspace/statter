import { forwardRef } from "react"
import { cn } from "@/shared/lib/utils"

export const IncidentIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
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
        d="M12 12v4"
        className="transition-all duration-300 group-hover:-translate-x-[7px] group-hover:-translate-y-3 group-hover:scale-[160%]"
      />
      <path
        d="M12 20h.01"
        className="transition-all duration-300 group-hover:-translate-x-[7px] group-hover:-translate-y-3 group-hover:scale-[160%]"
      />
      <path
        d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708"
        className="transition-all duration-300 group-hover:opacity-10"
      />
    </svg>
  )
)

IncidentIcon.displayName = "IncidentIcon"
