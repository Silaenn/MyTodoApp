import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold",
    "border-2 border-[#1A1208] rounded-md",
    "transition-all duration-100",
    "shadow-[3px_3px_0px_#1A1208]",
    "hover:shadow-[5px_5px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px",
    "active:shadow-[1px_1px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C75B2D] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:     "bg-[#C75B2D] text-[#FDFAF4] hover:bg-[#b54f27]",
        destructive: "bg-[#1A1208] text-[#FDFAF4] hover:bg-[#2d1f0f]",
        outline:     "bg-[#FDFAF4] text-[#1A1208] hover:bg-[#F5ECD7]",
        secondary:   "bg-[#E8A838] text-[#1A1208] hover:bg-[#d99a2e] border-[#1A1208]",
        accent:      "bg-[#4A7C59] text-[#FDFAF4] hover:bg-[#3d6849]",
        ghost:       "border-transparent shadow-none hover:bg-[#E8A838]/30 hover:shadow-none active:shadow-none active:translate-x-0 active:translate-y-0",
        link:        "border-transparent shadow-none text-[#C75B2D] underline-offset-4 hover:underline hover:shadow-none active:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm:      "h-9 px-4 text-xs shadow-[2px_2px_0px_#1A1208] hover:shadow-[3px_3px_0px_#1A1208]",
        lg:      "h-13 px-10 text-base shadow-[4px_4px_0px_#1A1208] hover:shadow-[6px_6px_0px_#1A1208]",
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