"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, FileText, Laptop, Search, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { celecJobs, celecJobStatus, celecLatestPublished, celecUnitUrls, type JobStatus } from "@/lib/opportunities-data"

const initialFilters = { unit: "Todas", fit: "Todas", status: "Todos", year: "Todos", experience: "Todas" }
// Experiencia mínima que pide la oferta; las que no la indican solo aparecen con "Todas"
const experienceOptions: Record<string, number> = { "Hasta 1 año": 12, "Hasta 2 años": 24 }
type FilterKey = keyof typeof initialFilters

const statusStyles: Record<JobStatus, string> = {
  Abierta: "bg-emerald-600 text-white hover:bg-emerald-600",
  "Por confirmar": "bg-amber-500 text-white hover:bg-amber-500",
  Cerrada: "bg-muted text-muted-foreground hover:bg-muted",
}

const formatDate = (iso: string | null) => iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" }) : null
const formatExperience = (months: number | null) => {
  if (months == null) return null
  if (months === 0) return "Sin experiencia mínima"
  if (months % 12 === 0) return `${months / 12} ${months === 12 ? "año" : "años"} de experiencia`
  return `${months} meses de experiencia`
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="flex min-w-0 flex-col gap-1.5"><span className="text-xs font-semibold text-muted-foreground">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">{options.map((item) => <option key={item}>{item}</option>)}</select></label>
}

