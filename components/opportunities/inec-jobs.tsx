"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, CalendarClock, CircleDot, FileText, Laptop, MapPin, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import inecData from "@/lib/data/inec-jobs.json"
import type { InecJob } from "@/lib/public-portals"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = inecData as { source: string; jobs: InecJob[] }
export const inecITJobs = data.jobs.filter((job) => job.isIT)

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

// Antes de montar no se conoce la hora: se muestra como cerrada para no desajustar el HTML del build
const isOpen = (job: InecJob, now: number | null) => now != null && job.closesAt != null && now <= Date.parse(job.closesAt)

export function InecJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])

  // Solo cargos de TI: el recolector guarda todo, pero aquí mostramos únicamente lo del área
  const jobs = useMemo(() => inecITJobs
    .map((job) => ({ ...job, open: isOpen(job, now) }))
    .sort((a, b) => (b.closesAt ?? "").localeCompare(a.closesAt ?? "")), [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: InecJob) => currentYear != null && (job.closesAt ?? job.firstSeen).slice(0, 4) < currentYear
  const open = jobs.filter((job) => job.open)
  const closed = onlyOpen ? [] : jobs.filter((job) => !job.open && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : jobs.filter((job) => !job.open && isPastYear(job)).length

  // Sin cargos de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: (typeof jobs)[number]) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.open ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : "border-l-muted-foreground/40 bg-card"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={job.open ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{job.open ? "Abierta" : "Cerrada"}</Badge></div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{job.title}</h3>
    <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5 shrink-0" />{job.place}</p>
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{job.closesAt ? `Cierra ${formatDateTime(job.closesAt)}` : job.deadlineText}</span></p>
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><FileText className="mt-0.5 size-3.5 shrink-0" /><span>{job.contract} · {job.project}</span></p>
    {/* El formulario solo recibe postulaciones mientras la convocatoria está abierta */}
    <div className="mt-auto flex flex-wrap gap-2 pt-1">
      {job.open && job.applyUrl && <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700"><a href={job.applyUrl} target="_blank" rel="noreferrer"><Send data-icon="inline-start" />Postular</a></Button>}
      <Button asChild size="sm" variant="outline"><a href={job.url} target="_blank" rel="noreferrer"><FileText data-icon="inline-start" />Bases (PDF)</a></Button>
    </div>
  </div>

  return <JobSection
    title="Cargos de TI en el INEC"
    description="El INEC contrata casi cada semana para sus encuestas y proyectos, y cada postulación abre solo de 1 a 3 días. Revisamos su página dos veces al día y aquí mostramos los cargos de TI y datos. Mientras una convocatoria está abierta, el botón Postular lleva al formulario oficial del INEC."
    badges={now != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CircleDot className="size-3" />{open.length} {open.length === 1 ? "abierta" : "abiertas"} de TI</Badge>}
    actions={<div className="mb-4 flex flex-wrap items-center gap-2"><Button asChild size="sm" variant="ghost" className="text-primary"><a href={data.source} target="_blank" rel="noreferrer">Ver todas en el sitio del INEC <ArrowUpRight data-icon="inline-end" /></a></Button></div>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver los ${count} cargos de TI`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
