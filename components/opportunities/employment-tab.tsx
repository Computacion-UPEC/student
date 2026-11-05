"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Building2, CircleDot, Code2, Globe2, Factory, GraduationCap, History, Landmark, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CelecAllCalls } from "@/components/opportunities/celec-all-calls"
import { CelecJobs } from "@/components/opportunities/celec-jobs"
import { FinanceJobs, financeITJobs } from "@/components/opportunities/finance-jobs"
import { FinancePortals } from "@/components/opportunities/finance-portals"
import { PetroecuadorJobs } from "@/components/opportunities/petroecuador-jobs"
import { InecJobs, inecITJobs } from "@/components/opportunities/inec-jobs"
import { InstitutionSocials } from "@/components/opportunities/institution-socials"
import { PrivateJobs, privateITJobs } from "@/components/opportunities/private-jobs"
import { PrivatePortals } from "@/components/opportunities/private-portals"
import { PublicITJobs, publicITJobs } from "@/components/opportunities/public-it-jobs"
import { PublicPortals } from "@/components/opportunities/public-portals"
import { PublicRoutes } from "@/components/opportunities/public-routes"
import { TechJobs, countOpenTechITJobs } from "@/components/opportunities/tech-jobs"
import { EncuentraEmpleoJobs, countOpenEncuentraEmpleoJobs } from "@/components/opportunities/encuentra-empleo-jobs"
import { GlobalJobs, countOpenGlobalJobs } from "@/components/opportunities/global-jobs"
import { EntryLevelJobs } from "@/components/opportunities/entry-level-jobs"
import { EmploymentStageNotice } from "@/components/opportunities/stage-picker"
import { ScrapedPlatforms } from "@/components/opportunities/scraped-platforms"
import { UpdateOffers } from "@/components/opportunities/update-offers"
import { financePortals } from "@/lib/finance-portals"
import { privatePortals } from "@/lib/private-portals"
import { encuentraEmpleoInstitutions, publicPortals } from "@/lib/public-portals"
import { celecJobs, publicOpportunities } from "@/lib/opportunities-data"
import { itJobs as petroecuadorITJobs } from "@/components/opportunities/petroecuador-jobs"
import type { Stage } from "@/lib/student-stages"

const ENTRY_KEY = "oportunidades.recien-graduados"

type Sector = "tecnologia" | "exterior" | "privado" | "energia" | "financiero" | "publico"

const sectors: { id: Sector; label: string; icon: typeof Zap; ownership: string; count: number; unit: string; description: string }[] = [
  { id: "tecnologia", label: "Tecnología / Software", icon: Code2, ownership: "Privado", count: countOpenTechITJobs(), unit: "vacantes", description: "Vacantes de TI en Ecuador de empresas de software (Devsu, Stack Builders) y ofertas de TI de todo el país en Encuentra Empleo." },
  { id: "privado", label: "Empresas privadas", icon: Factory, ownership: "Privado", count: privatePortals.length, unit: "empresas", description: privateITJobs.length ? "Ofertas de TI y portales oficiales de las empresas privadas más grandes del país (retail, telecomunicaciones, consumo, industria)." : "Portales oficiales de las empresas privadas más grandes del país: retail, telecomunicaciones, consumo e industria." },
  { id: "energia", label: "Energía", icon: Zap, ownership: "Empresas públicas", count: celecJobs.length + petroecuadorITJobs.length, unit: "ofertas", description: petroecuadorITJobs.length ? "Convocatorias reales de CELEC EP (electricidad) y cargos de TI de EP Petroecuador (petróleo)." : "Convocatorias reales de CELEC EP (electricidad). Los cargos de TI de Petroecuador aparecerán cuando publique alguno." },
  { id: "financiero", label: "Financiero", icon: Landmark, ownership: "Públicos y privados", count: financePortals.length, unit: "portales", description: financeITJobs.length ? "Ofertas de TI de bancos y cooperativas, y sus portales oficiales de empleo." : "Portales oficiales de empleo de bancos y cooperativas." },
  { id: "exterior", label: "Remoto y en el extranjero", icon: Globe2, ownership: "Privado", count: countOpenGlobalJobs(), unit: "vacantes", description: "Vacantes de TI de empresas grandes que contratan desde Ecuador en remoto, o que patrocinan la visa para Canadá y EE. UU." },
  { id: "publico", label: "Sector público", icon: Building2, ownership: "Público", count: publicOpportunities.length + publicPortals.length + encuentraEmpleoInstitutions.length, unit: "rutas", description: inecITJobs.length || publicITJobs.length ? "Cargos de TI del INEC, de CNT y de los concursos públicos de Encuentra Empleo, dónde publica cada institución y plataformas del Estado para docencia y consultoría." : "Dónde publica cada institución pública y plataformas del Estado para docencia, cargos públicos y consultoría." },
]

