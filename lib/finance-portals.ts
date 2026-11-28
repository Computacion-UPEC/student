// Portales oficiales de empleo de bancos y cooperativas del Ecuador.
// Cada enlace se verificó en octubre de 2026 (29 de Octubre, SanFra, CoopProgreso, Jardín Azuayo y las cooperativas de la RFD en noviembre) (abre la sección de empleo de la institución, no su página de inicio).
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
  { id: "internacional", name: "Banco Internacional", kind: "Banco", sector: "Financiero", ownership: "Privado", url: "https://career2.successfactors.eu/career?company=interame01&site=VjItV1BPM0FGNlZ0TDkwSHBhc3NlbUtIUT09", note: "Portal de SuccessFactors enlazado desde “Trabaja con nosotros”; lo revisamos dos veces al día.", collected: true },
  { id: "bce", name: "Banco Central del Ecuador", kind: "Banco", sector: "Financiero", ownership: "Público", url: "https://bancocentraldelecuador.hiringroom.com/jobs", note: "Banco central del país, con áreas de tecnología, datos y ciberseguridad. Su sitio oficial enlaza este portal de HiringRoom.", collected: true },
  { id: "banecuador", name: "BanEcuador", kind: "Banco", sector: "Financiero", ownership: "Público", url: "https://www.banecuador.fin.ec/historia-banecuador/trabajacon-nosotros/", note: "Banco público: convocatorias y procesos de selección." },
  { id: "tulcan", name: "Cooperativa Tulcán", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cooptulcan.fin.ec/bolsa-de-empleo/", note: "Bolsa de empleo de la cooperativa con sede en Tulcán.", local: true },
  { id: "jep", name: "Cooperativa JEP", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.jep.coop/informate/ofertas-laborables", note: "Ofertas laborales y postulación en línea.", collected: true },
  { id: "alianza", name: "Alianza del Valle", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://alianzaapps.alianzadelvalle.fin.ec:44144/vacantes", note: "Portal de vacantes de la cooperativa." },
  { id: "jardin-azuayo", name: "Jardín Azuayo", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.multitrabajos.com/perfiles/empresa_cooperativa-jardin-azuayo_10199124.html", note: "Segunda cooperativa más grande del país. Su página de empleo (jardinazuayo.fin.ec/empleo) envía a este perfil de Multitrabajos, el único medio para postular; suele buscar perfiles de Telecomunicaciones e Informática en Cuenca." },
  { id: "coop29deoctubre", name: "Cooperativa 29 de Octubre", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://coop29deoctubre.hiringroom.com/jobs", note: "Cooperativa de Quito del segmento 1, con agencia en El Ángel (Carchi). Su sitio oficial enlaza este portal de HiringRoom.", local: true, collected: true },
  { id: "sanfra", name: "Cooperativa San Francisco (SanFra)", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://coacsanfra.hiringroom.com/jobs", note: "Cooperativa de Ambato del segmento 1. Su sitio oficial enlaza este portal de HiringRoom.", collected: true },
  { id: "cooprogreso", name: "CoopProgreso", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cooprogreso.fin.ec/trabaja-con-nosotros", note: "No publica vacantes: deja tu hoja de vida en su formulario, que pregunta por tus conocimientos técnicos e informáticos." },
  { id: "cacpeco", name: "CACPECO", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://quierolaburo.com/empresas/cacpeco", note: "Publica sus vacantes en Laburo, enlazado desde “Trabaja con nosotros”; las revisamos desde un computador.", collected: true },
  { id: "23-de-julio", name: "Cooperativa 23 de Julio", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://coop23dejulio.hiringroom.com/jobs", note: "Cooperativa de Cayambe del segmento 1. Su sitio oficial enlaza este portal de HiringRoom.", collected: true },
  { id: "cacpe-pastaza", name: "CACPE Pastaza", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://cacpepastaza.hiringroom.com/jobs", note: "Cooperativa de Puyo del segmento 1. Publica sus vacantes en HiringRoom; su sitio también tiene un formulario para dejar tu hoja de vida.", collected: true },
  { id: "lucha-campesina", name: "Cooperativa Lucha Campesina", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://luchacampesina.hiringroom.com/jobs", note: "Cooperativa de Cumandá (Chimborazo) del segmento 1. Publica sus vacantes en HiringRoom; su sitio también tiene un formulario.", collected: true },
  { id: "maquita", name: "Maquita Cushunchic", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.maquita.fin.ec/empleos/", note: "Cooperativa de Quito del segmento 2. Lista de vacantes con filtro por ciudad y tipo de empleo." },
  { id: "virgen-del-cisne", name: "Cooperativa Virgen del Cisne", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.virgendelcisne.fin.ec/vacant.php", note: "Cooperativa de Latacunga del segmento 1. Página de vacantes de su sitio oficial." },
  { id: "tena", name: "Cooperativa Tena", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://cooptena.fin.ec/transparencia/convocatorias-concursos/", note: "Cooperativa de Tena del segmento 2. Publica convocatorias y concursos abiertos." },
  { id: "chone", name: "Cooperativa Chone", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://coopchone.fin.ec/wp-content/uploads/2026/04/Proceso-de-seleccion-1.pdf", note: "Cooperativa de Chone del segmento 1. Su menú “Procesos de Selección” enlaza un PDF con el proceso vigente (abril de 2026)." },
  { id: "atuntaqui", name: "Cooperativa Atuntaqui", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.atuntaqui.fin.ec/trabaja-con-nosotros/", note: "Cooperativa de Imbabura del segmento 1. No publica vacantes: deja tu hoja de vida en su formulario." },
  { id: "crediya", name: "CrediYa", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.crediya.fin.ec/contactanos/trabaja-nosotros/", note: "Cooperativa de Ambato del segmento 2. Formulario para dejar tu hoja de vida por área." },
  { id: "cacpe-zamora", name: "CACPE Zamora Chinchipe", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.cacpezamora.fin.ec/trabaje-con-nosotros/", note: "Cooperativa de Zamora del segmento 2. Formulario para dejar tu hoja de vida." },
  { id: "alianza-minas", name: "Cooperativa Alianza Minas", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://coopalianzaminas.com/trabaja-con-nosotros/", note: "Cooperativa de Quito del segmento 2. Formulario para dejar tu hoja de vida." },
  { id: "14-de-marzo", name: "Cooperativa 14 de Marzo", kind: "Cooperativa", sector: "Financiero", ownership: "Privado", url: "https://www.14demarzo.fin.ec/trabaja-con-nosotros-2/", note: "Cooperativa de Sangolquí del segmento 2. Formulario para dejar tu hoja de vida." },
]
