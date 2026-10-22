// Lee las vacantes de un portal de HiringRoom (<empresa>.hiringroom.com). Lo usan los recolectores de empresas
// privadas (FEMSA Salud, Novacero) y de bancos (Pague Ya, del Grupo Pichincha).
// La lista viene en HTML, 20 vacantes por página en /jobs/index/N (?page=N devuelve siempre la primera).

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"

const decode = (text) => text
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#0?39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
const clean = (text) => decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

async function get(url) {
  const response = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es-EC,es;q=0.9" } })
  if (!response.ok) throw new Error(`${response.status} en ${url}`)
  // HiringRoom dice UTF-8 pero algunos textos llegan en Latin-1
  const bytes = await response.arrayBuffer()
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    return new TextDecoder("latin1").decode(bytes)
  }
}

/** Vacantes del portal: { key, title, city, publishedAt, url }. Título en <h4> y ciudad junto al ícono de ubicación. */
export async function hiringRoom(sub) {
  const base = `https://${sub}.hiringroom.com`
  const jobs = new Map()
  for (let page = 1; page <= 50; page++) {
    const html = await get(`${base}/jobs/index/${page}`)
    const cards = [...html.matchAll(/<a href="(\/jobs\/get_vacancy\/([0-9a-f]{24}))"[^>]*>([\s\S]*?)<\/a>/g)]
    const nuevas = cards.filter(([, , id]) => !jobs.has(id))
    if (!nuevas.length) break
    for (const [, href, id, card] of nuevas) {
      const title = clean(card.match(/<h4[^>]*>([\s\S]*?)<\/h4>/)?.[1] ?? "")
      if (!title) continue
      // "Quito, Pichincha, Ecuador" -> "Quito"
      const city = clean(card.match(/hr-Location-pin[^>]*><\/i>([\s\S]*?)<\/span>/)?.[1] ?? "").split(",")[0].trim()
      jobs.set(id, { key: id, title, city: city || null, publishedAt: null, url: base + href })
    }
  }
  return [...jobs.values()]
}
