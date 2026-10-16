"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, CalendarDays, ChevronDown, Laptop, Mail, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import financeData from "@/lib/data/finance-jobs.json"
import type { FinanceJob } from "@/lib/finance-portals"
import type { EmploymentFilters } from "@/components/opportunities/celec-jobs"

const data = financeData as { collectedSince: string; jobs: FinanceJob[] }
/** Solo cargos de TI: el recolector guarda todas las ofertas, pero aquí mostramos únicamente las del área. */
export const financeITJobs = data.jobs.filter((job) => job.isIT)
const PREVIEW = 6

const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })
// "INGENIERO DE DATOS - QUITO" -> "Ingeniero de datos - Quito"
const tidy = (title: string) => title === title.toUpperCase() ? title.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()).replace(/\b(Ti|Ia|Ux|Qa|Smo|Bi|Coe|Uio|Gye)\b/g, (word) => word.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y|En|Con)\b/g, (word) => word.toLowerCase()) : title

export function FinanceJobs({ onlyOpen, showHistoric, onShowHistoric }: EmploymentFilters) {
  const [currentYear, setCurrentYear] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  useEffect(() => { setCurrentYear(String(new Date().getFullYear())) }, [])

  const isPastYear = (job: FinanceJob) => currentYear != null && (job.publishedAt ?? job.firstSeen).slice(0, 4) < currentYear
  const visibleToday = (job: FinanceJob) => (!job.closedOn || (showHistoric && !onlyOpen)) && (showHistoric || !isPastYear(job))
  const filtered = financeITJobs.filter(visibleToday)
  const hiddenHistoric = showHistoric ? 0 : financeITJobs.filter((job) => !visibleToday(job) && !onlyOpen).length
  const shown = showAll ? filtered : filtered.slice(0, PREVIEW)
  const institutions = [...new Set(filtered.map((job) => job.institution))]

  // Sin ofertas de TI que mostrar, la sección no aparece
  if (filtered.length === 0 && hiddenHistoric === 0) return null

  return <div className="mb-12">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Ofertas de TI en bancos y cooperativas</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Vacantes reales de {institutions.join(", ") || "bancos y cooperativas"}, revisadas dos veces al día desde el {formatDay(data.collectedSince)}. Solo mostramos las del área de TI.</p></div>
      <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{filtered.length} de TI</Badge>
    </div>

    {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No hay ofertas de TI de este año.{hiddenHistoric > 0 && <> <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver {hiddenHistoric} anteriores</button></>}</div> : <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{shown.map((job) => <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-sky-600 bg-sky-50/70 p-4 ring-1 ring-sky-600/30 dark:bg-sky-950/30">
        <div className="flex flex-wrap gap-1.5"><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge><Badge variant="secondary">{job.institution}</Badge>{job.closedOn && <Badge variant="outline">Cerrada</Badge>}</div>
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">{tidy(job.title)}</h3>
        {(job.city || job.province) && <p className="flex items-center gap-1.5 text-sm text-primary"><MapPin className="size-3.5" />{[job.city, job.province].filter(Boolean).map((place) => tidy(place!)).join(", ")}</p>}
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{job.publishedAt ? `Publicada ${formatDay(job.publishedAt)}` : `Vista desde ${formatDay(job.firstSeen)}`}{job.closedOn && ` · cerró ${formatDay(job.closedOn)}`}</p>
        {job.requirements?.length ? <details className="group text-xs"><summary className="flex cursor-pointer list-none items-center gap-1 font-semibold text-primary hover:underline [&::-webkit-details-marker]:hidden"><ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /> Ver requisitos</summary><ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">{job.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></details> : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {job.apply ? <Button asChild size="sm" className="h-8"><a href={`mailto:${job.apply.email}?subject=${encodeURIComponent(job.apply.subject)}`}><Mail data-icon="inline-start" /> Postular por correo</a></Button> : null}
          <Button asChild size="sm" variant={job.apply ? "ghost" : "default"} className="h-8"><a href={job.url} target="_blank" rel="noreferrer">Ver oferta <ArrowUpRight data-icon="inline-end" /></a></Button>
        </div>
      </div>)}</div>
      {filtered.length > PREVIEW && <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setShowAll((value) => !value)}><ChevronDown data-icon="inline-start" className={showAll ? "rotate-180" : ""} />{showAll ? "Ver menos" : `Ver las ${filtered.length} ofertas de TI`}</Button>}
      {hiddenHistoric > 0 && <p className="mt-3 text-xs text-muted-foreground">{hiddenHistoric} ofertas anteriores ocultas. <button type="button" onClick={onShowHistoric} className="font-semibold text-primary hover:underline">Ver históricos</button></p>}
    </>}
  </div>
}
