import type { ReactNode } from "react"
import { ArrowUpRight, BarChart3, Building, Lightbulb, RadioTower, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { encuentraEmpleoInstitutions, encuentraEmpleoLinks, publicPortals, type PortalLink, type PublicPortal } from "@/lib/public-portals"

const icons: Record<PublicPortal["kind"], typeof Building> = { Instituto: BarChart3, "Empresa pública": Building, "Agencia de regulación": RadioTower }

function PortalCard({ icon: Icon, name, badges, note, links }: { icon: typeof Building; name: string; badges: ReactNode; note: string; links: PortalLink[] }) {
  return <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="font-heading text-base font-bold text-foreground">{name}</span>
      <span className="flex flex-wrap gap-1">{badges}</span>
      <span className="text-xs text-muted-foreground">{note}</span>
      <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:underline">{link.label}<ArrowUpRight className="size-3.5" /></a>)}</span>
    </span>
  </div>
}

export function PublicPortals() {
  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Dónde publica cada institución pública</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Las empresas públicas y algunos institutos tienen su propio portal; los ministerios e instituciones regidos por la LOSEP publican sus concursos de méritos y oposición en Encuentra Empleo, del Ministerio del Trabajo.</p></div>
      <Badge variant="outline">{publicPortals.length + encuentraEmpleoInstitutions.length} instituciones</Badge>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {publicPortals.map((portal) => <PortalCard key={portal.id} icon={icons[portal.kind]} name={portal.name} note={portal.note} links={portal.links}
        badges={<><Badge variant="secondary" className="text-[11px]">{portal.kind}</Badge>{portal.collected && <Badge className="bg-sky-600 text-[11px] text-white hover:bg-sky-600">Ofertas recolectadas</Badge>}</>} />)}
      <PortalCard icon={Search} name="Vía Encuentra Empleo" links={encuentraEmpleoLinks} note="Sus concursos solo se postulan ahí. Los revisamos dos veces al día: los de TI aparecen arriba con su código. Crea tu cuenta y completa la hoja de vida antes de que abran."
        badges={encuentraEmpleoInstitutions.map((name) => <Badge key={name} variant="outline" className="text-[11px]">{name}</Badge>)} />
    </div>
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Las convocatorias públicas suelen abrir solo unos días. Ten lista tu hoja de vida en Encuentra Empleo y tu título registrado en la SENESCYT antes de que salgan.</span></p>
  </div>
}
