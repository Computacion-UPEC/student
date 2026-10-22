import { ArrowUpRight, Building, Laptop, Lightbulb, Pill, Radio, ShoppingCart, UtensilsCrossed, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import privateData from "@/lib/data/private-jobs.json"
import { Collapsible } from "@/components/opportunities/collapsible"
import { privatePortals, type PrivateJob, type PrivatePortal } from "@/lib/private-portals"

const icons: Record<PrivatePortal["sector"], typeof Building> = {
  Retail: ShoppingCart, "Farmacéutica": Pill, Telecomunicaciones: Radio, "Alimentos y bebidas": UtensilsCrossed, Industria: Wrench, Servicios: Building,
}

// Vacantes abiertas hoy por empresa (el id de la fuente del recolector es el id del portal)
const openJobs = (privateData as { jobs: PrivateJob[] }).jobs.filter((job) => !job.closedOn)
const counts = new Map<string, { total: number; it: number; itJobs: PrivateJob[] }>()
for (const job of openJobs) {
  const count = counts.get(job.source) ?? { total: 0, it: 0, itJobs: [] }
  counts.set(job.source, { total: count.total + 1, it: count.it + Number(job.isIT), itJobs: job.isIT ? [...count.itJobs, job] : count.itJobs })
}
// "ANALISTA DE BI COMERCIAL" -> "Analista de BI comercial"
const tidy = (text: string) => text === text.toUpperCase() ? text.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()).replace(/\b(Ti|Ia|Ux|Qa|Bi)\b/g, (word) => word.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y|En|Con)\b/g, (word) => word.toLowerCase()) : text

function PortalCard({ portal, compact = false }: { portal: PrivatePortal; compact?: boolean }) {
  const Icon = icons[portal.sector]
  const count = counts.get(portal.id)
  return <div className={`group flex items-start gap-3 rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md ${compact ? "border-border p-3 opacity-80 hover:opacity-100" : count?.it ? "border-sky-600/40 p-4 ring-1 ring-sky-600/20" : "border-border p-4"}`}>
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ${compact ? "size-8" : "size-10"}`}><Icon className={compact ? "size-4" : "size-5"} /></span>
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <a href={portal.url} target="_blank" rel="noreferrer" className={`flex items-center gap-1 font-heading font-bold text-foreground hover:text-primary ${compact ? "text-sm" : "text-base"}`}>{portal.name}<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></a>
      {portal.brands && <span className="text-xs text-muted-foreground">{portal.brands}</span>}
      {count && <span className="flex flex-wrap gap-1"><Badge className="bg-emerald-600 text-[11px] text-white hover:bg-emerald-600">{count.total} {count.total === 1 ? "vacante abierta" : "vacantes abiertas"}</Badge>{count.it > 0 && <Badge className="gap-1 bg-sky-600 text-[11px] text-white hover:bg-sky-600"><Laptop className="size-3" />{count.it} de TI</Badge>}</span>}
      <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.sector}</Badge><Badge variant="outline" className="text-[11px]">{portal.platform}</Badge>{portal.rank && portal.rank <= 100 && <Badge variant="outline" className="text-[11px]">#{portal.rank} en ingresos</Badge>}{compact && portal.collected && <Badge variant="outline" className="text-[11px]">Sin vacantes hoy</Badge>}</span>
      {count && count.itJobs.length > 0 && <ul className="mt-1 flex flex-col gap-1 rounded-lg bg-sky-50/70 p-2 dark:bg-sky-950/30">{count.itJobs.map((job) => <li key={job.id}><a href={job.url} target="_blank" rel="noreferrer" className="flex items-start gap-1.5 text-sm font-semibold text-sky-800 hover:underline dark:text-sky-300"><Laptop className="mt-0.5 size-3.5 shrink-0" /><span>{tidy(job.title)}{job.city && <span className="font-normal text-muted-foreground"> · {tidy(job.city)}</span>}</span><ArrowUpRight className="mt-0.5 size-3.5 shrink-0" /></a></li>)}</ul>}
      {!compact && <span className="text-xs text-muted-foreground">{portal.note}</span>}
      {count && <a href={portal.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline">Ver las {count.total} en su portal<ArrowUpRight className="size-3" /></a>}
    </span>
  </div>
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

    {others.length > 0 && <Collapsible className="mt-4" summary={`Otras ${others.length} empresas sin vacantes que podamos leer`}>
        <p className="mb-3 text-xs text-muted-foreground">Sin vacantes abiertas hoy, o con portales que no podemos leer automáticamente (formularios, LinkedIn, protección contra bots). En esas, entra y busca &ldquo;tecnología&rdquo;, &ldquo;sistemas&rdquo; o &ldquo;datos&rdquo;.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{others.map((portal) => <PortalCard key={portal.id} portal={portal} compact />)}</div>
    </Collapsible>}
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Muchas publican sus vacantes de TI también en LinkedIn: sigue sus páginas de empresa. Ninguna cobra por postular; desconfía de quien te pida dinero.</span></p>
  </div>
}
