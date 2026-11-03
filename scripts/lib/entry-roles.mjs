// Cargo de entrada (para recién graduados o con poca experiencia) según su título: asistentes, auxiliares,
// pasantías, trainee, junior... Lo usan el recolector de concursos públicos y la sección "Para recién graduados" de
// Oportunidades. El scraper local (COMPUMAX-EC/encuentraempleo-scraper, publicar_sitio.py) usa el mismo criterio.
import { TALENT_POOL } from "./it-roles.mjs"

const ENTRY_TERMS = [
  String.raw`\bauxiliar(es)?\b`,
  String.raw`\basistentes?\b`,
  String.raw`\bayudantes?\b`,
  String.raw`\bpasant(e|es|[ií]as?)\b|\bpracticantes?\b|pr[aá]cticas (pre)?profesionales`,
  String.raw`\btrainees?\b|\bjunior\b|\bjr\b|\baprendiz|\bbecari[oa]s?\b`,
  String.raw`reci[eé]n graduad|sin experiencia|primer empleo`,
  // Escala del sector público: "Servidor Público de Apoyo 1-4" ("Auxiliar de servicios generales" ya entra por auxiliar;
  // "Analista de servicios generales" no es de entrada)
  String.raw`servidor(a)? p[uú]blic[oa] de apoyo`,
  String.raw`\brecepcionistas?\b|\bcajer[oa]s?\b|\bdigitador(es|a)?\b|\bnotificador(es|a)?\b`,
]

export const ENTRY_ROLE = new RegExp(ENTRY_TERMS.join("|"), "i")
const SENIOR = /\b(senior|sr)\b/i

export const isEntryRole = (title) => !TALENT_POOL.test(title) && !SENIOR.test(title) && ENTRY_ROLE.test(title)
