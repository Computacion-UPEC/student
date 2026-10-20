// Recolecta los cargos de TI en concurso de méritos y oposición del sector público, desde Encuentra Empleo (MDT).
//
// Los ministerios e instituciones regidos por la LOSEP (SRI, ECU 911, Registro Civil, IGM, INAMHI, municipios...)
// publican sus concursos en la página pública "Concursos de mérito y oposición disponibles por Institución". La tabla
// pone primero a las instituciones con vacantes nuevas (en etapa de postulación), y cada una abre un detalle con los
// cargos, la remuneración (RMU) y las fechas de postulación. La página usa PrimeFaces (JSF), así que se lee con un
// navegador sin interfaz, como un visitante. Guarda los cargos de TI en lib/data/public-jobs.json con su historial.
// Para postular hay que ingresar a Encuentra Empleo con una cuenta de aspirante.
//
// Uso (desde la raíz del repo, con las dependencias de scripts/petroecuador instaladas):
//   node scripts/encuentra-empleo/collect.mjs        Local con un navegador instalado: PW_CHANNEL=chrome
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

// playwright-core se instala en scripts/petroecuador (lo comparten ambos recolectores en GitHub Actions)
const { chromium } = createRequire(new URL("../petroecuador/package.json", import.meta.url))("playwright-core")

const SOURCE_URL = "https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/procesos/busquedaOfertaPublica.jsf"
const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/public-jobs.json")
const MAX_PAGES = 40
const today = new Date().toISOString().slice(0, 10)

const clean = (text) => (text ?? "").replace(/\s+/g, " ").trim()
/** "2026-10-21 23:59" (hora de Ecuador) -> "2026-10-21T23:59:00-05:00" */
const toIso = (text) => text?.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/)?.slice(1).join("T").concat(":00-05:00") ?? null

/** Clic por JavaScript: la página abre al cargar un aviso modal cuya máscara tapa los botones. */
const jsClick = (locator) => locator.evaluate((element) => element.click())

/** Espera a que una tabla cambie de contenido después de un clic (PrimeFaces actualiza por AJAX). */
async function clickAndWait(page, locator, tableSelector) {
  const before = await page.locator(tableSelector).first().innerText().catch(() => "")
  await jsClick(locator)
  await page.waitForFunction(({ selector, previous }) => (document.querySelector(selector)?.innerText ?? "") !== previous, { selector: tableSelector, previous: before }, { timeout: 30_000 })
}

/** Lee los cargos del detalle abierto de una institución, página por página. */
async function readVacancies(page, institution) {
  const table = "#vacantesMpForm\\:vacantesTableMp_data"
  await page.waitForFunction((name) => document.getElementById("vacantesModal")?.innerText.includes(name), institution, { timeout: 30_000 })
  const rpp = page.locator("#vacantesMpForm\\:vacantesTableMp select").first()
  if (await rpp.count() && await rpp.inputValue() !== "15") {
    const before = await page.locator(table).innerText()
    await rpp.selectOption("15")
    await page.waitForFunction((previous) => document.querySelector("#vacantesMpForm\\:vacantesTableMp_data")?.innerText !== previous, before, { timeout: 30_000 }).catch(() => {})
  }
  const rows = []
  for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
    rows.push(...await page.$$eval(`${table} > tr`, (trs) => trs.map((tr) => {
      const cells = [...tr.children].map((td) => td.innerText)
      const dates = [...tr.querySelectorAll("th")].map((th) => th.innerText)
      return { cells, dates }
    })))
    const next = page.locator("#vacantesMpForm\\:vacantesTableMp .ui-paginator-next:not(.ui-state-disabled)").first()
    if (!(await next.count())) break
    await clickAndWait(page, next, table)
  }
  return rows.filter(({ cells }) => /^\d+$/.test(clean(cells[0]))).map(({ cells, dates }) => {
    const [code, title, vacancies, salary, city, , stage] = cells.map(clean)
    const dateTexts = dates.map(clean).filter((text) => /\d{4}-\d{2}-\d{2}/.test(text))
    return {
      id: code, institution, title, vacancies: Number(vacancies) || 1, salary: Number(salary) || null, city,
      stage: stage.split(" Desde")[0], opensAt: toIso(dateTexts[0]), closesAt: toIso(dateTexts[1]),
    }
  })
}

