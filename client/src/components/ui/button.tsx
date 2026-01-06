import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "luxury-btn bg-primary text-primary-foreground border border-primary-border shadow-md hover:shadow-lg",
        destructive:
          "luxury-btn bg-destructive text-destructive-foreground border border-destructive-border shadow-md hover:shadow-lg",
        outline:
          "glass-input border [border-color:var(--button-outline)] hover:bg-accent/50 hover:border-primary/30",
        secondary: "glass-input border bg-secondary/80 text-secondary-foreground backdrop-blur-sm hover:bg-secondary",
        ghost: "border border-transparent hover:bg-accent/50 hover:backdrop-blur-sm",
      },
      size: {
        default: "min-h-10 px-5 py-2.5",
        sm: "min-h-9 rounded-lg px-4 text-xs",
        lg: "min-h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
