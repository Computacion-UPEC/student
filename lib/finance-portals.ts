// Portales oficiales de empleo de bancos y cooperativas del Ecuador.
// Cada enlace se verificó en octubre de 2026 (abre la sección de empleo de la institución, no su página de inicio).
// Produbanco: su portal empleos.produbanco.com no resuelve (oct 2026); publica en Multitrabajos.
// No incluidos: Banco Guayaquil (su portal de reclutamiento responde "503 No available server"),
// y Banco del Pacífico, Bolivariano, del Austro y Pablo Muñoz Vega (no publican una sección de empleo en su sitio).

export type Ownership = "Público" | "Privado"

export type JobPortal = {
  id: string
  name: string
  /** "Filial": empresa del grupo de un banco con su propio portal de empleo (Pague Ya, del Grupo Pichincha). */
  kind: "Banco" | "Cooperativa" | "Filial"
  sector: "Financiero"
  ownership: Ownership
  url: string
  /** Lo que el estudiante encuentra al abrir el enlace. */
  note: string
  /** Relevante para estudiantes de la UPEC (Carchi). */
  local?: boolean
  /** Sus ofertas se recolectan a diario (scripts/finance/collect.mjs); si no, solo hay enlace. */
  collected?: boolean
}

/** Oferta recolectada de un banco o cooperativa (lib/data/finance-jobs.json). */
export type FinanceJob = {
  id: string
  source: string
  institution: string
  title: string
  city?: string
  province?: string
  publishedAt?: string | null
  url: string
  requirements?: string[]
  apply?: { email: string; subject: string }
  isIT: boolean
  firstSeen: string
  /** Día en que dejó de publicarse. */
  closedOn?: string
}

export const financePortals: JobPortal[] = [
  { id: "pichincha", name: "Banco Pichincha", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://vacantes.pichincha.com/", note: "Portal “Talento Pichincha” con vacantes abiertas. Desde 2024 incluye a Credife (microfinanzas) y Amerafin (crédito automotriz), absorbidas por el banco: sus cargos se publican aquí.", collected: true },
  { id: "bancoloja", name: "Banco de Loja", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://bancoloja.hiringroom.com/jobs", note: "Banco del sur del país vinculado al Grupo Pichincha. Su sitio oficial enlaza este portal de HiringRoom.", collected: true },
  { id: "pichincha-peru", name: "Banco Pichincha Perú", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://www.bumeran.com.pe/empleos-busqueda-banco-pichincha.html", note: "Banco del Grupo Pichincha en Perú: publica sus vacantes en Bumeran, enlazado desde su sitio oficial." },
  { id: "pichincha-espana", name: "Banco Pichincha España", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://bancopichincha.ofertas-trabajo.infojobs.net/", note: "Banco del Grupo Pichincha en España: sus vacantes están en InfoJobs, enlazado desde su sitio oficial." },
  { id: "pagueya", name: "Pague Ya", kind: "Filial", sector: "Financiero", ownership: "Privado", url: "https://pagueya.hiringroom.com/jobs", note: "Empresa de cobranzas del Grupo Pichincha (Pichincha Sistemas ACOVI). Su sitio oficial enlaza este portal; tiene programa de trainees y pasantías.", collected: true },
  { id: "produbanco", name: "Produbanco", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://www.multitrabajos.com/empleos-busqueda-produbanco.html", note: "Produbanco publica sus vacantes en Multitrabajos." },
  { id: "internacional", name: "Banco Internacional", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://www.bancointernacional.com.ec/trabaja-con-nosotros/", note: "Ofertas laborales y registro de hoja de vida." },
  { id: "banecuador", name: "BanEcuador", kind: "Banco", sector: "Financiero", ownership: "Público", url: "https://www.banecuador.fin.ec/historia-banecuador/trabajacon-nosotros/", note: "Banco público: convocatorias y procesos de selección." },
  { id: "tulcan", name: "Cooperativa Tulcán", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cooptulcan.fin.ec/bolsa-de-empleo/", note: "Bolsa de empleo de la cooperativa con sede en Tulcán.", local: true },
  { id: "jep", name: "Cooperativa JEP", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.jep.coop/informate/ofertas-laborables", note: "Ofertas laborales y postulación en línea.", collected: true },
  { id: "alianza", name: "Alianza del Valle", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://alianzaapps.alianzadelvalle.fin.ec:44144/vacantes", note: "Portal de vacantes de la cooperativa." },
  { id: "jardin-azuayo", name: "Jardín Azuayo", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.jardinazuayo.fin.ec/empleo/", note: "Empleos y postulación en línea." },
  { id: "cacpeco", name: "CACPECO", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cacpeco.com/trabaja-con-nosotros/", note: "Vacantes y registro de hoja de vida." },
]
