"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CalendarDays, ChevronDown, Globe2, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import techData from "@/lib/data/tech-jobs.json"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

/** Oferta de una empresa de software con vacantes en Ecuador (lib/data/tech-jobs.json, scripts/tech/collect.mjs). */
export type TechJob = {
  id: string
  company: string
  title: string
  city: string
  remote: boolean
  publishedAt: string | null
  url: string
  isIT: boolean
  firstSeen: string
  closedOn?: string
}

const data = techData as { collectedSince: string; jobs: TechJob[] }
/** Solo cargos de TI (descarta, por ejemplo, ventas o análisis de negocio). */
export const techITJobs = data.jobs.filter((job) => job.isIT)
const RECENT_DAYS = 60
/** Vacantes de TI abiertas y publicadas en los últimos 60 días respecto a `now` (sin fecha: todas las abiertas). */
export const countRecentTechITJobs = (now: number | null) => techITJobs.filter((job) => !job.closedOn && (now == null || (now - Date.parse(`${job.publishedAt ?? job.firstSeen}T12:00:00`)) / 864e5 <= RECENT_DAYS)).length
const PREVIEW = 6

const companies: Record<string, { about: string; site: string }> = {
  Devsu: { about: "Empresa de desarrollo de software y staffing con sede en Quito. Muchas vacantes son para proyectos de clientes del sector financiero.", site: "https://apply.workable.com/devsu/" },
  "Stack Builders": { about: "Consultora de software con oficina en Quito.", site: "https://apply.workable.com/stackbuilders/" },
}

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

export function TechJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [today, setToday] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { setToday(Date.now()) }, [])

  // Antes de montar no se conoce la fecha: se muestran todas para no desajustar el HTML del build
  const isRecent = (job: TechJob) => today == null || (today - Date.parse(`${job.publishedAt ?? job.firstSeen}T12:00:00`)) / 864e5 <= RECENT_DAYS
  const isVisible = (job: TechJob) => (showHistoric || (!job.closedOn && isRecent(job))) && (!onlyOpen || !job.closedOn)
  const filtered = techITJobs.filter(isVisible)
  const hidden = showHistoric ? 0 : techITJobs.filter((job) => !isVisible(job) && (!onlyOpen || !job.closedOn)).length
  const shown = showAll ? filtered : filtered.slice(0, PREVIEW)
  const companyNames = [...new Set(filtered.map((job) => job.company))]

  if (filtered.length === 0 && hidden === 0) return null

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Empresas de software en Ecuador</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Vacantes de TI en Ecuador publicadas en los últimos {RECENT_DAYS} días, revisadas dos veces al día desde el {formatDay(data.collectedSince)}.</p></div>
      <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{filtered.length} de TI</Badge>
    </div>

    <div className="mb-4 grid gap-2 md:grid-cols-2">{companyNames.map((name) => <a key={name} href={companies[name]?.site} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-card p-3 text-sm transition-colors hover:border-primary/50">
      <span className="flex items-center gap-1 font-heading font-bold text-foreground">{name}<span className="text-xs font-normal text-muted-foreground">· {filtered.filter((job) => job.company === name).length} vacantes</span><ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" /></span>
      <span className="text-xs text-muted-foreground">{companies[name]?.about}</span>
    </a>)}</div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No hay vacantes de TI publicadas en los últimos {RECENT_DAYS} días.{hidden > 0 && <> <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver {hidden} anteriores</button></>}</div> : <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{shown.map((job) => <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-sky-600 bg-sky-50/70 p-4 ring-1 ring-sky-600/30 dark:bg-sky-950/30">
        <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge variant="secondary">{job.company}</Badge>{job.remote && <Badge variant="outline" className="gap-1"><Globe2 className="size-3" />Remoto</Badge>}{job.closedOn && <Badge variant="outline">Cerrada</Badge>}</div>
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">{job.title}</h3>
        {job.city && <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{job.city}, Ecuador</p>}
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
        <div className="mt-auto pt-1"><Button asChild size="sm" className="h-8"><a href={job.url} target="_blank" rel="noreferrer">Ver y postular <ArrowUpRight data-icon="inline-end" /></a></Button></div>
      </div>)}</div>
      {filtered.length > PREVIEW && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : `Ver las ${filtered.length} vacantes`}</Button>}
      {hidden > 0 && <p className="mt-3 text-xs text-muted-foreground">{hidden} vacantes de más de {RECENT_DAYS} días ocultas. <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver históricos</button></p>}
    </>}
  </div>
}
