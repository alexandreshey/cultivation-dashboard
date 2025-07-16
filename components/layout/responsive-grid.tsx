"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    "2xl"?: number
  }
  gap?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const gapClasses = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-4 lg:gap-6",
  lg: "gap-6 lg:gap-8",
  xl: "gap-8 lg:gap-10"
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = "md",
  className
}: ResponsiveGridProps) {
  const gridCols = []
  
  if (cols.default) gridCols.push(`grid-cols-${cols.default}`)
  if (cols.sm) gridCols.push(`sm:grid-cols-${cols.sm}`)
  if (cols.md) gridCols.push(`md:grid-cols-${cols.md}`)
  if (cols.lg) gridCols.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) gridCols.push(`xl:grid-cols-${cols.xl}`)
  if (cols["2xl"]) gridCols.push(`2xl:grid-cols-${cols["2xl"]}`)

  return (
    <div className={cn(
      "grid",
      gridCols.join(" "),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Componente para cards em grid
interface GridCardProps {
  children: ReactNode
  className?: string
  span?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    "2xl"?: number
  }
}

export function GridCard({ children, className, span }: GridCardProps) {
  const spanClasses = []
  
  if (span?.default) spanClasses.push(`col-span-${span.default}`)
  if (span?.sm) spanClasses.push(`sm:col-span-${span.sm}`)
  if (span?.md) spanClasses.push(`md:col-span-${span.md}`)
  if (span?.lg) spanClasses.push(`lg:col-span-${span.lg}`)
  if (span?.xl) spanClasses.push(`xl:col-span-${span.xl}`)
  if (span?.["2xl"]) spanClasses.push(`2xl:col-span-${span["2xl"]}`)

  return (
    <div className={cn(spanClasses.join(" "), className)}>
      {children}
    </div>
  )
}