// Lee las vacantes de un portal de Oracle Recruiting Cloud (Candidate Experience), como el de Banco Guayaquil
// (enlazado desde "Trabaja con Nosotros" en el pie de bancoguayaquil.com). El portal es una aplicación de JavaScript,
// pero su API pública devuelve la lista en JSON sin clave:
//   https://<host>/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList&finder=findReqs;siteNumber=<sitio>,limit=<n>,offset=<n>

const UA = "Mozilla/5.0 (compatible; ComputacionUPEC-Oportunidades/1.0; +https://github.com/Computacion-UPEC/student)"
const PAGE = 100

/** Vacantes del portal: { key, title, city, province, publishedAt, url }. */
export async function oracleHcm(host, site) {
  const jobs = new Map()
  for (let offset = 0; offset < 2000; offset += PAGE) {
    const url = `https://${host}/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList&finder=findReqs;siteNumber=${site},limit=${PAGE},offset=${offset},sortBy=POSTING_DATES_DESC`
    const response = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } })
    if (!response.ok) throw new Error(`${response.status} en ${url}`)
    const result = (await response.json()).items?.[0]
    const list = result?.requisitionList ?? []
    for (const item of list) {
      // "GUAYAS, Ecuador" -> provincia en formato de título
      const province = item.PrimaryLocation?.split(",")[0]?.trim().toLowerCase().replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase()) || null
      jobs.set(String(item.Id), { key: String(item.Id), title: item.Title.trim(), city: null, province, publishedAt: item.PostedDate ?? null, url: `https://${host}/hcmUI/CandidateExperience/es/sites/${site}/job/${item.Id}` })
    }
    if (list.length < PAGE || jobs.size >= (result?.TotalJobsCount ?? 0)) break
  }
  return [...jobs.values()]
}
