"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, BellRing, FileText, GraduationCap, Laptop } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import cntData from "@/lib/data/cnt-jobs.json"
import financeData from "@/lib/data/finance-jobs.json"
import inecData from "@/lib/data/inec-jobs.json"
import petroecuadorData from "@/lib/data/petroecuador-jobs.json"
import privateData from "@/lib/data/private-jobs.json"
import publicData from "@/lib/data/public-jobs.json"
import techData from "@/lib/data/tech-jobs.json"
import { encuentraEmpleoFeed } from "@/components/opportunities/encuentra-empleo-jobs"
import type { TechJob } from "@/components/opportunities/tech-jobs"
import type { FinanceJob } from "@/lib/finance-portals"
import { celecJobs, type PetroecuadorJob } from "@/lib/opportunities-data"
import type { PrivateJob } from "@/lib/private-portals"
import { encuentraEmpleoLinks, type CntJob, type InecJob, type PublicContestJob } from "@/lib/public-portals"
import { isEntryRole } from "@/scripts/lib/entry-roles.mjs"
import { isITRelatedRole, isITRole } from "@/scripts/lib/it-roles.mjs"

/**
 * Cargo de entrada de cualquier fuente. Las de un portal con lista (empresas privadas, bancos) siguen abiertas
 * mientras se publican (closedOn); las de concursos y convocatorias, hasta su fecha de cierre (closes).
 */
type EntryJob = {
  id: string
  title: string
  org: string
  sector: string
  city?: string | null
  closes: string | null
  closedOn?: string
  /** Día en que la vimos por primera vez (o su publicación, si la fuente no lo guarda). */
  since: string | null
  url: string
  note?: string
  basesUrl?: string
  /** La fuente lo marca como rol de TI, o como afín (acepta una carrera de TI, o el scraper lo ve postulable). */
  flaggedIT?: boolean
  flaggedRelated?: boolean
}

/** "ti": cargo de TI; "afin": acepta una carrera de TI o es cercano (datos, digital, redes, electrónica...). */
type ITLevel = "ti" | "afin" | null
const itLevel = (job: EntryJob): ITLevel => job.flaggedIT || isITRole(job.title) ? "ti"
  : job.flaggedRelated || isITRelatedRole(job.title) ? "afin" : null

const NEW_FOR_DAYS = 7
const isEntry = (title: string, flagged?: boolean) => Boolean(flagged) || isEntryRole(title)
/** "2026-11-04" (último día) o una fecha y hora ISO -> instante de cierre. */
const closingTime = (closes: string) => Date.parse(closes.length === 10 ? `${closes}T23:59:59-05:00` : closes)

