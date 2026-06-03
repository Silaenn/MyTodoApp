import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-4 border-white bg-brutal-gray px-4 py-2 text-base font-bold uppercase tracking-widest text-white shadow-brutal transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-brutal-neon focus-visible:shadow-brutal-neon disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
