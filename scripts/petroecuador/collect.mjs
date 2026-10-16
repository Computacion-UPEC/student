// Recolecta las convocatorias de EP Petroecuador desde su página oficial "Trabaja con nosotros".
//
// La página solo muestra los procesos en ejecución (algunos duran 2 días) y luego los quita,
// así que este script se ejecuta a diario y acumula un historial en lib/data/petroecuador-jobs.json.
// Abre la página pública con un navegador sin interfaz, igual que un visitante, y lee la tabla.
//
// Uso (desde esta carpeta):  npm install && node collect.mjs
// Local con un navegador instalado:  PW_CHANNEL=chrome node collect.mjs   (o msedge)
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright-core"
import { isITRole } from "../lib/it-roles.mjs"

const SOURCE_URL = "https://eppetroecuadorenlinea.eppetroecuador.ec/eppec-talento-humano-concursos-ang/#/"
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/petroecuador-jobs.json")

const clean = (text) => text.replace(/\s+/g, " ").trim()

/** "14/10/2026 15:00" (hora de Ecuador) -> "2026-10-14T15:00:00-05:00" */
function toIso(text) {
  const m = clean(text).match(/^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?$/)
  if (!m) return null
  const [, d, mo, y, h = "00", mi = "00"] = m
  return `${y}-${mo}-${d}T${h}:${mi}:00-05:00`
}

async function readTable(page) {
  return page.$$eval("table tbody tr", (rows) => rows.map((row) => [...row.querySelectorAll("td")].map((td) => td.innerText)))
}

async function scrape() {
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ locale: "es-EC" })
    await page.goto(SOURCE_URL, { waitUntil: "networkidle", timeout: 90_000 })
    // Espera a que la tabla tenga filas o a que la página indique que no hay procesos
    await page.waitForFunction(() => document.querySelector("table tbody tr td") || /no existen|no hay/i.test(document.body.innerText), null, { timeout: 60_000 })

    const rows = []
    for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
      rows.push(...await readTable(page))
      const next = page.locator(".ui-paginator-next:not(.ui-state-disabled)")
      if (!(await next.count())) break
      const firstCode = await page.locator("table tbody tr td").first().innerText()
      await next.click()
      await page.waitForFunction((previous) => document.querySelector("table tbody tr td")?.textContent?.trim() !== previous.trim(), firstCode, { timeout: 15_000 })
    }
    return rows
  } finally {
    await browser.close()
  }
}

const rows = await scrape()
const today = new Date().toISOString().slice(0, 10)

const scraped = rows
  .filter((cells) => cells.length >= 6 && /^[A-Z]+-\d+/.test(clean(cells[0])))
  .map(([code, type, role, city, opens, closes]) => ({
    code: clean(code),
    type: clean(type),
    role: clean(role),
    city: clean(city),
    opensAt: toIso(opens),
    closesAt: toIso(closes),
    isIT: isITRole(role),
  }))

if (rows.length && !scraped.length) throw new Error("La tabla cambió de formato: no se reconoció ninguna fila. Revisa el selector o las columnas.")

// Historial: conserva lo visto antes y actualiza lo que sigue publicado
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const byCode = new Map(previous.jobs.map((job) => [job.code, job]))
for (const job of scraped) {
  const before = byCode.get(job.code)
  byCode.set(job.code, { ...job, firstSeen: before?.firstSeen ?? today, lastSeen: today })
}

const jobs = [...byCode.values()].sort((a, b) => (b.opensAt ?? "").localeCompare(a.opensAt ?? "") || b.code.localeCompare(a.code))
const output = JSON.stringify({ source: SOURCE_URL, collectedSince: previous.collectedSince ?? today, jobs }, null, 2) + "\n"

// Solo escribe si algo cambió, para no generar un commit (y un despliegue) cada día sin novedades
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)

const newOnes = scraped.filter((job) => !previous.jobs.some((old) => old.code === job.code))
console.log(`Publicados hoy: ${scraped.length} (${newOnes.length} nuevos, ${scraped.filter((job) => job.isIT).length} de TI). Historial: ${jobs.length}. ${changed ? "Datos actualizados." : "Sin cambios."}`)
