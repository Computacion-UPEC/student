// Contratistas de las grandes operadoras públicas de energía, petróleo y finanzas, según los procesos de compra
// pública que ellas mismas publican en SERCOP (datos abiertos OCDS, sin clave):
//   https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/api/search_ocds?year=<año>&search=<texto>&page=<n>
//   https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/api/record?ocid=<ocid>
// Las operadoras subcontratan el trabajo de campo (telecomunicaciones, automatización, TI, seguridad industrial y
// mantenimiento electromecánico) a empresas integradoras: entrar por una de ellas suele ser más rápido. Este script
// guarda qué empresas ganan esos contratos (o al menos ofertan), a quién y por cuánto, en lib/data/contratistas.json.
// Solo empresas (RUC de sociedad); las personas naturales no se guardan.
// El API admite 60 consultas por minuto: espera ~1,1 s entre consultas. Tarda unos 10 minutos.
// Uso (desde la raíz del repo):  node scripts/contratistas/collect.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { fieldsOf } from "./fields.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/contratistas.json")
const API = "https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/api"
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const year = new Date().getFullYear()
const YEARS = [year - 1, year]
const MAX_PAGES = Number(process.env.MAX_PAGES ?? 120)

// search: texto que se busca en SERCOP; buyer: filtro exacto del nombre de la entidad (la búsqueda es aproximada)
const OPERATORS = [
  { search: "CELEC", buyer: /CELEC|CORPORACI[OÓ]N EL[EÉ]CTRICA DEL ECUADOR/i, operator: "CELEC EP", sector: "Energía" },
  { search: "CNEL", buyer: /CNEL|EL[EÉ]CTRICA P[UÚ]BLICA ESTRAT[EÉ]GICA/i, operator: "CNEL EP", sector: "Energía" },
  { search: "ELECTRICA", buyer: /^EMPRESA EL[EÉ]CTRICA (REGIONAL|PROVINCIAL|AZOGUES|QUITO|AMBATO|RIOBAMBA)|CENTROSUR|ELECTRO ?GENERADORA/i, operator: "Distribuidoras eléctricas", sector: "Energía" },
  { search: "hidrocarburos", buyer: /hidrocarburos del ecuador|petroecuador/i, operator: "EP Petroecuador", sector: "Petróleo" },
  { search: "PETROECUADOR", buyer: /hidrocarburos del ecuador|petroecuador/i, operator: "EP Petroecuador", sector: "Petróleo" },
  { search: "BANECUADOR", buyer: /banecuador/i, operator: "BanEcuador", sector: "Finanzas" },
  { search: "BIESS", buyer: /BIESS|BANCO DEL INSTITUTO ECUATORIANO DE SEGURIDAD SOCIAL/i, operator: "BIESS", sector: "Finanzas" },
  { search: "BANCO CENTRAL", buyer: /BANCO CENTRAL DEL ECUADOR/i, operator: "Banco Central del Ecuador", sector: "Finanzas" },
  { search: "CORPORACION FINANCIERA NACIONAL", buyer: /CORPORACI[OÓ]N FINANCIERA NACIONAL/i, operator: "CFN", sector: "Finanzas" },
  { search: "BANCO DE DESARROLLO", buyer: /BANCO DE DESARROLLO DEL ECUADOR/i, operator: "BDE", sector: "Finanzas" },
  { search: "CONAFIPS", buyer: /CONAFIPS|FINANZAS POPULARES/i, operator: "CONAFIPS", sector: "Finanzas" },
]


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let last = 0
async function getJson(url, tries = 4) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    const wait = last + 1100 - Date.now()
    if (wait > 0) await sleep(wait)
    last = Date.now()
    try {
      const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } })
      if (response.status === 429) { await sleep(30_000 * attempt); continue }
      if (!response.ok) throw new Error(`${response.status}`)
      return await response.json()
    } catch (error) {
      if (attempt === tries) throw new Error(`${error.message} en ${url}`)
      await sleep(5_000 * attempt)
    }
  }
  throw new Error(`429 persistente en ${url}`)
}

/** RUC de sociedad privada: tercer dígito 9 (6 = entidad pública; menor a 6 = persona natural). */
const rucOf = (id = "") => id.match(/RUC-(\d{13})/)?.[1] ?? null
const isCompany = (ruc) => ruc != null && ruc[2] === "9"

// 1. Procesos de las operadoras en los campos de interés
const processes = new Map()
const warnings = []
for (const op of OPERATORS) {
  for (const y of YEARS) {
    let pages = 1
    for (let page = 1; page <= Math.min(pages, MAX_PAGES); page++) {
      let result
      try { result = await getJson(`${API}/search_ocds?year=${y}&search=${encodeURIComponent(op.search)}&page=${page}`) } catch (error) { warnings.push(`${op.operator} ${y}: ${error.message}`); break }
      pages = result.pages ?? 1
      for (const item of result.data ?? []) {
        if (!op.buyer.test(item.buyer ?? "")) continue
        const fields = fieldsOf(item.description ?? "")
        if (!fields.length || processes.has(item.ocid)) continue
        processes.set(item.ocid, { ocid: item.ocid, operator: op.operator, sector: op.sector, buyer: item.buyer.trim(), description: item.description.trim().replace(/\s+/g, " "), amount: Number(item.amount) || 0, date: item.date?.slice(0, 10) ?? null, method: item.internal_type, fields })
      }
    }
    console.log(`${op.operator} ${y}: ${pages} páginas, ${processes.size} procesos acumulados`)
  }
}

