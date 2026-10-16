// Etapas de la carrera de Ingeniería en Computación. Cada oportunidad indica para qué etapas sirve,
// así el estudiante ve primero lo que puede aprovechar ahora.

export type Stage = "inicio" | "mitad" | "final" | "graduado"

export type StageInfo = {
  id: Stage
  label: string
  range: string
  goal: string
  /** Tres acciones concretas para esta etapa; `href` lleva a la sección del sitio que ayuda con eso. */
  plan: { text: string; href?: string }[]
}

export const stages: StageInfo[] = [
  {
    id: "inicio",
    label: "Primeros semestres",
    range: "1.º a 4.º semestre",
    goal: "Aprende, practica inglés y consigue tus primeras experiencias.",
    plan: [
      { text: "Empieza o mejora tu inglés: lo piden casi todos los internships y becas.", href: "#becas" },
      { text: "Únete a una comunidad tecnológica y asiste a sus eventos.", href: "/comunidades" },
      { text: "Sube tus proyectos de clase a GitHub y haz tu primera contribución open source." },
    ],
  },
  {
    id: "mitad",
    label: "Mitad de carrera",
    range: "5.º a 7.º semestre",
    goal: "Consigue un internship pagado o un intercambio en el exterior.",
    plan: [
      { text: "Postula a un internship open source: GSoC, Outreachy, LFX o MLH.", href: "#becas" },
      { text: "Pregunta en relaciones internacionales por intercambios Erasmus+ o ELAP.", href: "#becas" },
      { text: "Conviértete en embajador de una comunidad para ganar liderazgo.", href: "/comunidades" },
    ],
  },
  {
    id: "final",
    label: "Final de carrera",
    range: "8.º semestre, tesis o prácticas",
    goal: "Planifica tu maestría y tu primer empleo antes de graduarte.",
    plan: [
      { text: "Las maestrías Erasmus Mundus aceptan postulantes en su último año: revisa las de TI.", href: "#becas" },
      { text: "Prepara tu examen de inglés (IELTS o TOEFL) y tus cartas de recomendación." },
      { text: "Revisa qué piden las ofertas reales para orientar tu tesis y tus prácticas.", href: "#empleo" },
    ],
  },
  {
    id: "graduado",
    label: "Graduado",
    range: "Título de tercer nivel",
    goal: "Encuentra empleo o financia tu posgrado.",
    plan: [
      { text: "Filtra las ofertas por la experiencia que tienes y postula a las de TI.", href: "#empleo" },
      { text: "Regístrate en Encuentra Empleo y Educa Empleo para convocatorias públicas.", href: "#empleo" },
      { text: "Busca becas de posgrado vigentes: Ecuador Productivo, Erasmus Mundus, Fulbright.", href: "#becas" },
    ],
  },
]

export const stageById = Object.fromEntries(stages.map((stage) => [stage.id, stage])) as Record<Stage, StageInfo>
export const isStage = (value: string | null): value is Stage => !!value && value in stageById