async function scrape() {
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ locale: "es-EC" })
    await page.goto(SOURCE_URL, { waitUntil: "networkidle", timeout: 90_000 })
    const table = "#formBuscaPublica\\:itemsTable_data"
    await page.waitForSelector(`${table} tr`, { timeout: 60_000 })
    const rpp = page.locator("#formBuscaPublica\\:itemsTable select").first()
    if (await rpp.count()) {
      const before = await page.locator(table).innerText()
      await rpp.selectOption("15")
      await page.waitForFunction((previous) => document.querySelector("#formBuscaPublica\\:itemsTable_data")?.innerText !== previous, before, { timeout: 30_000 }).catch(() => {})
    }

    const vacancies = []
    let institutionsWithVacancies = 0
    for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
      const rows = page.locator(`${table} > tr`)
      const count = await rows.count()
      let reachedZero = false
      for (let index = 0; index < count; index++) {
        const row = rows.nth(index)
        const institution = clean(await row.locator("td").nth(0).innerText())
        const newVacancies = Number((await row.locator("td").nth(1).innerText()).match(/(\d+)\s+Nuevas vacantes/i)?.[1] ?? 0)
        // La tabla ordena primero a las instituciones con vacantes nuevas: al llegar a 0 ya no hay más
        if (!newVacancies) { reachedZero = true; break }
        institutionsWithVacancies++
        await jsClick(row.locator("td").nth(1).locator("a").first())
        try {
          vacancies.push(...await readVacancies(page, institution))
        } catch (error) {
          console.warn(`  No se pudo leer ${institution}: ${error.message}`)
        }
        await page.evaluate(() => window.PF?.("vacantesModal")?.hide())
      }
      if (reachedZero) break
      const next = page.locator("#formBuscaPublica\\:itemsTable .ui-paginator-next:not(.ui-state-disabled)").first()
      if (!(await next.count())) break
      await clickAndWait(page, next, table)
    }
    return { vacancies, institutionsWithVacancies }
  } finally {
    await browser.close()
  }
}

const { vacancies, institutionsWithVacancies } = await scrape()

// Se guardan solo los cargos de TI (con historial); del resto, el total del día
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const jobs = new Map(previous.jobs.map((job) => [job.id, job]))
for (const vacancy of vacancies.filter((item) => isITRole(item.title))) {
  const before = jobs.get(vacancy.id)
  jobs.set(vacancy.id, { ...vacancy, isIT: true, firstSeen: before?.firstSeen ?? today, lastSeen: today })
}
const sorted = [...jobs.values()].sort((a, b) => (b.closesAt ?? "").localeCompare(a.closesAt ?? ""))
const summary = { date: today, institutions: institutionsWithVacancies, vacancies: vacancies.length }

const output = JSON.stringify({ source: SOURCE_URL, lastRun: summary, jobs: sorted }, null, 2) + "\n"
// El resumen cambia de fecha cada día: solo se escribe si cambian los cargos o los totales
const comparable = (text) => text.replace(/\r\n/g, "\n").replace(/"date": "[\d-]+",\s*/, "")
const changed = !existsSync(OUT) || comparable(readFileSync(OUT, "utf8")) !== comparable(output)
if (changed) writeFileSync(OUT, output)
console.log(`Encuentra Empleo: ${vacancies.length} cargos en postulación en ${institutionsWithVacancies} instituciones; ${sorted.filter((job) => job.lastSeen === today).length} de TI hoy, ${sorted.length} en el historial. ${changed ? "Datos actualizados." : "Sin cambios."}`)
for (const job of sorted.filter((item) => item.lastSeen === today)) console.log(`  [TI] ${job.institution}: ${job.title} — cierra ${job.closesAt}`)
