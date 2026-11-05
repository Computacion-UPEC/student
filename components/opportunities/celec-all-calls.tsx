"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, CalendarClock, Laptop, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible } from "@/components/opportunities/collapsible"
import allData from "@/lib/data/celec-all.json"
import { isITRole } from "@/scripts/lib/it-roles.mjs"

/** Convocatoria de cualquier unidad de CELEC EP, sea o no para Computación (lib/data/celec-all.json). */
type CelecCall = { unit: string; role: string; eligibility: string; publishedAt: string | null; closesAt: string | null; url: string | null }

const calls = (allData as { calls: CelecCall[] }).calls
const unitCount = new Set(calls.map((call) => call.unit)).size
/** Sin fecha de cierre legible, una convocatoria publicada hace menos de estos días se muestra como posiblemente abierta */
const RECENT_DAYS = 3

const isIT = (call: CelecCall) => /^Directa|cargo TIC/.test(call.eligibility) || isITRole(call.role)
const DAY_MS = 864e5
const dayNumber = (day: string) => Math.floor(Date.parse(`${day}T12:00:00Z`) / DAY_MS)

/** "2026-10-30" -> "30 oct 2026" */
const formatDay = (day: string | null) => day ? new Date(`${day}T12:00:00Z`).toLocaleDateString("es-EC", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" }) : "—"

/** Activa si su cierre es hoy o después; sin cierre legible, si se publicó hace pocos días (hay que confirmarlo en el PDF). */
function activity(call: CelecCall, today: string | null): { active: boolean; label: string } {
  if (today == null) return { active: false, label: "" }
  if (call.closesAt) {
    const left = dayNumber(call.closesAt) - dayNumber(today)
    if (left < 0) return { active: false, label: "" }
    return { active: true, label: left === 0 ? "Cierra hoy" : left === 1 ? "Cierra mañana" : `Cierra el ${formatDay(call.closesAt)}` }
  }
  if (!call.publishedAt) return { active: false, label: "" }
  const age = dayNumber(today) - dayNumber(call.publishedAt)
  return age >= 0 && age <= RECENT_DAYS ? { active: true, label: `Publicada ${age === 0 ? "hoy" : age === 1 ? "ayer" : `hace ${age} días`} · confirma el cierre en el PDF` } : { active: false, label: "" }
}

/**
 * Bolsas de empleo de las unidades de CELEC EP. Arriba, destacadas, las convocatorias activas de cualquier área (suelen
 * estar abiertas 1 o 2 días); abajo, plegado, el historial solo de las de TI.
 */
export function CelecAllCalls() {
  // La fecha de Ecuador se conoce al montar: antes, ninguna cuenta como activa para no desajustar el HTML del build
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => { setToday(new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })) }, [])
  const [query, setQuery] = useState("")

  const withStatus = useMemo(() => calls.map((call) => ({ call, ...activity(call, today), it: isIT(call) })), [today])
  const active = withStatus.filter((item) => item.active).sort((a, b) => Number(b.it) - Number(a.it) || (a.call.closesAt ?? "9").localeCompare(b.call.closesAt ?? "9"))
  const historicIT = withStatus.filter((item) => !item.active && item.it)
  const visible = historicIT.filter((item) => !query || `${item.call.role} ${item.call.unit}`.toLowerCase().includes(query.toLowerCase()))

  return <div className="mb-2">
    <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="font-heading text-lg font-bold text-foreground md:text-xl">Bolsas de empleo de CELEC EP: convocatorias activas</h2><p className="mt-1 max-w-2xl text-[13px] text-muted-foreground">Revisamos las bolsas de empleo de sus {unitCount} unidades (Hidrotoapi, Coca Codo Sinclair, CELEC SUR y las demás) cada día a las 08:00 y a las 18:00. Sus convocatorias suelen estar abiertas solo 1 o 2 días: postula el mismo día.</p></div>
      {today != null && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><Zap className="size-3" />{active.length} {active.length === 1 ? "activa" : "activas"}</Badge>}
    </div>
    {today != null && (active.length > 0
      ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{active.map(({ call, label, it }, index) => <div key={`${call.url}-${index}`} className="flex flex-col gap-2 rounded-xl border border-l-4 border-l-emerald-600 bg-emerald-50/70 p-3 ring-1 ring-emerald-600/30 dark:bg-emerald-950/30">
          <div className="flex flex-wrap gap-1.5"><Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Activa</Badge>{it && <Badge className="gap-1 bg-sky-600 text-white hover:bg-sky-600"><Laptop className="size-3" />Rol de TI</Badge>}<Badge variant="secondary">{call.unit}</Badge></div>
          <h3 className="font-heading text-sm font-bold leading-snug text-foreground">{call.role}</h3>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300"><CalendarClock className="size-3.5" />{label}</p>
          <p className="text-xs text-muted-foreground">{call.eligibility}</p>
          {call.url && <a href={call.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-0.5 text-[13px] font-semibold text-primary hover:underline">Ver la convocatoria oficial<ArrowUpRight className="size-3.5" /></a>}
        </div>)}</div>
      : <div className="rounded-xl border border-dashed border-border bg-card p-4 text-[13px] text-muted-foreground">Ninguna convocatoria activa ahora en las {unitCount} unidades. Vuelve a mirar en la mañana o en la tarde: abren y cierran en 1 o 2 días.</div>)}

    <Collapsible className="mt-2" summary={`Historial: ${historicIT.length} convocatorias de TI ya cerradas`}>
      <p className="mb-2 text-xs text-muted-foreground">Solo las de TI, para ver qué cargos abre cada unidad y qué piden. Las de otras áreas no se guardan en el historial.</p>
      <div className="mb-2 flex flex-wrap gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo o unidad…" aria-label="Buscar cargo o unidad" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px]" />
        <span className="self-center text-xs text-muted-foreground">{visible.length} convocatorias</span>
      </div>
      <div className="max-h-[32rem] overflow-auto">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead className="sticky top-0 border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-2 py-2 font-semibold">Unidad</th><th className="px-2 py-2 font-semibold">Cargo</th><th className="px-2 py-2 font-semibold">Publicada</th><th className="px-2 py-2 font-semibold">Cierre</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map(({ call }, index) => <tr key={`${call.url}-${index}`} className="align-top">
              <td className="px-2 py-2 text-muted-foreground">{call.unit}</td>
              <td className="px-2 py-2">{call.url ? <a href={call.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-foreground hover:underline">{call.role}<ArrowUpRight className="mt-0.5 size-3.5 shrink-0" /></a> : call.role}</td>
              <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">{formatDay(call.publishedAt)}</td>
              <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">{formatDay(call.closesAt)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Collapsible>
  </div>
}
