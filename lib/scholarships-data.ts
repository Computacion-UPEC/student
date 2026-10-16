// Becas: seleccionadas de la base de MultiAgentic-becas (github.com/Computacion-UPEC/MultiAgentic-becas),
// solo las que aceptan postulantes de Ecuador o internacionales y con fuente oficial verificada (oct 2026).
// Internships: programas recurrentes de open source y empresas, abiertos a estudiantes de cualquier país salvo que se indique.
// Las fechas cambian cada año: el campo `timing` describe el ciclo habitual, no una fecha garantizada.

export type ProgramKind = "Beca" | "Internship"

/**
 * Ciclo de convocatoria: en qué meses se suele poder postular (1 = enero).
 * "anual": una convocatoria por año. "varias": varias ventanas al año. "recurrente": se repite pero no todos los años.
 * approx: los meses salen de ciclos anteriores o fuentes no oficiales; confirmar cada año.
 */
export type Cycle = {
  frequency: "anual" | "varias" | "recurrente"
  months: number[]
  approx?: boolean
}

export type Program = {
  id: string
  kind: ProgramKind
  name: string
  provider: string
  place: string
  level: string
  funding: string
  eligibility: string
  timing: string
  url: string
  /** Advertencia visible en la tarjeta (requisitos poco comunes, disponibilidad incierta). */
  warning?: string
  /** Sin ciclo: la fecha depende de cada programa o no se publica. */
  cycle?: Cycle
  /** Fecha de cierre (ISO) de la convocatoria actual; mientras no pase, la tarjeta se marca como abierta. */
  closesAt?: string
  /** El programa es específico de TI o incluye campos de TI; el texto explica cuáles. */
  itFocus?: string
  tags: string[]
}

