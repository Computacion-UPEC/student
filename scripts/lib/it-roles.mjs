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
  String.raw`inteligencia de negocios|business intelligence|technical owner`,
  String.raw`\bSMO\b`, // Service Management Office: gestión de servicios de TI
  // Títulos en inglés o de empresas de software
  String.raw`developer|engineer\b|full ?stack|front-?end|back-?end|scrum master`,
  String.raw`seguridad aplicativa|t[eé]cnico de desarrollo|desarrollo de software`,
]

export const IT_ROLE = new RegExp(IT_TERMS.join("|"), "i")
// "IT Project Manager", "IT Delivery Manager": solo en mayúsculas, para no confundir con la palabra inglesa "it"
const IT_UPPERCASE = /\bIT\b/

export const isITRole = (title) => IT_ROLE.test(title) || IT_UPPERCASE.test(title)
