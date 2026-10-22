import { ArrowUpRight, CalendarDays, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { publicOpportunities } from "@/lib/opportunities-data"
import { NewCallBadge } from "@/components/opportunities/new-call-badge"
import { Collapsible } from "@/components/opportunities/collapsible"

export function PublicRoutes() {
  // No son ofertas de empleo sino caminos (docencia, cargos públicos, consultoría): plegadas al inicio
  return <Collapsible className="mb-12" summary={<>Rutas y convocatorias<span className="font-normal"> · {publicOpportunities.length} rutas para ingresar a docencia, sector público y consultoría</span></>}>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{publicOpportunities.map((item) => <Card key={item.id} className="flex h-full flex-col gap-0 border-primary/15 py-0">
      <div className="flex items-start justify-between gap-3 p-4 pb-2"><div className="min-w-0"><div className="mb-2 flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{item.category}</Badge><Badge variant="outline" className="text-[11px]">Público</Badge><NewCallBadge since={item.newSince} /></div><h3 className="font-heading text-base font-bold leading-tight text-foreground">{item.title}</h3><p className="mt-1 truncate text-xs font-medium text-primary">{item.platform}</p></div><Button asChild variant="outline" size="icon" className="size-8 shrink-0" aria-label={`Abrir ${item.title}`}><a href={item.url} target="_blank" rel="noreferrer"><ArrowUpRight data-icon="inline-end" /></a></Button></div>
      <div className="flex flex-1 flex-col px-4 pb-4"><p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>{item.note && <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400"><CalendarDays className="size-3.5 shrink-0" />{item.note}</p>}<details className="group mt-2 text-sm"><summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-primary hover:underline [&::-webkit-details-marker]:hidden"><ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /> Ver pasos</summary><ol className="mt-2 flex flex-col gap-1.5 text-foreground">{item.steps.map((step, index) => <li key={step} className="flex gap-2 text-xs"><span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{index + 1}</span><span>{step}</span></li>)}</ol></details></div>
    </Card>)}</div>
  </Collapsible>
}
