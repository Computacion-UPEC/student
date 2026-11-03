"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Collapsible } from "@/components/opportunities/collapsible"
import allData from "@/lib/data/celec-all.json"

/** Convocatoria de cualquier unidad de CELEC EP, sea o no para Computación (lib/data/celec-all.json). */
type CelecCall = { unit: string; role: string; eligibility: string; publishedAt: string | null; closesAt: string | null; url: string | null }

const calls = (allData as { calls: CelecCall[] }).calls
const units = [...new Set(calls.map((call) => call.unit))].sort()

/** "2026-10-30" -> "30 oct 2026" */
const formatDay = (day: string | null) => day ? new Date(`${day}T12:00:00Z`).toLocaleDateString("es-EC", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }) : "—"

/** Todas las convocatorias de las unidades de CELEC con su enlace oficial, para revisarlas una por una. */
export function CelecAllCalls() {
  const [unit, setUnit] = useState("Todas")
  const [query, setQuery] = useState("")
  const visible = useMemo(() => calls.filter((call) => (unit === "Todas" || call.unit === unit)
    && (!query || call.role.toLowerCase().includes(query.toLowerCase()))), [unit, query])

  return <Collapsible className="mb-8" summary={`Todas las convocatorias de CELEC EP (${calls.length}), con su enlace oficial`}>
    <div className="mb-3 flex flex-wrap gap-2">
      <select value={unit} onChange={(event) => setUnit(event.target.value)} aria-label="Unidad" className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm">
        {["Todas", ...units].map((name) => <option key={name} value={name}>{name === "Todas" ? "Todas las unidades" : `${name} (${calls.filter((call) => call.unit === name).length})`}</option>)}
      </select>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo…" aria-label="Buscar cargo" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm" />
      <span className="self-center text-xs text-muted-foreground">{visible.length} convocatorias</span>
    </div>
    <div className="max-h-[32rem] overflow-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="sticky top-0 border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr><th className="px-2 py-2 font-semibold">Unidad</th><th className="px-2 py-2 font-semibold">Cargo</th><th className="px-2 py-2 font-semibold">Publicada</th><th className="px-2 py-2 font-semibold">Cierre</th><th className="px-2 py-2 font-semibold">Para Computación</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {visible.map((call, index) => <tr key={`${call.url}-${index}`} className="align-top">
            <td className="px-2 py-2 text-muted-foreground">{call.unit}</td>
            <td className="px-2 py-2">{call.url ? <a href={call.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-foreground hover:underline">{call.role}<ArrowUpRight className="mt-0.5 size-3.5 shrink-0" /></a> : call.role}</td>
            <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">{formatDay(call.publishedAt)}</td>
            <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">{formatDay(call.closesAt)}</td>
            <td className="px-2 py-2 text-xs text-muted-foreground">{call.eligibility}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </Collapsible>
}
