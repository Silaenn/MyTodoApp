import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold",
    "border-2 border-[#0F1A0F] rounded-md",
    "transition-all duration-100",
    "shadow-[3px_3px_0px_#0F1A0F]",
    "hover:shadow-[5px_5px_0px_#0F1A0F] hover:-translate-x-px hover:-translate-y-px",
    "active:shadow-[1px_1px_0px_#0F1A0F] active:translate-x-0.5 active:translate-y-0.5",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B6B4A] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:     "bg-[#3B6B4A] text-[#F5F8F4] hover:bg-[#2d5238]",
        destructive: "bg-[#0F1A0F] text-[#F5F8F4] hover:bg-[#1a2d1a]",
        outline:     "bg-[#F5F8F4] text-[#0F1A0F] hover:bg-[#E8EDE6]",
        secondary:   "bg-[#D4A843] text-[#0F1A0F] hover:bg-[#c49a3a] border-[#0F1A0F]",
        accent:      "bg-[#8B4A2B] text-[#F5F8F4] hover:bg-[#7a4126]",
        ghost:       "border-transparent shadow-none hover:bg-[#D4A843]/30 hover:shadow-none active:shadow-none active:translate-x-0 active:translate-y-0",
        link:        "border-transparent shadow-none text-[#3B6B4A] underline-offset-4 hover:underline hover:shadow-none active:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm:      "h-9 px-4 text-xs shadow-[2px_2px_0px_#0F1A0F] hover:shadow-[3px_3px_0px_#0F1A0F]",
        lg:      "h-13 px-10 text-base shadow-[4px_4px_0px_#0F1A0F] hover:shadow-[6px_6px_0px_#0F1A0F]",
        icon:    "h-11 w-11",
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