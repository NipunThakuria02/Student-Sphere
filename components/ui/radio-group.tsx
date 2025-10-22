import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("grid gap-2", className)} {...props}>
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, { groupValue: value, onGroupValueChange: onValueChange })
            : child
        )}
      </div>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
    groupValue?: string
    onGroupValueChange?: (value: string) => void
  }
>(({ className, value, groupValue, onGroupValueChange, ...props }, ref) => {
  const isChecked = value === groupValue

  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isChecked}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked && "bg-primary",
        className
      )}
      onClick={() => onGroupValueChange?.(value)}
      {...props}
    >
      {isChecked && (
        <div className="flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-current" />
        </div>
      )}
    </button>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
