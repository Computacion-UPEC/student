// Recolecta ofertas de empresas de tecnología y software con vacantes en Ecuador desde Workable,
// la plataforma de reclutamiento que usan. Su widget publica un JSON público, sin autenticación:
//   https://apply.workable.com/api/v1/widget/accounts/<cuenta>
// Guarda solo las de Ecuador, con historial (firstSeen y closedOn) en lib/data/tech-jobs.json.
// La página oculta las publicadas hace más de 60 días. Solo escribe el archivo si algo cambió.
// Uso (desde la raíz del repo):  node scripts/tech/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/tech-jobs.json")
const today = new Date().toISOString().slice(0, 10)

const COMPANIES = [
  { id: "devsu", name: "Devsu", account: "devsu" },
  { id: "stackbuilders", name: "Stack Builders", account: "stackbuilders" },
]

const inEcuador = (job) => job.country === "Ecuador" || (job.locations ?? []).some((location) => location.country === "Ecuador" && !location.hidden)

async function collect(company) {
  const url = `https://apply.workable.com/api/v1/widget/accounts/${company.account}`
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)" } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  const { jobs = [] } = await response.json()
  // Una misma vacante puede aparecer varias veces (una por ubicación): se deduplica por enlace
  const byUrl = new Map()
  for (const job of jobs.filter(inEcuador)) {
    if (byUrl.has(job.url)) continue
    byUrl.set(job.url, { key: job.shortcode, title: job.title.trim(), city: job.city || "", remote: !!job.telecommuting, publishedAt: job.published_on ?? null, url: job.url })
  }
  return [...byUrl.values()]
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const byId = new Map(previous.jobs.map((job) => [job.id, job]))
const summary = []

for (const company of COMPANIES) {
  let found
  try {
    found = await collect(company)
  } catch (error) {
    // Si una fuente falla no se cierra ninguna de sus ofertas; se avisa en el registro de GitHub Actions
    console.log(`::warning::${company.name}: ${error.message}`)
    summary.push(`${company.name}: error`)
    continue
  }
  const seen = new Set()
  for (const { key, ...data } of found) {
    const id = `${company.id}-${key}`
    seen.add(id)
    byId.set(id, { id, company: company.name, ...data, isIT: isITRole(data.title), firstSeen: byId.get(id)?.firstSeen ?? today })
  }
  for (const job of byId.values()) if (job.id.startsWith(`${company.id}-`) && !seen.has(job.id) && !job.closedOn) byId.set(job.id, { ...job, closedOn: today })
  summary.push(`${company.name}: ${found.length} en Ecuador`)
}

const jobs = [...byId.values()].sort((a, b) => Number(!!a.closedOn) - Number(!!b.closedOn) || (b.publishedAt ?? b.firstSeen).localeCompare(a.publishedAt ?? a.firstSeen))
const output = JSON.stringify({ collectedSince: previous.collectedSince ?? today, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`${summary.join(" · ")}. ${changed ? "Datos actualizados." : "Sin cambios."}`)
