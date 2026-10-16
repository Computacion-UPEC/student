// Recolecta ofertas de empleo de bancos y cooperativas que publican sus vacantes de forma legible:
//   - Banco Pichincha: sitio de carreras (SAP SuccessFactors), páginas de resultados en HTML
//   - Cooperativa JEP: ofertas escritas en su página "Ofertas laborales"
// Los demás portales se quedan como enlace (ver lib/finance-portals.ts): Produbanco (publica en Multitrabajos),
// Banco Internacional (solo formulario de búsqueda), BanEcuador (sin página de vacantes; sus entradas
// "convocatoria" son llamados antiguos a secretarios de coactiva), Alianza del Valle, Jardín Azuayo, CACPECO
// y Cooperativa Tulcán (formulario de hoja de vida, no vacantes).
//
// Guarda un historial en lib/data/finance-jobs.json: cada oferta tiene firstSeen y, cuando deja de
// publicarse, closedOn. Solo escribe el archivo si algo cambió.
// Uso (desde la raíz del repo):  node scripts/finance/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/finance-jobs.json")
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  return response.text()
}

const MONTHS = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sept: "09", sep: "09", oct: "10", nov: "11", dic: "12" }
/** "16 oct 2026" -> "2026-10-16" */
function spanishDate(text) {
  const m = text.toLowerCase().match(/(\d{1,2}) ([a-z]+)\.? (\d{4})/)
  return m && MONTHS[m[2]] ? `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}` : null
}

async function pichincha() {
  const base = "https://vacantes.pichincha.com"
  const jobs = new Map()
  for (let start = 0; start < 1000; start += 25) {
    const html = await get(`${base}/search/?q=&sortColumn=referencedate&sortDirection=desc&startrow=${start}`)
    const ids = [...new Set([...html.matchAll(/data-focus-tile="\.job-id-(\d+)"/g)].map((m) => m[1]))]
    if (!ids.length) break
    for (const id of ids) {
      const link = html.match(new RegExp(`<a class="jobTitle-link[^"]*"[^>]*href="(/job/[^"]*/${id}/)"[^>]*>([\\s\\S]*?)</a>`))
      const field = (name) => {
        const m = html.match(new RegExp(`id="job-${id}-desktop-section-${name}-value"[^>]*>([\\s\\S]*?)</`))
        return m ? clean(m[1]) : ""
      }
      if (!link) continue
      jobs.set(id, { key: id, title: clean(link[2]), province: field("dept"), city: field("city"), publishedAt: spanishDate(field("date")), url: base + link[1] })
    }
    if (ids.length < 25) break
  }
  return [...jobs.values()]
}

async function jep() {
  const url = "https://www.jep.coop/informate/ofertas-laborables"
  const html = (await get(url)).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
  const lines = decode(html.replace(/<br\s*\/?>|<\/(p|li|h\d|div)>/gi, "\n").replace(/<[^>]+>/g, " "))
    .split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean)
  const jobs = []
  lines.forEach((line, index) => {
    if (!/^Requisitos:?$/i.test(line) || index === 0) return
    const title = lines[index - 1]
    const requirements = []
    for (const next of lines.slice(index + 1)) {
      if (/^(¡?si cumples|env[ií]a|descarga|ofrecemos)/i.test(next) || /^Requisitos:?$/i.test(next)) break
      requirements.push(next)
    }
    const subject = lines.slice(index).find((next) => /asunto/i.test(next))?.match(/asunto\s*[«“"]([^»”"]+)/i)?.[1] ?? title
    const [role, city = ""] = title.split(/\s+[–-]\s+/)
    jobs.push({ key: title.toLowerCase(), title: role.trim(), city: city.trim(), url, requirements: requirements.slice(0, 6), apply: { email: "seleccionjep@jep.coop", subject } })
  })
  return jobs
}

const SOURCES = [
  { id: "pichincha", institution: "Banco Pichincha", collect: pichincha },
  { id: "jep", institution: "Cooperativa JEP", collect: jep },
]

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const byId = new Map(previous.jobs.map((job) => [job.id, job]))
const summary = []

for (const source of SOURCES) {
  let found
  try {
    found = await source.collect()
  } catch (error) {
    // Si una fuente falla no se cierra ninguna de sus ofertas; se avisa en el registro de GitHub Actions
    console.log(`::warning::${source.institution}: ${error.message}`)
    summary.push(`${source.institution}: error`)
    continue
  }
  const seen = new Set()
  for (const item of found) {
    const id = `${source.id}-${item.key}`
    seen.add(id)
    const before = byId.get(id)
    const { key, ...data } = item
    byId.set(id, { id, source: source.id, institution: source.institution, ...data, isIT: isITRole(item.title), firstSeen: before?.firstSeen ?? today })
  }
  // Las que ya no aparecen quedan en el historial como cerradas
  for (const job of byId.values()) if (job.source === source.id && !seen.has(job.id) && !job.closedOn) byId.set(job.id, { ...job, closedOn: today })
  summary.push(`${source.institution}: ${found.length} (${found.filter((item) => isITRole(item.title)).length} de TI)`)
}

const jobs = [...byId.values()].sort((a, b) => Number(!!a.closedOn) - Number(!!b.closedOn) || (b.publishedAt ?? b.firstSeen).localeCompare(a.publishedAt ?? a.firstSeen))
const output = JSON.stringify({ collectedSince: previous.collectedSince ?? today, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`${summary.join(" · ")}. ${changed ? "Datos actualizados." : "Sin cambios."}`)