const entryJobs: EntryJob[] = [
  ...(privateData as { jobs: PrivateJob[] }).jobs.filter((job) => isEntry(job.title)).map((job) => ({
    id: job.id, title: job.title, org: job.company, sector: "Empresas privadas", city: job.city, closes: null, closedOn: job.closedOn,
    since: job.firstSeen, url: job.url, flaggedIT: job.isIT,
  })),
  ...encuentraEmpleoFeed.jobs.filter((job) => isEntry(job.title, job.entryLevel)).map((job) => ({
    id: `ee-${job.id}`, title: job.title, org: job.company ?? "Empresa privada", sector: "Empresas privadas", city: job.location,
    closes: job.closesOn, since: job.firstSeen, url: encuentraEmpleoFeed.source, note: `Encuentra Empleo, código ${job.id}`,
    flaggedIT: job.profile === "TI directo", flaggedRelated: job.applicableFromIT,
  })),
  ...(financeData as { jobs: FinanceJob[] }).jobs.filter((job) => isEntry(job.title)).map((job) => ({
    id: job.id, title: job.title, org: job.institution, sector: "Financiero", city: job.city, closes: null, closedOn: job.closedOn,
    since: job.firstSeen, url: job.url, flaggedIT: job.isIT,
  })),
  ...(techData as { jobs: TechJob[] }).jobs.filter((job) => isEntry(job.title)).map((job) => ({
    id: job.id, title: job.title, org: job.company, sector: "Tecnología / Software", city: job.city, closes: null, closedOn: job.closedOn,
    since: job.firstSeen, url: job.url, flaggedIT: job.isIT,
  })),
  ...celecJobs.filter((job) => isEntry(job.role)).map((job) => ({
    id: job.id, title: job.role, org: `CELEC EP – ${job.unit}`, sector: "Energía", closes: job.closesAt, since: job.publishedAt,
    url: job.url ?? "https://www.celec.gob.ec/", flaggedIT: job.isIT || job.fit === "Directa", flaggedRelated: job.fit === "Posible",
  })),
  ...(petroecuadorData as { source: string; jobs: PetroecuadorJob[] }).jobs.filter((job) => isEntry(job.role)).map((job) => ({
    id: `petro-${job.code}`, title: job.role, org: "EP Petroecuador", sector: "Energía", city: job.city, closes: job.closesAt,
    since: job.firstSeen, url: petroecuadorData.source, note: `Código ${job.code}`, flaggedIT: job.isIT,
  })),
  ...(cntData as { jobs: CntJob[] }).jobs.filter((job) => isEntry(job.title)).map((job) => ({
    id: `cnt-${job.id}`, title: job.title, org: "CNT EP", sector: "Sector público", closes: job.closesOn, since: job.firstSeen, url: job.url, flaggedIT: job.isIT,
  })),
  ...(inecData as { jobs: InecJob[] }).jobs.filter((job) => isEntry(job.title)).map((job) => ({
    id: `inec-${job.id}`, title: job.title, org: "INEC", sector: "Sector público", city: job.place, closes: job.closesAt,
    since: job.firstSeen, url: job.applyUrl ?? job.url, flaggedIT: job.isIT,
  })),
  ...(publicData as { jobs: PublicContestJob[] }).jobs.filter((job) => isEntry(job.title, job.entryLevel)).map((job) => ({
    id: `mdt-${job.id}`, title: job.title, org: job.institution, sector: "Sector público", city: job.city, closes: job.closesAt,
    since: job.firstSeen, url: encuentraEmpleoLinks[0].url, basesUrl: job.basesUrl, flaggedIT: job.isIT, flaggedRelated: job.acceptsIT,
    note: `Concurso, código ${job.id}${job.minExperienceMonths != null ? ` · experiencia: ${job.minExperienceMonths ? `${job.minExperienceMonths} meses` : "no piden"}` : ""}`,
  })),
]

const levels = new Map(entryJobs.map((job) => [job.id, itLevel(job)]))

