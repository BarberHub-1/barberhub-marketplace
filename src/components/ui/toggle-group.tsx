import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Definição das variantes de estilo do ToggleGroup usando class-variance-authority
// Inclui estilos para:
// - Layout e alinhamento
// - Cores e background
// - Estados de foco e desabilitado
const toggleGroupVariants = cva(
  "inline-flex items-center justify-center gap-1",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Componente ToggleGroup usando React.forwardRef
// Integra com o componente ToggleGroup do Radix UI
// Permite customização através de variantes e classes adicionais
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant, size, className }))}
    {...props}
  />
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

// Componente ToggleGroupItem usando React.forwardRef
// Integra com o componente ToggleGroupItem do Radix UI
// Permite customização através de classes adicionais
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      // Classes base do toggle group item usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de foco e desabilitado
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  />
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
