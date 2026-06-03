import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-y-0.5 active:shadow-none border border-white/10 shadow-brutal",
  {
    variants: {
      variant: {
        default: "bg-brutal-neon text-slate-950 hover:bg-teal-300",
        destructive: "bg-brutal-pink text-white hover:bg-orange-400 hover:text-slate-950",
        outline: "bg-white/5 text-slate-100 hover:bg-white/10",
        secondary: "bg-slate-800 text-slate-50 hover:bg-slate-700",
        ghost: "border-none shadow-none hover:bg-white/10",
        link: "border-none shadow-none text-brutal-neon underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-2xl",
        sm: "h-10 px-4 text-xs rounded-xl shadow-brutal-sm",
        lg: "h-14 px-10 text-base rounded-2xl shadow-brutal-lg",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
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
