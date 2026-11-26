// Redes sociales y página de empleo de cada contratista, tomadas SOLO de su sitio oficial (el que registró en SERCOP).
// Lee lib/data/contratistas.json, abre la portada de cada sitio (y, si existe, su página de contacto o "nosotros"),
// y guarda en cada empresa:  links: { linkedin, facebook, instagram, tiktok, x, youtube, whatsapp, careers: [{label,url}] }
// Si un sitio no responde, se conservan los enlaces que ya tenía.
// Uso (desde la raíz del repo):  node scripts/contratistas/links.mjs
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { mainField } from "./fields.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const FILE = process.env.CONTRACTORS_FILE ?? path.resolve(here, "../../lib/data/contratistas.json")
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const CONCURRENCY = 6

const SOCIAL = {
  linkedin: /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/(company|school|showcase)\/[^/?#]+/i,
  facebook: /^https?:\/\/(www\.|m\.|web\.)?facebook\.com\/(?!sharer|share|dialog|plugins|tr\b)[^?#]+/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/(?!p\/|reel\/|explore)[^/?#]+/i,
  tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[^/?#]+/i,
  x: /^https?:\/\/(www\.)?(twitter|x)\.com\/(?!intent|share|home)[^/?#]+/i,
  youtube: /^https?:\/\/(www\.)?youtube\.com\/(@|c\/|channel\/|user\/)[^?#]+/i,
  whatsapp: /^https?:\/\/(wa\.me\/\d+|(api|web)\.whatsapp\.com\/send\?phone=\d+)/i,
}
// Texto o dirección de un enlace de empleo
const CAREERS_TEXT = /trabaja con nosotros|trabaje con nosotros|[uú]nete|bolsa de (empleo|trabajo)|empleos?\b|vacantes|careers?|talento humano|postula|work with us|join us/i
const CAREERS_URL = /trabaja|trabaje|empleo|vacante|careers?|jobs?|talento|postula|unete|join/i
const ATS = /(teamtailor|hiringroom|bumeran|multitrabajos|computrabajo|workday|greenhouse|lever\.co|smartrecruiters|buk\.|recruitee|kenjo|jobvite|talentclue|evaluar)\./i
const SUBPAGE = /contact|nosotros|about|empresa|quienes/i

async function fetchHtml(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: controller.signal })
    if (!response.ok || !/html/i.test(response.headers.get("content-type") ?? "")) return null
    const bytes = new Uint8Array(await response.arrayBuffer()).slice(0, 2_000_000)
    // Muchos sitios viejos están en ISO-8859-1: se respeta el charset del encabezado o del <meta>
    const head = new TextDecoder("latin1").decode(bytes.slice(0, 4096))
    const charset = (response.headers.get("content-type")?.match(/charset=([\w-]+)/i)?.[1] ?? head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ?? "utf-8").toLowerCase()
    let html
    try { html = new TextDecoder(charset).decode(bytes) } catch { html = new TextDecoder("utf-8").decode(bytes) }
    return { html, url: response.url }
  } catch { return null } finally { clearTimeout(timer) }
}

const decode = (text) => text.replace(/&amp;/g, "&").replace(/&#0?38;/g, "&").replace(/&nbsp;/g, " ").replace(/&#x2F;|&#47;/g, "/")
function anchors(html, base) {
  const list = []
  for (const match of html.matchAll(/<a\b[^>]*?href\s*=\s*["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let url
    try { url = new URL(decode(match[1].trim()), base).href } catch { continue }
    if (!/^https?:/i.test(url)) continue
    const text = decode(match[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 80)
    list.push({ url, text })
  }
  return list
}

function extract(pages, site) {
  const links = { careers: [] }
  const host = new URL(site).hostname.replace(/^www\./, "")
  for (const { url, text } of pages.flat()) {
    for (const [network, regex] of Object.entries(SOCIAL)) if (!links[network] && regex.test(url)) links[network] = url.replace(/\/+$/, "")
    const own = new URL(url).hostname.replace(/^www\./, "").endsWith(host)
    const isCareers = ATS.test(url) || (own && (CAREERS_TEXT.test(text) || CAREERS_URL.test(new URL(url).pathname)))
    if (isCareers && !links.careers.some((item) => item.url === url) && links.careers.length < 2) links.careers.push({ label: text || "Empleo", url })
  }
  if (!links.careers.length) delete links.careers
  return links
}

async function linksOf(site) {
  const home = await fetchHtml(site)
  if (!home) return null
  const pages = [anchors(home.html, home.url)]
  // Muchas empresas solo ponen sus redes en "Contacto" o "Nosotros"
  const sub = pages[0].find(({ url, text }) => new URL(url).hostname === new URL(home.url).hostname && (SUBPAGE.test(text) || SUBPAGE.test(new URL(url).pathname)))
  if (sub) { const page = await fetchHtml(sub.url); if (page) pages.push(anchors(page.html, page.url)) }
  const links = extract(pages, home.url)
  // Cómo se describe la empresa en su propio sitio (meta description u og:description, si no el título)
  const meta = (name) => home.html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']{20,})["']`, "i"))?.[1]
    ?? home.html.match(new RegExp(`<meta[^>]+content=["']([^"']{20,})["'][^>]*(?:name|property)=["']${name}["']`, "i"))?.[1]
  const title = home.html.match(/<title[^>]*>([^<]{8,})<\/title>/i)?.[1]
  const about = meta("description") ?? meta("og:description") ?? title
  if (about) links.about = decode(about).replace(/&#\d+;|&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim().slice(0, 220)
  return links
}

const data = JSON.parse(readFileSync(FILE, "utf8"))
for (const company of data.companies) company.mainField = mainField(company.contracts)
const targets = data.companies.filter((company) => company.website)
let index = 0, ok = 0, failed = 0
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (index < targets.length) {
    const company = targets[index++]
    const links = await linksOf(company.website)
    if (links) { company.links = links; ok++ } else failed++
  }
}))
writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n")
const count = (key) => targets.filter((company) => company.links?.[key]?.length).length
console.log(`${targets.length} sitios: ${ok} leídos, ${failed} sin respuesta. LinkedIn ${count("linkedin")}, Facebook ${count("facebook")}, Instagram ${count("instagram")}, empleo ${count("careers")}.`)
