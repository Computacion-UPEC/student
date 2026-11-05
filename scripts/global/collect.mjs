// Recolecta vacantes de TI en el extranjero a las que se puede postular desde Ecuador, solo de empresas grandes y
// desde su propio sistema de reclutamiento (nada de bolsas de empleo ni suscripciones):
//   Greenhouse  https://boards-api.greenhouse.io/v1/boards/<cuenta>/jobs?content=true
//   Lever       https://api.lever.co/v0/postings/<cuenta>?mode=json
//   Ashby       https://api.ashbyhq.com/posting-api/job-board/<cuenta>
// Guarda dos rutas:
//   remoto      remotas abiertas a Latinoamérica, las Américas, Ecuador o a cualquier país
//   patrocinio  en Canadá o EE. UU. cuando el aviso dice que la empresa patrocina la visa
// Historial (firstSeen y closedOn) en lib/data/global-jobs.json. Solo escribe el archivo si algo cambió.
// Uso (desde la raíz del repo):  node scripts/global/collect.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { isITRole } from "../lib/it-roles.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(here, "../../lib/data/global-jobs.json")
const today = new Date().toISOString().slice(0, 10)
const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

const COMPANIES = [
  ...[
    ["airbnb", "Airbnb"], ["affirm", "Affirm"], ["asana", "Asana"], ["brex", "Brex"], ["canonical", "Canonical"],
    ["chime", "Chime"], ["cloudflare", "Cloudflare"], ["coinbase", "Coinbase"], ["databricks", "Databricks"],
    ["datadog", "Datadog"], ["discord", "Discord"], ["dropbox", "Dropbox"], ["duolingo", "Duolingo"], ["elastic", "Elastic"],
    ["figma", "Figma"], ["gitlab", "GitLab"], ["grafanalabs", "Grafana Labs"], ["gusto", "Gusto"], ["instacart", "Instacart"],
    ["lyft", "Lyft"], ["mongodb", "MongoDB"], ["mozilla", "Mozilla"], ["okta", "Okta"], ["pinterest", "Pinterest"],
    ["reddit", "Reddit"], ["robinhood", "Robinhood"], ["samsara", "Samsara"], ["stripe", "Stripe"], ["toast", "Toast"],
    ["twilio", "Twilio"], ["vercel", "Vercel"], ["wikimedia", "Wikimedia Foundation"],
  ].map(([account, name]) => ({ account, name, ats: "greenhouse" })),
  ...[["palantir", "Palantir"], ["spotify", "Spotify"]].map(([account, name]) => ({ account, name, ats: "lever" })),
  ...[
    ["linear", "Linear"], ["notion", "Notion"], ["openai", "OpenAI"], ["posthog", "PostHog"], ["ramp", "Ramp"],
    ["sentry", "Sentry"], ["supabase", "Supabase"], ["zapier", "Zapier"],
  ].map(([account, name]) => ({ account, name, ats: "ashby" })),
]

// Ubicaciones que incluyen a Ecuador; "Remote" a secas suele ser solo EE. UU., así que no cuenta
const OPEN_TO_ECUADOR = /\b(latam|latin america|latinoam[eé]rica|south america|americas|ecuador|anywhere|worldwide|global|emea ?& ?americas)\b/i
const NORTH_AMERICA = /\b(united states|usa|u\.s\.|canada|toronto|vancouver|montr[eé]al|ottawa|calgary|waterloo|new york|san francisco|seattle|austin|boston|chicago|denver|los angeles|atlanta|washington|ny|ca|wa|tx|ma|ontario|british columbia|qu[eé]bec)\b/i
const SPONSORS = /(visa sponsorship (is )?(available|provided|offered)|(will|can|able to|happy to) (provide|offer|support) (visa |immigration )?sponsorship|sponsor (work )?visas|(offer|provide)s? visa sponsorship)/i
const NO_SPONSOR = /(not|unable to|cannot|can't|won't|will not|do not|does not|no) (be able to )?(provide |offer |support )?(visa |immigration |employment )?sponsor/i
// "U.S. Anywhere", "US Remote": remotas solo dentro de EE. UU.
const US_ONLY = /\b(u\.s\.|us|usa|united states)[ -]+(anywhere|remote)\b/i
const NOT_IT = /\b(business development|alliances|partnerships|sales|account executive|account manager|recruit|talent acquisition|legal|counsel|marketing manager|paralegal|accountant)\b/i
const EXTRA_IT = /data scientist|site reliability|\bSRE\b|security (analyst|engineer)|machine learning|product designer|researcher/i

