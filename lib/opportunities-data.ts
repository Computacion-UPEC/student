export type Opportunity = {
  id: string
  role: string
  company: string
  location: string
  modality: "Remoto" | "Híbrido" | "Presencial"
  level: "Prácticas" | "Junior" | "Mid-level" | "Senior"
  publishedAt: string
  source: string
  skills: string[]
  summary: string
  accent: "green" | "gold" | "blue"
}

export const opportunities: Opportunity[] = [
  {
    id: "cloud-engineer",
    role: "Cloud Engineer Junior",
    company: "CloudSofts",
    location: "Quito, Ecuador",
    modality: "Remoto",
    level: "Junior",
    publishedAt: "2026-02-18",
    source: "LinkedIn",
    skills: ["AWS", "Docker", "Linux", "Python"],
    summary: "Automatización de infraestructura y despliegue de servicios cloud para productos digitales.",
    accent: "green",
  },
  {
    id: "backend-python",
    role: "Backend Developer",
    company: "Kuna Tech",
    location: "Latam",
    modality: "Remoto",
    level: "Junior",
    publishedAt: "2026-01-29",
    source: "Get on Board",
    skills: ["Python", "FastAPI", "PostgreSQL", "Git"],
    summary: "Construcción de APIs escalables y servicios internos para una plataforma fintech.",
    accent: "gold",
  },
  {
    id: "frontend-intern",
    role: "Frontend Developer Intern",
    company: "Pacha Digital",
    location: "Tulcán, Ecuador",
    modality: "Híbrido",
    level: "Prácticas",
    publishedAt: "2025-12-11",
    source: "LinkedIn",
    skills: ["React", "TypeScript", "CSS", "GitHub"],
    summary: "Apoyo en el desarrollo de interfaces accesibles y componentes reutilizables.",
    accent: "blue",
  },
  {
    id: "data-analyst",
    role: "Data Analyst",
    company: "Andes Analytics",
    location: "Quito, Ecuador",
    modality: "Presencial",
    level: "Junior",
    publishedAt: "2025-11-03",
    source: "Multitrabajos",
    skills: ["SQL", "Python", "Power BI", "Excel"],
    summary: "Transformar datos de negocio en reportes y decisiones accionables para equipos comerciales.",
    accent: "green",
  },
  {
    id: "qa-automation",
    role: "QA Automation Engineer",
    company: "DevQuality",
    location: "Latam",
    modality: "Remoto",
    level: "Mid-level",
    publishedAt: "2025-09-22",
    source: "Wellfound",
    skills: ["Playwright", "JavaScript", "CI/CD", "Testing"],
    summary: "Diseño de pruebas automatizadas y mejora continua de la calidad de aplicaciones web.",
    accent: "gold",
  },
  {
    id: "ml-engineer",
    role: "Machine Learning Engineer",
    company: "Innova Research",
    location: "Cuenca, Ecuador",
    modality: "Híbrido",
    level: "Mid-level",
    publishedAt: "2025-07-15",
    source: "LinkedIn",
    skills: ["Python", "TensorFlow", "Pandas", "MLOps"],
    summary: "Prototipado y puesta en producción de modelos para resolver problemas reales.",
    accent: "blue",
  },
]

export const opportunitySkills = ["Todas", "Python", "JavaScript", "React", "Docker", "SQL", "Cloud", "Testing"]
export const opportunityLevels = ["Todos", "Prácticas", "Junior", "Mid-level", "Senior"]
