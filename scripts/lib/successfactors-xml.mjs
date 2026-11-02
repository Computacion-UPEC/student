// Lee las vacantes de un sitio clásico de SAP SuccessFactors desde su feed XML público
// (career_ns=job_listing_summary&resultType=XML). Lo usan los recolectores de empresas privadas (Claro, Pronaca)
// y de bancos (Banco Internacional).

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

const decode = (text) => text
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))

/** Vacantes del sitio: { key, title, city, publishedAt, url }. site puede ir vacío si la empresa tiene un solo sitio. */
export async function successFactorsXml(host, company, site = "") {
  const base = `https://${host}/career?company=${company}${site ? `&site=${site}` : ""}&lang=es_ES`
  const response = await fetch(`${base}&career_ns=job_listing_summary&resultType=XML`, { headers: { "User-Agent": UA, "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${host} (${company})`)
  const xml = await response.text()
  if (!xml.includes("<Job-Listing")) throw new Error(`${host} (${company}) no devolvió el feed XML`)
  const tag = (job, name) => decode(job.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))?.[1] ?? "").trim()
  const jobs = []
  for (const [, job] of xml.matchAll(/<Job>([\s\S]*?)<\/Job>/g)) {
    const id = tag(job, "ReqId"), title = tag(job, "JobTitle")
    if (!id || !title) continue
    // "13/10/2026" -> "2026-10-13"
    const [d, m, y] = tag(job, "Posted-Date").split("/")
    jobs.push({ key: id, title, city: null, publishedAt: y ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : null, url: `${base}&career_ns=job_listing&career_job_req_id=${id}` })
  }
  return jobs
}