export const programs: Program[] = [
  // --- Becas del Ecuador (siau.senescyt.gob.ec/convocatorias)
  {
    id: "ecuador-productivo",
    kind: "Beca",
    name: "Becas de posgrado Ecuador Productivo",
    provider: "Gobierno del Ecuador (MINEDEC)",
    place: "Ecuador (en línea)",
    level: "Maestría o especialización en línea, o maestría tecnológica",
    funding: "100% de matrícula y aranceles, hasta USD 3.000",
    eligibility: "Admitidos o cursando un posgrado en línea en una universidad o instituto del país, con título de tercer nivel y sin título de cuarto nivel del mismo grado. Solo campos priorizados. Las postulaciones se validan por orden de llegada: postula pronto.",
    timing: "2026: postulación hasta el 25 de octubre; adjudicación hasta el 17 de noviembre.",
    url: "https://siau.senescyt.gob.ec/programa-de-becas-nacionales-de-posgrado-ecuador-productivo/",
    closesAt: "2026-10-25",
    itFocus: "Incluye Ciencias Computacionales, Desarrollo de Software y Redes y Bases de Datos",
    tags: ["Ecuador", "Posgrado"],
  },
  {
    id: "becas-tic-ecuador",
    kind: "Beca",
    name: "Becas TIC para la Reducción de la Brecha Digital",
    provider: "Gobierno del Ecuador (MINEDEC, antes SENESCYT, con fondos del MIT)",
    place: "Ecuador",
    level: "Tercer nivel técnico y tecnológico en carreras TIC",
    funding: "2026: USD 825,17 una sola vez para manutención (866 becas). 2024: hasta USD 4.000 de matrícula",
    eligibility: "Bachilleres matriculados en una carrera TIC técnica o tecnológica de una institución del país, sin título del mismo nivel ni otra beca vigente. Prioriza zonas rurales, urbano-marginales y de frontera.",
    timing: "2026: del 14 al 24 de septiembre (cerrada). 2024: septiembre a octubre.",
    url: "https://siau.senescyt.gob.ec/programa-de-becas-en-tecnologias-de-la-informacion-y-comunicacion-para-la-reduccion-de-la-brecha-digital-2026/",
    warning: "Solo carreras técnicas y tecnológicas, no ingenierías de grado.",
    itFocus: "Exclusiva para carreras TIC",
    cycle: { frequency: "recurrente", months: [9, 10] },
    tags: ["Ecuador", "TIC"],
  },

  {
    id: "fulbright-senescyt",
    kind: "Beca",
    name: "Fulbright-SENESCYT",
    provider: "Comisión Fulbright y Gobierno del Ecuador",
    place: "Estados Unidos",
    level: "Maestría",
    funding: "Estudios de maestría en EE. UU. (detalle en las bases)",
    eligibility: "Ecuatorianos con título de grado y sin título de cuarto nivel, seleccionados por la Comisión Fulbright; luego postulan al financiamiento en la plataforma del Gobierno.",
    timing: "La convocatoria 2026–2028 se publicó en diciembre de 2025; en 2023 cerró el 18 de abril.",
    url: "https://siau.senescyt.gob.ec/fulbright-senescyt-2026-2028/",
    cycle: { frequency: "recurrente", months: [12, 1, 2, 3, 4], approx: true },
    tags: ["Ecuador", "Posgrado"],
  },
  {
    id: "because-he-is-nice",
    kind: "Beca",
    name: "Becas de inglés “Because he is nice”",
    provider: "Gobierno del Ecuador (MINEDEC)",
    place: "Ecuador (en línea)",
    level: "Bachilleres mayores de 18 años",
    funding: "Curso de inglés nivel A1 gratuito",
    eligibility: "Sin documentos que adjuntar. El inglés es clave para internships y empleos de TI.",
    timing: "2026: cerró el 27 de marzo. Ha tenido varias fases.",
    url: "https://siau.senescyt.gob.ec/programa-de-becas-para-educacion-continua-because-he-is-nice-2026/",
    tags: ["Ecuador", "Inglés"],
  },

  // --- Becas (fuente: MultiAgentic-becas, verificadas en su sitio oficial)
  {
    id: "elap",
    kind: "Beca",
    name: "Emerging Leaders in the Americas Program (ELAP)",
    provider: "Gobierno de Canadá",
    place: "Canadá",
    level: "Pregrado, maestría y doctorado (intercambio)",
    funding: "CAD 8.600 (4 meses) o CAD 12.400 (5–6 meses)",
    eligibility: "Ecuador es país elegible. Debes estar matriculado en tu universidad y debe existir un convenio con una institución canadiense, que es quien postula.",
    timing: "Anual. La institución canadiense postula hasta ~marzo (2026: 31 de marzo).",
    url: "https://www.educanada.ca/scholarships-bourses/can/institutions/elap-pfla.aspx?lang=eng",
    cycle: { frequency: "anual", months: [1, 2, 3] },
    tags: ["Intercambio", "Investigación"],
  },
  {
    id: "daad",
    kind: "Beca",
    name: "Becas DAAD",
    provider: "Servicio Alemán de Intercambio Académico",
    place: "Alemania",
    level: "Maestría, doctorado y estancias de investigación",
    funding: "Según el programa (manutención, seguro y viaje en la mayoría)",
    eligibility: "La elegibilidad depende de cada programa; varios están dirigidos a países en desarrollo y emergentes. Filtra por tu país en la base de datos.",
    timing: "Cada programa tiene su propio cierre; revisa la convocatoria en la base de datos.",
    url: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/",
    tags: ["Posgrado", "Investigación"],
  },
  {
    id: "nl-scholarship",
    kind: "Beca",
    name: "NL Scholarship",
    provider: "Gobierno de Países Bajos y universidades neerlandesas",
    place: "Países Bajos",
    level: "Pregrado y maestría",
    funding: "€5.000 el primer año (no cubre toda la matrícula)",
    eligibility: "Para estudiantes de fuera del Espacio Económico Europeo (Ecuador aplica) sin título previo de una institución neerlandesa.",
    timing: "Abre ~1 de noviembre; cada universidad fija su fecha de cierre.",
    url: "https://www.studyinnl.org/finances/nl-scholarship",
    cycle: { frequency: "anual", months: [11, 12, 1, 2, 3, 4, 5], approx: true },
    tags: ["Pregrado", "Posgrado"],
  },
  {
    id: "tue-excellence",
    kind: "Beca",
    name: "TU/e Scholarship for Excellence",
    provider: "Eindhoven University of Technology",
    place: "Países Bajos",
    level: "Maestría (Ing. Eléctrica, Matemáticas y Computación, Física Aplicada, Mecánica)",
    funding: "Monto en la página oficial; si no cubre toda la matrícula, pagas la diferencia",
    eligibility: "Estudiantes internacionales con excelente rendimiento académico.",
    timing: "Cierre 1 de enero de 2027 para iniciar en septiembre de 2027.",
    url: "https://www.tue.nl/en/education/become-a-tue-student/scholarships-and-grants/tue-scholarship-for-excellence-shaping-the-future-of-microchip-innovation",
    cycle: { frequency: "anual", months: [10, 11, 12], approx: true },
    tags: ["Posgrado", "Semiconductores"],
  },
  {
    id: "asml",
    kind: "Beca",
    name: "ASML Technology Scholarship",
    provider: "ASML",
    place: "Países Bajos",
    level: "Maestría",
    funding: "Monto y beneficios en el sitio de ASML",
    eligibility: "Abierta a estudiantes de maestría de todo el mundo.",
    timing: "Revisa la fecha en el sitio de ASML.",
    url: "https://www.asml.com/en/careers/students-new-graduates/netherlands/scholarship",
    tags: ["Posgrado", "Semiconductores"],
  },
  {
    id: "vector-ai",
    kind: "Beca",
    name: "Vector Scholarships in Artificial Intelligence",
    provider: "Vector Institute",
    place: "Canadá (Ontario)",
    level: "Maestría en IA",
    funding: "CAD 17.500 por un año",
    eligibility: "Estudiantes internacionales admitidos a una maestría de IA en Ontario; los nomina el programa, no se postula directamente.",
    timing: "Anual. Nominación hasta ~marzo (2026: 18 de marzo); los programas cierran antes.",
    url: "https://vectorinstitute.ai/research-talent/students/scholarships/",
    cycle: { frequency: "anual", months: [1, 2, 3] },
    itFocus: "Maestrías en inteligencia artificial",
    tags: ["Posgrado", "IA"],
  },
  {
    id: "ogs-international",
    kind: "Beca",
    name: "Ontario Graduate Scholarship (internacional)",
    provider: "Gobierno de Ontario y universidades",
    place: "Canadá (Ontario)",
    level: "Maestría y doctorado",
    funding: "CAD 5.000 por período (2 o 3 períodos)",
    eligibility: "Estudiantes internacionales con permiso de estudio y admitidos a tiempo completo en un posgrado de Ontario. Cupos limitados.",
    timing: "Anual; cada universidad fija su cierre (normalmente entre enero y marzo).",
    url: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    cycle: { frequency: "anual", months: [1, 2, 3], approx: true },
    tags: ["Posgrado"],
  },

  // --- Internships recurrentes
  {
    id: "gsoc",
    kind: "Internship",
    name: "Google Summer of Code",
    provider: "Google",
    place: "Remoto",
    level: "Mayores de 18 años, estudiantes o principiantes en open source",
    funding: "Estipendio según el país",
    eligibility: "Contribuyes a un proyecto open source con un mentor durante el verano.",
    timing: "Anual. Organizaciones en febrero; postulación ~mediados de marzo a inicios de abril.",
    url: "https://summerofcode.withgoogle.com/",
    cycle: { frequency: "anual", months: [3, 4] },
    tags: ["Open source", "Remoto"],
  },
  {
    id: "outreachy",
    kind: "Internship",
    name: "Outreachy",
    provider: "Software Freedom Conservancy",
    place: "Remoto",
    level: "Estudiantes y profesionales de grupos subrepresentados en tecnología",
    funding: "USD 7.000",
    eligibility: "Internship pagado de 3 meses en proyectos open source.",
    timing: "Dos cohortes al año: mayo (postulación inicial ~febrero) y diciembre (postulación inicial ~agosto).",
    url: "https://www.outreachy.org/",
    cycle: { frequency: "varias", months: [1, 2, 8, 9] },
    tags: ["Open source", "Remoto", "Diversidad"],
  },
  {
    id: "lfx",
    kind: "Internship",
    name: "LFX Mentorship",
    provider: "Linux Foundation",
    place: "Remoto",
    level: "Estudiantes y desarrolladores que inician en open source",
    funding: "Estipendio según el país",
    eligibility: "Proyectos de la Linux Foundation y la CNCF (Kubernetes, cloud native, etc.).",
    timing: "Tres períodos: primavera (postulación ~enero–febrero), verano (~mayo) y otoño (~agosto).",
    url: "https://lfx.linuxfoundation.org/tools/mentorship/",
    cycle: { frequency: "varias", months: [1, 2, 5, 8] },
    tags: ["Open source", "Remoto", "Cloud"],
  },
  {
    id: "mlh-fellowship",
    kind: "Internship",
    name: "MLH Fellowship",
    provider: "Major League Hacking",
    place: "Remoto",
    level: "Estudiantes y desarrolladores en inicio de carrera",
    funding: "Estipendio",
    eligibility: "Trabajas en equipo con mentores sobre software real u open source.",
    timing: "Varios grupos al año (primavera, verano y otoño); cada uno cierra semanas antes de iniciar.",
    url: "https://fellowship.mlh.io/",
    cycle: { frequency: "varias", months: [3, 4, 6, 7, 8, 11, 12], approx: true },
    tags: ["Open source", "Remoto"],
  },
  {
    id: "google-step",
    kind: "Internship",
    name: "Google STEP",
    provider: "Google",
    place: "Oficinas de Google (según región)",
    level: "1.º y 2.º año de pregrado en Computación",
    funding: "Internship pagado",
    eligibility: "Se ofrece en países con oficinas de Google; verifica si tu región aplica antes de postular.",
    timing: "Postulación habitual entre septiembre y diciembre para el año siguiente.",
    url: "https://buildyourfuture.withgoogle.com/programs/step",
    warning: "No siempre disponible para estudiantes en Ecuador.",
    cycle: { frequency: "anual", months: [9, 10, 11, 12], approx: true },
    tags: ["Empresa"],
  },
]
