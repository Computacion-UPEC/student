// Lee las vacantes de un sitio de empleo de Workday desde la lista pública que usa su propia página
// (POST /wday/cxs/<tenant>/<sitio>/jobs). Lo usa el recolector de empresas privadas (Tigo, filtrado a Ecuador).

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const PAGE = 20

/** "Publicado hace 6 días" / "Posted 6 Days Ago" / "Publicado hoy" -> día aproximado de publicación. */
function postedOn(text, today = new Date()) {
  const days = /today|\bhoy\b/i.test(text) ? 0 : /yesterday|\bayer\b/i.test(text) ? 1 : Number(text.match(/(\d+)\+? (days?|d[ií]as?)/i)?.[1] ?? NaN)
  return Number.isNaN(days) ? null : new Date(today.getTime() - days * 864e5).toISOString().slice(0, 10)
}

/**
 * Vacantes del sitio: { key, title, city, publishedAt, url }. facets filtra como en la página, p. ej.
 * { locationCountry: ["<id de Ecuador>"] } (los id salen de la lista de "facets" de la misma respuesta).
 */
export async function workday(host, tenant, site, facets = {}) {
  const jobs = []
  for (let offset = 0; offset < 1000; offset += PAGE) {
    const response = await fetch(`https://${host}/wday/cxs/${tenant}/${site}/jobs`, {
      method: "POST",
      headers: { "User-Agent": UA, "Content-Type": "application/json", Accept: "application/json", "Accept-Language": "es-EC,es;q=0.9" },
      body: JSON.stringify({ limit: PAGE, offset, searchText: "", appliedFacets: facets }),
    })
    if (!response.ok) throw new Error(`${response.status} en ${host} (${site})`)
    const data = await response.json()
    const page = data.jobPostings ?? []
    for (const job of page) {
      if (!job.title || !job.externalPath) continue
      jobs.push({
        key: job.bulletFields?.[0] ?? job.externalPath, title: job.title.trim(), city: job.locationsText || null,
        publishedAt: postedOn(job.postedOn ?? ""), url: `https://${host}/${site}${job.externalPath}`,
      })
    }
    if (page.length < PAGE || offset + PAGE >= (data.total ?? 0)) break
  }
  return jobs
}
