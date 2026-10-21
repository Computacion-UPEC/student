"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Building, CalendarClock, ChevronDown, CircleDot, DollarSign, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import data from "@/lib/data/encuentra-empleo-jobs.json"
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
const PREVIEW = 6
const SCRAPER_REPO = "https://github.com/COMPUMAX-EC/encuentraempleo-scraper"

const titleCase = (text: string) => text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })
const todayInEcuador = (now: number) => new Date(now).toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })

/** Ofertas abiertas (para el conteo del sector); antes de montar no se conoce la fecha. */
export const countOpenEncuentraEmpleoJobs = (now: number | null) =>
  now == null ? 0 : feed.jobs.filter((job) => job.closesOn && job.closesOn >= todayInEcuador(now)).length

export function EncuentraEmpleoJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { setNow(Date.now()) }, [])

  // Antes de montar no se conoce la fecha: se muestra como cerrada para no desajustar el HTML del build
  const jobs = useMemo(() => {
    const today = now == null ? null : todayInEcuador(now)
    return feed.jobs
      .map((job) => ({ ...job, open: today != null && job.closesOn != null && job.closesOn >= today }))
      .sort((a, b) => Number(b.open) - Number(a.open) || (b.closesOn ?? "").localeCompare(a.closesOn ?? ""))
  }, [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: EncuentraEmpleoJob) => currentYear != null && (job.closesOn ?? job.lastSeen).slice(0, 4) < currentYear
  const filtered = jobs.filter((job) => (!onlyOpen || job.open) && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric ? 0 : jobs.filter((job) => isPastYear(job) && (!onlyOpen || job.open)).length
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW)
  const openCount = jobs.filter((job) => job.open).length

  // Sin ofertas de TI que mostrar, la sección no aparece
  if (filtered.length === 0 && hiddenHistoric === 0) return null

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Ofertas de TI en Encuentra Empleo</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Ofertas de empresas e instituciones de todo el país publicadas en el portal del Ministerio del Trabajo. Aquí ves un resumen; para ver los requisitos y postular, ingresa al portal con tu cuenta de aspirante y busca el código de la oferta.{feed.updatedAt && <> Última actualización: {formatDay(feed.updatedAt.slice(0, 10))}.</>}</p></div>
      <div className="flex flex-wrap gap-2"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{jobs.length} de TI</Badge>{now != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CircleDot className="size-3" />{openCount} {openCount === 1 ? "abierta" : "abiertas"}</Badge>}</div>
    </div>

    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="text-primary"><a href={feed.source} target="_blank" rel="noreferrer">Ir a Encuentra Empleo <ArrowUpRight data-icon="inline-end" /></a></Button>
      <Button asChild size="sm" variant="ghost" className="text-muted-foreground"><a href={SCRAPER_REPO} target="_blank" rel="noreferrer">Herramienta que recolecta estas ofertas <ArrowUpRight data-icon="inline-end" /></a></Button>
    </div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{onlyOpen ? "No hay ofertas de TI abiertas en Encuentra Empleo en este momento." : "No hay ofertas de TI de este año."}{hiddenHistoric > 0 && <> <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver {hiddenHistoric} de años anteriores</button></>}</div> : <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((job) => <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-sky-600 bg-sky-50/70 p-4 ring-1 ring-sky-600/30 dark:bg-sky-950/30">
        <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={job.open ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{job.open ? "Abierta" : "Cerrada"}</Badge>{job.sector && <Badge variant="outline">{job.sector}</Badge>}</div>
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">{titleCase(job.title)}</h3>
        {job.company && <p className="flex items-start gap-1.5 text-sm font-medium text-primary"><Building className="mt-0.5 size-3.5 shrink-0" />{titleCase(job.company)}</p>}
        {job.location && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{titleCase(job.location)}</p>}
        {job.salary && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="size-3.5 shrink-0" />{job.salary}{job.contract ? ` · ${job.contract}` : ""}</p>}
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{job.closesOn ? `Postulación hasta el ${formatDay(job.closesOn)}` : "Sin fecha de cierre"}</span></p>
        <p className="text-xs text-muted-foreground">Código: <span className="font-mono">{job.id}</span></p>
        <div className="mt-auto pt-1"><Button asChild size="sm" variant={job.open ? "default" : "outline"}><a href={feed.source} target="_blank" rel="noreferrer">{job.open ? "Postular en Encuentra Empleo" : "Ver en Encuentra Empleo"}<ArrowUpRight data-icon="inline-end" /></a></Button></div>
      </div>)}</div>
      {filtered.length > PREVIEW && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : `Ver las ${filtered.length} ofertas de TI`}</Button>}
    </>}
  </div>
}
