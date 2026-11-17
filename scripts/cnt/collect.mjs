// Recolecta los concursos de CNT EP desde su portal CNT Empleo (https://empleo.cnt.gob.ec).
//
// En noviembre de 2026 CNT reemplazó su sitio WordPress (con feed RSS) por un portal nuevo, "Concursos de Méritos y
// Oposición", hecho con Laravel + Inertia. La página de inicio trae los concursos como JSON dentro de
// <script data-page="app">: props.concursos es una paginación de Laravel (data, next_page_url). Cada concurso tiene su
// página en /concursos/<slug>, donde se postula con una cuenta de candidato. Este script lee los concursos activos dos
// veces al día y guarda el historial en lib/data/cnt-jobs.json, marcando los roles de TI.
// El portal rechaza las conexiones desde GitHub Actions (servidores fuera de Ecuador), así que no está en el workflow:
// corre a las 08:20 y 18:20 en el runner propio de un computador en Ecuador (workflow privado
// COMPUMAX-EC/oportunidades-runner) con scripts/cnt/publicar.sh, que abre y fusiona un PR con los cambios.
// Uso (desde la raíz del repo):  node scripts/cnt/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"
import { recordStatus } from "../lib/status.mjs"

const BASE = "https://empleo.cnt.gob.ec"
const LIST = `${BASE}/?estado=activos&orden=recientes&page=`
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/cnt-jobs.json")
// El portal rechaza agentes que se identifican como bots: se usa el de un navegador común
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
const MAX_PAGES = 10
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text.replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  return response.text()
}

/** Props de Inertia que la página trae en <script data-page="app" type="application/json">. */
function pageProps(html) {
  const json = html.match(/<script[^>]*data-page="app"[^>]*>([\s\S]*?)<\/script>/)?.[1]
    ?? html.match(/data-page="([^"]+)"/)?.[1]
  if (!json) return null
  try {
    return JSON.parse(json.trim().startsWith("{") ? json : decode(json)).props
  } catch {
    return JSON.parse(decode(json)).props
  }
}

/** "2026-11-20", "2026-11-20 23:59:00", "2026-11-20T…" o "20/11/2026" -> "2026-11-20" */
const toDay = (value) => {
  if (!value) return null
  const text = String(value)
  return text.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? text.match(/(\d{2})\/(\d{2})\/(\d{4})/)?.slice(1).reverse().join("-") ?? null
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const known = new Map(previous.jobs.map((job) => [job.url, job]))

const contests = []
for (let page = 1; page <= MAX_PAGES; page++) {
  const html = await get(LIST + page).catch((error) => {
    throw new Error(`CNT Empleo no responde (${error.cause?.code ?? error.message}): se reintenta en la próxima corrida.`)
  })
  const list = pageProps(html)?.concursos
  // Sin el JSON de Inertia o sin la lista de concursos, el portal cambió de formato: hay que revisar este script
  if (!list || !Array.isArray(list.data)) throw new Error("El portal de CNT Empleo no trajo la lista de concursos: revisa el formato.")
  contests.push(...list.data)
  if (!list.next_page_url || !list.data.length) break
}

const jobs = new Map(previous.jobs.map((job) => [job.url, job]))
for (const contest of contests) {
  if (!contest.slug || !contest.titulo_convocatoria) continue
  const url = `${BASE}/concursos/${contest.slug}`
  const before = known.get(url)
  jobs.set(url, {
    id: contest.slug,
    title: contest.titulo_convocatoria.replace(/\s+/g, " ").trim(),
    url,
    publishedOn: toDay(contest.fecha_inicio_postulacion) ?? before?.publishedOn ?? today,
    closesOn: toDay(contest.fecha_cierre_postulacion) ?? before?.closesOn ?? null,
    isIT: isITRole(contest.titulo_convocatoria),
    firstSeen: before?.firstSeen ?? today,
  })
}

const sorted = [...jobs.values()].sort((a, b) => (b.publishedOn ?? "").localeCompare(a.publishedOn ?? ""))
const output = JSON.stringify({ source: `${BASE}/`, jobs: sorted }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
const open = sorted.filter((job) => job.closesOn && job.closesOn >= today)
// Cero concursos activos es un resultado válido (el portal nuevo puede no tener convocatorias abiertas)
console.log(`CNT: ${contests.length} concursos activos en el portal; historial ${sorted.length} (${sorted.filter((job) => job.isIT).length} de TI), ${open.length} abiertas. ${changed ? "Datos actualizados." : "Sin cambios."}`)
for (const job of open) console.log(`  ${job.isIT ? "[TI] " : ""}${job.title} — cierra ${job.closesOn}`)
recordStatus({ CNT: true })
