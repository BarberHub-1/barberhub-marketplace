import * as React from "react"
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

// Componente ResizablePanelGroup usando React.forwardRef
// Integra com o componente ResizablePanelGroup do react-resizable-panels
// Permite customização através de classes adicionais
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      // Classes base do resizable panel group usando Tailwind CSS
      // Inclui estilos para:
      // - Layout e alinhamento
      // - Cores e background
      // - Estados de hover e foco
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

// Componente ResizablePanel usando React.forwardRef
// Integra com o componente ResizablePanel do react-resizable-panels
// Permite customização através de classes adicionais
const ResizablePanel = ResizablePrimitive.Panel

// Componente ResizableHandle usando React.forwardRef
// Integra com o componente ResizableHandle do react-resizable-panels
// Permite customização através de classes adicionais
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      // Classes base do resizable handle usando Tailwind CSS
      // Inclui estilos para:
      // - Tamanho e posicionamento
      // - Cores e background
      // - Estados de hover e foco
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:w-1 after:bg-border hover:bg-border hover:after:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&[data-panel-group-direction=vertical]]:h-px [&[data-panel-group-direction=vertical]]:w-full [&[data-panel-group-direction=vertical]]:after:h-1 [&[data-panel-group-direction=vertical]]:after:w-full",
      withHandle &&
        "after:content-[''] after:absolute after:inset-y-0 after:w-1 after:bg-border hover:after:bg-border focus-visible:after:bg-border",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
        <div className="h-4 w-px bg-border" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
