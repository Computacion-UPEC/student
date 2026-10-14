import celecData from "@/lib/data/celec-jobs.json"

// --- Ofertas reales de CELEC EP (generadas con scripts/scrape_celec.py + scripts/export-celec.mjs)

export type CelecJob = {
  id: string
  unit: string
  role: string
  /** "Directa": piden Computación/Sistemas/TI. "Posible": carrera afín o cargo TIC, revisar requisitos. */
  fit: "Directa" | "Posible"
  fitDetail: string
  minExperienceMonths: number | null
  experience: string
  education: string
  salary: string
  openings: string
  publishedAt: string
  closesAt: string | null
  statusAtScrape: string
  code: string
  url: string | null
}

export const celecJobs = celecData.jobs as CelecJob[]
export const celecSourceFile = celecData.source
export const celecLatestPublished = celecJobs.reduce((max, job) => (job.publishedAt > max ? job.publishedAt : max), "")

const CELEC = "https://www.celec.gob.ec"

// Página de empleo de cada unidad de negocio (las mismas que recorre el scraper)
export const celecUnitUrls: Record<string, string> = {
  "CELEC EP Matriz": `${CELEC}/bolsa-de-empleo/`,
  "CELEC SUR": `${CELEC}/celecsur/bolsa-de-empleo/`,
  "Coca Codo Sinclair": `${CELEC}/cocacodo/bolsa-de-empleo/`,
  Hidrotoapi: `${CELEC}/hidrotoapi/bolsa-de-empleo/`,
  Termoesmeraldas: `${CELEC}/termoesmeraldas/oportunides-de-empleo/`,
  "Termomanabí": `${CELEC}/termomanabi/bolsa-de-empleo/`,
  "Termogas Machala": `${CELEC}/termogasmachala/oportunidades-de-empleo/`,
  Electroguayas: `${CELEC}/electroguayas/`,
  "Hidroagoyán": `${CELEC}/hidroagoyan/`,
  Gensur: `${CELEC}/gensur/`,
  "Hidronación": `${CELEC}/hidronacion/`,
  Termopichincha: `${CELEC}/termopichincha/`,
  Transelectric: `${CELEC}/transelectric/`,
}

export type JobStatus = "Abierta" | "Cerrada" | "Por confirmar"

/** Estado según la fecha de cierre; sin fecha se usa lo que marcó el scraper. */
export function celecJobStatus(job: CelecJob, today: string | null): JobStatus {
  if (job.closesAt && today) return job.closesAt >= today ? "Abierta" : "Cerrada"
  if (job.statusAtScrape.startsWith("Abierta")) return job.closesAt ? "Abierta" : "Por confirmar"
  return "Cerrada"
}

// --- Rutas y convocatorias públicas

export type PublicOpportunity = {
  id: string
  title: string
  platform: string
  url: string
  description: string
  steps: string[]
  category: string
  /** Short status note, e.g. when a call only opens once a year. */
  note?: string
}

export const publicOpportunities: PublicOpportunity[] = [
  { id: "educa-empleo", title: "Educa Empleo", platform: "academico.educarecuador.gob.ec", url: "https://academico.educarecuador.gob.ec/educaempleo/#/homePage", description: "Convocatorias para docencia técnica de informática en instituciones fiscales.", steps: ["Crear cuenta con cédula y correo", "Validar título en SENESCYT", "Filtrar por provincia y especialidad", "Postular hasta a 5 instituciones"], category: "Docencia técnica" },
  { id: "policia-especialistas", title: "Oficial Especialista · Policía Nacional", platform: "reclutamiento.policia.gob.ec", url: "https://reclutamiento.policia.gob.ec", description: "Convocatorias para profesionales TIC, informática y áreas especializadas.", steps: ["Registrar usuario durante el llamamiento", "Validar título SENESCYT", "Descargar prospecto y declaración", "Subir documentos PDF"], category: "Sector público", note: "Convocatoria anual. Última: abril 2026 (cerrada)." },
  { id: "sercop-consultoria", title: "Proveedor del Estado · SERCOP", platform: "portal.compraspublicas.gob.ec", url: "https://portal.compraspublicas.gob.ec/sercop/", description: "Oportunidades de consultoría, desarrollo, redes y soporte mediante contratación pública.", steps: ["Obtener RUP con RUC activo", "Seleccionar códigos CPC afines", "Filtrar necesidades por Carchi", "Enviar cotización y hoja técnica"], category: "Consultoría" },
  { id: "encuentra-empleo-publico", title: "Vacantes del Sector Público", platform: "encuentraempleo.trabajo.gob.ec", url: "https://encuentraempleo.trabajo.gob.ec", description: "Convocatorias LOSEP y servicios ocasionales para perfiles de Tecnologías de la Información.", steps: ["Completar la hoja de vida", "Entrar a Sector Público", "Filtrar por TIC y nivel jerárquico", "Postular a las convocatorias"], category: "Sector público" },
]
