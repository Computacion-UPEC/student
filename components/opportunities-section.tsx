"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { opportunities, opportunityCompanies, opportunityLevels, opportunityLocations, opportunityModalities, opportunitySkills, opportunitySources, opportunityYears, companyColors, companyInitials } from "@/lib/opportunities-data"

const accentClasses = { green: "border-l-primary", gold: "border-l-secondary", blue: "border-l-sky-500" }
const initialFilters = { skill: "Todas", level: "Todos", modality: "Todas", source: "Todas", company: "Todas", location: "Todas", year: "Todos" }

type FilterKey = keyof typeof initialFilters

function CompanyMark({ company }: { company: string }) {
  return <div aria-label={`Logo de ${company}`} className="flex size-12 shrink-0 items-center justify-center rounded-xl text-xs font-black tracking-tight text-white shadow-sm" style={{ backgroundColor: companyColors[company] ?? "hsl(var(--primary))" }}>{companyInitials[company] ?? company.slice(0, 2).toUpperCase()}</div>
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="flex min-w-0 flex-col gap-1.5"><span className="text-xs font-semibold text-muted-foreground">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"><option>{options[0]}</option>{options.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
}

export function OpportunitiesSection() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateFilter = (key: FilterKey, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const activeCount = Object.values(filters).filter((value) => value !== "Todos" && value !== "Todas").length
  const resetFilters = () => { setQuery(""); setFilters(initialFilters) }

  const filtered = useMemo(() => opportunities.filter((item) => {
    const searchable = `${item.role} ${item.company} ${item.location} ${item.skills.join(" ")} ${item.source}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (filters.skill === "Todas" || item.skills.includes(filters.skill)) && (filters.level === "Todos" || item.level === filters.level) && (filters.modality === "Todas" || item.modality === filters.modality) && (filters.source === "Todas" || item.source === filters.source) && (filters.company === "Todas" || item.company === filters.company) && (filters.location === "Todas" || item.location === filters.location) && (filters.year === "Todos" || item.publishedAt.startsWith(filters.year))
  }), [filters, query])

  return <section id="oportunidades" className="scroll-mt-20 border-t border-border bg-muted/30 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div><Badge className="mb-4 gap-2 bg-primary text-primary-foreground"><BriefcaseBusiness data-icon="inline-start" /> Mercado laboral</Badge><h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">Oportunidades</h2><p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Explora el histórico de ofertas, compara empresas y descubre qué especialidades están abriendo puertas para estudiantes de computación.</p></div>
        <Card className="border-primary/20 bg-primary text-primary-foreground"><CardContent className="flex gap-4 p-5"><Sparkles className="mt-1 shrink-0 text-secondary" /><div><p className="font-semibold">Especialízate con evidencia</p><p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">Filtra por empresa, modalidad, nivel, año y habilidad para orientar tu siguiente proyecto de aprendizaje.</p></div></CardContent></Card>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row"><label className="relative block flex-1"><span className="sr-only">Buscar oportunidades</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo, empresa, fuente o habilidad..." className="pl-10" /></label><Button type="button" variant="outline" onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal data-icon="inline-start" /> Filtros {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}<ChevronDown className={filtersOpen ? "rotate-180 transition-transform" : "transition-transform"} /></Button>{(query || activeCount > 0) && <Button type="button" variant="ghost" onClick={resetFilters}><X data-icon="inline-start" /> Limpiar</Button>}</div>
        {filtersOpen && <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4"><FilterSelect label="Empresa" value={filters.company} options={opportunityCompanies} onChange={(value) => updateFilter("company", value)} /><FilterSelect label="Habilidad" value={filters.skill} options={opportunitySkills} onChange={(value) => updateFilter("skill", value)} /><FilterSelect label="Nivel" value={filters.level} options={opportunityLevels} onChange={(value) => updateFilter("level", value)} /><FilterSelect label="Modalidad" value={filters.modality} options={opportunityModalities} onChange={(value) => updateFilter("modality", value)} /><FilterSelect label="Ubicación" value={filters.location} options={opportunityLocations} onChange={(value) => updateFilter("location", value)} /><FilterSelect label="Fuente" value={filters.source} options={opportunitySources} onChange={(value) => updateFilter("source", value)} /><FilterSelect label="Año" value={filters.year} options={opportunityYears} onChange={(value) => updateFilter("year", value)} /></div>}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> ofertas encontradas</p><p className="text-sm font-medium text-primary">Actualizado por la comunidad estudiantil</p></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <Card key={item.id} className={`flex h-full flex-col border-l-4 ${accentClasses[item.accent]} transition-transform hover:-translate-y-1`}><CardHeader><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><CompanyMark company={item.company} /><div><CardTitle className="font-heading text-xl leading-tight">{item.role}</CardTitle><p className="mt-1 font-medium text-primary">{item.company}</p></div></div><Badge variant="outline">{item.level}</Badge></div></CardHeader><CardContent className="flex-1"><div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin data-icon="inline-start" />{item.location}</span><span>{item.modality}</span><span className="inline-flex items-center gap-1"><CalendarDays data-icon="inline-start" />{new Date(item.publishedAt).toLocaleDateString("es-EC", { month: "short", year: "numeric" })}</span></div><p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p><div className="mt-5 flex flex-wrap gap-2">{item.skills.map((itemSkill) => <Badge key={itemSkill} variant="secondary">{itemSkill}</Badge>)}</div></CardContent><CardFooter className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{item.source}</span><Button variant="ghost" size="sm" className="text-primary">Ver referencia <ArrowUpRight data-icon="inline-end" /></Button></CardFooter></Card>)}</div>
      {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground"><Check className="mx-auto mb-3 text-primary" />No encontramos ofertas con esos filtros.</div>}
    </div>
  </section>
}
