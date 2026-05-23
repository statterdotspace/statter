import { forwardRef } from "react"
import { cn } from "@/shared/lib/utils"

export const ServerIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
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
        d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
        className="transition-all group-hover:-translate-y-1 group-hover:scale-105"
      />
      <path
        d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"
        className="transition-all group-hover:opacity-0"
      />
    </svg>
  )
)

ServerIcon.displayName = "ServicesIcon"
