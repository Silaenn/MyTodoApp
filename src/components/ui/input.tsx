import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-base font-medium text-slate-50 shadow-brutal transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-teal-400/50 focus-visible:ring-2 focus-visible:ring-teal-400/20 focus-visible:shadow-brutal-neon disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
