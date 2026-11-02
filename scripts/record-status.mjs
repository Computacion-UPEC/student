// Registra el resultado de cada recolector del workflow en lib/data/scrape-status.json.
// Uso:  node scripts/record-status.mjs Petroecuador=success Bancos=failure ...   (el "outcome" de cada paso)
import { recordStatus } from "./lib/status.mjs"

const results = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [name, outcome] = arg.split("=")
  return [name, outcome === "success"]
}))
recordStatus(results)
console.log(`Estado registrado: ${Object.entries(results).map(([name, ok]) => `${name} ${ok ? "ok" : "con fallas"}`).join(", ")}`)