// 2. Quién ganó (o al menos ofertó) en cada proceso
const companies = new Map()
const CACHE_DIR = process.env.CACHE_DIR
if (CACHE_DIR) mkdirSync(CACHE_DIR, { recursive: true })
let done = 0
for (const process of processes.values()) {
  let record
  // CACHE_DIR (opcional, solo local): guarda cada registro para no volver a pedirlo
  const cached = CACHE_DIR && path.join(CACHE_DIR, `${process.ocid.replace(/[^\w-]/g, "_")}.json`)
  if (cached && existsSync(cached)) record = JSON.parse(readFileSync(cached, "utf8"))
  else {
    try { record = await getJson(`${API}/record?ocid=${encodeURIComponent(process.ocid)}`) } catch (error) { warnings.push(error.message); continue }
    if (cached) writeFileSync(cached, JSON.stringify(record))
  }
  if (++done % 50 === 0) console.log(`${done}/${processes.size} registros revisados`)
  const releases = record.releases ?? record.records?.flatMap((item) => item.releases ?? []) ?? []
  const parties = new Map(releases.flatMap((release) => release.parties ?? []).map((party) => [party.id, party]))
  const winners = new Map()
  for (const award of releases.flatMap((release) => release.awards ?? [])) {
    if (award.status && !/active|pending/i.test(award.status)) continue
    for (const supplier of award.suppliers ?? []) winners.set(supplier.id, Number(award.value?.amount) || 0)
  }
  for (const party of parties.values()) {
    const ruc = rucOf(party.id)
    if (!isCompany(ruc)) continue
    const won = winners.has(party.id)
    if (!won && !(party.roles ?? []).includes("tenderer")) continue
    const site = party.contactPoint?.url?.trim()
    const entry = companies.get(ruc) ?? { ruc, name: party.name.trim(), website: null, city: party.address?.locality?.trim() || null, sectors: new Set(), operators: new Set(), fields: new Set(), awards: 0, awardedAmount: 0, bids: 0, contracts: [] }
    // Sitio web que la empresa registró en SERCOP (no correos ni dominios gratuitos)
    if (!entry.website && site && /\.[a-z]{2,}/i.test(site) && !/@|gmail|hotmail|yahoo|outlook/i.test(site)) entry.website = /^https?:\/\//i.test(site) ? site : `http://${site}`
    entry.bids++
    entry.sectors.add(process.sector); entry.operators.add(process.operator)
    for (const field of process.fields) entry.fields.add(field)
    if (won) {
      entry.awards++
      entry.awardedAmount += winners.get(party.id) || process.amount
      entry.contracts.push({ ocid: process.ocid, operator: process.operator, description: process.description, amount: winners.get(party.id) || process.amount, date: process.date })
    }
    companies.set(ruc, entry)
  }
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {}
// Los enlaces de redes y empleo (links.mjs) se conservan entre corridas
const previousLinks = new Map((previous.companies ?? []).filter((entry) => entry.links).map((entry) => [entry.ruc, entry.links]))
// 3. Orden: primero quien gana contratos (y cuántos), luego quien solo oferta
const list = [...companies.values()]
  .map((entry) => ({ ...entry, sectors: [...entry.sectors], operators: [...entry.operators], fields: [...entry.fields], awardedAmount: Math.round(entry.awardedAmount), contracts: entry.contracts.sort((a, b) => b.amount - a.amount).slice(0, 4), ...(previousLinks.has(entry.ruc) ? { links: previousLinks.get(entry.ruc) } : {}) }))
  .sort((a, b) => b.awards - a.awards || b.awardedAmount - a.awardedAmount || b.bids - a.bids)

// Si casi todo falló (API caído), no se reemplaza lo que ya había
if (processes.size === 0 && previous.companies?.length) {
  console.log(`::warning::Sin procesos nuevos; se conservan los datos anteriores. ${warnings.slice(0, 3).join(" · ")}`)
  process.exit(0)
}
for (const warning of warnings.slice(0, 10)) console.log(`::warning::${warning}`)
const output = JSON.stringify({ source: "SERCOP, datos abiertos OCDS", years: YEARS, operators: [...new Set(OPERATORS.map((op) => op.operator))], processes: processes.size, companies: list }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
console.log(`${processes.size} procesos de interés; ${list.length} empresas (${list.filter((entry) => entry.awards).length} con contratos ganados). ${changed ? "Datos actualizados." : "Sin cambios."}`)
