import status from "@/lib/data/scrape-status.json"

/** Cómo se revisa una plataforma: sola en GitHub Actions, en un computador en Ecuador o a mano. */
export type ScrapeMethod = "automática" | "local" | "manual"

export type ScrapedPlatform = {
  /** Clave en lib/data/scrape-status.json. */
  key: string
  name: string
  /** Portal de la fuente, si tiene uno solo. */
  url?: string
  collects: string
  method: ScrapeMethod
  schedule: string
}

export type PlatformStatus = { lastRun: string; lastSuccess: string | null; ok: boolean }

/** Todas las fuentes de ofertas que se revisan para la página de Oportunidades. */
export const scrapedPlatforms: ScrapedPlatform[] = [
  { key: "Concursos", name: "Encuentra Empleo: concursos públicos", url: "https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/procesos/busquedaOfertaPublica.jsf", collects: "Cargos de TI en concursos de méritos y oposición (LOSEP)", method: "automática", schedule: "08:00 y 18:00" },
  { key: "Encuentra-Empleo-bases", name: "Encuentra Empleo: bases de concursos", url: "https://github.com/COMPUMAX-EC/encuentraempleo-scraper", collects: "PDF de bases y carreras aceptadas de cada vacante", method: "local", schedule: "Semanal, con sesión de aspirante" },
  { key: "Encuentra-Empleo", name: "Encuentra Empleo: ofertas privadas", url: "https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/index.jsf", collects: "Ofertas de TI de empresas privadas de todo el país", method: "local", schedule: "A pedido, con sesión de aspirante" },
  { key: "INEC", name: "INEC", url: "https://www.ecuadorencifras.gob.ec/institucional/trabaja-con-nosotros/", collects: "Convocatorias de encuestas y cargos técnicos", method: "automática", schedule: "08:00 y 18:00" },
  { key: "CNT", name: "CNT EP", url: "https://empleo.cnt.gob.ec/procesos/", collects: "Vacantes de CNT Empleo", method: "local", schedule: "Cada noche (el portal bloquea GitHub)" },
  { key: "Petroecuador", name: "EP Petroecuador", url: "https://eppetroecuadorenlinea.eppetroecuador.ec/eppec-talento-humano-concursos-ang/#/", collects: "Concursos de talento humano", method: "automática", schedule: "08:00 y 18:00" },
  { key: "CELEC", name: "CELEC EP", url: "https://www.celec.gob.ec/", collects: "Bolsas de empleo de sus 13 unidades: centrales hidroeléctricas y térmicas, Transelectric y la Matriz", method: "automática", schedule: "08:00 y 18:00" },
  { key: "Bancos", name: "Bancos y cooperativas", collects: "Banco Pichincha, Banco Internacional, Banco de Loja, BCE, Cooperativa JEP y PagueYa", method: "automática", schedule: "08:00 y 18:00" },
  { key: "CACPECO", name: "CACPECO", url: "https://quierolaburo.com/empresas/cacpeco", collects: "Vacantes de la cooperativa en Laburo", method: "local", schedule: "A pedido (Laburo exige un navegador real)" },
  { key: "El-Rosado", name: "Corporación El Rosado", url: "https://empleo.elrosado.com", collects: "Mi Comisariato, Supercines y demás áreas (retail, entretenimiento, restaurantes, industrial)", method: "local", schedule: "A pedido, con cuenta de postulante" },
  { key: "Software", name: "Empresas de software", collects: "Devsu y Stack Builders (Workable)", method: "automática", schedule: "08:00 y 18:00" },
  { key: "Privadas", name: "Empresas privadas grandes", collects: "Holcim, Arca Continental, Claro, Pronaca, Difare, Farmaenlace, GPF, Novacero, Teuno y Tuti", method: "automática", schedule: "08:00 y 18:00" },
  { key: "Educa-Empleo", name: "Educa Empleo", url: "https://educacion.gob.ec/educa-empleo/", collects: "Convocatoria mensual de docentes (LOEI)", method: "automática", schedule: "08:00 y 18:00" },
  { key: "Remotas", name: "Empresas remotas", collects: "Get on Board, Greenhouse y Lever (solo en la base local)", method: "local", schedule: "A pedido" },
]

export const platformStatus = (status as { platforms: Record<string, PlatformStatus> }).platforms
