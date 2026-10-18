import { ArrowUpRight, BarChart3, Building, Lightbulb, RadioTower, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ENCUENTRA_EMPLEO_URL, encuentraEmpleoInstitutions, publicPortals, type PublicPortal } from "@/lib/public-portals"

const icons: Record<PublicPortal["kind"], typeof Building> = { Instituto: BarChart3, "Empresa pública": Building, "Agencia de regulación": RadioTower }

export function PublicPortals() {
  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Dónde publica cada institución pública</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Las empresas públicas y algunos institutos tienen su propio portal; los ministerios e instituciones regidos por la LOSEP publican sus concursos de méritos y oposición en Encuentra Empleo, del Ministerio del Trabajo.</p></div>
      <Badge variant="outline">{publicPortals.length + encuentraEmpleoInstitutions.length} instituciones</Badge>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {publicPortals.map((portal) => {
        const Icon = icons[portal.kind]
        return <a key={portal.id} href={portal.url} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex items-center gap-1 font-heading text-base font-bold text-foreground">{portal.name}<ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></span>
            <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.kind}</Badge>{portal.collected && <Badge className="bg-sky-600 text-[11px] text-white hover:bg-sky-600">Ofertas recolectadas</Badge>}</span>
            <span className="text-xs text-muted-foreground">{portal.note}</span>
          </span>
        </a>
      })}
      <a href={ENCUENTRA_EMPLEO_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Search className="size-5" /></span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-1 font-heading text-base font-bold text-foreground">Vía Encuentra Empleo<ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></span>
          <span className="flex flex-wrap gap-1">{encuentraEmpleoInstitutions.map((name) => <Badge key={name} variant="outline" className="text-[11px]">{name}</Badge>)}</span>
          <span className="text-xs text-muted-foreground">Sus concursos solo se postulan ahí: busca la institución en &ldquo;Sector público&rdquo;.</span>
        </span>
      </a>
    </div>
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Las convocatorias públicas suelen abrir solo unos días. Ten lista tu hoja de vida en Encuentra Empleo y tu título registrado en la SENESCYT antes de que salgan.</span></p>
  </div>
}
