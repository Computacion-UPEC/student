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
  { id: "pichincha-dev", role: "Desarrollador Backend", company: "Banco Pichincha", location: "Quito, Ecuador", modality: "Híbrido", level: "Junior", publishedAt: "2026-02-14", source: "LinkedIn", skills: ["Java", "Spring", "SQL", "Git"], summary: "Desarrollo de servicios financieros seguros y APIs para canales digitales.", accent: "green" },
  { id: "guayaquil-data", role: "Analista de Datos", company: "Banco Guayaquil", location: "Guayaquil, Ecuador", modality: "Híbrido", level: "Junior", publishedAt: "2026-01-31", source: "LinkedIn", skills: ["SQL", "Python", "Power BI", "Excel"], summary: "Convertir datos de negocio en reportes y decisiones para productos financieros.", accent: "gold" },
  { id: "celec-software", role: "Ingeniero de Software", company: "CELEC EP", location: "Quito, Ecuador", modality: "Presencial", level: "Mid-level", publishedAt: "2025-12-20", source: "Encuentra Empleo", skills: ["Python", "APIs", "PostgreSQL", "Linux"], summary: "Construcción y mantenimiento de sistemas para operación e infraestructura energética.", accent: "blue" },
  { id: "tulcan-support", role: "Desarrollador de Sistemas", company: "Cooperativa Tulcán", location: "Tulcán, Ecuador", modality: "Presencial", level: "Junior", publishedAt: "2025-11-28", source: "Encuentra Empleo", skills: ["PHP", "JavaScript", "MySQL", "Git"], summary: "Soporte y evolución de aplicaciones internas para servicios cooperativos.", accent: "green" },
  { id: "gad-web", role: "Desarrollador Web", company: "GAD Municipal", location: "Tulcán, Ecuador", modality: "Presencial", level: "Prácticas", publishedAt: "2025-10-08", source: "Encuentra Empleo", skills: ["HTML", "CSS", "JavaScript", "WordPress"], summary: "Creación de sitios y herramientas digitales para servicios ciudadanos.", accent: "gold" },
  { id: "cloud-engineer", role: "Cloud Engineer Junior", company: "CloudSofts", location: "Quito, Ecuador", modality: "Remoto", level: "Junior", publishedAt: "2026-02-18", source: "LinkedIn", skills: ["AWS", "Docker", "Linux", "Python"], summary: "Automatización de infraestructura y despliegue de servicios cloud.", accent: "blue" },
  { id: "backend-python", role: "Backend Developer", company: "Kuna Tech", location: "Latam", modality: "Remoto", level: "Junior", publishedAt: "2026-01-29", source: "Get on Board", skills: ["Python", "FastAPI", "PostgreSQL", "Git"], summary: "Construcción de APIs escalables para una plataforma fintech.", accent: "green" },
  { id: "frontend-intern", role: "Frontend Developer Intern", company: "Pacha Digital", location: "Tulcán, Ecuador", modality: "Híbrido", level: "Prácticas", publishedAt: "2025-12-11", source: "LinkedIn", skills: ["React", "TypeScript", "CSS", "GitHub"], summary: "Interfaces accesibles y componentes reutilizables.", accent: "gold" },
  { id: "qa-automation", role: "QA Automation Engineer", company: "DevQuality", location: "Latam", modality: "Remoto", level: "Mid-level", publishedAt: "2025-09-22", source: "Wellfound", skills: ["Playwright", "JavaScript", "CI/CD", "Testing"], summary: "Pruebas automatizadas y mejora continua de aplicaciones web.", accent: "blue" },
]

export const opportunitySkills = ["Todas", "Python", "JavaScript", "Java", "React", "Docker", "SQL", "APIs", "Cloud", "Testing"]
export const opportunityLevels = ["Todos", "Prácticas", "Junior", "Mid-level", "Senior"]
export const opportunityModalities = ["Todas", "Remoto", "Híbrido", "Presencial"]
export const opportunitySources = ["Todas", "LinkedIn", "Encuentra Empleo", "Get on Board", "Wellfound"]
export const opportunityCompanies = ["Todas", "Banco Pichincha", "Banco Guayaquil", "CELEC EP", "Cooperativa Tulcán", "GAD Municipal", "CloudSofts", "Kuna Tech", "Pacha Digital", "DevQuality"]
export const opportunityLocations = ["Todas", "Quito, Ecuador", "Guayaquil, Ecuador", "Tulcán, Ecuador", "Latam"]

export const companyInitials: Record<string, string> = {
  "Banco Pichincha": "BP", "Banco Guayaquil": "BG", "CELEC EP": "CE", "Cooperativa Tulcán": "CT", "GAD Municipal": "GAD", "Encuentra Empleo": "EE", CloudSofts: "CS", "Kuna Tech": "KT", "Pacha Digital": "PD", DevQuality: "DQ",
}

export const companyColors: Record<string, string> = {
  "Banco Pichincha": "#c8102e", "Banco Guayaquil": "#005baa", "CELEC EP": "#e87519", "Cooperativa Tulcán": "#087f5b", "GAD Municipal": "#1479b8", "Encuentra Empleo": "#3730a3", CloudSofts: "#1e293b", "Kuna Tech": "#6d28d9", "Pacha Digital": "#be185d", DevQuality: "#0e7490",
}

export const companyLogos: Record<string, string> = {
  "Banco Pichincha": "https://thesvg.org/icons/banco-pichincha/default.svg",
  "Banco Guayaquil": "https://thesvg.org/icons/banco-guayaquil/default.svg",
  "CELEC EP": "https://thesvg.org/icons/celec-ep/default.svg",
  "Cooperativa Tulcán": "https://thesvg.org/icons/cooperativa-tulcan/default.svg",
  "GAD Municipal": "https://thesvg.org/icons/gad-municipal/default.svg",
  "Encuentra Empleo": "https://thesvg.org/icons/encuentra-empleo/default.svg",
}

export const opportunityYears = ["Todos", "2026", "2025"]
