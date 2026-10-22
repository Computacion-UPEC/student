"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, Building, CalendarClock, CircleDot, DollarSign, Laptop, MapPin, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import cntData from "@/lib/data/cnt-jobs.json"
import publicData from "@/lib/data/public-jobs.json"
import { encuentraEmpleoLinks, type CntJob, type PublicContestJob } from "@/lib/public-portals"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

/** Cargo de TI de una institución pública, de CNT Empleo o de Encuentra Empleo, con su enlace para postular. */
type PublicITJob = { id: string; institution: string; title: string; city?: string; salary?: number | null; vacancies?: number; closesAt: string | null; applyUrl: string; applyNote?: string; source: "CNT Empleo" | "Encuentra Empleo" }

const cntJobs: PublicITJob[] = (cntData.jobs as CntJob[]).filter((job) => job.isIT).map((job) => ({
  id: `cnt-${job.id}`, institution: "CNT EP", title: job.title,
  // El portal publica el último día de publicación: se toma hasta el fin de ese día
  closesAt: job.closesOn ? `${job.closesOn}T23:59:00-05:00` : null, applyUrl: job.url, source: "CNT Empleo",
}))
const contestJobs: PublicITJob[] = ((publicData as { jobs: PublicContestJob[] }).jobs).map((job) => ({
  id: `mdt-${job.id}`, institution: job.institution, title: job.title, city: job.city, salary: job.salary, vacancies: job.vacancies,
  closesAt: job.closesAt, applyUrl: encuentraEmpleoLinks[0].url, applyNote: `Código ${job.id}: ingresa a Encuentra Empleo y búscalo en Sector público.`, source: "Encuentra Empleo",
}))
export const publicITJobs = [...cntJobs, ...contestJobs]

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
const titleCase = (text: string) => text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
// Antes de montar no se conoce la hora: se muestra como cerrada para no desajustar el HTML del build
const isOpen = (job: PublicITJob, now: number | null) => now != null && job.closesAt != null && now <= Date.parse(job.closesAt)

export function PublicITJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])

  const jobs = useMemo(() => publicITJobs
    .map((job) => ({ ...job, open: isOpen(job, now) }))
    .sort((a, b) => (b.closesAt ?? "").localeCompare(a.closesAt ?? "")), [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: PublicITJob) => currentYear != null && job.closesAt != null && job.closesAt.slice(0, 4) < currentYear
  const open = jobs.filter((job) => job.open)
  const closed = onlyOpen ? [] : jobs.filter((job) => !job.open && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : jobs.filter((job) => !job.open && isPastYear(job)).length

  // Sin cargos de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: (typeof jobs)[number]) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.open ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : "border-l-muted-foreground/40 bg-card"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={job.open ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{job.open ? "Abierta" : "Cerrada"}</Badge><Badge variant="outline">{job.source}</Badge></div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{titleCase(job.title)}</h3>
    <p className="flex items-start gap-1.5 text-sm font-medium text-primary"><Building className="mt-0.5 size-3.5 shrink-0" />{titleCase(job.institution)}</p>
    {job.city && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5 shrink-0" />{titleCase(job.city)}{job.vacancies && job.vacancies > 1 ? ` · ${job.vacancies} vacantes` : ""}</p>}
    {job.salary && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="size-3.5 shrink-0" />RMU ${job.salary.toLocaleString("es-EC", { minimumFractionDigits: 2 })}</p>}
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{job.closesAt ? `Postulación hasta ${formatDateTime(job.closesAt)}` : "Publicación vencida"}</span></p>
    {job.applyNote && job.open && <p className="text-xs text-muted-foreground">{job.applyNote}</p>}
    <div className="mt-auto flex flex-wrap gap-2 pt-1">
      {job.open
        ? <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700"><a href={job.applyUrl} target="_blank" rel="noreferrer"><Send data-icon="inline-start" />Postular</a></Button>
        : <Button asChild size="sm" variant="outline"><a href={job.applyUrl} target="_blank" rel="noreferrer">Ver en {job.source}<ArrowUpRight data-icon="inline-end" /></a></Button>}
    </div>
  </div>

  return <JobSection
    title="Cargos de TI en instituciones públicas"
    description="Revisamos los concursos de méritos y oposición de todas las instituciones en Encuentra Empleo (SRI, ECU 911, Registro Civil, municipios y más) dos veces al día, y el portal CNT Empleo cada noche, y aquí mostramos solo los cargos de TI. La postulación dura pocos días."
    badges={now != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CircleDot className="size-3" />{open.length} {open.length === 1 ? "abierta" : "abiertas"} de TI</Badge>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver los ${count} cargos de TI`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
