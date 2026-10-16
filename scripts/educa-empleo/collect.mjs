// Detecta la convocatoria mensual de Educa Empleo (docentes LOEI) en su página oficial.
//
// Según los lineamientos del MINEDEC, Educa Empleo es un "proceso de ejecución mensual" y el cronograma
// se publica en https://educacion.gob.ec/educa-empleo/. La página no trae las fechas como texto, pero su
// título cambia cada mes ("EDUCA EMPLEO OCTUBRE 2026 – RÉGIMEN ..."). Este script lo lee dos veces al día y
// guarda en lib/data/educa-empleo.json cada mes nuevo con el día en que apareció, para avisar a tiempo.
// Uso (desde la raíz del repo):  node scripts/educa-empleo/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const PAGE = "https://educacion.gob.ec/educa-empleo/"
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/educa-empleo.json")
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
const today = new Date().toISOString().slice(0, 10)

const decode = (text) => text.replace(/&#8211;|&ndash;/g, "–").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

const response = await fetch(PAGE, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)" } })
if (!response.ok) throw new Error(`${response.status} en ${PAGE}`)
const html = await response.text()

const heading = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g)].map((m) => clean(m[1])).find((text) => /^EDUCA EMPLEO\s+[A-ZÁÉÍÓÚ]+\s+\d{4}/i.test(text))
if (!heading) throw new Error("No se encontró el título 'EDUCA EMPLEO <MES> <AÑO>': la página cambió de formato.")
const [, monthName, year] = heading.match(/^EDUCA EMPLEO\s+([A-ZÁÉÍÓÚ]+)\s+(\d{4})/i)
const month = MONTHS.indexOf(monthName.toLowerCase()) + 1
if (!month) throw new Error(`Mes no reconocido: ${monthName}`)
const key = `${year}-${String(month).padStart(2, "0")}`

// Documentos de la convocatoria (lineamientos, manual) publicados en la página
const documents = [...new Set([...html.matchAll(/href="([^"]+educa-empleo[^"]*\.pdf)"/gi)].map((m) => m[1]))]

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { calls: [] }
const calls = previous.calls.filter((call) => call.key !== key)
const before = previous.calls.find((call) => call.key === key)
calls.push({ key, title: heading, firstSeen: before?.firstSeen ?? today, documents })
calls.sort((a, b) => b.key.localeCompare(a.key))

const output = JSON.stringify({ source: PAGE, calls }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`Educa Empleo: ${heading} (visto desde ${before?.firstSeen ?? today}). ${changed ? "Datos actualizados." : "Sin cambios."}`)
