
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    getFillColor?: (value: number) => string
  }
>(({ className, value = 0, max = 100, getFillColor, ...props }, ref) => {
  const percentage = (value / max) * 100
  
  // Default color or dynamic color based on value
  const fillColor = getFillColor 
    ? getFillColor(value) 
    : value > 66 
    ? "var(--primary)" 
    : value > 33 
    ? "var(--warning)" 
    : "var(--destructive)"
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ 
          transform: `translateX(-${100 - percentage}%)`,
          backgroundColor: fillColor
        }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
