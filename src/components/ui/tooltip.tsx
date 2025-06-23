import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// Componente TooltipProvider usando React.forwardRef
// Integra com o componente TooltipProvider do Radix UI
// Permite customização através de classes adicionais
const TooltipProvider = TooltipPrimitive.Provider

// Componente Tooltip usando React.forwardRef
// Integra com o componente Tooltip do Radix UI
// Permite customização através de classes adicionais
const Tooltip = TooltipPrimitive.Root

// Componente TooltipTrigger usando React.forwardRef
// Integra com o componente TooltipTrigger do Radix UI
// Permite customização através de classes adicionais
const TooltipTrigger = TooltipPrimitive.Trigger

// Componente TooltipContent usando React.forwardRef
// Integra com o componente TooltipContent do Radix UI
// Permite customização através de classes adicionais
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Classes base do tooltip content usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Tipografia e animação
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
