import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        {...props}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
          "transition-all duration-200 ease-in-out",
          className
        )}
        ref={ref}
        ref={ref}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
