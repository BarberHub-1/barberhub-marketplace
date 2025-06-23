import * as React from "react"

import { cn } from "@/lib/utils"

// Componente Table usando React.forwardRef
// Estende as props padrão de uma tabela HTML
// Permite customização através de classes adicionais
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// Componente TableHeader usando React.forwardRef
// Estende as props padrão de um thead HTML
// Permite customização através de classes adicionais
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

// Componente TableBody usando React.forwardRef
// Estende as props padrão de um tbody HTML
// Permite customização através de classes adicionais
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

// Componente TableFooter usando React.forwardRef
// Estende as props padrão de um tfoot HTML
// Permite customização através de classes adicionais
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

// Componente TableRow usando React.forwardRef
// Estende as props padrão de um tr HTML
// Permite customização através de classes adicionais
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      // Classes base do table row usando Tailwind CSS
      // Inclui estilos para:
      // - Borda e transição
      // - Estados de hover e seleção
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// Componente TableHead usando React.forwardRef
// Estende as props padrão de um th HTML
// Permite customização através de classes adicionais
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      // Classes base do table head usando Tailwind CSS
      // Inclui estilos para:
      // - Padding e alinhamento
      // - Tipografia e cor
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// Componente TableCell usando React.forwardRef
// Estende as props padrão de um td HTML
// Permite customização através de classes adicionais
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // Classes base do table cell usando Tailwind CSS
      // Inclui estilos para:
      // - Padding e alinhamento
      // - Tipografia e cor
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// Componente TableCaption usando React.forwardRef
// Estende as props padrão de um caption HTML
// Permite customização através de classes adicionais
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
