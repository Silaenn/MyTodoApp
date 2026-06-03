"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] px-4 py-2 text-sm font-medium text-[#1A1208] transition-all duration-100",
          "placeholder:text-[#6B5744]",
          "shadow-[3px_3px_0px_#1A1208]",
          "focus-visible:outline-none focus-visible:border-[#C75B2D] focus-visible:shadow-[4px_4px_0px_#C75B2D]",
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