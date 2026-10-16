// Convierte la hoja "Para Ing. Computación" del Excel generado por scrape_celec.py
// en lib/data/celec-jobs.json, que es lo que usa la página de Oportunidades.
//
// Uso:  node scripts/export-celec.mjs [ruta/al/archivo.xlsx]
// Sin argumento usa el .xlsx más reciente dentro de data/.
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import * as XLSX from "xlsx"
import * as fs from "node:fs"

XLSX.set_fs(fs)

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..")
const dataDir = path.join(root, "data")

const input = process.argv[2] ?? readdirSync(dataDir)
  .filter((f) => f.startsWith("celec_empleos") && f.endsWith(".xlsx"))
  .map((f) => path.join(dataDir, f))
  .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]

if (!input) throw new Error("No se encontró ningún data/celec_empleos*.xlsx")

const wb = XLSX.readFile(input)
const sheetName = wb.SheetNames.find((n) => n.startsWith("Para Ing"))
if (!sheetName) throw new Error(`La hoja "Para Ing. Computación" no existe en ${input}`)
const sheet = wb.Sheets[sheetName]

// Excel guarda las fechas como número de días desde 1899-12-30
const toDate = (value) => {
  if (typeof value === "number") return new Date(Date.UTC(1899, 11, 30) + value * 864e5).toISOString().slice(0, 10)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return null
}
const clean = (value) => (value == null ? "" : String(value).replace(/\s+/g, " ").trim())

// Rol de TI según el título del cargo (no según la carrera aceptada: muchos cargos administrativos
// aceptan "Sistemas" entre varias carreras sin ser de TI)
const IT_ROLE = /tecnolog[ií]as? de (la )?informaci[oó]n|\bTICS?\b|inform[aá]tic|software|desarrollador|programador|ciberseguridad|base de datos|redes y comunicaciones|soporte t[eé]cnico/i

const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
const col = (name) => header.indexOf(name)
const range = XLSX.utils.decode_range(sheet["!ref"])

const jobs = []
for (let r = range.s.r + 1; r <= range.e.r; r++) {
  const cell = (name) => sheet[XLSX.utils.encode_cell({ r, c: col(name) })]
  const value = (name) => cell(name)?.v
  const cargo = clean(value("Cargo"))
  if (!cargo) continue
  const eligibility = clean(value("Elegibilidad Ing. Computación"))
  const docCell = cell("Documento")
  jobs.push({
    id: `celec-${r}`,
    unit: clean(value("Unidad")),
    role: cargo,
    // Un cargo de TI es afinidad directa aunque la convocatoria no detalle la carrera
    fit: eligibility.startsWith("1") || IT_ROLE.test(cargo) ? "Directa" : "Posible",
    isIT: IT_ROLE.test(cargo),
    fitDetail: eligibility.replace(/^\d\.\s*/, ""),
    minExperienceMonths: typeof value("Experiencia mínima (meses)") === "number" ? value("Experiencia mínima (meses)") : null,
    experience: clean(value("Experiencia requerida")),
    education: clean(value("Formación requerida")),
    salary: clean(value("Sueldo (RMU)")),
    openings: clean(value("Vacantes")),
    publishedAt: toDate(value("Fecha publicación")),
    closesAt: toDate(value("Fecha finalización")),
    statusAtScrape: clean(value("Estado")),
    code: clean(value("Código")),
    url: docCell?.l?.Target ?? null,
  })
}

const out = path.join(root, "lib", "data", "celec-jobs.json")
mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ source: path.basename(input), exportedAt: new Date().toISOString().slice(0, 10), jobs }, null, 2) + "\n")
console.log(`${jobs.length} ofertas -> ${path.relative(root, out)}`)