const isIT = (title) => !NOT_IT.test(title) && (isITRole(title) || EXTRA_IT.test(title))
const plain = (html = "") => html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#\d+;/g, " ")

/** "remoto", "patrocinio" o null según dónde es y lo que dice el aviso. */
function routeOf(location, text, remote) {
  if ((OPEN_TO_ECUADOR.test(location) && !US_ONLY.test(location)) || (remote && /\b(latam|latin america)\b/i.test(text))) return "remoto"
  if (NORTH_AMERICA.test(location) && SPONSORS.test(text) && !NO_SPONSOR.test(text)) return "patrocinio"
  return null
}

async function getJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": UA } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  return response.json()
}

const readers = {
  async greenhouse(account) {
    const { jobs = [] } = await getJson(`https://boards-api.greenhouse.io/v1/boards/${account}/jobs?content=true`)
    return jobs.map((job) => ({ key: String(job.id), title: job.title, location: job.location?.name ?? "", remote: /remote/i.test(job.location?.name ?? ""), text: plain(job.content), publishedAt: (job.first_published ?? job.updated_at ?? "").slice(0, 10) || null, url: job.absolute_url }))
  },
  async lever(account) {
    const jobs = await getJson(`https://api.lever.co/v0/postings/${account}?mode=json`)
    return jobs.map((job) => ({ key: job.id, title: job.text, location: [job.categories?.location, ...(job.categories?.allLocations ?? [])].filter(Boolean).join(" · "), remote: job.workplaceType === "remote", text: [job.descriptionPlain, job.additionalPlain, ...(job.lists ?? []).map((list) => plain(list.content))].join(" "), publishedAt: job.createdAt ? new Date(job.createdAt).toISOString().slice(0, 10) : null, url: job.hostedUrl }))
  },
  async ashby(account) {
    const { jobs = [] } = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${account}`)
    return jobs.filter((job) => job.isListed !== false).map((job) => ({ key: job.id, title: job.title, location: [job.location, ...(job.secondaryLocations ?? []).map((item) => item.location)].filter(Boolean).join(" · "), remote: !!job.isRemote || job.workplaceType === "Remote", text: job.descriptionPlain ?? plain(job.descriptionHtml), publishedAt: job.publishedAt?.slice(0, 10) ?? null, url: job.jobUrl }))
  },
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { jobs: [] }
const byId = new Map(previous.jobs.map((job) => [job.id, job]))
const summary = []
const results = await Promise.all(COMPANIES.map(async (company) => {
  try { return { company, jobs: await readers[company.ats](company.account) } } catch (error) { return { company, error } }
}))

for (const { company, jobs, error } of results) {
  // Si una fuente falla no se cierra ninguna de sus ofertas; se avisa en el registro de GitHub Actions
  if (error) { console.log(`::warning::${company.name}: ${error.message}`); summary.push(`${company.name}: error`); continue }
  const prefix = `${company.ats}-${company.account}-`
  const seen = new Set()
  for (const job of jobs) {
    if (!isIT(job.title)) continue
    const route = routeOf(job.location, job.text, job.remote)
    if (!route) continue
    const id = prefix + job.key
    seen.add(id)
    const { firstSeen = today } = byId.get(id) ?? {}
    byId.set(id, { id, company: company.name, title: job.title.trim(), location: job.location.trim(), route, publishedAt: job.publishedAt, url: job.url, firstSeen })
  }
  for (const job of byId.values()) if (job.id.startsWith(prefix) && !seen.has(job.id) && !job.closedOn) byId.set(job.id, { ...job, closedOn: today })
  if (seen.size) summary.push(`${company.name}: ${seen.size}`)
}

const jobs = [...byId.values()].sort((a, b) => Number(!!a.closedOn) - Number(!!b.closedOn) || (b.publishedAt ?? b.firstSeen).localeCompare(a.publishedAt ?? a.firstSeen))
const output = JSON.stringify({ collectedSince: previous.collectedSince ?? today, jobs }, null, 2) + "\n"
const changed = !existsSync(OUT) || readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") !== output
if (changed) writeFileSync(OUT, output)
const open = jobs.filter((job) => !job.closedOn)
console.log(`${COMPANIES.length} empresas. Abiertas: ${open.filter((job) => job.route === "remoto").length} remotas, ${open.filter((job) => job.route === "patrocinio").length} con patrocinio. ${summary.join(" · ")}. ${changed ? "Datos actualizados." : "Sin cambios."}`)
