// Dónde publica sus vacantes cada institución pública. Verificado en octubre de 2026.
//
// Hay dos regímenes:
//   - Empresas públicas (LOEP) y algunos institutos tienen portal propio (CNT Empleo, INEC, EP Petroecuador).
//   - Las instituciones regidas por la LOSEP publican sus concursos de méritos y oposición en Encuentra Empleo, del
//     Ministerio del Trabajo (Acuerdo MDT-2022-180). La prensa lo confirma para el SRI (feb y may 2026) y el IGM
//     (jun 2026). La página de concursos del ECU 911 existe pero está vacía. Sus cargos de TI se recolectan a diario
//     (scripts/encuentra-empleo/collect.mjs).
// CNT Empleo rechaza las conexiones desde GitHub Actions (servidores fuera de Ecuador): su recolector corre cada
// noche en un computador en Ecuador y publica los cambios con un PR (scripts/cnt/publicar.sh).
// EP Petroecuador está en el sector Energía (sus cargos de TI se recolectan a diario).
// No incluidos: EPMAPS (aguaquito.gob.ec bloquea las consultas automáticas y no se pudo verificar su sección de
// empleo) y el Banco Central del Ecuador (no publica una sección de empleo ni se hallaron convocatorias recientes).

export type PortalLink = { label: string; url: string }

export type PublicPortal = {
  id: string
  name: string
  kind: "Empresa pública" | "Instituto" | "Agencia de regulación"
  /** Enlaces directos: ver vacantes, crear la cuenta o registrar la hoja de vida (el primero es el principal). */
  links: PortalLink[]
  /** Lo que el estudiante encuentra al abrir el enlace. */
  note: string
  /** Sus convocatorias se recolectan a diario (scripts/inec/collect.mjs); si no, solo hay enlace. */
  collected?: boolean
}

export const publicPortals: PublicPortal[] = [
  { id: "inec", name: "INEC", kind: "Instituto", links: [{ label: "Ver convocatorias", url: "https://www.ecuadorencifras.gob.ec/institucional/trabaja-con-nosotros/" }], note: "Convocatorias casi semanales para encuestas y proyectos: analistas de datos, bases de datos y aplicaciones. Cada una abre de 1 a 3 días; las de TI aparecen arriba con su botón Postular.", collected: true },
  { id: "cnt", name: "CNT EP", kind: "Empresa pública", links: [{ label: "Procesos de selección", url: "https://empleo.cnt.gob.ec/procesos/" }, { label: "Concursos", url: "https://empleo.cnt.gob.ec/concursos/" }, { label: "Crear cuenta", url: "https://empleo.cnt.gob.ec/user-login/" }], note: "Portal CNT Empleo. Revisamos sus vacantes cada noche: las de TI aparecen arriba. Se postula con una cuenta propia en el mismo portal.", collected: true },
  // El formulario es de Google y pide iniciar sesión con una cuenta de Google
  { id: "arcotel", name: "ARCOTEL", kind: "Agencia de regulación", links: [{ label: "Registrar hoja de vida", url: "https://docs.google.com/forms/d/e/1FAIpQLSe82Pp63of_-KZJvFgGekcZ3VE0jP6pyJUv086_eDcIIu2ceQ/viewform" }], note: "Bolsa de empleo: formulario oficial para dejar tus datos; te consideran cuando abren una vacante. Sus concursos van por Encuentra Empleo." },
]

/** Instituciones que publican sus concursos en Encuentra Empleo (sector público, LOSEP). */
export const encuentraEmpleoInstitutions = ["SRI", "ECU 911", "Registro Civil", "IGM", "INAMHI", "INOCAR"]
export const encuentraEmpleoLinks: PortalLink[] = [
  { label: "Buscar concursos", url: "https://encuentraempleo.trabajo.gob.ec" },
  { label: "Crear cuenta", url: "https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/registro/aspirante/registroAspiranteCompromiso.jsf" },
]

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
  /** Bases de la convocatoria (PDF). */
  url: string
  /** Formulario oficial de postulación (sacado del PDF); null si el PDF no lo trae. */
  applyUrl: string | null
  isIT: boolean
  firstSeen: string
}

/** Vacante de CNT EP (lib/data/cnt-jobs.json). Se postula en su página ("Aplicar al trabajo"). */
export type CntJob = {
  id: string
  title: string
  url: string
  publishedOn: string | null
  /** Último día de publicación; null si la vacante ya venció (el portal deja de mostrar sus fechas). */
  closesOn: string | null
  isIT: boolean
  firstSeen: string
}

/** Cargo de TI en concurso de méritos y oposición, publicado en Encuentra Empleo (lib/data/public-jobs.json). */
export type PublicContestJob = {
  /** Código del puesto en Encuentra Empleo. */
  id: string
  institution: string
  title: string
  vacancies: number
  /** Remuneración mensual unificada (USD). */
  salary: number | null
  city: string
  stage: string
  opensAt: string | null
  closesAt: string | null
  isIT: boolean
  firstSeen: string
  lastSeen: string
}
