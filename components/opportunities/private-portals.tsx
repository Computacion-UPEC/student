import { ArrowUpRight, Building, ChevronDown, Laptop, Lightbulb, Pill, Radio, ShoppingCart, UtensilsCrossed, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import privateData from "@/lib/data/private-jobs.json"
import { privatePortals, type PrivateJob, type PrivatePortal } from "@/lib/private-portals"

const icons: Record<PrivatePortal["sector"], typeof Building> = {
  Retail: ShoppingCart, "Farmacéutica": Pill, Telecomunicaciones: Radio, "Alimentos y bebidas": UtensilsCrossed, Industria: Wrench, Servicios: Building,
}

// Vacantes abiertas hoy por empresa (el id de la fuente del recolector es el id del portal)
const openJobs = (privateData as { jobs: PrivateJob[] }).jobs.filter((job) => !job.closedOn)
const counts = new Map<string, { total: number; it: number }>()
for (const job of openJobs) {
  const count = counts.get(job.source) ?? { total: 0, it: 0 }
  counts.set(job.source, { total: count.total + 1, it: count.it + Number(job.isIT) })
}

function PortalCard({ portal, compact = false }: { portal: PrivatePortal; compact?: boolean }) {
  const Icon = icons[portal.sector]
  const count = counts.get(portal.id)
  return <a href={portal.url} target="_blank" rel="noreferrer" className={`group flex items-start gap-3 rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md ${compact ? "border-border p-3 opacity-80 hover:opacity-100" : count?.it ? "border-sky-600/40 p-4 ring-1 ring-sky-600/20" : "border-border p-4"}`}>
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ${compact ? "size-8" : "size-10"}`}><Icon className={compact ? "size-4" : "size-5"} /></span>
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <span className={`flex items-center gap-1 font-heading font-bold text-foreground ${compact ? "text-sm" : "text-base"}`}>{portal.name}<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></span>
      {portal.brands && <span className="text-xs text-muted-foreground">{portal.brands}</span>}
      {count && <span className="flex flex-wrap gap-1"><Badge className="bg-emerald-600 text-[11px] text-white hover:bg-emerald-600">{count.total} {count.total === 1 ? "vacante abierta" : "vacantes abiertas"}</Badge>{count.it > 0 && <Badge className="gap-1 bg-sky-600 text-[11px] text-white hover:bg-sky-600"><Laptop className="size-3" />{count.it} de TI</Badge>}</span>}
      <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.sector}</Badge><Badge variant="outline" className="text-[11px]">{portal.platform}</Badge>{portal.rank && portal.rank <= 100 && <Badge variant="outline" className="text-[11px]">#{portal.rank} en ingresos</Badge>}{compact && portal.collected && <Badge variant="outline" className="text-[11px]">Sin vacantes hoy</Badge>}</span>
      {!compact && <span className="text-xs text-muted-foreground">{portal.note}</span>}
    </span>
  </a>
}

export function PrivatePortals() {
  // Arriba las empresas con vacantes abiertas (primero las que tienen de TI); las demás, plegadas
  const withJobs = privatePortals.filter((portal) => counts.get(portal.id)?.total)
    .sort((a, b) => counts.get(b.id)!.it - counts.get(a.id)!.it || counts.get(b.id)!.total - counts.get(a.id)!.total)
  const others = privatePortals.filter((portal) => !counts.get(portal.id)?.total)
    .sort((a, b) => Number(!!a.collected) - Number(!!b.collected) || (a.rank ?? 999) - (b.rank ?? 999))
  const total = withJobs.reduce((sum, portal) => sum + counts.get(portal.id)!.total, 0)

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Empresas privadas grandes con vacantes</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Las empresas con más ingresos del país (ranking 2025 de la Superintendencia de Compañías) que hoy tienen vacantes en su portal oficial. Revisamos sus portales dos veces al día; entra al portal para ver todas y postular.</p></div>
      <Badge variant="outline">{withJobs.length} empresas · {total} vacantes</Badge>
    </div>
    {withJobs.length > 0
      ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{withJobs.map((portal) => <PortalCard key={portal.id} portal={portal} />)}</div>
      : <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">Hoy ninguna de las empresas que revisamos tiene vacantes publicadas.</div>}

    {others.length > 0 && <details className="group/others mt-4 rounded-xl border border-dashed border-border bg-muted/30">
      <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <ChevronDown className="size-4 transition-transform group-open/others:rotate-180" />
        Otras {others.length} empresas sin vacantes que podamos leer
      </summary>
      <div className="px-4 pb-4">
        <p className="mb-3 text-xs text-muted-foreground">Sin vacantes abiertas hoy, o con portales que no podemos leer automáticamente (formularios, LinkedIn, protección contra bots). En esas, entra y busca &ldquo;tecnología&rdquo;, &ldquo;sistemas&rdquo; o &ldquo;datos&rdquo;.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{others.map((portal) => <PortalCard key={portal.id} portal={portal} compact />)}</div>
      </div>
    </details>}
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Muchas publican sus vacantes de TI también en LinkedIn: sigue sus páginas de empresa. Ninguna cobra por postular; desconfía de quien te pida dinero.</span></p>
  </div>
}
