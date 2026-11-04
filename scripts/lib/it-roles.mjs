// Rol de TI según el título del cargo, no según la carrera aceptada: muchos cargos administrativos
// aceptan "Sistemas" entre varias carreras sin ser de TI. Lo usan export-celec.mjs y los recolectores.
const IT_TERMS = [
  String.raw`tecnolog[ií]as? de (la )?informaci[oó]n`,
  String.raw`\bTICS?\b`,
  String.raw`\bTI\b`, // "Desarrollo TI", "Jefe de TI"
  String.raw`inform[aá]tic`,
  String.raw`software`,
  String.raw`desarrollador|programador|\bdevops\b|\bQA\b`,
  String.raw`ciberseguridad|seguridad de la informaci[oó]n`,
  String.raw`base de datos|(?<!protecci[oó]n de )\bdatos\b|\bdata\b`, // ingeniero de datos, data steward; no "protección de datos"
  String.raw`inteligencia artificial|\bIA\b|machine learning`,
  String.raw`arquitect[oa] (de )?(integraci[oó]n|soluciones|software|datos|nube|cloud|empresarial|ti)\b`,
  String.raw`redes y comunicaciones|telecomunicaciones`,
  String.raw`soporte t[eé]cnico|servicios tecnol[oó]gicos|infraestructura tecnol[oó]gica|continuidad tecnol[oó]gica`,
  String.raw`analista de aplicaciones|\bcloud\b|\bnube\b`,
  String.raw`\bUX\b|experiencia de usuario|dise[nñ]ador de experiencia`,
  String.raw`inteligencia de negocios|business intelligence|\bBI\b|technical owner`,
  String.raw`\bSMO\b`, // Service Management Office: gestión de servicios de TI
  // Títulos en inglés o de empresas de software
  String.raw`developer|engineer\b|full ?stack|front-?end|back-?end|scrum master`,
  String.raw`seguridad aplicativa|t[eé]cnico de desarrollo|desarrollo de software`,
  // Títulos del sector público: "Analista de Sistemas", "Técnico de Redes" (no "Sistemas de Gestión", "redes sociales")
  String.raw`\b(analista|asistente|t[eé]cnic[oa]|especialista|ingenier[oa]|jefe|director[a]?|coordinador[a]?|administrador[a]?|pasante|practicante|auxiliar) (de )?(sistemas|redes)\b(?! (de gesti[oó]n|integrados?|sociales))`,
  String.raw`desarrollo de sistemas|arquitectura de ti\b`,
  // "Trainee Tecnología Arquitectura", "Pasante de Tecnología"
  String.raw`\b(trainee|pasante|practicante)s? (de )?tecnolog[ií]a\b`,
]

export const IT_ROLE = new RegExp(IT_TERMS.join("|"), "i")
// "IT Project Manager", "IT Delivery Manager": solo en mayúsculas, para no confundir con la palabra inglesa "it"
const IT_UPPERCASE = /\bIT\b/

// Bolsas de hojas de vida que las empresas privadas publican como vacante: "Base de Datos de Talento", "Base de datos – Feria laboral"
export const TALENT_POOL = /base de datos (de (talento|candidatos|postulantes|hojas de vida)|\s*[–-])|postulaci[oó]n abierta|feria laboral/i

export const isITRole = (title) => !TALENT_POOL.test(title) && (IT_ROLE.test(title) || IT_UPPERCASE.test(title))

// Cargos afines a TI sin serlo del todo: datos y analítica, lo digital, redes y telecomunicaciones, electrónica y
// automatización, soporte... Los usa la sección "Para recién graduados" para el filtro "TI y afines".
const IT_RELATED_TERMS = [
  String.raw`anal[ií]tica|estad[ií]stic|reporter[ií]a|inteligencia comercial|\bkpi`,
  String.raw`digital|e-?commerce|comercio electr[oó]nico|community manager|\bweb\b|redes sociales`,
  String.raw`\bredes\b|networking|telecomunicaci|telecom\b|fibra [oó]ptica|\bcloud\b|data ?center|centro de datos`,
  String.raw`electr[oó]nic|automatizaci[oó]n|mecatr[oó]nic|instrumentaci[oó]n|\bSCADA\b|\bPLC\b`,
  String.raw`tecnolog[ií]a|tecnol[oó]gic|\bsistemas\b|soporte|mesa de (ayuda|servicio)|help ?desk`,
  String.raw`innovaci[oó]n|transformaci[oó]n|\bSAP\b|\bERP\b|\bCRM\b|\bUX\b|\bUI\b|dise[nñ]o (web|digital)`,
  String.raw`\bdigitador|\bdatos\b|\bdata\b`,
]
export const IT_RELATED = new RegExp(IT_RELATED_TERMS.join("|"), "i")
export const isITRelatedRole = (title) => !TALENT_POOL.test(title) && IT_RELATED.test(title)
