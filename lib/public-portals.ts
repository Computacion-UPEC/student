// Dónde publica sus vacantes cada institución pública. Verificado en octubre de 2026.
//
// Hay dos regímenes:
//   - Empresas públicas (LOEP) y algunos institutos tienen portal propio (CNT Empleo, INEC, EP Petroecuador).
//   - Las instituciones regidas por la LOSEP publican sus concursos de méritos y oposición en Encuentra Empleo, del
//     Ministerio del Trabajo (Acuerdo MDT-2022-180). La prensa lo confirma para el SRI (feb y may 2026) y el IGM
//     (jun 2026). La página de concursos del ECU 911 existe pero está vacía.
// EP Petroecuador está en el sector Energía (sus cargos de TI se recolectan a diario).
// No incluidos: EPMAPS (aguaquito.gob.ec bloquea las consultas automáticas y no se pudo verificar su sección de
// empleo) y el Banco Central del Ecuador (no publica una sección de empleo ni se hallaron convocatorias recientes).

export type PublicPortal = {
  id: string
  name: string
  kind: "Empresa pública" | "Instituto" | "Agencia de regulación"
  url: string
  /** Lo que el estudiante encuentra al abrir el enlace. */
  note: string
  /** Sus convocatorias se recolectan a diario (scripts/inec/collect.mjs); si no, solo hay enlace. */
  collected?: boolean
}

export const publicPortals: PublicPortal[] = [
  { id: "inec", name: "INEC", kind: "Instituto", url: "https://www.ecuadorencifras.gob.ec/institucional/trabaja-con-nosotros/", note: "Convocatorias casi semanales para encuestas y proyectos: analistas de datos, bases de datos y aplicaciones. Cada una abre de 1 a 3 días.", collected: true },
  { id: "cnt", name: "CNT EP", kind: "Empresa pública", url: "https://empleo.cnt.gob.ec/", note: "Portal CNT Empleo: procesos de selección y concursos de méritos y oposición. Pide crear una cuenta para postular." },
  { id: "arcotel", name: "ARCOTEL", kind: "Agencia de regulación", url: "https://www.arcotel.gob.ec/bolsa-de-empleo/", note: "Bolsa de empleo: registro de hoja de vida. Sus concursos se publican en Encuentra Empleo." },
]

/** Instituciones que publican sus concursos en Encuentra Empleo (sector público, LOSEP). */
export const encuentraEmpleoInstitutions = ["SRI", "ECU 911", "Registro Civil", "IGM", "INAMHI", "INOCAR"]
export const ENCUENTRA_EMPLEO_URL = "https://encuentraempleo.trabajo.gob.ec"

/** Convocatoria del INEC (lib/data/inec-jobs.json). */
export type InecJob = {
  id: string
  title: string
  group: string
  contract: string
  project: string
  place: string
  /** Texto original de la columna "Postulación". */
  deadlineText: string
  /** Fecha y hora de cierre en ISO de Ecuador, o null si el texto no trae fecha. */
  closesAt: string | null
  /** Bases de la convocatoria (PDF) con el enlace de postulación. */
  url: string
  isIT: boolean
  firstSeen: string
}