export function CelecJobs() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [onlyIT, setOnlyIT] = useState(false)
  // La fecha se fija al montar para no desajustar el HTML generado en el build
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)) }, [])

  const updateFilter = (key: FilterKey, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const activeCount = Object.values(filters).filter((value) => value !== "Todos" && value !== "Todas").length + Number(onlyIT)
  const resetFilters = () => { setQuery(""); setFilters(initialFilters); setOnlyIT(false) }

  const jobs = useMemo(() => celecJobs
    .map((job) => ({ ...job, status: celecJobStatus(job, today) }))
    .sort((a, b) => Number(b.status === "Abierta") - Number(a.status === "Abierta") || Number(b.isIT) - Number(a.isIT) || b.publishedAt.localeCompare(a.publishedAt)), [today])

  const units = useMemo(() => Object.entries(jobs.reduce<Record<string, number>>((acc, job) => ({ ...acc, [job.unit]: (acc[job.unit] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])), [jobs])
  const years = useMemo(() => [...new Set(jobs.map((job) => job.publishedAt.slice(0, 4)))].sort().reverse(), [jobs])
  const openCount = jobs.filter((job) => job.status === "Abierta").length
  const itCount = jobs.filter((job) => job.isIT).length
  const itByUnit = jobs.reduce<Record<string, number>>((acc, job) => (job.isIT ? { ...acc, [job.unit]: (acc[job.unit] ?? 0) + 1 } : acc), {})

  const filtered = useMemo(() => jobs.filter((job) => {
    const searchable = `${job.role} ${job.unit} ${job.education} ${job.code}`.toLowerCase()
    return searchable.includes(query.toLowerCase())
      && (!onlyIT || job.isIT)
      && (filters.unit === "Todas" || job.unit === filters.unit)
      && (filters.fit === "Todas" || job.fit === filters.fit)
      && (filters.status === "Todos" || job.status === filters.status)
      && (filters.year === "Todos" || job.publishedAt.startsWith(filters.year))
      && (filters.experience === "Todas" || (job.minExperienceMonths != null && job.minExperienceMonths <= experienceOptions[filters.experience]))
  }), [jobs, filters, query, onlyIT])

  return <div>
    <div className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Ofertas de CELEC EP</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Convocatorias reales de la Corporación Eléctrica del Ecuador que piden o aceptan un perfil de Ingeniería en Computación. Úsalas para ver qué se pide y cuánto se paga.</p></div>
        <div className="flex flex-wrap gap-2"><Badge variant="outline">{jobs.length} ofertas</Badge><Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{itCount} de TI</Badge><Badge className={statusStyles.Abierta}>{openCount} {openCount === 1 ? "abierta" : "abiertas"}</Badge></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {units.map(([unit, count]) => <div key={unit} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
          <button type="button" onClick={() => updateFilter("unit", unit)} className="flex items-center gap-3 text-left" aria-label={`Ver ofertas de ${unit}`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><BriefcaseBusiness className="size-5" /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-foreground">{unit}</span><span className="text-xs text-muted-foreground">{count} {count === 1 ? "oferta" : "ofertas"}{itByUnit[unit] ? <span className="font-semibold text-sky-700 dark:text-sky-400"> · {itByUnit[unit]} de TI</span> : null}</span></span>
            <span className="font-heading text-2xl font-bold text-primary">{count}</span>
          </button>
          {celecUnitUrls[unit] && <Button asChild size="sm" variant="outline" className="h-7 w-full text-xs"><a href={celecUnitUrls[unit]} target="_blank" rel="noreferrer">Bolsa de empleo <ArrowUpRight data-icon="inline-end" /></a></Button>}
        </div>)}
      </div>
    </div>

    <div className="mb-6 rounded-2xl border border-border bg-card p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row"><label className="relative block flex-1"><span className="sr-only">Buscar ofertas</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo, unidad, carrera o código..." className="pl-10" /></label><Button type="button" variant={onlyIT ? "default" : "outline"} aria-pressed={onlyIT} onClick={() => setOnlyIT((value) => !value)} className={onlyIT ? "bg-sky-600 text-white hover:bg-sky-700" : "border-sky-600/40 text-sky-700 dark:text-sky-400"}><Laptop data-icon="inline-start" /> Solo TI ({itCount})</Button><Button type="button" variant="outline" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal data-icon="inline-start" /> Filtros {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}<ChevronDown className={filtersOpen ? "rotate-180 transition-transform" : "transition-transform"} /></Button>{(query || activeCount > 0) && <Button type="button" variant="ghost" onClick={resetFilters}><X data-icon="inline-start" /> Limpiar</Button>}</div>
      {filtersOpen && <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-5">
        <FilterSelect label="Unidad" value={filters.unit} options={["Todas", ...units.map(([unit]) => unit)]} onChange={(value) => updateFilter("unit", value)} />
        <FilterSelect label="Afinidad con Computación" value={filters.fit} options={["Todas", "Directa", "Posible"]} onChange={(value) => updateFilter("fit", value)} />
        <FilterSelect label="Estado" value={filters.status} options={["Todos", "Abierta", "Por confirmar", "Cerrada"]} onChange={(value) => updateFilter("status", value)} />
        <FilterSelect label="Año" value={filters.year} options={["Todos", ...years]} onChange={(value) => updateFilter("year", value)} />
        <FilterSelect label="Experiencia que piden" value={filters.experience} options={["Todas", ...Object.keys(experienceOptions)]} onChange={(value) => updateFilter("experience", value)} />
      </div>}
    </div>

    <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> ofertas encontradas</p><p className="text-xs text-muted-foreground">Fuente: sitios oficiales de CELEC EP · publicadas hasta el {formatDate(celecLatestPublished)} · <span className="font-mono">scripts/scrape_celec.py</span></p></div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((job) => <Card key={job.id} className={`flex h-full flex-col gap-0 border-l-4 py-0 ${job.isIT ? "border-l-sky-600 bg-sky-50/70 ring-1 ring-sky-600/30 dark:bg-sky-950/30" : job.fit === "Directa" ? "border-l-primary" : "border-l-secondary"}`}>
      <CardHeader className="p-5 pb-3">
        <div className="mb-2 flex flex-wrap gap-1.5">{job.isIT && <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />{job.role.split(",").length > 2 ? "Incluye cargo de TI" : "Rol de TI"}</Badge>}<Badge className={statusStyles[job.status]}>{job.status}</Badge><Badge variant="outline">{job.fit === "Directa" ? "Afinidad directa" : "Afinidad posible"}</Badge></div>
        <h3 className="line-clamp-3 font-heading text-lg font-bold leading-snug text-foreground">{job.role}</h3>
        <p className="mt-1 text-sm font-medium text-primary">{job.unit}{job.code && <span className="text-muted-foreground"> · {job.code}</span>}</p>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-4">
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {job.salary && <span className="font-bold text-foreground">{job.salary}</span>}
          {job.openings && <span className="text-muted-foreground">{job.openings} {job.openings === "1" ? "vacante" : "vacantes"}</span>}
          {formatExperience(job.minExperienceMonths) && <span className="text-muted-foreground">{formatExperience(job.minExperienceMonths)}</span>}
        </div>
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" /> Publicada {formatDate(job.publishedAt)}</span>{job.closesAt && <span>Cierra {formatDate(job.closesAt)}</span>}</div>
        <details className="group text-sm"><summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-primary hover:underline [&::-webkit-details-marker]:hidden"><ChevronDown className="size-3.5 transition-transform group-open:rotate-180" /> Ver requisitos</summary>
          <div className="mt-2 flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">{job.education && <p><span className="font-semibold text-foreground">Formación:</span> {job.education}</p>}{job.experience && <p><span className="font-semibold text-foreground">Experiencia:</span> {job.experience}</p>}<p><span className="font-semibold text-foreground">Por qué aparece:</span> {job.fitDetail}</p></div>
        </details>
      </CardContent>
      {job.url && <CardFooter className="border-t border-border px-5 py-3"><Button asChild variant="ghost" size="sm" className="-ml-2 text-primary"><a href={job.url} target="_blank" rel="noreferrer"><FileText data-icon="inline-start" /> Ver convocatoria oficial <ArrowUpRight data-icon="inline-end" /></a></Button></CardFooter>}
    </Card>)}</div>
    {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground"><Check className="mx-auto mb-3 text-primary" />No encontramos ofertas con esos filtros.</div>}
  </div>
}
