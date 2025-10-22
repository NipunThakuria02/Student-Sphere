import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  // Extract items and placeholder
  const items: { value: string; label: React.ReactNode }[] = []
  let placeholder = 'Select...'
  
  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === SelectContent) {
        const childProps = child.props as any
        if (childProps.children) {
          React.Children.forEach(childProps.children, item => {
            if (React.isValidElement(item)) {
              const itemProps = item.props as any
              if (itemProps.value) {
                items.push({ 
                  value: itemProps.value as string, 
                  label: itemProps.children 
                })
              }
            }
          })
        }
      } else if (child.type === SelectTrigger) {
        const childProps = child.props as any
        if (childProps.children) {
          React.Children.forEach(childProps.children, subChild => {
            if (React.isValidElement(subChild) && subChild.type === SelectValue) {
              const subChildProps = subChild.props as any
              if (subChildProps.placeholder) {
                placeholder = subChildProps.placeholder as string
              }
            }
          })
        }
      }
    }
  })

  // Find the label for the current value
  const selectedItem = items.find(item => item.value === value)
  const displayText = selectedItem ? selectedItem.label : placeholder

  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, onValueChange, isOpen, setIsOpen, displayText } as any)
          : child
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string; onValueChange?: (value: string) => void; isOpen?: boolean; setIsOpen?: (open: boolean) => void; displayText?: string }
>(({ className, children, value, onValueChange, isOpen, setIsOpen, displayText, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setIsOpen?.(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="truncate">{displayText || 'Select...'}</span>
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform ml-2 flex-shrink-0", isOpen && "transform rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span>{placeholder || 'Select...'}</span>
)

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (value: string) => void; isOpen?: boolean; setIsOpen?: (open: boolean) => void; displayText?: string }
>(({ className, children, onValueChange, isOpen, setIsOpen, displayText, ...props }, ref) => {
  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md mt-1 w-full",
        className
      )}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { onValueChange, setIsOpen } as any)
            : child
        )}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; onValueChange?: (value: string) => void; setIsOpen?: (open: boolean) => void }
>(({ className, children, value, onValueChange, setIsOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
      className
    )}
    onClick={() => {
      onValueChange?.(value)
      setIsOpen?.(false)
    }}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
