"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Building2, CircleDot, Code2, History, Landmark, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CelecJobs } from "@/components/opportunities/celec-jobs"
import { FinanceJobs, financeITJobs } from "@/components/opportunities/finance-jobs"
import { FinancePortals } from "@/components/opportunities/finance-portals"
import { PetroecuadorJobs } from "@/components/opportunities/petroecuador-jobs"
import { InecJobs, inecITJobs } from "@/components/opportunities/inec-jobs"
import { PublicITJobs, publicITJobs } from "@/components/opportunities/public-it-jobs"
import { PublicPortals } from "@/components/opportunities/public-portals"
import { PublicRoutes } from "@/components/opportunities/public-routes"
import { TechJobs, countRecentTechITJobs } from "@/components/opportunities/tech-jobs"
import { EmploymentStageNotice } from "@/components/opportunities/stage-picker"
import { financePortals } from "@/lib/finance-portals"
import { encuentraEmpleoInstitutions, publicPortals } from "@/lib/public-portals"
import { celecJobs, publicOpportunities } from "@/lib/opportunities-data"
import { itJobs as petroecuadorITJobs } from "@/components/opportunities/petroecuador-jobs"
import type { Stage } from "@/lib/student-stages"

type Sector = "tecnologia" | "energia" | "financiero" | "publico"

const sectors: { id: Sector; label: string; icon: typeof Zap; ownership: string; count: number; unit: string; description: string }[] = [
  { id: "tecnologia", label: "Tecnología / Software", icon: Code2, ownership: "Privado", count: countRecentTechITJobs(null), unit: "vacantes", description: "Vacantes de TI en Ecuador de empresas de desarrollo de software (Devsu, Stack Builders)." },
  { id: "energia", label: "Energía", icon: Zap, ownership: "Empresas públicas", count: celecJobs.length + petroecuadorITJobs.length, unit: "ofertas", description: petroecuadorITJobs.length ? "Convocatorias reales de CELEC EP (electricidad) y cargos de TI de EP Petroecuador (petróleo)." : "Convocatorias reales de CELEC EP (electricidad). Los cargos de TI de Petroecuador aparecerán cuando publique alguno." },
  { id: "financiero", label: "Financiero", icon: Landmark, ownership: "Públicos y privados", count: financePortals.length, unit: "portales", description: financeITJobs.length ? "Ofertas de TI de bancos y cooperativas, y sus portales oficiales de empleo." : "Portales oficiales de empleo de bancos y cooperativas." },
  { id: "publico", label: "Sector público", icon: Building2, ownership: "Público", count: publicOpportunities.length + publicPortals.length + encuentraEmpleoInstitutions.length, unit: "rutas", description: inecITJobs.length || publicITJobs.length ? "Cargos de TI del INEC y de los concursos públicos de Encuentra Empleo, dónde publica cada institución y plataformas del Estado para docencia y consultoría." : "Dónde publica cada institución pública y plataformas del Estado para docencia, cargos públicos y consultoría." },
]

function SectorGroup({ sector, children }: { sector: (typeof sectors)[number]; children: ReactNode }) {
  const Icon = sector.icon
  return <section aria-labelledby={`sector-${sector.id}`} className="mb-6">
    <div className="mb-6 flex flex-wrap items-center gap-3 border-b-2 border-primary/20 pb-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="size-5" /></span>
      <div className="min-w-0 flex-1"><h2 id={`sector-${sector.id}`} className="font-heading text-xl font-bold uppercase tracking-wide text-primary">{sector.label}</h2><p className="text-xs text-muted-foreground">{sector.description}</p></div>
      <Badge variant="outline">{sector.ownership}</Badge>
    </div>
    {children}
  </section>
}

export function EmploymentTab({ stage }: { stage: Stage | null }) {
  const [sector, setSector] = useState<Sector | "todos">("todos")
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [showHistoric, setShowHistoric] = useState(false)
  const filters = { onlyOpen, showHistoric, onShowHistoric: () => setShowHistoric(true) }
  const visible = (id: Sector) => sector === "todos" || sector === id
  // El conteo de Tecnología depende de la fecha (últimos 60 días): se calcula al montar
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])
  const countFor = (item: (typeof sectors)[number]) => item.id === "tecnologia" ? countRecentTechITJobs(now) : item.count

  const toggleClass = (active: boolean) => `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"}`

  return <div>
    <EmploymentStageNotice stage={stage} />

    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Sector">
        {[{ id: "todos" as const, label: "Todos", count: null }, ...sectors.map((item) => ({ id: item.id, label: item.label, count: countFor(item) }))].map((item) => <button key={item.id} type="button" aria-pressed={sector === item.id} onClick={() => setSector(item.id)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${sector === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{item.label}{item.count != null && <span className="ml-1 text-xs text-muted-foreground">{item.count}</span>}</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={onlyOpen} onClick={() => setOnlyOpen((value) => !value)} className={toggleClass(onlyOpen)}><CircleDot className="size-4" /> Solo abiertas</button>
        <button type="button" aria-pressed={showHistoric} onClick={() => setShowHistoric((value) => !value)} className={toggleClass(showHistoric)}><History className="size-4" /> Históricos</button>
      </div>
    </div>

    {visible("tecnologia") && <SectorGroup sector={sectors.find((item) => item.id === "tecnologia")!}><TechJobs {...filters} /></SectorGroup>}
    {visible("energia") && <SectorGroup sector={sectors.find((item) => item.id === "energia")!}><PetroecuadorJobs {...filters} /><CelecJobs {...filters} /></SectorGroup>}
    {visible("financiero") && <SectorGroup sector={sectors.find((item) => item.id === "financiero")!}><FinanceJobs {...filters} /><FinancePortals /></SectorGroup>}
    {visible("publico") && <SectorGroup sector={sectors.find((item) => item.id === "publico")!}><InecJobs {...filters} /><PublicITJobs {...filters} /><PublicPortals /><PublicRoutes /></SectorGroup>}
  </div>
}
