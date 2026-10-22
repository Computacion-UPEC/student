import { ArrowUpRight, Building2, Landmark, Laptop, Lightbulb, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import financeData from "@/lib/data/finance-jobs.json"
import { Collapsible } from "@/components/opportunities/collapsible"
import { ITJobLinks, type ITJobLink } from "@/components/opportunities/it-job-links"
import { financePortals, type FinanceJob, type JobPortal } from "@/lib/finance-portals"

// Vacantes abiertas hoy por portal (el id de la fuente del recolector es el id del portal)
const counts = new Map<string, { total: number; it: number; itJobs: ITJobLink[] }>()
for (const job of (financeData as { jobs: FinanceJob[] }).jobs.filter((item) => !item.closedOn)) {
  const count = counts.get(job.source) ?? { total: 0, it: 0, itJobs: [] }
  const itJobs = job.isIT ? [...count.itJobs, { id: job.id, title: job.title, city: job.city ?? null, url: job.url }] : count.itJobs
  counts.set(job.source, { total: count.total + 1, it: count.it + Number(job.isIT), itJobs })
}

function PortalCard({ portal, compact = false }: { portal: JobPortal; compact?: boolean }) {
  const Icon = portal.kind === "Banco" ? Landmark : Building2
  const count = counts.get(portal.id)
  return <div className={`group flex items-start gap-3 rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md ${compact ? "border-border p-3 opacity-80 hover:opacity-100" : count?.it ? "border-sky-600/40 p-4 ring-1 ring-sky-600/20" : "border-border p-4"}`}>
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ${compact ? "size-8" : "size-10"}`}><Icon className={compact ? "size-4" : "size-5"} /></span>
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <a href={portal.url} target="_blank" rel="noreferrer" className={`flex items-center gap-1 font-heading font-bold text-foreground hover:text-primary ${compact ? "text-sm" : "text-base"}`}>{portal.name}<ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></a>
      {count && <span className="flex flex-wrap gap-1"><Badge className="bg-emerald-600 text-[11px] text-white hover:bg-emerald-600">{count.total} {count.total === 1 ? "vacante abierta" : "vacantes abiertas"}</Badge>{count.it > 0 && <Badge className="gap-1 bg-sky-600 text-[11px] text-white hover:bg-sky-600"><Laptop className="size-3" />{count.it} de TI</Badge>}</span>}
      <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.kind}</Badge><Badge variant="outline" className="text-[11px]">{portal.ownership}</Badge>{portal.local && <Badge className="gap-1 bg-primary text-[11px] text-primary-foreground hover:bg-primary"><MapPin className="size-3" />Carchi</Badge>}{compact && portal.collected && <Badge variant="outline" className="text-[11px]">Sin vacantes hoy</Badge>}</span>
      {count && <ITJobLinks jobs={count.itJobs} />}
      {!compact && <span className="text-xs text-muted-foreground">{portal.note}</span>}
      {count && <a href={portal.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">Ver las {count.total} en su portal<ArrowUpRight className="size-3" /></a>}
    </span>
  </div>
}

export function FinancePortals() {
  // Arriba los portales con vacantes abiertas; los demás (lo local primero), plegados
  const withJobs = financePortals.filter((portal) => counts.get(portal.id)?.total)
    .sort((a, b) => counts.get(b.id)!.it - counts.get(a.id)!.it || counts.get(b.id)!.total - counts.get(a.id)!.total)
  const others = financePortals.filter((portal) => !counts.get(portal.id)?.total)
    .sort((a, b) => Number(!!b.local) - Number(!!a.local) || a.kind.localeCompare(b.kind))

  return <div className="mb-12">
    {withJobs.length > 0 && <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Bancos y cooperativas con vacantes</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Portales oficiales del sector financiero que hoy tienen vacantes abiertas. Los revisamos dos veces al día; entra al portal para ver todas y postular.</p></div>
        <Badge variant="outline">{withJobs.length} portales</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{withJobs.map((portal) => <PortalCard key={portal.id} portal={portal} />)}</div>
    </>}
    {others.length > 0 && <Collapsible className="mt-4" summary={`Otros ${others.length} bancos y cooperativas sin vacantes que podamos leer`}>
      <p className="mb-3 text-xs text-muted-foreground">Sin vacantes abiertas hoy, o con portales que no publican sus ofertas de forma legible. En cada uno busca &ldquo;tecnología&rdquo;, &ldquo;desarrollador&rdquo;, &ldquo;datos&rdquo; o &ldquo;ciberseguridad&rdquo;.</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{others.map((portal) => <PortalCard key={portal.id} portal={portal} compact />)}</div>
    </Collapsible>}
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Otros bancos y cooperativas publican sus vacantes en portales como Multitrabajos o LinkedIn.</span></p>
  </div>
}
