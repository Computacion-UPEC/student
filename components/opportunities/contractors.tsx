"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Award, Briefcase, Facebook, HardHat, Instagram, Linkedin, MapPin, MessageCircle, Music2, Search, Twitter, Youtube } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible } from "@/components/opportunities/collapsible"
import contractorsData from "@/lib/data/contratistas.json"
import { contractorCareers } from "@/lib/contractor-careers"

/** Empresa que gana u oferta en procesos de compra de las operadoras (lib/data/contratistas.json, scripts/contratistas/collect.mjs). */
type Contractor = {
  ruc: string
  name: string
  /** Sitio web que la empresa registró en SERCOP */
  website: string | null
  city: string | null
  /** Enlaces publicados en su propio sitio (scripts/contratistas/links.mjs) */
  links?: Partial<Record<Network, string>> & { careers?: { label: string; url: string }[]; about?: string }
  /** Campo en el que más contratos ganó: su producto o servicio principal ante las operadoras */
  mainField?: string | null
  sectors: string[]
  operators: string[]
  fields: string[]
  awards: number
  awardedAmount: number
  bids: number
  contracts: { ocid: string; operator: string; description: string; amount: number; date: string | null }[]
}

type Network = "linkedin" | "facebook" | "instagram" | "tiktok" | "x" | "youtube" | "whatsapp"
const NETWORKS: { id: Network; label: string; icon: typeof Linkedin }[] = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: Music2 },
  { id: "x", label: "X", icon: Twitter },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
]

const data = contractorsData as { source: string; years: number[]; operators: string[]; processes: number; companies: Contractor[] }
const winners = data.companies.filter((company) => company.awards > 0)
export const countContractors = () => winners.length

const SECTORS = ["Energía", "Petróleo", "Finanzas"]
const FIELDS = ["Telecomunicaciones", "Automatización y control", "TI y software", "Seguridad industrial y electrónica", "Mantenimiento electromecánico"]
const TOP = 30
const processUrl = (ocid: string) => `https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/ocds/${encodeURIComponent(ocid)}`
const titleCase = (text: string) => text.toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase())
const usd = (value: number) => value.toLocaleString("es-EC", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
const linkedin = (name: string) => `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(name.replace(/\b(S\.?A\.?S?|CIA\.?|LTDA\.?|C\.?A\.?)\b\.?/gi, "").trim())}`

const chip = (active: boolean) => `rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`

/**
 * Las operadoras grandes (CELEC, CNEL, Petroecuador, la banca pública) subcontratan el trabajo de campo de
 * telecomunicaciones, automatización, TI, seguridad y mantenimiento. Aquí, las empresas que ganan esos contratos
 * según SERCOP: entrar por una de ellas suele ser más rápido que por la operadora.
 */
export function Contractors() {
  const [sector, setSector] = useState<string | null>(null)
  const [field, setField] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => winners.filter((company) =>
    (!sector || company.sectors.includes(sector)) &&
    (!field || company.fields.includes(field)) &&
    (!query || `${company.name} ${company.contracts.map((contract) => contract.description).join(" ")}`.toLowerCase().includes(query.toLowerCase()))), [sector, field, query])
  const top = filtered.slice(0, TOP)
  const rest = filtered.slice(TOP)
  const bidders = data.companies.length - winners.length

  return <div className="mb-2">
    <div className="mb-2">
      <h2 className="font-heading text-lg font-bold text-foreground md:text-xl">Contratistas de las operadoras de energía y finanzas</h2>
      <p className="mt-1 max-w-3xl text-[13px] text-muted-foreground">
        CELEC EP, CNEL EP, Petroecuador y la banca pública subcontratan casi todo el trabajo de campo a empresas integradoras.
        Estas son las que ganaron contratos de telecomunicaciones, automatización, TI, seguridad y mantenimiento en {data.years.join(" y ")}
        ({data.processes} procesos revisados en SERCOP). Entrar por un contratista suele ser más rápido: busca sus vacantes o escríbeles con tu hoja de vida.
      </p>
    </div>

    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      <button type="button" className={chip(sector == null)} onClick={() => setSector(null)}>Todas</button>
      {SECTORS.map((item) => <button key={item} type="button" aria-pressed={sector === item} className={chip(sector === item)} onClick={() => setSector(sector === item ? null : item)}>{item}</button>)}
      <span className="mx-1 h-4 w-px bg-border" />
      {FIELDS.map((item) => <button key={item} type="button" aria-pressed={field === item} className={chip(field === item)} onClick={() => setField(field === item ? null : item)}>{item}</button>)}
    </div>
    <label className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px]">
      <Search className="size-4 text-muted-foreground" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empresa o tipo de contrato (fibra, SCADA, software…)" aria-label="Buscar contratista" className="min-w-0 flex-1 bg-transparent outline-none" />
      <span className="shrink-0 text-xs text-muted-foreground">{filtered.length} empresas</span>
    </label>

    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{top.map((company) => <ContractorCard key={company.ruc} company={company} />)}</div>
    {rest.length > 0 && <Collapsible className="mt-2" summary={`${rest.length} contratistas más`}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rest.map((company) => <ContractorCard key={company.ruc} company={company} />)}</div>
    </Collapsible>}
    <LinkTable companies={filtered} />
    <p className="mt-2 text-xs text-muted-foreground">Fuente: {data.source}. Solo empresas (no personas naturales). Otras {bidders} empresas ofertaron sin ganar. Se actualiza los lunes.</p>
  </div>
}

