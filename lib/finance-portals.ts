// Portales oficiales de empleo de bancos y cooperativas del Ecuador.
// Cada enlace se verificó en octubre de 2026 (abre la sección de empleo de la institución, no su página de inicio).
// No incluidos: Banco Guayaquil (su portal de reclutamiento responde "503 No available server"),
// y Banco del Pacífico, Bolivariano, del Austro y Pablo Muñoz Vega (no publican una sección de empleo en su sitio).

export type Ownership = "Público" | "Privado"

export type JobPortal = {
  id: string
  name: string
  kind: "Banco" | "Cooperativa"
  sector: "Financiero"
  ownership: Ownership
  url: string
  /** Lo que el estudiante encuentra al abrir el enlace. */
  note: string
  /** Relevante para estudiantes de la UPEC (Carchi). */
  local?: boolean
}

export const financePortals: JobPortal[] = [
  { id: "pichincha", name: "Banco Pichincha", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://vacantes.pichincha.com/", note: "Portal “Talento Pichincha” con vacantes abiertas." },
  { id: "produbanco", name: "Produbanco", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://empleos.produbanco.com/", note: "Portal de empleos con las vacantes del banco." },
  { id: "internacional", name: "Banco Internacional", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://www.bancointernacional.com.ec/trabaja-con-nosotros/", note: "Ofertas laborales y registro de hoja de vida." },
  { id: "banecuador", name: "BanEcuador", kind: "Banco", sector: "Financiero", ownership: "Público", url: "https://www.banecuador.fin.ec/historia-banecuador/trabajacon-nosotros/", note: "Banco público: convocatorias y procesos de selección." },
  { id: "tulcan", name: "Cooperativa Tulcán", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cooptulcan.fin.ec/bolsa-de-empleo/", note: "Bolsa de empleo de la cooperativa con sede en Tulcán.", local: true },
  { id: "jep", name: "Cooperativa JEP", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.jep.coop/informate/ofertas-laborables", note: "Ofertas laborales y postulación en línea." },
  { id: "alianza", name: "Alianza del Valle", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://alianzaapps.alianzadelvalle.fin.ec:44144/vacantes", note: "Portal de vacantes de la cooperativa." },
  { id: "jardin-azuayo", name: "Jardín Azuayo", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.jardinazuayo.fin.ec/empleo/", note: "Empleos y postulación en línea." },
  { id: "cacpeco", name: "CACPECO", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cacpeco.com/trabaja-con-nosotros/", note: "Vacantes y registro de hoja de vida." },
]
