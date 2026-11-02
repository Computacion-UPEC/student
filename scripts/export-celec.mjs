// Convierte la hoja "Para Ing. Computación" del Excel generado por scrape_celec.py
// en lib/data/celec-jobs.json, que es lo que usa la página de Oportunidades.
//
// Conserva el historial: las convocatorias que CELEC ya retiró de su sitio siguen en el JSON (como cerradas).
//
// Uso:  node scripts/export-celec.mjs [ruta/al/archivo.xlsx]
// Sin argumento usa el .xlsx más reciente dentro de data/.
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import * as fs from "node:fs"
import { IT_ROLE } from "./lib/it-roles.mjs"

// xlsx se instala en scripts/petroecuador (lo comparten los recolectores en GitHub Actions)
const XLSX = createRequire(new URL("./petroecuador/package.json", import.meta.url))("xlsx")
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


// Sueldos que el scraper leyó mal, verificados contra la convocatoria oficial (enlace = clave)
const SALARY_FIXES = {
  // El PDF dice "$ 1,170.00"; el scraper anterior lo cortó en "1,17"
  "https://www.celec.gob.ec/celecsur/wp-content/uploads/2024/06/12.-CONVOCATORIA-ASIS-TIC.pdf": 1170,
  "https://www.celec.gob.ec/celecsur/wp-content/uploads/2024/08/11.-CONVOCATORIA-ASIS-TIC-003.pdf": 1170,
  // El PDF dice "$ 1,856.22"
  "https://www.celec.gob.ec/celecsur/wp-content/uploads/2024/04/CONVOCATORIA-SELECCION-CONCURSO-CELEC-SUR-1.pdf": 1856.22,
  // La página dice "$1.1170,00" (dígito de más); es un Asistente Adm. 7, que en el resto de ofertas gana $1.170,00
  "https://www.celec.gob.ec/termopichincha/uncategorized/convocatoria-para-el-proceso-de-seleccion-simple-asistente-de-bodega-e-inventarios-central-puna-2/": 1170,
  "https://www.celec.gob.ec/termopichincha/uncategorized/convocatoria-para-el-proceso-de-seleccion-simple-asistente-de-gestion-documentao-y-archivo-central-guangopolo/": 1170,
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })

/** Convierte "1.170,00", "1,170.00", "1350.00" o "2025,00" a número; null si el formato no es confiable. */
function parseAmount(token) {
  const decimal = token.match(/[.,](\d{2})$/)
  const integerPart = decimal ? token.slice(0, -3) : token
  const groups = integerPart.split(/[.,]/)
  // Separadores de miles: cada grupo después del primero debe tener 3 dígitos
  if (groups.slice(1).some((group) => group.length !== 3)) return null
  const amount = Number(groups.join("") + (decimal ? `.${decimal[1]}` : ""))
  // Un sueldo mensual menor a USD 400 es un error de lectura (p. ej. "1,17")
  return amount >= 400 ? amount : null
}

/** Sueldo en un solo formato ($1,170.00); varios montos se separan con " / ". */
function formatSalary(raw, url) {
  if (url && SALARY_FIXES[url]) return usd.format(SALARY_FIXES[url])
  const tokens = raw.match(/\d[\d.,]*\d|\d/g)
  if (!tokens) return ""
  const amounts = tokens.map(parseAmount)
  if (amounts.some((amount) => amount == null)) throw new Error(`Sueldo con formato desconocido: "${raw}" (${url}). Agrégalo a SALARY_FIXES.`)
  return amounts.map((amount) => usd.format(amount)).join(" / ")
}

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
    id: `celec-${createHash("sha1").update(`${docCell?.l?.Target ?? ""}|${cargo}`).digest("hex").slice(0, 10)}`,
    unit: clean(value("Unidad")),
    role: cargo,
    // Un cargo de TI es afinidad directa aunque la convocatoria no detalle la carrera
    fit: eligibility.startsWith("1") || IT_ROLE.test(cargo) ? "Directa" : "Posible",
    isIT: IT_ROLE.test(cargo),
    fitDetail: eligibility.replace(/^\d\.\s*/, ""),
    minExperienceMonths: typeof value("Experiencia mínima (meses)") === "number" ? value("Experiencia mínima (meses)") : null,
    experience: clean(value("Experiencia requerida")),
    education: clean(value("Formación requerida")),
    salary: formatSalary(clean(value("Sueldo (RMU)")), docCell?.l?.Target),
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
const today = new Date().toISOString().slice(0, 10)
const key = (job) => `${job.url ?? ""}|${job.role}`
const previous = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : { jobs: [] }
const before = new Map(previous.jobs.map((job) => [key(job), job]))
const current = new Set(jobs.map(key))
const merged = [
  // Las exportaciones anteriores al historial no traen firstSeen: se toma su fecha de exportación
  ...jobs.map((job) => ({ ...job, firstSeen: before.has(key(job)) ? before.get(key(job)).firstSeen ?? previous.exportedAt : today })),
  // Retiradas del sitio de CELEC: se guardan como historial
  ...previous.jobs.filter((job) => !current.has(key(job))).map((job) => ({ ...job, firstSeen: job.firstSeen ?? previous.exportedAt })),
]
// exportedAt cambia cada día: solo se reescribe si cambiaron las convocatorias
const changed = JSON.stringify(previous.jobs) !== JSON.stringify(merged)
if (changed) writeFileSync(out, JSON.stringify({ source: "https://www.celec.gob.ec", exportedAt: today, jobs: merged }, null, 2) + "\n")
console.log(`CELEC: ${jobs.length} convocatorias para TI en el sitio, ${merged.length} en el historial. ${changed ? "Datos actualizados." : "Sin cambios."}`)

// Todas las convocatorias (hoja "Todas") con su enlace, para revisarlas una por una: lib/data/celec-all.json
const allSheet = wb.Sheets["Todas"]
const allRows = allSheet ? XLSX.utils.sheet_to_json(allSheet, { header: 1 }) : []
const allHeader = allRows[0] ?? []
const allRange = allSheet ? XLSX.utils.decode_range(allSheet["!ref"]) : null
const calls = []
for (let r = 1; allRange && r <= allRange.e.r; r++) {
  const at = (name) => allSheet[XLSX.utils.encode_cell({ r, c: allHeader.indexOf(name) })]
  const role = clean(at("Cargo")?.v)
  if (!role) continue
  calls.push({
    unit: clean(at("Unidad")?.v),
    role,
    eligibility: clean(at("Elegibilidad Ing. Computación")?.v).replace(/^\d\.\s*/, ""),
    publishedAt: toDate(at("Fecha publicación")?.v),
    closesAt: toDate(at("Fecha finalización")?.v),
    url: at("Documento")?.l?.Target ?? null,
  })
}
if (calls.length) {
  const allOut = path.join(root, "lib", "data", "celec-all.json")
  const previousCalls = existsSync(allOut) ? JSON.parse(readFileSync(allOut, "utf8")).calls : []
  const seen = new Set(calls.map(key))
  const allMerged = [...calls, ...previousCalls.filter((call) => !seen.has(key(call)))]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
  if (JSON.stringify(previousCalls) !== JSON.stringify(allMerged)) writeFileSync(allOut, JSON.stringify({ source: "https://www.celec.gob.ec", calls: allMerged }, null, 2) + "\n")
  console.log(`CELEC: ${allMerged.length} convocatorias en total (todas las unidades) en ${path.relative(root, allOut)}`)
}
