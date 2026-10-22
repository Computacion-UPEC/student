"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CalendarDays, Laptop, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import privateData from "@/lib/data/private-jobs.json"
import type { PrivateJob } from "@/lib/private-portals"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = privateData as { collectedSince: string; jobs: PrivateJob[] }
/** Solo cargos de TI: el recolector guarda todas las ofertas, pero aquí mostramos únicamente las del área. */
export const privateITJobs = data.jobs.filter((job) => job.isIT)

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })
const tidy = (text: string) => text === text.toUpperCase() ? text.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()).replace(/\b(Ti|Ia|Ux|Qa|Bi)\b/g, (word) => word.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y|En|Con)\b/g, (word) => word.toLowerCase()) : text

export function PrivateJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [currentYear, setCurrentYear] = useState<string | null>(null)
  useEffect(() => { setCurrentYear(String(new Date().getFullYear())) }, [])

  const isPastYear = (job: PrivateJob) => currentYear != null && (job.publishedAt ?? job.firstSeen).slice(0, 4) < currentYear
  const open = privateITJobs.filter((job) => !job.closedOn)
  const closed = onlyOpen ? [] : privateITJobs.filter((job) => job.closedOn && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : privateITJobs.filter((job) => job.closedOn && isPastYear(job)).length
  const companies = [...new Set(open.map((job) => job.company))]

  // Sin ofertas de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: PrivateJob) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.closedOn ? "border-l-muted-foreground/40 bg-card" : "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge variant="secondary">{job.company}</Badge>{job.closedOn && <Badge variant="outline">Cerrada</Badge>}</div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{tidy(job.title)}</h3>
    {job.city && <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{tidy(job.city)}</p>}
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
    <div className="mt-auto pt-1"><Button asChild size="sm" variant={job.closedOn ? "outline" : "default"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">{job.closedOn ? "Ver oferta" : "Ver y postular"} <ArrowUpRight data-icon="inline-end" /></a></Button></div>
  </div>

  return <JobSection
    title="Ofertas de TI en empresas privadas grandes"
    description={<>Vacantes reales de {companies.join(", ") || "empresas privadas"}, revisadas dos veces al día desde el {formatDay(data.collectedSince)}. Solo mostramos las del área de TI.</>}
    badges={<Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{open.length} abiertas de TI</Badge>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver las ${count} ofertas de TI`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
