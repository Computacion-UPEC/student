"use client"

import { ArrowUpRight, CalendarDays, Globe2, Laptop, MapPin, Plane } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import globalData from "@/lib/data/global-jobs.json"
import sponsorsData from "@/lib/data/visa-sponsors.json"
import { Collapsible, JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

/** Vacante de TI en el extranjero de una empresa grande (lib/data/global-jobs.json, scripts/global/collect.mjs). */
export type GlobalJob = {
  id: string
  company: string
  title: string
  location: string
  route: "remoto" | "patrocinio"
  /** Puestos de TI con LMIA aprobado que la empresa obtuvo en Canadá el último año */
  canadaLmia?: number
  publishedAt: string | null
  url: string
  firstSeen: string
  closedOn?: string
}

const data = globalData as { collectedSince: string; jobs: GlobalJob[] }
export const countOpenGlobalJobs = () => data.jobs.filter((job) => !job.closedOn).length

type CanadaSponsor = { name: string; positions: number; globalTalent: boolean; cities: string[]; occupations: string[] }
const sponsors = sponsorsData as { source: string; quarters: string[]; canada: CanadaSponsor[] }
const TOP_SPONSORS = 40

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
      {job.route === "remoto" ? <Badge variant="outline" className="gap-1"><Globe2 className="size-3" />Remoto desde Ecuador</Badge> : <Badge variant="outline" className="gap-1 border-emerald-600/60 text-emerald-700 dark:text-emerald-400"><Plane className="size-3" />{job.canadaLmia ? `Patrocinó ${job.canadaLmia} visas de TI en Canadá` : "El aviso ofrece visa"}</Badge>}
      {job.closedOn && <Badge variant="outline">Cerrada</Badge>}
    </div>
    <h3 className="font-heading text-sm font-bold leading-snug text-foreground">{job.title}</h3>
    <p className="flex items-start gap-1.5 text-[13px] text-primary"><MapPin className="mt-0.5 size-3.5 shrink-0" />{job.location}</p>
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
    <div className="mt-auto pt-0.5"><Button asChild size="sm" variant={job.closedOn ? "outline" : "default"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">{job.closedOn ? "Ver oferta" : "Ver y postular"} <ArrowUpRight data-icon="inline-end" /></a></Button></div>
  </div>

  return <JobSection
    title="Empresas grandes que contratan desde Ecuador"
    description={<>Leídas directamente del sistema de reclutamiento de cada empresa ({companies.join(", ") || "ninguna con vacantes hoy"}), sin bolsas de empleo ni suscripciones. Solo vacantes de TI remotas abiertas a Latinoamérica, las Américas o cualquier país, o en Canadá y EE. UU. cuando el aviso ofrece la visa o la empresa patrocinó visas de TI en Canadá el último año (datos oficiales del LMIA). Que la empresa patrocine no garantiza que lo haga en cada puesto: pregúntalo al postular. Revisadas dos veces al día desde el {formatDay(data.collectedSince)}. Postulan en inglés.</>}
    badges={<><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Globe2 className="size-3" />{open.length - sponsored} remotas</Badge>{sponsored > 0 && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><Plane className="size-3" />{sponsored} con visa</Badge>}</>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver las ${count} vacantes`}
    footer={<Collapsible className="mt-2" summary={`Empresas que más patrocinaron visas de TI en Canadá (${sponsors.quarters[0]} a ${sponsors.quarters.at(-1)})`}>
      <p className="mb-2 text-xs text-muted-foreground">Puestos de TI con LMIA aprobado, el permiso que una empresa necesita para contratar a un extranjero. &ldquo;Vía rápida&rdquo; es el Global Talent Stream, con trámite de unas dos semanas. Fuente: <a href={sponsors.source} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">Gobierno de Canadá (ESDC)</a>. Busca sus vacantes en el portal oficial de cada empresa.</p>
      <ol className="grid gap-x-4 gap-y-1 text-[13px] sm:grid-cols-2 lg:grid-cols-3">{sponsors.canada.slice(0, TOP_SPONSORS).map((sponsor) => <li key={sponsor.name} className="flex flex-col">
        <span className="font-semibold text-foreground">{sponsor.name}{sponsor.globalTalent && <span className="ml-1 text-[11px] font-normal text-emerald-700 dark:text-emerald-400">vía rápida</span>}</span>
        <span className="text-xs text-muted-foreground">{sponsor.positions} puestos · {sponsor.cities.slice(0, 2).join(", ")} · {sponsor.occupations.slice(0, 2).join(", ")}</span>
      </li>)}</ol>
    </Collapsible>}
  />
}
