import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-warm-lg border border-border-DEFAULT bg-white px-3 py-2 text-sm text-bark-500 placeholder:text-bark-200 focus:outline-none focus:ring-2 focus:ring-sunset-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-fast",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

