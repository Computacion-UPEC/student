"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CalendarDays, ChevronDown, Laptop, Mail, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import financeData from "@/lib/data/finance-jobs.json"
import type { FinanceJob } from "@/lib/finance-portals"
import { HistoricNote } from "@/components/opportunities/historic-note"
import { JobSection } from "@/components/opportunities/collapsible"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = financeData as { collectedSince: string; jobs: FinanceJob[] }
/** Solo cargos de TI: el recolector guarda todas las ofertas, pero aquí mostramos únicamente las del área. */
export const financeITJobs = data.jobs.filter((job) => job.isIT)

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })
// "INGENIERO DE DATOS - QUITO" -> "Ingeniero de datos - Quito"
const tidy = (title: string) => title === title.toUpperCase() ? title.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()).replace(/\b(Ti|Ia|Ux|Qa|Smo|Bi|Coe|Uio|Gye)\b/g, (word) => word.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y|En|Con)\b/g, (word) => word.toLowerCase()) : title

export function FinanceJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [currentYear, setCurrentYear] = useState<string | null>(null)
  useEffect(() => { setCurrentYear(String(new Date().getFullYear())) }, [])

  const isPastYear = (job: FinanceJob) => currentYear != null && (job.publishedAt ?? job.firstSeen).slice(0, 4) < currentYear
  const open = financeITJobs.filter((job) => !job.closedOn)
  const closed = onlyOpen ? [] : financeITJobs.filter((job) => job.closedOn && (showHistoric || !isPastYear(job)))
  const hiddenHistoric = showHistoric || onlyOpen ? 0 : financeITJobs.filter((job) => job.closedOn && isPastYear(job)).length
  const institutions = [...new Set(open.map((job) => job.institution))]

  // Sin ofertas de TI que mostrar, la sección no aparece
  if (open.length === 0 && closed.length === 0 && hiddenHistoric === 0) return null

  const card = (job: FinanceJob) => <div key={job.id} className={`flex flex-col gap-2 rounded-xl border border-l-4 p-4 ${job.closedOn ? "border-l-muted-foreground/40 bg-card" : "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30"}`}>
    <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge variant="secondary">{job.institution}</Badge>{job.closedOn && <Badge variant="outline">Cerrada</Badge>}</div>
    <h3 className="font-heading text-base font-bold leading-snug text-foreground">{tidy(job.title)}</h3>
    {(job.city || job.province) && <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{[job.city, job.province].filter(Boolean).map((place) => tidy(place!)).join(", ")}</p>}
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
    {job.requirements?.length ? <details className="group text-xs"><summary className="flex cursor-pointer list-none items-center gap-1 font-semibold text-primary hover:underline [&::-webkit-details-marker]:hidden"><ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /> Ver requisitos</summary><ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">{job.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></details> : null}
    <div className="mt-auto flex flex-wrap gap-2 pt-1">
      {job.apply && !job.closedOn ? <Button asChild size="sm" className="h-8"><a href={`mailto:${job.apply.email}?subject=${encodeURIComponent(job.apply.subject)}`}><Mail data-icon="inline-start" /> Postular por correo</a></Button> : null}
      <Button asChild size="sm" variant={job.apply || job.closedOn ? "ghost" : "default"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">Ver oferta <ArrowUpRight data-icon="inline-end" /></a></Button>
    </div>
  </div>

  return <JobSection
    title="Ofertas de TI en bancos y cooperativas"
    description={<>Vacantes reales de {institutions.join(", ") || "bancos y cooperativas"}, revisadas dos veces al día desde el {formatDay(data.collectedSince)}. Solo mostramos las del área de TI.</>}
    badges={<Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{open.length} abiertas de TI</Badge>}
    open={open.map(card)}
    closed={closed.map(card)}
    moreLabel={(count) => `Ver las ${count} ofertas de TI`}
    footer={<HistoricNote count={hiddenHistoric} onShow={onShowHistoric} />}
  />
}
