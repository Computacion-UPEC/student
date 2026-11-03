// Lee las vacantes de un sitio de empleo de Teamtailor desde su feed RSS público (https://<empresa>.teamtailor.com/jobs.rss).
// Lo usa el recolector de empresas privadas (PuntoNet).

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

const decode = (text) => text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).trim()

/** Vacantes del sitio: { key, title, city, publishedAt, url }. */
export async function teamtailor(company) {
  const response = await fetch(`https://${company}.teamtailor.com/jobs.rss`, { headers: { "User-Agent": UA, "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${company}.teamtailor.com`)
  const xml = await response.text()
  if (!xml.includes("<rss")) throw new Error(`${company}.teamtailor.com no devolvió el feed RSS`)
  const tag = (item, name) => decode(item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? "")
  const jobs = []
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const title = tag(item, "title"), url = tag(item, "link")
    if (!title || !url) continue
    const date = new Date(tag(item, "pubDate"))
    jobs.push({
      key: url.match(/\/jobs\/(\d+)/)?.[1] ?? tag(item, "guid"), title, city: tag(item, "tt:city") || null,
      // La fecha llega con la hora de Ecuador: se toma el día local
      publishedAt: Number.isNaN(date.getTime()) ? null : new Date(date.getTime() - 5 * 3600e3).toISOString().slice(0, 10), url,
    })
  }
  return jobs
}
