"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, MapPin, Search, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { opportunities, opportunityLevels, opportunitySkills } from "@/lib/opportunities-data"

const accentClasses = {
  green: "border-l-primary",
  gold: "border-l-secondary",
  blue: "border-l-sky-500",
}

export function OpportunitiesSection() {
  const [query, setQuery] = useState("")
  const [skill, setSkill] = useState("Todas")
  const [level, setLevel] = useState("Todos")

  const filtered = useMemo(() => opportunities.filter((item) => {
    const searchable = `${item.role} ${item.company} ${item.location} ${item.skills.join(" ")}`.toLowerCase()
    const matchesQuery = searchable.includes(query.toLowerCase())
    const matchesSkill = skill === "Todas" || item.skills.some((itemSkill) => itemSkill.toLowerCase().includes(skill.toLowerCase()))
    const matchesLevel = level === "Todos" || item.level === level
    return matchesQuery && matchesSkill && matchesLevel
  }), [query, skill, level])

  return (
    <section id="oportunidades" className="scroll-mt-20 border-t border-border bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <Badge className="mb-4 gap-2 bg-primary text-primary-foreground"><BriefcaseBusiness data-icon="inline-start" /> Mercado laboral</Badge>
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">Oportunidades</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Un histórico de ofertas para descubrir dónde están las oportunidades y qué habilidades están buscando las empresas.</p>
          </div>
          <Card className="border-primary/20 bg-primary text-primary-foreground">
            <CardContent className="flex gap-4 p-5">
              <Sparkles className="mt-1 shrink-0 text-secondary" />
              <div><p className="font-semibold">Aprende con intención</p><p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">Las habilidades más repetidas en este histórico aparecen destacadas en cada oferta.</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_auto_auto] md:p-5">
          <label className="relative block"><span className="sr-only">Buscar oportunidades</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo, empresa o habilidad..." className="pl-10" /></label>
          <label><span className="sr-only">Filtrar por habilidad</span><select value={skill} onChange={(event) => setSkill(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:w-40">{opportunitySkills.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Filtrar por nivel</span><select value={level} onChange={(event) => setLevel(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm md:w-40">{opportunityLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>

        <div className="mb-5 flex items-center justify-between"><p className="text-sm text-muted-foreground">{filtered.length} ofertas en el histórico</p><p className="text-sm font-medium text-primary">Actualizado por la comunidad estudiantil</p></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => <Card key={item.id} className={`flex h-full flex-col border-l-4 ${accentClasses[item.accent]} transition-transform hover:-translate-y-1`}>
            <CardHeader><div className="mb-3 flex items-center justify-between gap-3"><Badge variant="outline">{item.level}</Badge><span className="text-xs text-muted-foreground">{item.source}</span></div><CardTitle className="font-heading text-2xl">{item.role}</CardTitle><p className="font-medium text-primary">{item.company}</p></CardHeader>
            <CardContent className="flex-1"><div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin />{item.location}</span><span>{item.modality}</span><span className="inline-flex items-center gap-1"><CalendarDays />{new Date(item.publishedAt).toLocaleDateString("es-EC", { month: "short", year: "numeric" })}</span></div><p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p><div className="mt-5 flex flex-wrap gap-2">{item.skills.map((itemSkill) => <Badge key={itemSkill} variant="secondary">{itemSkill}</Badge>)}</div></CardContent>
            <CardFooter><Button variant="ghost" className="w-full justify-between text-primary">Ver referencia <ArrowUpRight data-icon="inline-end" /></Button></CardFooter>
          </Card>)}
        </div>
        {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No encontramos ofertas con esos filtros.</div>}
      </div>
    </section>
  )
}