function SectorGroup({ sector, children }: { sector: (typeof sectors)[number]; children: ReactNode }) {
  const Icon = sector.icon
  return <section aria-labelledby={`sector-${sector.id}`} className="mb-2">
    <div className="mb-2 flex flex-wrap items-center gap-3 border-b-2 border-primary/20 pb-2">
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="size-5" /></span>
      <div className="min-w-0 flex-1"><h2 id={`sector-${sector.id}`} className="font-heading text-base font-bold uppercase tracking-wide text-primary">{sector.label}</h2><p className="text-xs text-muted-foreground">{sector.description}</p></div>
      <Badge variant="outline">{sector.ownership}</Badge>
    </div>
    {children}
  </section>
}

export function EmploymentTab({ stage }: { stage: Stage | null }) {
  const [sector, setSector] = useState<Sector | "todos">("todos")
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [showHistoric, setShowHistoric] = useState(false)
  // Resaltar los cargos de entrada: encendido por defecto y recordado en este navegador
  const [showEntry, setShowEntry] = useState(true)
  useEffect(() => { try { if (localStorage.getItem(ENTRY_KEY) === "0") setShowEntry(false) } catch {} }, [])
  const toggleEntry = () => setShowEntry((value) => { try { localStorage.setItem(ENTRY_KEY, value ? "0" : "1") } catch {} return !value })
  const filters = { onlyOpen, showHistoric, onShowHistoric: () => setShowHistoric(true) }
  const visible = (id: Sector) => sector === "todos" || sector === id
  // El conteo de Tecnología incluye Encuentra Empleo, que depende de la fecha: se calcula al montar
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])
  const countFor = (item: (typeof sectors)[number]) => item.id === "tecnologia" ? countOpenTechITJobs() + countOpenEncuentraEmpleoJobs(now) : item.count

  const toggleClass = (active: boolean) => `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"}`

  return <div>
    <EmploymentStageNotice stage={stage} />
    <UpdateOffers />
    <ScrapedPlatforms />

    <div className="mb-2 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Sector">
        {[{ id: "todos" as const, label: "Todos", count: null }, ...sectors.map((item) => ({ id: item.id, label: item.label, count: countFor(item) }))].map((item) => <button key={item.id} type="button" aria-pressed={sector === item.id} onClick={() => setSector(item.id)} className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${sector === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{item.label}{item.count != null && <span className="ml-1 text-xs text-muted-foreground">{item.count}</span>}</button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={showEntry} onClick={toggleEntry} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors ${showEntry ? "border-amber-600 bg-amber-600 text-white" : "border-border bg-background text-foreground hover:border-amber-600/50"}`}><GraduationCap className="size-4" /> Recién graduados</button>
        <button type="button" aria-pressed={onlyOpen} onClick={() => setOnlyOpen((value) => !value)} className={toggleClass(onlyOpen)}><CircleDot className="size-4" /> Solo abiertas</button>
        <button type="button" aria-pressed={showHistoric} onClick={() => setShowHistoric((value) => !value)} className={toggleClass(showHistoric)}><History className="size-4" /> Históricos</button>
      </div>
    </div>

    {showEntry && <EntryLevelJobs />}
    {visible("tecnologia") && <SectorGroup sector={sectors.find((item) => item.id === "tecnologia")!}><TechJobs {...filters} /><EncuentraEmpleoJobs {...filters} /></SectorGroup>}
    {visible("privado") && <SectorGroup sector={sectors.find((item) => item.id === "privado")!}><PrivateJobs {...filters} /><PrivatePortals /></SectorGroup>}
    {visible("energia") && <SectorGroup sector={sectors.find((item) => item.id === "energia")!}><PetroecuadorJobs {...filters} /><CelecJobs {...filters} /><CelecAllCalls /></SectorGroup>}
    {visible("financiero") && <SectorGroup sector={sectors.find((item) => item.id === "financiero")!}><FinanceJobs {...filters} /><FinancePortals /></SectorGroup>}
    {visible("exterior") && <SectorGroup sector={sectors.find((item) => item.id === "exterior")!}><GlobalJobs {...filters} /></SectorGroup>}
    {visible("publico") && <SectorGroup sector={sectors.find((item) => item.id === "publico")!}><InecJobs {...filters} /><PublicITJobs {...filters} /><PublicPortals /><PublicRoutes /></SectorGroup>}
    <InstitutionSocials />
  </div>
}
