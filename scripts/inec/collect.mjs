// Recolecta las convocatorias de "Trabaja con nosotros" del INEC (Instituto Nacional de Estadística y Censos).
//
// El INEC publica casi cada semana cargos para sus encuestas y proyectos (analistas, especialistas de bases de datos,
// encuestadores) en una tabla HTML, y cada postulación queda abierta solo uno o tres días. Este script lee la tabla
// dos veces al día, marca los roles de TI y guarda en lib/data/inec-jobs.json cada convocatoria con el día en que
// apareció. Las bases y el enlace de postulación están en el PDF de cada fila.
// Uso (desde la raíz del repo):  node scripts/inec/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const PAGE = "https://www.ecuadorencifras.gob.ec/institucional/trabaja-con-nosotros/"
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/inec-jobs.json")
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text.replace(/&#8211;|&ndash;/g, "–").replace(/&#8220;|&#8221;/g, "\"").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

/** La última fecha del texto de postulación ("Desde las 20h00 del 16 de octubre hasta las 20h00 del 19 de octubre de 2026"). */
function parseDeadline(text) {
  const dates = [...text.matchAll(/(?:(\d{1,2})h(\d{2})\s+del\s+)?(\d{1,2})\s+de\s+([a-záéíóú]+)(?:\s+(?:de|del)\s+(\d{4}))?/gi)]
  const last = dates.at(-1)
  if (!last) return null
  const [, hour = "23", minute = "59", day, monthName, year = text.match(/\b(20\d{2})\b/)?.[1]] = last
  const month = MONTHS.indexOf(monthName.toLowerCase()) + 1
  if (!month || !year) return null
  const pad = (value) => String(value).padStart(2, "0")
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${minute}:00-05:00`
}

const response = await fetch(PAGE, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)" } })
if (!response.ok) throw new Error(`${response.status} en ${PAGE}`)
const html = await response.text()

const rows = [...html.matchAll(/<tr[\s\S]*?<\/tr>/g)].map(([row]) => ({
  cells: [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => clean(m[1])).filter(Boolean),
  pdf: row.match(/href="([^"]+\.pdf)"/i)?.[1] ?? null,
}))
// Filas de datos: cargo, grupo ocupacional, tipo de contrato, proyecto, lugar, postulación (+ enlace a las bases)
const found = rows.filter(({ cells, pdf }) => pdf && cells.length >= 6).map(({ cells, pdf }) => {
  const [title, group, contract, project, place, deadline] = cells
  return { id: `${pdf.split("/").pop()}#${title}`, title, group, contract, project, place, deadlineText: deadline, closesAt: parseDeadline(deadline), url: pdf, isIT: isITRole(title) }
})
if (!found.length) throw new Error("No se encontró la tabla de convocatorias: la página cambió de formato.")

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const firstSeen = new Map(previous.jobs.map((job) => [job.id, job.firstSeen]))
const unique = [...new Map(found.map((job) => [job.id, { ...job, firstSeen: firstSeen.get(job.id) ?? today }])).values()]
// La tabla del INEC es su propio historial; se conservan además las filas que retire
const retired = previous.jobs.filter((job) => !unique.some((item) => item.id === job.id))
const jobs = [...unique, ...retired].sort((a, b) => (b.closesAt ?? "").localeCompare(a.closesAt ?? ""))

const output = JSON.stringify({ source: PAGE, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
const open = jobs.filter((job) => job.closesAt && Date.parse(job.closesAt) > Date.now())
console.log(`INEC: ${jobs.length} convocatorias (${jobs.filter((job) => job.isIT).length} de TI), ${open.length} abiertas. ${changed ? "Datos actualizados." : "Sin cambios."}`)
for (const job of open) console.log(`  ${job.isIT ? "[TI] " : ""}${job.title} — cierra ${job.closesAt}`)
