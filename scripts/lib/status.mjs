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
  save({ ...previous, platforms })
}

function save(data) {
  const sortKeys = (object) => Object.fromEntries(Object.entries(object ?? {}).sort(([a], [b]) => a.localeCompare(b)))
  const failing = data.failing && Object.keys(data.failing).length ? { failing: sortKeys(data.failing) } : {}
  const output = JSON.stringify({ platforms: sortKeys(data.platforms), ...failing }, null, 2) + "\n"
  if (!existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output) writeFileSync(OUT, output)
}

/** Corridas seguidas con error a partir de las cuales una fuente se avisa en el issue de fallas. */
export const WARN_AFTER = 3

/**
 * Lleva la cuenta de corridas seguidas en que falla cada fuente de un recolector (una empresa, un banco), en
 * "failing" de scrape-status.json. Un portal caído unas horas (p. ej. un error 500) no abre el issue: solo se avisa
 * con "::warning::" cuando ya falló WARN_AFTER corridas seguidas. ok = true borra la cuenta.
 */
export function trackSource(name, ok, error) {
  const data = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { platforms: {} }
  const failing = { ...data.failing }
  if (ok) {
    if (!failing[name]) return
    delete failing[name]
  } else {
    const runs = (failing[name]?.runs ?? 0) + 1
    failing[name] = { since: failing[name]?.since ?? todayInEcuador(), runs }
    const message = error?.message ?? String(error)
    console.log(runs >= WARN_AFTER
      ? `::warning::${name}: ${message} (falla desde el ${failing[name].since}, ${runs} corridas seguidas)`
      : `${name}: falla temporal ${runs}/${WARN_AFTER}, aún no se avisa: ${message}`)
  }
  save({ ...data, failing })
}
