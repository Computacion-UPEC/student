"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Bloque plegado al inicio: lo que no es una oferta abierta (cerradas, portales sin vacantes, rutas, redes). */
export function Collapsible({ summary, children, className = "" }: { summary: ReactNode; children: ReactNode; className?: string }) {
  return <details className={`rounded-xl border border-dashed border-border bg-muted/30 ${className}`}>
    <summary className="flex cursor-pointer list-none items-center gap-2 p-3 text-[13px] font-semibold text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
      {/* Solo gira con su propio <details>, aunque haya otro plegable adentro */}
      <ChevronDown className="size-4 shrink-0 transition-transform [[open]>summary>&]:rotate-180" />
      <span className="min-w-0">{summary}</span>
    </summary>
    <div className="px-3 pb-2">{children}</div>
  </details>
}

const GRID = "grid gap-3 md:grid-cols-2 xl:grid-cols-3"

/**
 * Sección de ofertas: las abiertas a la vista y las cerradas plegadas. Si no hay ninguna abierta, toda la sección
 * queda plegada en una línea.
 */
export function JobSection({ title, description, badges, actions, open, closed, closedLabel = "cerradas", moreLabel, footer, preview = 6 }: {
  title: string
  description: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  open: ReactNode[]
  closed: ReactNode[]
  closedLabel?: string
  moreLabel: (count: number) => string
  footer?: ReactNode
  preview?: number
}) {
  const [showAll, setShowAll] = useState(false)
  const closedGrid = closed.length > 0 && <div className={GRID}>{closed}</div>

  if (open.length === 0) return <Collapsible className="mb-2" summary={<>{title}<span className="font-normal"> · sin ofertas abiertas ahora{closed.length > 0 && ` · ${closed.length} ${closedLabel}`}</span></>}>
    <p className="mb-2 max-w-2xl text-xs text-muted-foreground">{description}</p>
    {actions}
    {closedGrid}
    {footer}
  </Collapsible>

  return <div className="mb-3">
    <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="font-heading text-lg font-bold text-foreground md:text-xl">{title}</h2><p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">{description}</p></div>
      {badges && <div className="flex flex-wrap gap-2">{badges}</div>}
    </div>
    {actions}
    <div className={GRID}>{showAll ? open : open.slice(0, preview)}</div>
    {open.length > preview && <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : moreLabel(open.length)}</Button>}
    {closed.length > 0 && <Collapsible className="mt-2" summary={`${closed.length} ${closedLabel}`}>{closedGrid}</Collapsible>}
    {footer}
  </div>
}
