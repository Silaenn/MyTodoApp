"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] px-4 py-2 text-sm font-medium text-[#0F1A0F] transition-all duration-100",
          "placeholder:text-[#5A6E5A]",
          "shadow-[3px_3px_0px_#0F1A0F]",
          "focus-visible:outline-none focus-visible:border-[#3B6B4A] focus-visible:shadow-[4px_4px_0px_#3B6B4A]",
          "disabled:cursor-not-allowed disabled:opacity-50",
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