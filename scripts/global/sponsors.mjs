// Empresas que patrocinaron visas de trabajo de TI en Canadá, según datos oficiales del Gobierno de Canadá:
// la lista de empleadores con un LMIA (Labour Market Impact Assessment) aprobado, que publica ESDC cada trimestre en
//   https://open.canada.ca/data/dataset/90fed587-1364-4f33-a9ee-208181dc0b97
// Un LMIA aprobado es el permiso que la empresa obtiene para contratar a un extranjero; el Global Talent Stream es
// la vía rápida para cargos de tecnología. Suma los últimos 4 trimestres y solo ocupaciones de TI (NOC 2021).
// Guarda lib/data/visa-sponsors.json; solo escribe el archivo si algo cambió.
// EE. UU. no está: USCIS y el Departamento de Trabajo bloquean las descargas automáticas.
// Uso (desde la raíz del repo):  node scripts/global/sponsors.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
// xlsx está instalado en scripts/petroecuador, que es lo que GitHub Actions instala
const XLSX = createRequire(new URL("../petroecuador/package.json", import.meta.url))("xlsx")

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/visa-sponsors.json")
const DATASET = "https://open.canada.ca/data/api/action/package_show?id=90fed587-1364-4f33-a9ee-208181dc0b97"
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

// Ocupaciones de TI de la NOC 2021: gerentes de sistemas, ingenieros y desarrolladores de software, datos, redes,
// ciberseguridad, diseño web y soporte técnico
const IT_NOC = /^(20012|21211|21220|21221|21222|21223|21230|21231|21232|21233|21234|21311|22220|22221|22222)-/

async function get(url, as = "json") {
  const response = await fetch(url, { headers: { "User-Agent": UA } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  return as === "json" ? response.json() : Buffer.from(await response.arrayBuffer())
}

const { result } = await get(DATASET)
// Archivos trimestrales en inglés: "tfwp_2026q2_pos_en.xlsx"
const quarterly = result.resources
  .map((resource) => ({ url: resource.url, quarter: resource.url.match(/(\d{4})q(\d)_pos_en\.xlsx$/i) }))
  .filter((item) => item.quarter)
  .map((item) => ({ url: item.url, quarter: `${item.quarter[1]}-T${item.quarter[2]}` }))
  .sort((a, b) => b.quarter.localeCompare(a.quarter))
  .slice(0, 4)
if (quarterly.length === 0) throw new Error("No se encontraron los archivos trimestrales del LMIA")

const clean = (text) => String(text ?? "").replace(/\s+/g, " ").trim()
const employers = new Map()
for (const { url, quarter } of quarterly) {
  const sheet = XLSX.read(await get(url, "buffer")).Sheets
  const rows = XLSX.utils.sheet_to_json(Object.values(sheet)[0], { header: 1 })
  const header = rows.findIndex((row) => row.includes("Employer"))
  const col = Object.fromEntries(rows[header].map((name, index) => [clean(name), index]))
  for (const row of rows.slice(header + 1)) {
    const occupation = clean(row[col.Occupation])
    if (!IT_NOC.test(occupation)) continue
    const name = clean(row[col.Employer])
    const entry = employers.get(name) ?? { name, positions: 0, globalTalent: false, cities: new Set(), occupations: new Set() }
    entry.positions += Number(row[col["Approved Positions"]]) || 0
    entry.globalTalent ||= /global talent/i.test(clean(row[col["Program Stream"]]))
    entry.cities.add(clean(row[col.Address]).split(",")[0])
    entry.occupations.add(occupation.replace(/^\d+-/, ""))
    employers.set(name, entry)
  }
  console.log(`${quarter}: leído`)
}

// Solo empleadores con al menos 3 puestos de TI aprobados: los que contratan extranjeros de forma habitual
const MIN_POSITIONS = 3
const list = [...employers.values()]
  .filter((entry) => entry.positions >= MIN_POSITIONS)
  .sort((a, b) => b.positions - a.positions || a.name.localeCompare(b.name))
  .map((entry) => ({ ...entry, cities: [...entry.cities].sort(), occupations: [...entry.occupations].sort().slice(0, 4) }))
const quarters = quarterly.map((item) => item.quarter).sort()
const output = JSON.stringify({ source: "https://open.canada.ca/data/dataset/90fed587-1364-4f33-a9ee-208181dc0b97", quarters, canada: list }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`Canadá (${quarters[0]} a ${quarters.at(-1)}): ${list.length} empleadores con 3 o más puestos de TI con LMIA, ${list.reduce((sum, entry) => sum + entry.positions, 0)} puestos. ${changed ? "Datos actualizados." : "Sin cambios."}`)
