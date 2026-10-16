"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, ArrowUpRight, BellRing, CalendarDays, Check, GraduationCap, Laptop, MapPin, Repeat, Search, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { programs, type Cycle, type ProgramKind } from "@/lib/scholarships-data"

const kinds: ("Todos" | ProgramKind)[] = ["Todos", "Internship", "Beca"]
const kindLabel = { Todos: "Todos", Internship: "Internships", Beca: "Becas" }

const monthInitials = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
const frequencyLabel: Record<Cycle["frequency"], string> = { anual: "Convocatoria anual", varias: "Varias convocatorias al año", recurrente: "Convocatoria recurrente" }

/** Abre pronto: una ventana habitual empieza este mes o el siguiente (no cuenta las que ya van por la mitad). */
const opensSoon = (cycle: Cycle | undefined, month: number | null) => {
  if (!cycle || month == null) return false
  const startsIn = (m: number) => cycle.months.includes(m) && !cycle.months.includes(((m + 10) % 12) + 1)
  return startsIn(month) || startsIn((month % 12) + 1)
}

function CycleStrip({ cycle, month }: { cycle: Cycle; month: number | null }) {
  return <div className="rounded-lg border border-border bg-muted/40 p-2.5">
    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground"><Repeat className="size-3.5 text-primary" />{frequencyLabel[cycle.frequency]}{cycle.approx && <span className="font-normal text-muted-foreground">· meses aproximados</span>}</p>
    <ol className="grid grid-cols-12 gap-0.5" aria-label={`Suele abrir en ${cycle.months.map((m) => monthNames[m - 1]).join(", ")}`}>
      {monthInitials.map((initial, index) => {
        const open = cycle.months.includes(index + 1)
        const current = month === index + 1
        return <li key={index} title={monthNames[index]} className={`flex h-6 items-center justify-center rounded text-[10px] font-bold ${open ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground/60"} ${current ? "ring-2 ring-secondary ring-offset-1 ring-offset-background" : ""}`}>{initial}</li>
      })}
    </ol>
  </div>
}

export function ProgramsList() {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<(typeof kinds)[number]>("Todos")
  // El mes se fija al montar para no desajustar el HTML generado en el build
  const [month, setMonth] = useState<number | null>(null)
  useEffect(() => { setMonth(new Date().getMonth() + 1) }, [])

  const filtered = useMemo(() => programs.filter((program) => {
    const searchable = `${program.name} ${program.provider} ${program.place} ${program.level} ${program.tags.join(" ")}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (kind === "Todos" || program.kind === kind)
  }), [query, kind])

  return <div>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">Internships y becas</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Programas recurrentes que aceptan estudiantes de Ecuador. El calendario marca los meses en que suelen abrir; las fechas cambian cada año, así que confirma siempre en el sitio oficial.</p></div>
      <div className="flex flex-wrap gap-2"><Badge variant="outline">{programs.length} programas</Badge>{month != null && <Badge className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary"><BellRing className="size-3" />{programs.filter((program) => opensSoon(program.cycle, month)).length} abren pronto</Badge>}</div>
    </div>

    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:p-5">
      <label className="relative block flex-1"><span className="sr-only">Buscar programas</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar programa, país, IA, open source..." className="pl-10" /></label>
      <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="Tipo de programa">{kinds.map((item) => <button key={item} type="button" onClick={() => setKind(item)} aria-pressed={kind === item} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${kind === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{kindLabel[item]}</button>)}</div>
    </div>

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((program) => <Card key={program.id} className={`flex h-full flex-col gap-0 border-l-4 py-0 ${program.kind === "Beca" ? "border-l-secondary" : "border-l-sky-500"}`}>
      <CardHeader className="p-5 pb-3">
        <div className="mb-2 flex flex-wrap gap-1.5"><Badge variant={program.kind === "Beca" ? "secondary" : "default"} className="gap-1">{program.kind === "Beca" ? <GraduationCap className="size-3" /> : <Laptop className="size-3" />}{program.kind}</Badge>{opensSoon(program.cycle, month) && <Badge className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary"><BellRing className="size-3" />Abre pronto</Badge>}{program.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
        <h3 className="font-heading text-lg font-bold leading-snug text-foreground">{program.name}</h3>
        <p className="mt-1 text-sm font-medium text-primary">{program.provider}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 px-5 pb-4 text-sm">
        <p className="flex gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" /><span>{program.place} · {program.level}</span></p>
        <p className="flex gap-2 text-foreground"><Wallet className="mt-0.5 size-4 shrink-0 text-primary" /><span>{program.funding}</span></p>
        <p className="flex gap-2 text-muted-foreground"><CalendarDays className="mt-0.5 size-4 shrink-0" /><span>{program.timing}</span></p>
        {program.cycle && <CycleStrip cycle={program.cycle} month={month} />}
        <p className="text-xs leading-relaxed text-muted-foreground">{program.eligibility}</p>
        {program.warning && <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400"><AlertTriangle className="size-3.5 shrink-0" />{program.warning}</p>}
      </CardContent>
      <CardFooter className="border-t border-border px-5 py-3"><Button asChild variant="ghost" size="sm" className="-ml-2 text-primary"><a href={program.url} target="_blank" rel="noreferrer">Sitio oficial <ArrowUpRight data-icon="inline-end" /></a></Button></CardFooter>
    </Card>)}</div>
    {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground"><Check className="mx-auto mb-3 text-primary" />No encontramos programas con esa búsqueda.</div>}

    <p className="mt-6 text-xs text-muted-foreground">Las becas provienen de la base de <a href="https://github.com/Computacion-UPEC/MultiAgentic-becas" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">MultiAgentic-becas</a>, filtradas a las que aceptan postulantes de Ecuador o internacionales y verificadas en su fuente oficial (octubre 2026).</p>
  </div>
}
