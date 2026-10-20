// Recolecta las vacantes de CNT EP desde su portal CNT Empleo (https://empleo.cnt.gob.ec).
//
// El portal publica cada vacante como una página propia y las anuncia en un feed RSS público. Cada vacante dura pocos
// días ("Fecha fin de publicación"), así que este script lee el feed dos veces al día, abre la página de las vacantes
// nuevas para leer sus fechas y guarda el historial en lib/data/cnt-jobs.json, marcando los roles de TI. Se postula
// en la misma página de la vacante ("Aplicar al trabajo", con una cuenta de candidato).
// Uso (desde la raíz del repo):  node scripts/cnt/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const FEED = "https://empleo.cnt.gob.ec/feed/?post_type=job"
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/cnt-jobs.json")
// El portal rechaza agentes que se identifican como bots: se usa el de un navegador común
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
const MAX_FEED_PAGES = 5
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&#8211;|&ndash;/g, "–").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/rss+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  return response.text()
}

/** "20/10/2026" -> "2026-10-20" */
const toDay = (text) => text?.match(/(\d{2})\/(\d{2})\/(\d{4})/)?.slice(1).reverse().join("-") ?? null

/** Fechas y ubicación que muestra la página de la vacante. */
async function readJobPage(url) {
  const text = clean(await get(url))
  return {
    publishedOn: toDay(text.match(/Fecha de publicaci[oó]n\s*:\s*([\d/]+)/i)?.[1]),
    closesOn: toDay(text.match(/Fecha fin de publicaci[oó]n\s*:\s*([\d/]+)/i)?.[1]),
  }
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const known = new Map(previous.jobs.map((job) => [job.url, job]))

const items = []
for (let page = 1; page <= MAX_FEED_PAGES; page++) {
  const xml = await get(`${FEED}&paged=${page}`).catch((error) => { console.warn(`  Feed página ${page}: ${error.message}`); return "" })
  const pageItems = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: clean(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""),
    url: clean(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ""),
    pubDate: item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1],
  }))
  if (!pageItems.length) break
  items.push(...pageItems)
  // Las páginas siguientes son más antiguas: basta con lo que ya conocemos
  if (pageItems.every((item) => known.has(item.url))) break
}
if (!items.length) throw new Error("El feed de CNT Empleo no trajo vacantes: revisa el formato.")

const jobs = new Map(previous.jobs.map((job) => [job.url, job]))
for (const item of items) {
  const before = known.get(item.url)
  // Solo se abre la página de las vacantes nuevas. Las vencidas ya no muestran fechas: sin fecha de cierre = cerrada
  const dates = before ?? await readJobPage(item.url).catch(() => ({ publishedOn: null, closesOn: null }))
  jobs.set(item.url, {
    id: item.url.split("/job/")[1]?.replace(/\/$/, "") ?? item.url,
    title: item.title,
    url: item.url,
    publishedOn: dates.publishedOn ?? (item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : null),
    closesOn: dates.closesOn,
    isIT: isITRole(item.title),
    firstSeen: before?.firstSeen ?? today,
  })
}

const sorted = [...jobs.values()].sort((a, b) => (b.publishedOn ?? "").localeCompare(a.publishedOn ?? ""))
const output = JSON.stringify({ source: "https://empleo.cnt.gob.ec/procesos/", jobs: sorted }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
const open = sorted.filter((job) => job.closesOn && job.closesOn >= today)
console.log(`CNT: ${sorted.length} vacantes (${sorted.filter((job) => job.isIT).length} de TI), ${open.length} abiertas. ${changed ? "Datos actualizados." : "Sin cambios."}`)
for (const job of open) console.log(`  ${job.isIT ? "[TI] " : ""}${job.title} — cierra ${job.closesOn}`)
