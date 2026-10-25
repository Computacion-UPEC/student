"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ArrowUpRight, BarChart3, Building, Laptop, Lightbulb, RadioTower, Scale, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import cntData from "@/lib/data/cnt-jobs.json"
import inecData from "@/lib/data/inec-jobs.json"
import publicData from "@/lib/data/public-jobs.json"
import { Collapsible } from "@/components/opportunities/collapsible"
import { encuentraEmpleoInstitutions, encuentraEmpleoLinks, publicPortals, type CntJob, type InecJob, type PortalLink, type PublicContestJob, type PublicPortal } from "@/lib/public-portals"

const icons: Record<PublicPortal["kind"], typeof Building> = { Instituto: BarChart3, "Empresa pública": Building, "Agencia de regulación": RadioTower, "Función Judicial": Scale }
type Count = { total: number; it: number }

/** Convocatorias abiertas ahora por portal; antes de montar no se conoce la hora y todas cuentan como cerradas. */
function openCounts(now: number | null): Record<string, Count> {
  if (now == null) return {}
  const count = <T,>(jobs: T[], isOpen: (job: T) => boolean, isIT: (job: T) => boolean) => {
    const open = jobs.filter(isOpen)
    return { total: open.length, it: open.filter(isIT).length }
  }
  const today = new Date(now).toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })
  return {
    inec: count(inecData.jobs as InecJob[], (job) => job.closesAt != null && now <= Date.parse(job.closesAt), (job) => job.isIT),
    cnt: count(cntData.jobs as CntJob[], (job) => job.closesOn != null && job.closesOn >= today, (job) => job.isIT),
    // Los concursos de Encuentra Empleo que guardamos son solo de TI
    encuentra: count((publicData as { jobs: PublicContestJob[] }).jobs, (job) => job.closesAt != null && now <= Date.parse(job.closesAt), () => true),
  }
}

function CountBadges({ count }: { count?: Count }) {
  if (!count?.total) return null
  return <><Badge className="bg-emerald-600 text-[11px] text-white hover:bg-emerald-600">{count.total} {count.total === 1 ? "abierta" : "abiertas"}</Badge>{count.it > 0 && count.it < count.total && <Badge className="gap-1 bg-sky-600 text-[11px] text-white hover:bg-sky-600"><Laptop className="size-3" />{count.it} de TI</Badge>}</>
}

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
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])
  const counts = openCounts(now)

  const cards = [
    ...publicPortals.map((portal) => ({ id: portal.id, node: <PortalCard key={portal.id} icon={icons[portal.kind]} name={portal.name} note={portal.note} links={portal.links}
      badges={<><Badge variant="secondary" className="text-[11px]">{portal.kind}</Badge><CountBadges count={counts[portal.id]} /></>} /> })),
    { id: "encuentra", node: <PortalCard key="encuentra" icon={Search} name="Vía Encuentra Empleo" links={encuentraEmpleoLinks} note="Sus concursos solo se postulan ahí. Los revisamos dos veces al día: los de TI aparecen arriba con su código. Crea tu cuenta y completa la hoja de vida antes de que abran."
      badges={<><CountBadges count={counts.encuentra} />{encuentraEmpleoInstitutions.map((name) => <Badge key={name} variant="outline" className="text-[11px]">{name}</Badge>)}</>} /> },
  ]
  const withJobs = cards.filter((card) => counts[card.id]?.total)
  const others = cards.filter((card) => !counts[card.id]?.total)

  return <div className="mb-12">
    {withJobs.length > 0 && <>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Instituciones públicas con convocatorias abiertas</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Las empresas públicas y algunos institutos tienen su propio portal; los ministerios e instituciones regidos por la LOSEP publican sus concursos en Encuentra Empleo, del Ministerio del Trabajo.</p></div>
        <Badge variant="outline">{withJobs.length} con convocatorias</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{withJobs.map((card) => card.node)}</div>
    </>}
    {others.length > 0 && <Collapsible className="mt-4" summary={`${withJobs.length ? "Otras" : "Dónde publican las instituciones públicas:"} ${others.length} sin convocatorias abiertas ahora`}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{others.map((card) => card.node)}</div>
    </Collapsible>}
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Las convocatorias públicas suelen abrir solo unos días. Ten lista tu hoja de vida en Encuentra Empleo y tu título registrado en la SENESCYT antes de que salgan.</span></p>
  </div>
}