const isOpen = (job: EntryJob, now: number) => job.closes ? now <= closingTime(job.closes) : job.closedOn == null && job.since != null
const isNew = (job: EntryJob, now: number) => job.since != null && (now - Date.parse(`${job.since}T00:00:00-05:00`)) / 864e5 <= NEW_FOR_DAYS
const titleCase = (text: string) => text === text.toUpperCase() ? text.toLowerCase().replace(/(^|[\s(/–-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()) : text
const formatClose = (closes: string | null) => closes
  ? new Date(closingTime(closes)).toLocaleDateString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short" })
  : "Mientras siga publicada"

/** Asistentes, auxiliares, pasantías y demás cargos de entrada abiertos en todas las fuentes, para no perderlos. */
export function EntryLevelJobs() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => { setNow(Date.now()) }, [])
  const [sector, setSector] = useState("Todos")
  const [query, setQuery] = useState("")
  const [onlyNew, setOnlyNew] = useState(false)
  const [onlyIT, setOnlyIT] = useState(false)

  const open = useMemo(() => now == null ? [] : entryJobs.filter((job) => isOpen(job, now))
    .sort((a, b) => (b.since ?? "").localeCompare(a.since ?? "")), [now])
  const sectors = [...new Set(open.map((job) => job.sector))].sort()
  const itCount = open.filter((job) => levels.get(job.id)).length
  const visible = open.filter((job) => (sector === "Todos" || job.sector === sector) && (!onlyNew || (now != null && isNew(job, now)))
    && (!onlyIT || levels.get(job.id))
    && (!query || `${job.title} ${job.org} ${job.city ?? ""}`.toLowerCase().includes(query.toLowerCase())))
  const newCount = now == null ? 0 : open.filter((job) => isNew(job, now)).length

  return <section aria-labelledby="recien-graduados" className="mb-3 rounded-2xl border-2 border-amber-500/60 bg-amber-50/60 p-3 dark:bg-amber-950/20 md:p-4">
    <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h2 id="recien-graduados" className="flex items-center gap-2 font-heading text-lg font-bold text-foreground"><GraduationCap className="size-5 shrink-0 text-amber-600" />Para recién graduados</h2>
        <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">Cargos de entrada abiertos en todas las fuentes que revisamos, sean o no de TI: asistentes, auxiliares (incluye servicios generales), ayudantes, pasantías, trainee y junior. Suelen pedir poca o ninguna experiencia; revisa los requisitos de cada uno antes de postular.</p>
      </div>
      {now != null && <div className="flex flex-wrap gap-2">
        <Badge className="bg-amber-600 text-white hover:bg-amber-600">{open.length} abiertos</Badge>
        {newCount > 0 && <Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><BellRing className="size-3" />{newCount} nuevos esta semana</Badge>}
      </div>}
    </div>
    <div className="mb-2 flex flex-wrap gap-2">
      <button type="button" aria-pressed={onlyIT} onClick={() => setOnlyIT((value) => !value)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors ${onlyIT ? "border-sky-600 bg-sky-600 text-white" : "border-border bg-background text-foreground hover:border-sky-600/50"}`}><Laptop className="size-4" />TI y afines{now != null && <span className={onlyIT ? "text-white/80" : "text-muted-foreground"}>({itCount})</span>}</button>
      <select value={sector} onChange={(event) => setSector(event.target.value)} aria-label="Sector" className="rounded-lg border border-border bg-background px-3 py-1.5 text-[13px]">
        {["Todos", ...sectors].map((name) => <option key={name} value={name}>{name === "Todos" ? "Todos los sectores" : `${name} (${open.filter((job) => job.sector === name).length})`}</option>)}
      </select>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cargo, empresa o ciudad…" aria-label="Buscar cargo, empresa o ciudad" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px]" />
      <label className="flex items-center gap-1.5 self-center text-[13px]"><input type="checkbox" checked={onlyNew} onChange={(event) => setOnlyNew(event.target.checked)} />Solo nuevos ({NEW_FOR_DAYS} días)</label>
      <span className="self-center text-xs text-muted-foreground">{visible.length} cargos</span>
    </div>
    <div className="max-h-[36rem] overflow-auto rounded-lg border border-border bg-background">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="sticky top-0 border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr><th className="px-2 py-2 font-semibold">Cargo</th><th className="px-2 py-2 font-semibold">Empresa o institución</th><th className="px-2 py-2 font-semibold">Ciudad</th><th className="px-2 py-2 font-semibold">Cierre</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {now == null && <tr><td colSpan={4} className="px-2 py-2 text-center text-muted-foreground">Cargando…</td></tr>}
          {visible.map((job) => <tr key={job.id} className="align-top">
            <td className="px-2 py-2">
              <a href={job.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 font-medium text-foreground hover:underline">{titleCase(job.title)}<ArrowUpRight className="mt-0.5 size-3.5 shrink-0" /></a>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {levels.get(job.id) === "ti" && <Badge className="gap-1 bg-sky-600 text-[11px] text-white hover:bg-sky-600"><Laptop className="size-3" />TI</Badge>}
                {levels.get(job.id) === "afin" && <Badge variant="outline" className="gap-1 border-sky-600 text-[11px] text-sky-700 dark:text-sky-300"><Laptop className="size-3" />Afín a TI</Badge>}
                {now != null && isNew(job, now) && <Badge className="gap-1 bg-emerald-600 text-[11px] text-white hover:bg-emerald-600"><BellRing className="size-3" />Nuevo</Badge>}
                <Badge variant="outline" className="text-[11px]">{job.sector}</Badge>
                {job.note && <span className="text-xs text-muted-foreground">{job.note}</span>}
                {job.basesUrl && <a href={job.basesUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><FileText className="size-3" />Bases</a>}
              </div>
            </td>
            <td className="px-2 py-2 text-muted-foreground">{titleCase(job.org)}</td>
            <td className="px-2 py-2 text-muted-foreground">{job.city ? titleCase(job.city) : "—"}</td>
            <td className="whitespace-nowrap px-2 py-2 text-muted-foreground">{formatClose(job.closes)}</td>
          </tr>)}
          {now != null && visible.length === 0 && <tr><td colSpan={4} className="px-2 py-2 text-center text-muted-foreground">No hay cargos con ese filtro.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>
}
