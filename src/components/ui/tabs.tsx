import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Componente Tabs usando React.forwardRef
// Integra com o componente Tabs do Radix UI
// Permite customização através de classes adicionais
const Tabs = TabsPrimitive.Root

// Componente TabsList usando React.forwardRef
// Integra com o componente TabsList do Radix UI
// Permite customização através de classes adicionais
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Classes base do tabs list usando Tailwind CSS
      // Inclui estilos para:
      // - Layout e alinhamento
      // - Cores e background
      // - Estados de foco e desabilitado
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// Componente TabsTrigger usando React.forwardRef
// Integra com o componente TabsTrigger do Radix UI
// Permite customização através de classes adicionais
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Classes base do tabs trigger usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de foco e seleção
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// Componente TabsContent usando React.forwardRef
// Integra com o componente TabsContent do Radix UI
// Permite customização através de classes adicionais
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Classes base do tabs content usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de foco e desabilitado
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
