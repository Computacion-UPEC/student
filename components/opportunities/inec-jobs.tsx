"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, CalendarClock, ChevronDown, CircleDot, FileText, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import inecData from "@/lib/data/inec-jobs.json"
import type { InecJob } from "@/lib/public-portals"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = inecData as { source: string; jobs: InecJob[] }
export const inecITJobs = data.jobs.filter((job) => job.isIT)
const PREVIEW = 6

const formatDateTime = (iso: string) => new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

// Antes de montar no se conoce la hora: se muestra como cerrada para no desajustar el HTML del build
const isOpen = (job: InecJob, now: number | null) => now != null && job.closesAt != null && now <= Date.parse(job.closesAt)

export function InecJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { setNow(Date.now()) }, [])

  // Solo cargos de TI: el recolector guarda todo, pero aquí mostramos únicamente lo del área
  const jobs = useMemo(() => inecITJobs
    .map((job) => ({ ...job, open: isOpen(job, now) }))
    .sort((a, b) => Number(b.open) - Number(a.open) || (b.closesAt ?? "").localeCompare(a.closesAt ?? "")), [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: InecJob) => currentYear != null && (job.closesAt ?? job.firstSeen).slice(0, 4) < currentYear
  const filtered = jobs.filter((job) => (!onlyOpen || job.open) && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric ? 0 : jobs.filter((job) => isPastYear(job) && (!onlyOpen || job.open)).length
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW)
  const openCount = jobs.filter((job) => job.open).length

  // Sin cargos de TI que mostrar, la sección no aparece
  if (filtered.length === 0 && hiddenHistoric === 0) return null

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Cargos de TI en el INEC</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">El INEC contrata casi cada semana para sus encuestas y proyectos, y cada postulación abre solo de 1 a 3 días. Revisamos su página dos veces al día y aquí mostramos los cargos de TI y datos. Las bases y el enlace para postular están en el PDF de cada convocatoria.</p></div>
      <div className="flex flex-wrap gap-2"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{jobs.length} de TI</Badge>{now != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CircleDot className="size-3" />{openCount} {openCount === 1 ? "abierta" : "abiertas"}</Badge>}</div>
    </div>

    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="text-primary"><a href={data.source} target="_blank" rel="noreferrer">Ver todas en el sitio del INEC <ArrowUpRight data-icon="inline-end" /></a></Button>
    </div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{onlyOpen ? "El INEC no tiene cargos de TI abiertos en este momento." : "No hay cargos de TI de este año."}{hiddenHistoric > 0 && <> <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver {hiddenHistoric} de años anteriores</button></>}</div> : <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((job) => <a key={job.id} href={job.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-2 rounded-xl border border-l-4 border-l-sky-600 bg-sky-50/70 p-4 ring-1 ring-sky-600/30 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-sky-950/30">
        <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={job.open ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-muted text-muted-foreground hover:bg-muted"}>{job.open ? "Abierta" : "Cerrada"}</Badge></div>
        <h3 className="flex items-start gap-1 font-heading text-base font-bold leading-snug text-foreground">{job.title}<ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></h3>
        <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5 shrink-0" />{job.place}</p>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{job.closesAt ? `Cierra ${formatDateTime(job.closesAt)}` : job.deadlineText}</span></p>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><FileText className="mt-0.5 size-3.5 shrink-0" /><span>{job.contract} · {job.project}</span></p>
      </a>)}</div>
      {filtered.length > PREVIEW && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : `Ver los ${filtered.length} cargos de TI`}</Button>}
    </>}
  </div>
}
