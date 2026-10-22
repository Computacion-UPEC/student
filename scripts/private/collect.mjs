// Recolecta vacantes de empresas privadas grandes de Ecuador que publican sus ofertas de forma legible:
//   - Holcim Ecuador, Arca Continental (Coca-Cola, Tonicorp, Inalecsa) y Farmaenlace: sitios de empleo de
//     SAP SuccessFactors, igual que Banco Pichincha (páginas de resultados en HTML con startrow)
//   - Tiendas Tuti: vacantes publicadas en su propia página "Trabaja con nosotros"
//   - FEMSA Salud (GPF: Fybeca, SanaSana) y Novacero: portales de HiringRoom (lista en HTML, 20 por página en
//     /jobs/index/N; ?page=N devuelve siempre la primera)
//   - Difare: portal de Evaluar.com (WP Job Manager), enlazado desde "Trabaja con nosotros" de difare.com.ec
// Las demás empresas investigadas quedan como enlace (ver lib/private-portals.ts): sus portales cargan las
// vacantes con JavaScript (SuccessFactors clásico), tienen protección contra bots o reciben solo hojas de vida.
//
// Guarda un historial en lib/data/private-jobs.json (firstSeen y, cuando deja de publicarse, closedOn). Solo
// escribe el archivo si algo cambió.
// Uso (desde la raíz del repo):  node scripts/private/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/private-jobs.json")
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

async function get(url, init = {}) {
  const response = await fetch(url, { ...init, headers: { "User-Agent": UA, "Accept-Language": "es-EC,es;q=0.9", ...init.headers } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  // HiringRoom dice UTF-8 pero algunos textos llegan en Latin-1
  const bytes = await response.arrayBuffer()
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder("latin1").decode(bytes)
  }
}

const MONTHS = { ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06", jul: "07", ago: "08", sept: "09", sep: "09", oct: "10", nov: "11", dic: "12",
  jan: "01", apr: "04", aug: "08", dec: "12" }
/** "16 oct 2026" -> "2026-10-16" */
function spanishDate(text) {
  const m = text.toLowerCase().match(/(\d{1,2}) ([a-z]+)\.? (\d{4})/)
  return m && MONTHS[m[2]] ? `${m[3]}-${MONTHS[m[2]]}-${m[1].padStart(2, "0")}` : null
}

/**
 * Sitio de empleos de SuccessFactors (Recruiting Marketing). Cada empresa nombra distinto los campos de la lista
 * (city, multilocation, location, country...), así que se lee el primero que exista.
 * soloEcuador: algunas empresas publican vacantes de varios países en el mismo sitio.
 */
async function successFactors(base, search, { soloEcuador = false, ciudadEnEnlace = false } = {}) {
  const jobs = new Map()
  for (let start = 0; start < 1000; start += 25) {
    const html = await get(`${base}${search}${search.includes("?") ? "&" : "?"}startrow=${start}`)
    // Algunas empresas anteponen su sitio al enlace ("/holcim_ecuador/job/...")
    const links = [...html.matchAll(/href="((?:\/[\w-]+)?\/job\/([^"/]*)\/(\d+)\/)"[^>]*>([\s\S]*?)<\/a>/g)]
    const nuevas = links.filter(([, , , id]) => !jobs.has(id))
    if (!nuevas.length) break
    for (const [, href, slug, id, text] of nuevas) {
      const title = clean(text)
      if (!title || jobs.has(id)) continue
      const field = (...names) => {
        for (const name of names) {
          const m = html.match(new RegExp(`id="job-${id}-desktop-section-${name}-value"[^>]*>([\\s\\S]*?)</`))
          if (m && clean(m[1])) return clean(m[1])
        }
        return ""
      }
      // Sin campo de ciudad (Farmaenlace), la ciudad es la primera parte del enlace: "/job/CUENCA-DEPENDIENTE-JUNIOR/"
      const location = field("city", "multilocation", "location", "dept") || (ciudadEnEnlace ? decodeURIComponent(slug).split("-")[0] : "")
      const country = field("country")
      if (soloEcuador && !/\bEC\b|ecuador/i.test(`${location} ${country}`)) continue
      jobs.set(id, { key: id, title, city: location.replace(/,\s*[A-Z]{1,3},\s*EC(,\s*\d+)?/g, "").replace(/\s*•\s*EC\b|\bEC\s*•\s*/g, "").trim() || null,
        publishedAt: spanishDate(field("date")), url: base + href })
    }
  }
  return [...jobs.values()]
}

