import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

// Componente Menubar usando React.forwardRef
// Integra com o componente Menubar do Radix UI
// Permite customização através de classes adicionais
const MenubarMenu = MenubarPrimitive.Menu

// Componente MenubarGroup usando React.forwardRef
// Integra com o componente MenubarGroup do Radix UI
// Permite customização através de classes adicionais
const MenubarGroup = MenubarPrimitive.Group

// Componente MenubarPortal usando React.forwardRef
// Integra com o componente MenubarPortal do Radix UI
// Permite customização através de classes adicionais
const MenubarPortal = MenubarPrimitive.Portal

// Componente MenubarSub usando React.forwardRef
// Integra com o componente MenubarSub do Radix UI
// Permite customização através de classes adicionais
const MenubarSub = MenubarPrimitive.Sub

// Componente MenubarRadioGroup usando React.forwardRef
// Integra com o componente MenubarRadioGroup do Radix UI
// Permite customização através de classes adicionais
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

// Componente Menubar usando React.forwardRef
// Integra com o componente Menubar do Radix UI
// Permite customização através de classes adicionais
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      // Classes base do menubar usando Tailwind CSS
      // Inclui estilos para:
      // - Layout e alinhamento
      // - Cores e background
      // - Estados de hover e foco
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

// Componente MenubarTrigger usando React.forwardRef
// Integra com o componente MenubarTrigger do Radix UI
// Permite customização através de classes adicionais
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      // Classes base do menubar trigger usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de hover e foco
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

// Componente MenubarSubTrigger usando React.forwardRef
// Integra com o componente MenubarSubTrigger do Radix UI
// Permite customização através de classes adicionais
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Classes base do menubar sub trigger usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de hover e foco
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

// Componente MenubarSubContent usando React.forwardRef
// Integra com o componente MenubarSubContent do Radix UI
// Permite customização através de classes adicionais
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      // Classes base do menubar sub content usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Tipografia e animação
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

// Componente MenubarContent usando React.forwardRef
// Integra com o componente MenubarContent do Radix UI
// Permite customização através de classes adicionais
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          // Classes base do menubar content usando Tailwind CSS
          // Inclui estilos para:
          // - Tamanho e padding
          // - Cores e background
          // - Tipografia e animação
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

// Componente MenubarItem usando React.forwardRef
// Integra com o componente MenubarItem do Radix UI
// Permite customização através de classes adicionais
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      // Classes base do menubar item usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de hover e foco
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

// Componente MenubarCheckboxItem usando React.forwardRef
// Integra com o componente MenubarCheckboxItem do Radix UI
// Permite customização através de classes adicionais
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      // Classes base do menubar checkbox item usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de hover e foco
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName =
  MenubarPrimitive.CheckboxItem.displayName

// Componente MenubarRadioItem usando React.forwardRef
// Integra com o componente MenubarRadioItem do Radix UI
// Permite customização através de classes adicionais
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      // Classes base do menubar radio item usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Estados de hover e foco
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

// Componente MenubarLabel usando React.forwardRef
// Integra com o componente MenubarLabel do Radix UI
// Permite customização através de classes adicionais
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      // Classes base do menubar label usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e padding
      // - Cores e background
      // - Tipografia
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

// Componente MenubarSeparator usando React.forwardRef
// Integra com o componente MenubarSeparator do Radix UI
// Permite customização através de classes adicionais
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

// Componente MenubarShortcut usando React.forwardRef
// Estende as props padrão de um span HTML
// Permite customização através de classes adicionais
const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        // Classes base do menubar shortcut usando Tailwind CSS
        // Inclui estilos para:
        // - Tamanho e padding
        // - Cores e background
        // - Tipografia
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
  MenubarTrigger,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
}
