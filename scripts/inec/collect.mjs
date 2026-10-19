// Recolecta las convocatorias de "Trabaja con nosotros" del INEC (Instituto Nacional de Estadística y Censos).
//
// El INEC publica casi cada semana cargos para sus encuestas y proyectos (analistas, especialistas de bases de datos,
// encuestadores) en una tabla HTML, y cada postulación queda abierta solo uno o tres días. Este script lee la tabla
// dos veces al día, marca los roles de TI y guarda en lib/data/inec-jobs.json cada convocatoria con el día en que
// apareció. Las bases están en el PDF de cada fila, y dentro del PDF el enlace real de postulación (un formulario del
// INEC o de Google): se extrae con pdftotext (poppler-utils) una sola vez por convocatoria.
// Uso (desde la raíz del repo):  node scripts/inec/collect.mjs
import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
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

// Formularios de postulación que usa el INEC. Se buscan por dominio porque pdftotext pega el enlace con la palabra
// siguiente ("...447246?lang=esLUGAR DE TRABAJO").
const APPLY_LINKS = [
  /https?:\/\/aplicaciones2\.ecuadorencifras\.gob\.ec\/encuestas\/index\.php\/\d+(?:\?lang=es)?/,
  /https?:\/\/forms\.gle\/[A-Za-z0-9]{17}/,
  /https?:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform/,
]
const tmp = mkdtempSync(path.join(os.tmpdir(), "inec-"))

/** Enlace de postulación escrito en el PDF de la convocatoria, o null si no lo trae (o no hay pdftotext). */
async function findApplyUrl(pdfUrl) {
  try {
    const response = await fetch(pdfUrl, { headers: { "User-Agent": USER_AGENT } })
    if (!response.ok) return null
    const file = path.join(tmp, "convocatoria.pdf")
    writeFileSync(file, Buffer.from(await response.arrayBuffer()))
    const text = execFileSync("pdftotext", [file, "-"], { encoding: "utf8" }).replace(/\s+/g, " ")
    for (const pattern of APPLY_LINKS) {
      const match = text.match(pattern)
      if (match) return match[0]
    }
  } catch (error) {
    console.warn(`  No se pudo leer ${pdfUrl}: ${error.message}`)
  }
  return null
}

const USER_AGENT = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const response = await fetch(PAGE, { headers: { "User-Agent": USER_AGENT } })
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
const known = new Map(previous.jobs.map((job) => [job.id, job]))
const unique = [...new Map(found.map((job) => [job.id, { ...job, firstSeen: known.get(job.id)?.firstSeen ?? today }])).values()]

// Un PDF sirve a varias filas: se lee una vez por PDF y solo si ninguna fila ya tiene su enlace
const applyByPdf = new Map(previous.jobs.filter((job) => job.applyUrl).map((job) => [job.url, job.applyUrl]))
for (const pdf of new Set(unique.map((job) => job.url))) {
  if (!applyByPdf.has(pdf)) applyByPdf.set(pdf, await findApplyUrl(pdf))
}
rmSync(tmp, { recursive: true, force: true })
for (const job of unique) job.applyUrl = applyByPdf.get(job.url) ?? null
// La tabla del INEC es su propio historial; se conservan además las filas que retire
const retired = previous.jobs.filter((job) => !unique.some((item) => item.id === job.id))
const jobs = [...unique, ...retired].sort((a, b) => (b.closesAt ?? "").localeCompare(a.closesAt ?? ""))

const output = JSON.stringify({ source: PAGE, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
const open = jobs.filter((job) => job.closesAt && Date.parse(job.closesAt) > Date.now())
console.log(`INEC: ${jobs.length} convocatorias (${jobs.filter((job) => job.isIT).length} de TI, ${jobs.filter((job) => job.applyUrl).length} con enlace de postulación), ${open.length} abiertas. ${changed ? "Datos actualizados." : "Sin cambios."}`)
for (const job of open) console.log(`  ${job.isIT ? "[TI] " : ""}${job.title} — cierra ${job.closesAt}`)
