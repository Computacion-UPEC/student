"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CalendarDays, Globe2, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import techData from "@/lib/data/tech-jobs.json"
import { JobSection } from "@/components/opportunities/collapsible"
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

const companies: Record<string, { about: string; site: string }> = {
  Devsu: { about: "Empresa de desarrollo de software y staffing con sede en Quito. Muchas vacantes son para proyectos de clientes del sector financiero.", site: "https://apply.workable.com/devsu/" },
  "Stack Builders": { about: "Consultora de software con oficina en Quito.", site: "https://apply.workable.com/stackbuilders/" },
}

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

export function TechJobs({ onlyOpen }: EmploymentFilters) {
  const [today, setToday] = useState<number | null>(null)
  useEffect(() => { setToday(Date.now()) }, [])

  // Antes de montar no se conoce la fecha: se muestran todas para no desajustar el HTML del build
  const isRecent = (job: TechJob) => today == null || (today - Date.parse(`${job.publishedAt ?? job.firstSeen}T12:00:00`)) / 864e5 <= RECENT_DAYS
  const isOpen = (job: TechJob) => !job.closedOn && isRecent(job)
  const open = techITJobs.filter(isOpen)
  const closed = onlyOpen ? [] : techITJobs.filter((job) => !isOpen(job))
  const companyNames = [...new Set(open.map((job) => job.company))]

  if (open.length === 0 && closed.length === 0) return null

  const card = (job: TechJob) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${isOpen(job) ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : "border-l-muted-foreground/40 bg-card"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge variant="secondary">{job.company}</Badge>{job.remote && <Badge variant="outline" className="gap-1"><Globe2 className="size-3" />Remoto</Badge>}{job.closedOn ? <Badge variant="outline">Cerrada</Badge> : !isOpen(job) && <Badge variant="outline">Más de {RECENT_DAYS} días</Badge>}</div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{job.title}</h3>
    {job.city && <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{job.city}, Ecuador</p>}
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
    <div className="mt-auto pt-1"><Button asChild size="sm" variant={isOpen(job) ? "default" : "outline"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">{isOpen(job) ? "Ver y postular" : "Ver oferta"} <ArrowUpRight data-icon="inline-end" /></a></Button></div>
  </div>

  return <JobSection
    title="Empresas de software en Ecuador"
    description={<>Vacantes de TI en Ecuador publicadas en los últimos {RECENT_DAYS} días, revisadas dos veces al día desde el {formatDay(data.collectedSince)}.</>}
    badges={<Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{open.length} abiertas de TI</Badge>}
    actions={companyNames.length > 0 && <div className="mb-4 grid gap-2 md:grid-cols-2">{companyNames.map((name) => <a key={name} href={companies[name]?.site} target="_blank" rel="noreferrer" className="group rounded-xl border border-border bg-card p-3 text-sm transition-colors hover:border-primary/50">
      <span className="flex items-center gap-1 font-heading font-bold text-foreground">{name}<span className="text-xs font-normal text-muted-foreground">· {open.filter((job) => job.company === name).length} vacantes</span><ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" /></span>
      <span className="text-xs text-muted-foreground">{companies[name]?.about}</span>
    </a>)}</div>}
    open={open.map(card)}
    closed={closed.map(card)}
    closedLabel={`cerradas o de hace más de ${RECENT_DAYS} días`}
    moreLabel={(count) => `Ver las ${count} vacantes`}
  />
}