async function tuti() {
  const base = "https://tuti.com.ec"
  const html = await get(`${base}/trabaja-con-nosotros/`)
  const jobs = new Map()
  for (const [, url, slug] of html.matchAll(/href="(https:\/\/tuti\.com\.ec\/jobs\/([^"/]+)\/)"/g)) {
    if (jobs.has(slug)) continue
    // El título está en la página de la vacante
    const page = await get(url).catch(() => "")
    const title = clean(page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "") || slug.replace(/-/g, " ")
    jobs.set(slug, { key: slug, title, city: null, publishedAt: null, url })
  }
  return [...jobs.values()]
}

/** Portal de HiringRoom: /jobs/index/N, 20 vacantes por página; título en <h4> y ciudad junto al ícono de ubicación. */
async function hiringRoom(sub) {
  const base = `https://${sub}.hiringroom.com`
  const jobs = new Map()
  for (let page = 1; page <= 50; page++) {
    const html = await get(`${base}/jobs/index/${page}`)
    const cards = [...html.matchAll(/<a href="(\/jobs\/get_vacancy\/([0-9a-f]{24}))"[^>]*>([\s\S]*?)<\/a>/g)]
    const nuevas = cards.filter(([, , id]) => !jobs.has(id))
    if (!nuevas.length) break
    for (const [, href, id, card] of nuevas) {
      const title = clean(card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1] ?? "")
      if (!title) continue
      // "Quito, Pichincha, Ecuador" -> "Quito"
      const city = clean(card.match(/hr-Location-pin[^>]*><\/i>([\s\S]*?)<\/span>/)?.[1] ?? "").split(",")[0].trim()
      jobs.set(id, { key: id, title, city: city || null, publishedAt: null, url: base + href })
    }
  }
  return [...jobs.values()]
}

/** Portal de Evaluar.com (WP Job Manager): la lista completa sale de su endpoint jm-ajax. */
async function evaluar(sub) {
  const base = `https://${sub}.evaluar.com`
  const jobs = new Map()
  for (let page = 1; page <= 20; page++) {
    const data = JSON.parse(await get(`${base}/jm-ajax/get_listings/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" },
      body: `per_page=100&page=${page}&orderby=featured&order=DESC`,
    }))
    for (const [, url, slug, card] of (data.html ?? "").matchAll(/<a href="(https:\/\/[\w.-]+\/trabajo\/([^"/]+)\/)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const title = clean(card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1] ?? "")
      if (!title || jobs.has(slug)) continue
      const city = clean(card.match(/ln-icon-Map2[^>]*><\/i>([\s\S]*?)<small/)?.[1] ?? "")
      jobs.set(slug, { key: slug, title, city: city || null, publishedAt: null, url })
    }
    if (page >= (data.max_num_pages ?? 1)) break
  }
  return [...jobs.values()]
}

const SOURCES = [
  { id: "holcim", company: "Holcim Ecuador", collect: () => successFactors("https://careers.holcimgroup.com", "/holcim_ecuador/go/Empleos-en-Holcim-Ecuador/8822402/") },
  { id: "arca", company: "Arca Continental", collect: () => successFactors("https://careers.arcacontal.com", "/search/?q=&locationsearch=Ecuador", { soloEcuador: true }) },
  { id: "farmaenlace", company: "Farmaenlace", collect: () => successFactors("https://trabajaconnosotros.farmaenlace.com", "/search/?q=", { ciudadEnEnlace: true }) },
  { id: "tuti", company: "Tiendas Tuti", collect: tuti },
  { id: "gpf", company: "FEMSA Salud (GPF)", collect: () => hiringRoom("corporaciongpf") },
  { id: "novacero", company: "Novacero", collect: () => hiringRoom("novaceroseleccion") },
  { id: "difare", company: "Difare", collect: () => evaluar("difare") },
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
    console.log(`::warning::${source.company}: ${error.message}`)
    summary.push(`${source.company}: error`)
    continue
  }
  const seen = new Set()
  for (const item of found) {
    const id = `${source.id}-${item.key}`
    seen.add(id)
    const before = byId.get(id)
    const { key, ...data } = item
    byId.set(id, { id, source: source.id, company: source.company, ...data, isIT: isITRole(item.title), firstSeen: before?.firstSeen ?? today })
  }
  // Las que ya no aparecen quedan en el historial como cerradas
  for (const job of byId.values()) if (job.source === source.id && !seen.has(job.id) && !job.closedOn) byId.set(job.id, { ...job, closedOn: today })
  summary.push(`${source.company}: ${found.length} (${found.filter((item) => isITRole(item.title)).length} de TI)`)
}

const jobs = [...byId.values()].sort((a, b) => Number(!!a.closedOn) - Number(!!b.closedOn) || (b.publishedAt ?? b.firstSeen).localeCompare(a.publishedAt ?? a.firstSeen))
const output = JSON.stringify({ collectedSince: previous.collectedSince ?? today, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`${summary.join(" · ")}. ${changed ? "Datos actualizados." : "Sin cambios."}`)
