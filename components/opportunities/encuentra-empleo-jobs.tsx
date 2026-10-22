"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Building, CalendarClock, CircleDot, DollarSign, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import data from "@/lib/data/encuentra-empleo-jobs.json"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

/** Oferta de TI de Encuentra Empleo, exportada desde el scraper local (COMPUMAX-EC/encuentraempleo-scraper). */
export type EncuentraEmpleoJob = {
  /** Código de la oferta en el portal, p. ej. "OFERTA-00056287-2026". */
  id: string
  title: string
  company: string | null
  location: string | null
  salary: string | null
  contract: string | null
  employerType: string | null
  sector: string | null
  profile: string
  applicableFromIT: boolean
  /** Último día de postulación (AAAA-MM-DD). */
  closesOn: string | null
  firstSeen: string
  lastSeen: string
}

const feed = data as { source: string; updatedAt: string | null; jobs: EncuentraEmpleoJob[] }
const SCRAPER_REPO = "https://github.com/COMPUMAX-EC/encuentraempleo-scraper"

const titleCase = (text: string) => text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })
const todayInEcuador = (now: number) => new Date(now).toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })

/** Ofertas abiertas (para el conteo del sector); antes de montar no se conoce la fecha. */
export const countOpenEncuentraEmpleoJobs = (now: number | null) =>
  now == null ? 0 : feed.jobs.filter((job) => job.closesOn && job.closesOn >= todayInEcuador(now)).length

export function EncuentraEmpleoJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])

  // Antes de montar no se conoce la fecha: se muestra como cerrada para no desajustar el HTML del build
  const jobs = useMemo(() => {
    const today = now == null ? null : todayInEcuador(now)
    return feed.jobs
      .map((job) => ({ ...job, open: today != null && job.closesOn != null && job.closesOn >= today }))
      .sort((a, b) => (b.closesOn ?? "").localeCompare(a.closesOn ?? ""))
  }, [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: EncuentraEmpleoJob) => currentYear != null && (job.closesOn ?? job.lastSeen).slice(0, 4) < currentYear
  const open = jobs.filter((job) => job.open)
  const closed = onlyOpen ? [] : jobs.filter((job) => !job.open && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : jobs.filter((job) => !job.open && isPastYear(job)).length

  // Sin ofertas de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: (typeof jobs)[number]) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.open ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : "border-l-muted-foreground/40 bg-card"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={job.open ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{job.open ? "Abierta" : "Cerrada"}</Badge>{job.sector && <Badge variant="outline">{job.sector}</Badge>}</div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{titleCase(job.title)}</h3>
    {job.company && <p className="flex items-start gap-1.5 text-sm font-medium text-primary"><Building className="mt-0.5 size-3.5 shrink-0" />{titleCase(job.company)}</p>}
    {job.location && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{titleCase(job.location)}</p>}
    {job.salary && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="size-3.5 shrink-0" />{job.salary}{job.contract ? ` · ${job.contract}` : ""}</p>}
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{job.closesOn ? `Postulación hasta el ${formatDay(job.closesOn)}` : "Sin fecha de cierre"}</span></p>
    <p className="text-xs text-muted-foreground">Código: <span className="font-mono">{job.id}</span></p>
    <div className="mt-auto pt-1"><Button asChild size="sm" variant={job.open ? "default" : "outline"}><a href={feed.source} target="_blank" rel="noreferrer">{job.open ? "Postular en Encuentra Empleo" : "Ver en Encuentra Empleo"}<ArrowUpRight data-icon="inline-end" /></a></Button></div>
  </div>

  return <JobSection
    title="Ofertas de TI en Encuentra Empleo"
    description={<>Ofertas de empresas e instituciones de todo el país publicadas en el portal del Ministerio del Trabajo. Aquí ves un resumen; para ver los requisitos y postular, ingresa al portal con tu cuenta de aspirante y busca el código de la oferta.{feed.updatedAt && <> Última actualización: {formatDay(feed.updatedAt.slice(0, 10))}.</>}</>}
    badges={now != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CircleDot className="size-3" />{open.length} {open.length === 1 ? "abierta" : "abiertas"} de TI</Badge>}
    actions={<div className="mb-4 flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="text-primary"><a href={feed.source} target="_blank" rel="noreferrer">Ir a Encuentra Empleo <ArrowUpRight data-icon="inline-end" /></a></Button>
      <Button asChild size="sm" variant="ghost" className="text-muted-foreground"><a href={SCRAPER_REPO} target="_blank" rel="noreferrer">Herramienta que recolecta estas ofertas <ArrowUpRight data-icon="inline-end" /></a></Button>
    </div>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver las ${count} ofertas de TI abiertas`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
