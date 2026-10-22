// Portales oficiales de empleo de las empresas privadas más grandes de Ecuador con áreas de TI.
// Ranking: Superintendencia de Compañías, ingresos 2025. Cada enlace se verificó en el sitio oficial de la empresa
// (octubre de 2026). No incluidas por no tener una sección de empleo verificable: Kywi (la ruta existe pero es una
// página genérica), Marcimex e Indurama (sin vacantes visibles), Banco Guayaquil (ver portales financieros).

export type PrivatePortal = {
  id: string
  name: string
  /** Marcas o empresas del grupo, para que el estudiante las reconozca. */
  brands?: string
  sector: "Retail" | "Farmacéutica" | "Telecomunicaciones" | "Alimentos y bebidas" | "Industria" | "Servicios"
  /** Puesto en el ranking de ingresos 2025 de la Superintendencia de Compañías (si está en el top 100). */
  rank?: number
  url: string
  /** Plataforma de postulación. */
  platform: string
  note: string
  /** Sus vacantes se recolectan a diario (scripts/private/collect.mjs). */
  collected?: boolean
}

export const privatePortals: PrivatePortal[] = [
  { id: "favorita", name: "Corporación Favorita", brands: "Supermaxi, Megamaxi, Akí", sector: "Retail", rank: 1, url: "https://www.supermaxi.com/trabaje-con-nosotros/", platform: "Formularios propios", note: "La empresa más grande del país. Postulación con sus formularios oficiales." },
  { id: "elrosado", name: "Corporación El Rosado", brands: "Mi Comisariato, Ferrisariato", sector: "Retail", rank: 4, url: "https://empleo.elrosado.com", platform: "Portal propio", note: "Portal de empleo con registro de cuenta." },
  { id: "pronaca", name: "Pronaca", sector: "Alimentos y bebidas", rank: 7, url: "https://career4.successfactors.com/career?company=C0004326754P", platform: "SuccessFactors", note: "Vacantes en su portal de SuccessFactors." },
  { id: "claro", name: "Claro Ecuador", sector: "Telecomunicaciones", rank: 9, url: "https://career19.sapsf.com/career?company=consorcioe&site=VjItZlREOW5LOEo4alZ5cDF3N1psajF6QT09&lang=es_ES", platform: "SuccessFactors", note: "Operador con un área de TI grande." },
  { id: "tuti", name: "Tiendas Tuti", sector: "Retail", rank: 10, url: "https://tuti.com.ec/trabaja-con-nosotros/", platform: "Página propia", note: "Vacantes publicadas en su sitio.", collected: true },
  { id: "difare", name: "Difare", sector: "Farmacéutica", rank: 12, url: "https://difare.evaluar.com/", platform: "Evaluar.com", note: "Vacantes en su portal de Evaluar, enlazado desde su sitio oficial.", collected: true },
  { id: "tia", name: "TIA", sector: "Retail", rank: 14, url: "https://reclutamiento.tia.com.ec", platform: "Portal propio", note: "Portal de reclutamiento de Almacenes TÍA." },
  { id: "farmaenlace", name: "Farmaenlace", brands: "Medicity, Farmacias Económicas", sector: "Farmacéutica", rank: 19, url: "https://trabajaconnosotros.farmaenlace.com", platform: "SuccessFactors", note: "Sitio de empleos con todas sus vacantes.", collected: true },
  { id: "gpf", name: "FEMSA Salud Ecuador (Corporación GPF)", brands: "Fybeca, SanaSana", sector: "Farmacéutica", rank: 27, url: "https://corporaciongpf.hiringroom.com/jobs", platform: "HiringRoom", note: "Vacantes en su portal de HiringRoom.", collected: true },
  { id: "arca", name: "Arca Continental", brands: "Coca-Cola, Tonicorp, Inalecsa", sector: "Alimentos y bebidas", rank: 28, url: "https://careers.arcacontal.com/search/?q=&locationsearch=Ecuador", platform: "SuccessFactors", note: "Tiene un hub digital y de tecnología: Digital Nest.", collected: true },
  { id: "cn", name: "Cervecería Nacional", brands: "AB InBev", sector: "Alimentos y bebidas", rank: 35, url: "https://www.cervecerianacional.ec/vacantes-disponibles", platform: "LinkedIn y Multitrabajos", note: "Publica sus vacantes en LinkedIn y Multitrabajos; tiene programas de talento joven." },
  { id: "holcim", name: "Holcim Ecuador", sector: "Industria", rank: 37, url: "https://careers.holcimgroup.com/holcim_ecuador/go/Empleos-en-Holcim-Ecuador/8822402/", platform: "SuccessFactors", note: "Sitio de empleos del grupo Holcim; también tiene programa de pasantías.", collected: true },
  { id: "novacero", name: "Novacero", sector: "Industria", rank: 42, url: "https://novaceroseleccion.hiringroom.com/jobs", platform: "HiringRoom", note: "Vacantes en su portal de HiringRoom.", collected: true },
  { id: "adelca", name: "Adelca", sector: "Industria", rank: 50, url: "https://www.adelca.com/trabaja-con-nosotros/", platform: "Correo", note: "Recibe hojas de vida en seleccionpersonal@adelca.com." },
  { id: "teuno", name: "Teuno", brands: "Grupo Bravco, del Grupo Pichincha", sector: "Telecomunicaciones", url: "https://jobs.genoma.work/teuno", platform: "Genoma", note: "Empresa de TI del Grupo Pichincha (nube, ciberseguridad, redes). Su sitio oficial enlaza esta bolsa de empleo.", collected: true },
  { id: "netlife", name: "Netlife", brands: "Megadatos", sector: "Telecomunicaciones", rank: 62, url: "https://netlife.ec/trabaja-con-nosotros/", platform: "Página con correo", note: "Proveedor de internet con áreas de redes y TI." },
  { id: "saludsa", name: "Saludsa", sector: "Servicios", rank: 73, url: "https://empleos.saludsa.com.ec/postulacion", platform: "Portal propio", note: "Portal de postulación propio." },
  { id: "primax", name: "Primax", brands: "Atimasa", sector: "Servicios", rank: 6, url: "https://portalempleos.atimasa.com.ec/", platform: "Portal propio", note: "Portal de empleos de Atimasa, operadora de Primax." },
  { id: "unilever", name: "Unilever", sector: "Alimentos y bebidas", rank: 88, url: "https://careers.unilever.com/en", platform: "Workday", note: "Portal global: filtra por Ecuador." },
  { id: "nestle", name: "Nestlé Ecuador", sector: "Alimentos y bebidas", rank: 23, url: "https://www.nestle.com/jobs", platform: "Portal global", note: "Portal global de empleos: filtra por Ecuador." },
  { id: "telconet", name: "Telconet", sector: "Telecomunicaciones", rank: 60, url: "https://www.linkedin.com/company/telconet/jobs/", platform: "LinkedIn", note: "Más de 10.000 empleados en el grupo; publica sus vacantes en LinkedIn." },
  { id: "tigo", name: "Tigo (ex Movistar)", brands: "Millicom", sector: "Telecomunicaciones", url: "https://www.millicom.com/careers/", platform: "Portal global y LinkedIn", note: "Reemplazó a Movistar en octubre de 2026 e invierte en tecnología." },
  { id: "molinera", name: "Industrial Molinera (Grupo Noboa)", sector: "Alimentos y bebidas", url: "https://www.industrialmolinera.com/empleo/", platform: "LinkedIn y correo", note: "El grupo Noboa no tiene un portal central: cada empresa recluta por su cuenta (Industrial Molinera por LinkedIn y seleccion_imca@gnoboa.com)." },
]

/** Vacante de una empresa privada grande (lib/data/private-jobs.json). */
export type PrivateJob = {
  id: string
  source: string
  company: string
  title: string
  city: string | null
  publishedAt: string | null
  url: string
  isIT: boolean
  firstSeen: string
  /** Día en que dejó de publicarse. */
  closedOn?: string
}
