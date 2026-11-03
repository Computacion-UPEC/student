// Lee las vacantes de un portal de TalentRoom (https://talentroom.ec/talent-public/portal/<empresa>/external/vacantes).
// Su API responde cifrado, así que se lee la lista que muestra la página, como un visitante, con el navegador sin
// interfaz que se instala para Petroecuador. Las vacantes no tienen enlace propio: se abren dentro del portal.
// Lo usa el recolector de empresas privadas (Netlife).
import { createRequire } from "node:module"

const { chromium } = createRequire(new URL("../petroecuador/package.json", import.meta.url))("playwright-core")
const MAX_PAGES = 30

/** Vacantes del portal: { key, title, city, publishedAt, url }. */
export async function talentRoom(company) {
  const url = `https://talentroom.ec/talent-public/portal/${company}/external/vacantes`
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined })
  try {
    const page = await browser.newPage({ locale: "es-EC" })
    await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 })
    const jobs = []
    const seen = new Map()
    for (let number = 1; number <= MAX_PAGES; number++) {
      // Cada tarjeta: título (h2) y una línea "Ciudad | jornada | modalidad" (p)
      const cards = await page.$$eval("div.cursor-pointer", (items) => items.map((item) => [
        item.querySelector("h2")?.textContent.replace(/\s+/g, " ").trim() ?? "",
        item.querySelector("p")?.textContent.replace(/\s+/g, " ").trim() ?? "",
      ]))
      for (const [title, place] of cards) {
        if (!title) continue
        const city = place.split("|")[0].trim() || null
        // Sin id propio: dos vacantes con el mismo cargo y ciudad se distinguen por su orden
        const base = `${title}-${city ?? ""}`.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/^-|-$/g, "")
        const n = (seen.get(base) ?? 0) + 1
        seen.set(base, n)
        jobs.push({ key: n > 1 ? `${base}-${n}` : base, title, city, publishedAt: null, url })
      }
      // Paginador de PrimeNG: botón "siguiente" hasta que se deshabilita
      const next = page.locator("button.p-paginator-next:not(.p-disabled):not([disabled])").first()
      if (!(await next.count())) break
      const before = cards.map(([title]) => title).join("|")
      await next.click()
      await page.waitForFunction((previous) => [...document.querySelectorAll("div.cursor-pointer h2")].map((h) => h.textContent.replace(/\s+/g, " ").trim()).join("|") !== previous, before, { timeout: 30_000 }).catch(() => {})
    }
    if (!jobs.length) throw new Error(`no se encontraron vacantes en ${url}`)
    return jobs
  } finally {
    await browser.close()
  }
}
