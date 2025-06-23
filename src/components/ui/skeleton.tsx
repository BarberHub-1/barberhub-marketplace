import { cn } from "@/lib/utils"

// Componente Skeleton usando React.forwardRef
// Estende as props padrão de um div HTML
// Permite customização através de classes adicionais
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Classes base do skeleton usando Tailwind CSS
        // Inclui estilos para:
        // - Animação de pulso
        // - Cores e background
        // - Tamanho e arredondamento
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
