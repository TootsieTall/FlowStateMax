import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-warm-lg text-sm font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-sunset-500 to-sunset-600 text-white shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5",
        secondary: "bg-sand-400 text-bark-500 shadow-warm-sm hover:bg-sand-500 hover:shadow-warm-md hover:-translate-y-0.5",
        ghost: "text-bark-400 hover:bg-dawn-200 hover:text-sunset-500",
        success: "bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-warm-md hover:shadow-glow-gold",
        outline: "border-2 border-border-DEFAULT bg-white text-bark-500 hover:border-sunset-400 hover:bg-sunset-50",
        link: "text-sunset-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-warm-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

