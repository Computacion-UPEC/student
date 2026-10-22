import { ArrowUpRight, Building, Lightbulb, Pill, Radio, ShoppingCart, UtensilsCrossed, Wrench } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { privatePortals, type PrivatePortal } from "@/lib/private-portals"

const icons: Record<PrivatePortal["sector"], typeof Building> = {
  Retail: ShoppingCart, "Farmacéutica": Pill, Telecomunicaciones: Radio, "Alimentos y bebidas": UtensilsCrossed, Industria: Wrench, Servicios: Building,
}

export function PrivatePortals() {
  // Primero las que recolectamos, luego por puesto en el ranking
  const portals = [...privatePortals].sort((a, b) => Number(!!b.collected) - Number(!!a.collected) || (a.rank ?? 999) - (b.rank ?? 999))

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Portales de las empresas privadas más grandes</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Las empresas con más ingresos del país (ranking 2025 de la Superintendencia de Compañías) y su canal oficial para postular. De las marcadas como &ldquo;Ofertas recolectadas&rdquo; leemos las vacantes a diario; en las demás, busca &ldquo;tecnología&rdquo;, &ldquo;sistemas&rdquo; o &ldquo;datos&rdquo;.</p></div>
      <Badge variant="outline">{portals.length} empresas</Badge>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{portals.map((portal) => {
      const Icon = icons[portal.sector]
      return <a key={portal.id} href={portal.url} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-1 font-heading text-base font-bold text-foreground">{portal.name}<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></span>
          {portal.brands && <span className="text-xs text-muted-foreground">{portal.brands}</span>}
          <span className="flex flex-wrap gap-1"><Badge variant="secondary" className="text-[11px]">{portal.sector}</Badge><Badge variant="outline" className="text-[11px]">{portal.platform}</Badge>{portal.rank && portal.rank <= 100 && <Badge variant="outline" className="text-[11px]">#{portal.rank} en ingresos</Badge>}{portal.collected && <Badge className="bg-sky-600 text-[11px] text-white hover:bg-sky-600">Ofertas recolectadas</Badge>}</span>
          <span className="text-xs text-muted-foreground">{portal.note}</span>
        </span>
      </a>
    })}</div>
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Muchas publican sus vacantes de TI también en LinkedIn: sigue sus páginas de empresa. Ninguna cobra por postular; desconfía de quien te pida dinero.</span></p>
  </div>
}
