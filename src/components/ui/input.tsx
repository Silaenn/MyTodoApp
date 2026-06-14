"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border-2 border-brutal-ink bg-brutal-paper px-4 py-2 text-sm font-medium text-brutal-ink transition-all duration-100",
          "placeholder:text-brutal-muted",
          "shadow-brutal-sm",
          "focus-visible:outline-none focus-visible:border-brutal-primary focus-visible:shadow-brutal-primary",
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