function ContractorCard({ company }: { company: Contractor }) {
  const careers = contractorCareers[company.ruc]
  return <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
    <div className="flex flex-wrap gap-1.5">
      {company.mainField && <Badge className="bg-amber-600 text-white hover:bg-amber-600">{company.mainField}</Badge>}
      {company.fields.filter((field) => field !== company.mainField).slice(0, 1).map((field) => <Badge key={field} variant="secondary">{field}</Badge>)}
    </div>
    <h3 className="flex items-start gap-1.5 font-heading text-sm font-bold leading-snug text-foreground"><HardHat className="mt-0.5 size-4 shrink-0 text-amber-600" />{company.name}</h3>
    {company.city && <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3.5" />{titleCase(company.city)}</p>}
    <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground"><Award className="size-3.5 text-emerald-600" />{company.awards} {company.awards === 1 ? "contrato" : "contratos"} · {usd(company.awardedAmount)} · para {company.operators.join(", ")}</p>
    {company.links?.about && <p className="line-clamp-2 text-xs italic text-muted-foreground">&ldquo;{company.links.about}&rdquo;</p>}
    <ul className="space-y-1 text-xs text-muted-foreground">
      {company.contracts.slice(0, 2).map((contract) => <li key={contract.ocid} className="line-clamp-2"><a href={processUrl(contract.ocid)} target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">{contract.description}</a> <span className="whitespace-nowrap">({usd(contract.amount)})</span></li>)}
    </ul>
    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[13px] font-semibold">
      {(careers ? [careers] : company.links?.careers ?? []).slice(0, 1).map((page) => <a key={page.url} href={page.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-700 hover:underline dark:text-emerald-400"><Briefcase className="size-3.5" />Empleo<ArrowUpRight className="size-3.5" /></a>)}
      {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-primary hover:underline">Sitio oficial<ArrowUpRight className="size-3.5" /></a>}
      {NETWORKS.filter((network) => company.links?.[network.id]).map(({ id, label, icon: Icon }) => <a key={id} href={company.links![id]} target="_blank" rel="noreferrer" aria-label={`${company.name} en ${label}`} title={label} className="text-muted-foreground hover:text-foreground"><Icon className="size-4" /></a>)}
      {!company.links?.linkedin && <a href={linkedin(company.name)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground hover:underline">Buscar en LinkedIn<ArrowUpRight className="size-3.5" /></a>}
    </div>
  </div>
}

/** Todos los enlaces de cada contratista en una tabla, para revisarlos de una vez o descargarlos. */
function LinkTable({ companies }: { companies: Contractor[] }) {
  const rows = companies.filter((company) => company.website || company.links)
  const csv = () => {
    const header = ["Empresa", "Ciudad", "Contratos", "Monto USD", "Operadoras", "Empleo", "Sitio", ...NETWORKS.map((network) => network.label)]
    const lines = rows.map((company) => [company.name, company.city ?? "", company.awards, company.awardedAmount, company.operators.join(" / "), company.links?.careers?.[0]?.url ?? "", company.website ?? "", ...NETWORKS.map((network) => company.links?.[network.id] ?? "")])
    const text = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([String.fromCharCode(0xfeff) + text], { type: "text/csv;charset=utf-8" }))
    link.download = "contratistas-enlaces.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }
  const cell = (url?: string, label = "Abrir") => url ? <a href={url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{label}</a> : <span className="text-muted-foreground/50">—</span>
  return <Collapsible className="mt-3" summary={`Lista de enlaces: redes sociales y empleo de ${rows.length} contratistas`}>
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">Solo enlaces que la empresa publica en su propio sitio. Si no tiene página de empleo, escríbeles por LinkedIn o por el contacto del sitio.</p>
      <button type="button" onClick={csv} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted">Descargar CSV</button>
    </div>
    <div className="max-h-[32rem] overflow-auto">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="sticky top-0 border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr><th className="px-2 py-2 font-semibold">Empresa</th><th className="px-2 py-2 font-semibold">Empleo</th><th className="px-2 py-2 font-semibold">Sitio</th>{NETWORKS.map((network) => <th key={network.id} className="px-2 py-2 font-semibold">{network.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((company) => <tr key={company.ruc} className="align-top">
            <td className="px-2 py-2"><span className="font-semibold text-foreground">{company.name}</span><span className="block text-xs text-muted-foreground">{company.awards} {company.awards === 1 ? "contrato" : "contratos"} · {company.operators.join(", ")}</span></td>
            <td className="px-2 py-2">{cell(company.links?.careers?.[0]?.url, "Empleo")}</td>
            <td className="px-2 py-2">{cell(company.website ?? undefined, "Sitio")}</td>
            {NETWORKS.map((network) => <td key={network.id} className="px-2 py-2">{cell(company.links?.[network.id])}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  </Collapsible>
}
