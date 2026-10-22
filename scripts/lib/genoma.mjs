// Lee las vacantes de un sitio de empleo de Genoma (jobs.genoma.work/<empresa>), que carga la lista desde su API
// pública. La usa el recolector de empresas privadas para Teuno (Grupo Pichincha).
// Cuando se escribió (octubre de 2026) Teuno no tenía vacantes publicadas, así que los nombres de los campos de cada
// vacante no se pudieron ver: se leen los más comunes y, si ninguno trae título, se avisa en el registro.

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

const pick = (item, ...keys) => {
  for (const key of keys) {
    const value = key.split(".").reduce((current, part) => current?.[part], item)
    if (typeof value === "string" && value.trim()) return value.trim()
  }
  return null
}

/** Vacantes del sitio: { key, title, city, publishedAt, url }. */
export async function genoma(slug) {
  const response = await fetch(`https://api.genoma.work/api/v1/gamesandtests/${slug}/jobslisting/`, { headers: { "User-Agent": UA, Accept: "application/json" } })
  if (!response.ok) throw new Error(`${response.status} en la API de Genoma (${slug})`)
  const items = (await response.json()).jobapplications ?? []
  const site = `https://jobs.genoma.work/${slug}`
  const jobs = items.map((item) => ({
    key: String(item.id ?? item.uuid ?? pick(item, "name", "title", "job_title")),
    title: pick(item, "name", "title", "job_title", "jobapplication_name", "position.name"),
    city: pick(item, "city", "city.name", "location", "location.name", "address"),
    publishedAt: pick(item, "created_at", "published_at", "start_date")?.slice(0, 10) ?? null,
    url: item.id ? `${site}/${item.id}` : site,
  }))
  if (jobs.some((job) => !job.title)) console.log(`::warning::Genoma (${slug}): vacantes sin título reconocible; revisar scripts/lib/genoma.mjs`)
  return jobs.filter((job) => job.title)
}
