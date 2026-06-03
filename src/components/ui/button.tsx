import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-x-1 active:translate-y-1 active:shadow-none border-4 border-white shadow-brutal",
  {
    variants: {
      variant: {
        default: "bg-brutal-neon text-black hover:bg-white",
        destructive: "bg-brutal-pink text-white hover:bg-brutal-yellow hover:text-black",
        outline: "bg-transparent text-white hover:bg-white hover:text-black",
        secondary: "bg-brutal-blue text-white hover:bg-brutal-neon hover:text-black",
        ghost: "border-none shadow-none hover:bg-white/10",
        link: "border-none shadow-none text-brutal-neon underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 text-xs border-2 shadow-brutal-sm",
        lg: "h-14 px-10 text-lg border-4 shadow-brutal-lg",
        icon: "h-12 w-12",
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
