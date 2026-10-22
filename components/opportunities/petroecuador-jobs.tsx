"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, CalendarClock, CircleDot, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import petroecuadorData from "@/lib/data/petroecuador-jobs.json"
import type { PetroecuadorJob } from "@/lib/opportunities-data"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = petroecuadorData as { source: string; collectedSince: string; jobs: PetroecuadorJob[] }
export const itJobs = data.jobs.filter((job) => job.isIT)

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
  useEffect(() => { setNow(Date.now()) }, [])

  // Solo cargos de TI: el recolector guarda todo, pero aquí mostramos únicamente lo del área
  const jobs = useMemo(() => itJobs
    .map((job) => ({ ...job, status: statusOf(job, now) }))
    .sort((a, b) => (b.opensAt ?? "").localeCompare(a.opensAt ?? "")), [now])

  const currentYear = now == null ? null : new Date(now).getFullYear().toString()
  const isPastYear = (job: PetroecuadorJob) => currentYear != null && (job.opensAt ?? job.firstSeen).slice(0, 4) < currentYear
  // Las próximas también van a la vista: se puede preparar la postulación
  const open = jobs.filter((job) => job.status !== "Cerrada" && (!onlyOpen || job.status === "Abierta"))
  const closed = onlyOpen ? [] : jobs.filter((job) => job.status === "Cerrada" && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : jobs.filter((job) => job.status === "Cerrada" && isPastYear(job)).length
  const openCount = jobs.filter((job) => job.status === "Abierta").length

  // Sin cargos de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: (typeof jobs)[number]) => <div key={job.code} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.status === "Cerrada" ? "border-l-muted-foreground/40 bg-card" : "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge className={statusStyles[job.status]}>{job.status}</Badge></div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{job.role}</h3>
    <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{job.city}<span className="text-muted-foreground">· {job.code}</span></p>
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0" /><span>{formatDateTime(job.opensAt)} → {formatDateTime(job.closesAt)}</span></p>
    <p className="text-xs text-muted-foreground">{job.type}</p>
  </div>

  return <JobSection
    title="Cargos de TI en EP Petroecuador"
    description={<>Petroecuador publica sus procesos solo mientras están abiertos, a veces por 2 días. Los revisamos dos veces al día desde el {formatDay(data.collectedSince)} y aquí mostramos solo los del área de TI.</>}
    badges={now != null && <Badge className={statusStyles.Abierta}><CircleDot className="size-3" />{openCount} {openCount === 1 ? "abierta" : "abiertas"} de TI</Badge>}
    actions={<div className="mb-4 flex flex-wrap items-center gap-2"><Button asChild size="sm" variant="ghost" className="text-primary"><a href={data.source} target="_blank" rel="noreferrer">Postular en el sitio oficial <ArrowUpRight data-icon="inline-end" /></a></Button></div>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver los ${count} cargos de TI`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
