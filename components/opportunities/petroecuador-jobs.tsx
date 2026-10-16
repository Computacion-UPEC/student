"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, CalendarClock, ChevronDown, CircleDot, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import petroecuadorData from "@/lib/data/petroecuador-jobs.json"
import type { PetroecuadorJob } from "@/lib/opportunities-data"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = petroecuadorData as { source: string; collectedSince: string; jobs: PetroecuadorJob[] }
export const itJobs = data.jobs.filter((job) => job.isIT)
const PREVIEW = 6

type Status = "Abierta" | "Próxima" | "Cerrada"
const statusStyles: Record<Status, string> = {
  Abierta: "bg-emerald-600 text-white hover:bg-emerald-600",
  Próxima: "bg-secondary text-secondary-foreground hover:bg-secondary",
  Cerrada: "bg-muted text-muted-foreground hover:bg-muted",
}

const formatDateTime = (iso: string | null) => iso ? new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"
const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" })

function statusOf(job: PetroecuadorJob, now: number | null): Status {
  // Antes de montar no se conoce la hora: se muestra como cerrada para no desajustar el HTML del build
  if (now == null || !job.closesAt) return "Cerrada"
  if (job.opensAt && now < Date.parse(job.opensAt)) return "Próxima"
  return now <= Date.parse(job.closesAt) ? "Abierta" : "Cerrada"
}

export function PetroecuadorJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [now, setNow] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { setNow(Date.now()) }, [])

  // Solo cargos de TI: el recolector guarda todo, pero aquí mostramos únicamente lo del área
  const jobs = useMemo(() => itJobs
    .map((job) => ({ ...job, status: statusOf(job, now) }))
    .sort((a, b) => Number(b.status !== "Cerrada") - Number(a.status !== "Cerrada") || (b.opensAt ?? "").localeCompare(a.opensAt ?? "")), [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: PetroecuadorJob) => currentYear != null && (job.opensAt ?? job.firstSeen).slice(0, 4) < currentYear
  const filtered = jobs.filter((job) => (!onlyOpen || job.status === "Abierta") && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric ? 0 : jobs.filter((job) => isPastYear(job) && (!onlyOpen || job.status === "Abierta")).length
  const visible = showAll ? filtered : filtered.slice(0, PREVIEW)
  const openCount = jobs.filter((job) => job.status === "Abierta").length

  // Sin cargos de TI que mostrar, la sección no aparece
  if (filtered.length === 0 && hiddenHistoric === 0) return null

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Cargos de TI en EP Petroecuador</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Petroecuador publica sus procesos solo mientras están abiertos, a veces por 2 días. Los revisamos dos veces al día desde el {formatDay(data.collectedSince)} y aquí mostramos solo los del área de TI.</p></div>
      <div className="flex flex-wrap gap-2"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{jobs.length} de TI</Badge>{now != null && <Badge className={statusStyles.Abierta}><CircleDot className="size-3" />{openCount} {openCount === 1 ? "abierta" : "abiertas"}</Badge>}</div>
    </div>

    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="text-primary"><a href={data.source} target="_blank" rel="noreferrer">Postular en el sitio oficial <ArrowUpRight data-icon="inline-end" /></a></Button>
    </div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{onlyOpen ? "Petroecuador no tiene cargos de TI abiertos en este momento." : "No hay cargos de TI de este año."}{hiddenHistoric > 0 && <> <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver {hiddenHistoric} de años anteriores</button></>}</div> : <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((job) => <div key={job.code} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.isIT ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : "border-l-primary bg-card"}`}>
        <div className="flex flex-wrap gap-1.5">{job.isIT && <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge>}<Badge className={statusStyles[job.status]}>{job.status}</Badge></div>
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">{job.role}</h3>
        <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{job.city}<span className="text-muted-foreground">· {job.code}</span></p>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{formatDateTime(job.opensAt)} → {formatDateTime(job.closesAt)}</span></p>
        <p className="text-xs text-muted-foreground">{job.type}</p>
      </div>)}</div>
      {filtered.length > PREVIEW && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : `Ver los ${filtered.length} cargos de TI`}</Button>}
    </>}
  </div>
}
