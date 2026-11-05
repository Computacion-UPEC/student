"use client"

import { ArrowUpRight, CalendarDays, Globe2, Laptop, MapPin, Plane } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import globalData from "@/lib/data/global-jobs.json"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

/** Vacante de TI en el extranjero de una empresa grande (lib/data/global-jobs.json, scripts/global/collect.mjs). */
export type GlobalJob = {
  id: string
  company: string
  title: string
  location: string
  route: "remoto" | "patrocinio"
  publishedAt: string | null
  url: string
  firstSeen: string
  closedOn?: string
}

const data = globalData as { collectedSince: string; jobs: GlobalJob[] }
export const countOpenGlobalJobs = () => data.jobs.filter((job) => !job.closedOn).length

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })

export function GlobalJobs({ onlyOpen }: EmploymentFilters) {
  const open = data.jobs.filter((job) => !job.closedOn)
  const closed = onlyOpen ? [] : data.jobs.filter((job) => job.closedOn)
  const companies = [...new Set(open.map((job) => job.company))]
  const sponsored = open.filter((job) => job.route === "patrocinio").length

  const card = (job: GlobalJob) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-3 ${job.closedOn ? "border-l-muted-foreground/40 bg-card" : "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30"}`}>
    <div className="flex flex-wrap gap-1.5">
      <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge>
      <Badge variant="secondary">{job.company}</Badge>
      {job.route === "remoto" ? <Badge variant="outline" className="gap-1"><Globe2 className="size-3" />Remoto desde Ecuador</Badge> : <Badge variant="outline" className="gap-1 border-emerald-600/60 text-emerald-700 dark:text-emerald-400"><Plane className="size-3" />Patrocina visa</Badge>}
      {job.closedOn && <Badge variant="outline">Cerrada</Badge>}
    </div>
    <h3 className="font-heading text-sm font-bold leading-snug text-foreground">{job.title}</h3>
    <p className="flex items-start gap-1.5 text-[13px] text-primary"><MapPin className="mt-0.5 size-3.5 shrink-0" />{job.location}</p>
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
    <div className="mt-auto pt-0.5"><Button asChild size="sm" variant={job.closedOn ? "outline" : "default"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">{job.closedOn ? "Ver oferta" : "Ver y postular"} <ArrowUpRight data-icon="inline-end" /></a></Button></div>
  </div>

  return <JobSection
    title="Empresas grandes que contratan desde Ecuador"
    description={<>Leídas directamente del sistema de reclutamiento de cada empresa ({companies.join(", ") || "ninguna con vacantes hoy"}), sin bolsas de empleo ni suscripciones. Solo vacantes de TI remotas abiertas a Latinoamérica, las Américas o cualquier país, o en Canadá y EE. UU. cuando el aviso dice que patrocinan la visa. Revisadas dos veces al día desde el {formatDay(data.collectedSince)}. Postulan en inglés.</>}
    badges={<><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Globe2 className="size-3" />{open.length - sponsored} remotas</Badge>{sponsored > 0 && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><Plane className="size-3" />{sponsored} con visa</Badge>}</>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver las ${count} vacantes`}
  />
}
