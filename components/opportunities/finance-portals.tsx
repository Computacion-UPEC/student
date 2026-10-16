import { ArrowUpRight, Building2, Landmark, Lightbulb, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { financePortals } from "@/lib/finance-portals"

export function FinancePortals() {
  // Primero lo local (Carchi), luego bancos y cooperativas
  const portals = [...financePortals].sort((a, b) => Number(!!b.local) - Number(!!a.local) || a.kind.localeCompare(b.kind))

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Bancos y cooperativas</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Portales oficiales de empleo del sector financiero. Los bancos y cooperativas contratan perfiles de desarrollo, datos, soporte y ciberseguridad.</p></div>
      <Badge variant="outline">{portals.length} portales</Badge>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{portals.map((portal) => {
      const Icon = portal.kind === "Banco" ? Landmark : Building2
      return <a key={portal.id} href={portal.url} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-1 font-heading text-base font-bold text-foreground">{portal.name}<ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></span>
          <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.kind}</Badge><Badge variant="outline" className="text-[11px]">{portal.ownership}</Badge>{portal.local && <Badge className="gap-1 bg-primary text-[11px] text-primary-foreground hover:bg-primary"><MapPin className="size-3" />Carchi</Badge>}</span>
          <span className="text-xs text-muted-foreground">{portal.note}</span>
        </span>
      </a>
    })}</div>
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>En cada portal busca &ldquo;tecnología&rdquo;, &ldquo;desarrollador&rdquo;, &ldquo;datos&rdquo; o &ldquo;ciberseguridad&rdquo;. Otros bancos y cooperativas publican sus vacantes en portales como Multitrabajos o LinkedIn.</span></p>
  </div>
}
