import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// Componente NavigationMenu usando React.forwardRef
// Integra com o componente NavigationMenu do Radix UI
// Permite customização através de classes adicionais
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      // Classes base do navigation menu usando Tailwind CSS
      // Inclui estilos para:
      // - Layout e alinhamento
      // - Cores e background
      // - Estados de hover e foco
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

// Componente NavigationMenuList usando React.forwardRef
// Integra com o componente NavigationMenuList do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      // Classes base do navigation menu list usando Tailwind CSS
      // Inclui estilos para:
      // - Layout e alinhamento
      // - Cores e background
      // - Estados de hover e foco
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

// Componente NavigationMenuItem usando React.forwardRef
// Integra com o componente NavigationMenuItem do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuItem = NavigationMenuPrimitive.Item

// Definição de variantes de estilo para o navigation menu trigger
// Usando class-variance-authority para gerenciar classes condicionais
const navigationMenuTriggerStyle = cva(
  // Classes base do navigation menu trigger usando Tailwind CSS
  // Inclui estilos para:
  // - Tamanho e padding
  // - Cores e background
  // - Estados de hover e foco
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
)

// Componente NavigationMenuTrigger usando React.forwardRef
// Integra com o componente NavigationMenuTrigger do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

// Componente NavigationMenuContent usando React.forwardRef
// Integra com o componente NavigationMenuContent do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      // Classes base do navigation menu content usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Tipografia e animação
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

// Componente NavigationMenuLink usando React.forwardRef
// Integra com o componente NavigationMenuLink do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuLink = NavigationMenuPrimitive.Link

// Componente NavigationMenuViewport usando React.forwardRef
// Integra com o componente NavigationMenuViewport do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        // Classes base do navigation menu viewport usando Tailwind CSS
        // Inclui estilos para:
        // - Tamanho e padding
        // - Cores e background
        // - Tipografia e animação
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

// Componente NavigationMenuIndicator usando React.forwardRef
// Integra com o componente NavigationMenuIndicator do Radix UI
// Permite customização através de classes adicionais
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      // Classes base do navigation menu indicator usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Tipografia e animação
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
