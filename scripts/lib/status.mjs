// Registro de cuándo se revisó cada fuente de ofertas, para la tabla "Plataformas que revisamos" de Oportunidades.
//
// Guarda en lib/data/scrape-status.json, por plataforma, el día (hora de Ecuador) de la última revisión, el de la
// última revisión sin errores y si la última salió bien. Solo guarda el día para no generar un commit por corrida.
// Lo usan el workflow "Recolectar convocatorias" (scripts/record-status.mjs), el recolector de CNT y, desde el
// scraper local de Encuentra Empleo, publicar_sitio.py.
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../lib/data/scrape-status.json")

/** Día de hoy en Ecuador (UTC-5, sin horario de verano). */
export const todayInEcuador = () => new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10)

/** results: { "INEC": true, "CNT": false, ... } (true = la revisión salió bien). */
export function recordStatus(results, day = todayInEcuador()) {
  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { platforms: {} }
  const platforms = { ...previous.platforms }
  for (const [name, ok] of Object.entries(results)) {
    const before = platforms[name] ?? {}
    platforms[name] = { lastRun: day, lastSuccess: ok ? day : before.lastSuccess ?? null, ok }
  }
  const sorted = Object.fromEntries(Object.entries(platforms).sort(([a], [b]) => a.localeCompare(b)))
  const output = JSON.stringify({ platforms: sorted }, null, 2) + "\n"
  if (!existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output) writeFileSync(OUT, output)
}
